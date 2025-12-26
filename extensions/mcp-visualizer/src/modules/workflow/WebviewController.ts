import * as vscode from 'vscode';
import { ToWebviewMessage } from '../../common/types';
import { WorkflowConfigLoader } from './WorkflowConfigLoader';
import { WorkflowStateManager } from './WorkflowStateManager';
import { GitService } from '../../services/git/GitService';
import { IWorkflowContext, IActionDefinition } from './types';
import { getWorkspaceRoot } from '../../shared/workspace/workspaceRoot';
import { GitWatcher } from '../../services/git/GitWatcher';

/**
 * Controller for the Workflow Webview.
 * Handles communication between the Extension and the Webview.
 */
export class WebviewController implements vscode.Disposable {
  private readonly _disposables: vscode.Disposable[] = [];
  private readonly configLoader: WorkflowConfigLoader;
  private readonly stateManager: WorkflowStateManager;
  private readonly gitService: GitService;
  private readonly gitWatcher: GitWatcher;
  private readonly root: string;

  constructor(
    private readonly _webview: vscode.Webview,
    private readonly _context: vscode.ExtensionContext,
  ) {
    this.root = getWorkspaceRoot() || '';

    // Initialize Services
    this.configLoader = new WorkflowConfigLoader(this.root);
    this.stateManager = new WorkflowStateManager(this.root);
    this.gitService = new GitService(this.root);
    this.gitWatcher = new GitWatcher(this.root);

    this._setupMessageListener();
    this._setupThemeListener();
    this._setupGitListener();
  }

  private _setupMessageListener() {
    this._webview.onDidReceiveMessage(
      (message: any) => this._handleMessage(message), // eslint-disable-line @typescript-eslint/no-explicit-any
      null,
      this._disposables,
    );
  }

  private _setupThemeListener() {
    this._updateTheme();
    this._disposables.push(vscode.window.onDidChangeActiveColorTheme(() => this._updateTheme()));
  }

  // Setup Git Listener to auto-update on branch switch
  private _setupGitListener() {
    this._disposables.push(this.gitWatcher);

    // Listen to external git changes (Watcher + Polling)
    this._disposables.push(
      this.gitWatcher.onDidBranchChange(() => {
        console.log('Git Branch changed (External/Watcher), refreshing context...');
        this.refreshContext();
      }),
    );

    // Also listen to internal git service events (faster response for internal actions)
    this._disposables.push(
      this.gitService.onDidBranchChange(() => {
        console.log('Git Branch changed (Internal), refreshing context...');
        this.refreshContext();
      }),
    );
  }

  private _updateTheme() {
    const kind = vscode.window.activeColorTheme.kind;
    const isDark =
      kind === vscode.ColorThemeKind.Dark || kind === vscode.ColorThemeKind.HighContrast;

    this.postMessage({
      type: 'themeChanged',
      theme: { kind: isDark ? 'dark' : 'light' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async _handleMessage(message: any) {
    switch (message.type) {
      case 'webview:ready':
        this._updateTheme();
        await this.initializeWorkflow();
        break;
      case 'executeAction':
        await this.handleExecuteAction(message.payload);
        break;
      case 'workflow:log':
        console.log(`[Webview Log]: ${message.payload}`);
        break;
    }
  }

  private async initializeWorkflow() {
    try {
      const config = await this.configLoader.loadConfig();

      // Check current branch
      let branch = 'unknown';
      try {
        branch = await this.gitService.getCurrentBranch();
      } catch (e) {
        console.warn('Git not initialized or no branch');
      }

      // Check context
      let context = await this.stateManager.loadContext();

      // Validate Context Branch Binding
      if (context && context.branch && context.branch !== branch) {
        console.log(
          `[Workflow] Context branch mismatch (${context.branch} != ${branch}). Resetting context view.`,
        );
        context = null;
      }

      // Logic: Determine if we are in "Development Mode" (Scene B) based on Branch Pattern
      const devPattern = config.branchPattern?.development || '^feature/.*';
      const isFeatureBranch = new RegExp(devPattern).test(branch);

      // Clone config to avoid mutating shared state (though configLoader current returns new obj)
      const dynamicConfig = JSON.parse(JSON.stringify(config));

      if (!isFeatureBranch) {
        // Scene A: Non-Dev Branch.
        // Force 'init' step context for virtual view if needed, but usually we just stay on step 0.
        context = {
          currentStep: 'init',
          history: [],
          data: { ...context?.data },
          branch: branch,
          lastUpdated: Date.now(),
        };
      } else {
        // Scene B: Feature Branch.
        // Update Init Step actions to be "Save & Next" instead of "Create Branch"
        const initStep = dynamicConfig.steps.find((s: any) => s.id === 'init');
        if (initStep) {
          initStep.actions = [
            {
              type: 'LoadStep',
              label: 'Save & Next',
              style: 'primary',
              params: { stepId: 'development' },
            },
            {
              type: 'LoadStep',
              label: 'Next',
              style: 'default',
              params: { stepId: 'development' },
            },
          ];
        }

        // If context is missing on feature branch, init to 'development' (or whatever the config says is next after init?)
        // Ideally we should find the step that matches the current flow. For now, defaulting to 'development' is fine as per PRD logic.
        if (!context) {
          context = {
            currentStep: 'development',
            history: [],
            data: {},
            branch: branch,
            lastUpdated: Date.now(),
          };
        }
      }

      // Fetch release branches
      const releaseBranches = await this.gitService.listReleaseBranches();

      this.postMessage({
        type: 'workflow:init',
        payload: {
          config: dynamicConfig,
          context,
          gitBranch: branch,
          releaseBranches,
        },
      });
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      vscode.window.showErrorMessage(`Workflow Init Failed: ${error.message || error}`);
    }
  }

  private async handleExecuteAction(payload: {
    action: IActionDefinition;
    stepId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  }) {
    const { action, stepId, data } = payload;

    try {
      // Update context data first
      const currentContext = (await this.stateManager.loadContext()) || {
        currentStep: stepId,
        history: [],
        data: {},
        lastUpdated: Date.now(),
      };

      // Ensure history exists (migrating old contexts if necessary)
      if (!currentContext.history) {
        currentContext.history = [];
      }

      // Merge new data
      currentContext.data = { ...currentContext.data, ...data };
      await this.stateManager.saveContext(currentContext);

      switch (action.type) {
        case 'CreateBranch':
          await this.handleCreateBranch(action, currentContext);
          break;
        case 'GitCommit':
          await this.handleGitCommit(action, currentContext);
          break;
        case 'Transition':
          await this.handleTransition(action, currentContext);
          break;
        case 'MergeAndPush':
          await this.handleMergeAndPush(action, currentContext);
          break;
        case 'LoadStep':
          await this.handleLoadStep(action, currentContext);
          break;
        default:
          vscode.window.showWarningMessage(`Unknown action type: ${action.type}`);
      }

      // After successful action, reload
      await this.refreshContext();
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      vscode.window.showErrorMessage(`Action Failed: ${error.message}`);
    }
  }

  private async handleCreateBranch(action: IActionDefinition, context: IWorkflowContext) {
    const template = action.params?.template || 'feature/${meegleId}-${brief}';
    const branchName = this.interpolate(template, context.data);
    const base = context.data.baseBranch || action.params?.baseBranch || 'master';

    // 1. Check if branch already exists
    const exists = await this.gitService.branchExists(branchName);
    if (exists) {
      const selection = await vscode.window.showWarningMessage(
        `Branch '${branchName}' already exists.`,
        'Switch to Existing Branch',
        'Cancel',
      );

      if (selection === 'Switch to Existing Branch') {
        await this.gitService.checkout(branchName);
        // Continue to update context as if we just created it
      } else {
        return; // Cancel action
      }
    } else {
      // 2. Dirty Check
      const isClean = await this.gitService.checkGitStatus();
      if (!isClean) {
        const choice = await vscode.window.showWarningMessage(
          'Working directory is not clean.',
          'Stash & Continue',
          'Cancel',
        );
        if (choice === 'Stash & Continue') {
          await this.gitService.stashChanges();
        } else {
          return; // Abort
        }
      }

      // 3. Checkout -b
      await this.gitService.checkoutNewBranch(base, branchName);
    }

    // 4. Initialize Context for new branch
    const nextStep = action.params?.nextStep || 'development';

    context.currentStep = nextStep;
    context.branch = branchName;
    context.history.push({
      timestamp: Date.now(),
      action: 'CreateBranch',
      data: { branchName, base },
    });
    context.lastUpdated = Date.now();

    // Write context
    await this.stateManager.saveContext(context);

    // Commit context (only if new branch created or context changed significantly?)
    // If we switched to existing, we probably shouldn't force a commit unless we want to update the context file there.
    // For consistency, let's just save context. If it checks out, the context file on disk might be old or new.
    // We overwrote it with `saveContext`.

    // Commit context if we are on the branch
    try {
      await this.gitService.commit('docs: init workflow context');
    } catch (e) {
      // Ignore "nothing to commit" if we just switched to existing branch and nothing changed
      console.warn('Commit failed (likely nothing to commit)', e);
    }
  }

  private async handleGitCommit(action: IActionDefinition, _context: IWorkflowContext) {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    const prefix = action.params?.prefix || '';
    const msg = await vscode.window.showInputBox({
      prompt: 'Enter commit message',
      value: prefix,
    });
    if (!msg) {
      return;
    }

    await this.gitService.commit(msg);
    vscode.window.showInformationMessage('Commit successful');
  }

  private async handleTransition(action: IActionDefinition, context: IWorkflowContext) {
    // 1. Ensure Commit
    const isClean = await this.gitService.checkGitStatus();
    if (!isClean) {
      const msg = await vscode.window.showInputBox({
        prompt: 'Commit changes before transition',
        value: `feat: update for ${context.currentStep} -> ${action.params?.nextStep}`,
      });
      if (msg) {
        await this.gitService.commit(msg);
      } else {
        return; // User cancelled
      }
    }

    // 2. Tag
    if (action.params?.tag) {
      const tagName = this.interpolate(action.params.tag, {
        ...context.data,
        ...this.getDateVariables(),
      });
      await this.gitService.addTag(tagName);
      // Push Code & Tags
      await this.gitService.push();
      await this.gitService.pushTags();
    }

    // 3. Update Status
    if (action.params?.nextStep) {
      context.currentStep = action.params.nextStep;
      context.lastUpdated = Date.now();
      context.history.push({
        timestamp: Date.now(),
        action: 'Transition',
        toStep: context.currentStep,
        data: { tag: action.params?.tag },
      });

      await this.stateManager.saveContext(context);

      // 4. Commit Status Change
      await this.gitService.commit(`docs: update workflow state to ${context.currentStep}`);
      await this.gitService.push();
    }
  }

  private async handleLoadStep(action: IActionDefinition, context: IWorkflowContext) {
    if (action.params?.stepId) {
      context.currentStep = action.params.stepId;
      context.lastUpdated = Date.now();
      await this.stateManager.saveContext(context);
    }
  }

  private async handleMergeAndPush(action: IActionDefinition, context: IWorkflowContext) {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    let targetBranch = context.data.targetBranch;
    if (!targetBranch) {
      // Try to discover
      const releases = await this.gitService.listReleaseBranches();
      if (releases.length > 0) {
        targetBranch = releases[0];
      } else {
        vscode.window.showErrorMessage('No release branch found or selected.');
        return;
      }
    }

    const currentFeature = await this.gitService.getCurrentBranch();

    try {
      await this.gitService.mergeAndPush(currentFeature, targetBranch);
      vscode.window.showInformationMessage(
        `Successfully merged ${currentFeature} into ${targetBranch}`,
      );
    } catch (error: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      if (error.type === 'Conflict') {
        vscode.window.showErrorMessage(
          'Merge Conflict detected. Please resolve manually then commit & push.',
        );
      } else {
        throw error;
      }
    }
  }

  private async refreshContext() {
    const config = await this.configLoader.loadConfig();
    // Check current branch
    let branch = 'unknown';
    try {
      branch = await this.gitService.getCurrentBranch();
    } catch (e) {
      /* empty */
    }

    let context = await this.stateManager.loadContext();

    // Validate Context Branch Binding
    if (context && context.branch && context.branch !== branch) {
      console.log(
        `[Workflow] Context branch mismatch (${context.branch} != ${branch}). Resetting context view.`,
      );
      context = null;
    }

    const isFeatureBranch = branch.startsWith('feature/');

    // Clone config
    const dynamicConfig = JSON.parse(JSON.stringify(config));

    if (!isFeatureBranch) {
      context = {
        currentStep: 'init',
        history: [],
        data: { ...context?.data },
        branch: branch,
        lastUpdated: Date.now(),
      };
    } else {
      // Scene B: Feature Branch. Update Init Step actions.
      const initStep = dynamicConfig.steps.find((s: any) => s.id === 'init');
      if (initStep) {
        initStep.actions = [
          {
            type: 'LoadStep',
            label: 'Save & Next',
            style: 'primary',
            params: { stepId: 'development' },
          },
          {
            type: 'LoadStep',
            label: 'Next',
            style: 'default',
            params: { stepId: 'development' },
          },
        ];
      }

      if (!context) {
        context = {
          currentStep: 'development',
          history: [],
          data: {},
          branch: branch,
          lastUpdated: Date.now(),
        };
      }
    }

    // Fetch release branches
    const releaseBranches = await this.gitService.listReleaseBranches();

    this.postMessage({
      type: 'workflow:update',
      payload: { context, gitBranch: branch, releaseBranches, config: dynamicConfig },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private interpolate(str: string, data: any): string {
    return str.replace(/\$\{(\w+)\}/g, (_, key) => data[key] || '');
  }

  private getDateVariables() {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return {
      MMDD: `${pad(d.getMonth() + 1)}${pad(d.getDate())}`,
      hh: pad(d.getHours()),
      mm: pad(d.getMinutes()),
      date: d.toISOString().split('T')[0],
    };
  }

  public postMessage(message: ToWebviewMessage) {
    this._webview.postMessage(message);
  }

  public dispose() {
    this._disposables.forEach((d) => d.dispose());
  }
}
