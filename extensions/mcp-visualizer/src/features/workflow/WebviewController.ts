import * as vscode from 'vscode';
import { ToWebviewMessage } from '../../common/types';
import { WorkflowConfigLoader } from './WorkflowConfigLoader';
import { WorkflowStateManager } from './WorkflowStateManager';
import { GitService } from '../../services/git/gitService';
import { IWorkflowContext, IActionDefinition } from './types';
import { getWorkspaceRoot } from '../../shared/workspace/workspaceRoot';

/**
 * Controller for the Workflow Webview.
 * Handles communication between the Extension and the Webview.
 */
export class WebviewController implements vscode.Disposable {
  private readonly _disposables: vscode.Disposable[] = [];
  private readonly configLoader: WorkflowConfigLoader;
  private readonly stateManager: WorkflowStateManager;
  private readonly gitService: GitService;
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

    this._setupMessageListener();
    this._setupThemeListener();
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
    this._disposables.push(
      vscode.window.onDidChangeActiveColorTheme(() => this._updateTheme()),
    );
  }

  private _updateTheme() {
    const isDark = [
      vscode.ColorThemeKind.Dark,
      vscode.ColorThemeKind.HighContrast,
    ].includes(vscode.window.activeColorTheme.kind);

    this.postMessage({
      type: 'style:set-theme',
      payload: isDark ? 'dark' : 'light',
    });
  }

  private async _handleMessage(message: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    switch (message.type) {
      case 'webview:ready':
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

      // Logic: If branch does NOT start with 'feature/', we are in Init Mode.
      const isFeatureBranch = branch.startsWith('feature/');

      if (!isFeatureBranch) {
        // Force 'init' step context for virtual view
        context = {
          currentStep: 'init',
          history: [],
          data: { ...context?.data },
          lastUpdated: Date.now(),
        };
      } else {
        // If context is missing on feature branch, init to 'development'
        if (!context) {
          context = {
            currentStep: 'development',
            history: [],
            data: {},
            lastUpdated: Date.now(),
          };
        }
      }

      // Fetch release branches
      const releaseBranches = await this.gitService.listReleaseBranches();

      this.postMessage({
        type: 'workflow:init',
        payload: {
          config,
          context,
          gitBranch: branch,
          releaseBranches,
        },
      });
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      vscode.window.showErrorMessage(`Workflow Init Failed: ${error.message || error}`);
    }
  }

  private async handleExecuteAction(payload: { action: IActionDefinition; stepId: string; data: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const { action, stepId, data } = payload;

    try {
      // Update context data first
      const currentContext = (await this.stateManager.loadContext()) || {
        currentStep: stepId,
        history: [],
        data: {},
        lastUpdated: Date.now(),
      };

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
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      vscode.window.showErrorMessage(`Action Failed: ${error.message}`);
    }
  }

  private async handleCreateBranch(action: IActionDefinition, context: IWorkflowContext) {
    const template = action.params?.template || 'feature/${meegleId}-${brief}';
    const branchName = this.interpolate(template, context.data);
    const base = context.data.baseBranch || action.params?.baseBranch || 'master';

    // 1. Dirty Check
    const isClean = await this.gitService.checkGitStatus();
    if (!isClean) {
      const choice = await vscode.window.showWarningMessage(
        'Working directory is not clean.',
        'Stash & Continue',
        'Cancel'
      );
      if (choice === 'Stash & Continue') {
        await this.gitService.stashChanges();
      } else {
        return; // Abort
      }
    }

    // 2. Checkout -b
    await this.gitService.checkoutNewBranch(base, branchName);

    // 3. Initialize Context for new branch
    const nextStep = action.params?.nextStep || 'development';

    context.currentStep = nextStep;
    context.history.push({
      timestamp: Date.now(),
      action: 'CreateBranch',
      data: { branchName, base },
    });
    context.lastUpdated = Date.now();

    // Write context
    await this.stateManager.saveContext(context);

    // Commit context
    await this.gitService.commit('docs: init workflow context');
  }

  private async handleGitCommit(action: IActionDefinition, context: IWorkflowContext) { // eslint-disable-line @typescript-eslint/no-unused-vars
    const prefix = action.params?.prefix || '';
    const msg = await vscode.window.showInputBox({
      prompt: 'Enter commit message',
      value: prefix,
    });
    if (!msg) { return; }

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

  private async handleMergeAndPush(action: IActionDefinition, context: IWorkflowContext) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
      vscode.window.showInformationMessage(`Successfully merged ${currentFeature} into ${targetBranch}`);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (error.type === 'Conflict') {
        vscode.window.showErrorMessage(
          'Merge Conflict detected. Please resolve manually then commit & push.'
        );
      } else {
        throw error;
      }
    }
  }

  private async refreshContext() {
    const config = await this.configLoader.loadConfig(); // eslint-disable-line @typescript-eslint/no-unused-vars
    // Check current branch
    let branch = 'unknown';
    try {
      branch = await this.gitService.getCurrentBranch();
    } catch (e) { /* empty */ }

    let context = await this.stateManager.loadContext();
    const isFeatureBranch = branch.startsWith('feature/');

    if (!isFeatureBranch) {
      context = {
        currentStep: 'init',
        history: [],
        data: { ...context?.data },
        lastUpdated: Date.now(),
      };
    } else if (!context) {
      context = {
        currentStep: 'development',
        history: [],
        data: {},
        lastUpdated: Date.now(),
      };
    }

    // Fetch release branches
    const releaseBranches = await this.gitService.listReleaseBranches();

    this.postMessage({
      type: 'workflow:update',
      payload: { context, gitBranch: branch, releaseBranches },
    });
  }

  private interpolate(str: string, data: any): string { // eslint-disable-line @typescript-eslint/no-explicit-any
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
