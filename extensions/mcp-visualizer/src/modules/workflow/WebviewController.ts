import * as vscode from 'vscode';
import { ToWebviewMessage } from '../../common/types';
import { WorkflowConfigLoader } from './WorkflowConfigLoader';
import { WorkflowStateManager } from './WorkflowStateManager';
import { GitService } from '../../services/git/GitService';
import { IActionDefinition } from './types';
import { getWorkspaceRoot } from '../../shared/workspace/workspaceRoot';
import { GitWatcher } from '../../services/git/GitWatcher';
import { WorkflowActionService } from './services/WorkflowActionService';

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
  private readonly actionService: WorkflowActionService;
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
    this.actionService = new WorkflowActionService(this.gitService, this.stateManager);

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
        const initStep = dynamicConfig.steps.find(
          (s: unknown) => (s as { id: string }).id === 'init',
        );
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
    } catch (error) {
      const err = error as Error;
      vscode.window.showErrorMessage(`Workflow Init Failed: ${err.message || error}`);
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
          await this.actionService.handleCreateBranch(action, currentContext);
          break;
        case 'GitCommit':
          await this.actionService.handleGitCommit(action);
          break;
        case 'Transition':
          await this.actionService.handleTransition(action, currentContext);
          break;
        case 'MergeAndPush':
          await this.actionService.handleMergeAndPush(action, currentContext);
          break;
        case 'LoadStep':
          await this.actionService.handleLoadStep(action, currentContext);
          break;
        default:
          vscode.window.showWarningMessage(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      const err = error as Error;
      vscode.window.showErrorMessage(`Action Failed: ${err.message}`);
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
      const initStep = dynamicConfig.steps.find(
        (s: unknown) => (s as { id: string }).id === 'init',
      );
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

  public postMessage(message: ToWebviewMessage) {
    this._webview.postMessage(message);
  }

  public dispose() {
    this._disposables.forEach((d) => d.dispose());
  }
}
