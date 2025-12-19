import * as vscode from 'vscode';
import { ToWebviewMessage, FromWebviewMessage } from '../../common/types';
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

    constructor(
        private readonly _webview: vscode.Webview,
        private readonly _context: vscode.ExtensionContext
    ) {
        const root = getWorkspaceRoot() || ''; // Handle undefined
        
        // Initialize Services
        this.configLoader = new WorkflowConfigLoader(root);
        this.stateManager = new WorkflowStateManager(root);
        this.gitService = new GitService(root);

        this._setupMessageListener();
        this._setupThemeListener();
    }

    private _setupMessageListener() {
        this._webview.onDidReceiveMessage(
            (message: any) => this._handleMessage(message),
            null,
            this._disposables
        );
    }

    private _setupThemeListener() {
        this._updateTheme();
        this._disposables.push(
            vscode.window.onDidChangeActiveColorTheme(() => this._updateTheme())
        );
    }

    private _updateTheme() {
        const isDark = [
            vscode.ColorThemeKind.Dark,
            vscode.ColorThemeKind.HighContrast
        ].includes(vscode.window.activeColorTheme.kind);

        this.postMessage({
            type: 'style:set-theme',
            payload: isDark ? 'dark' : 'light'
        });
    }

    private async _handleMessage(message: any) {
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
            const branch = await this.gitService.getCurrentBranch();
            // Check context
            let context = await this.stateManager.loadContext();

            // If no context, create default empty context (Step 1)
            // But verify if we are on a strict branch model?
            // For now, if no context, we start at 'init' (or first step)
            if (!context) {
                 context = {
                    currentStep: config.steps[0].id,
                    history: [],
                    data: {},
                    lastUpdated: Date.now()
                 };
            }

            this.postMessage({ 
                type: 'workflow:init', 
                payload: {
                    config,
                    context,
                    gitBranch: branch
                } 
            });
        } catch (error: any) {
            vscode.window.showErrorMessage(`Workflow Init Failed: ${error.message || error}`);
        }
    }

    private async handleExecuteAction(payload: { action: IActionDefinition, stepId: string, data: any }) {
        const { action, stepId, data } = payload;

        try {
            switch (action.type) {
                case 'CreateBranch':
                    await this.handleCreateBranch(action, data);
                    break;
                case 'GitCommit':
                    await this.handleGitCommit(action, data);
                    break;
                case 'Transition':
                    await this.handleTransition(action, data);
                    break;
                case 'MergeAndPush':
                    await this.handleMergeAndPush(action, data);
                    break;
                case 'Rollback':
                    await this.handleRollback(action, data);
                    break;
                default:
                    vscode.window.showWarningMessage(`Unknown action type: ${action.type}`);
            }
            
            // After successful action, reload and send context
            await this.refreshContext();

        } catch (error: any) {
            vscode.window.showErrorMessage(`Action Failed: ${error.message}`);
        }
    }

    private async handleCreateBranch(action: IActionDefinition, data: any) {
        const template = action.params?.template || "feature/${meegleId}-${brief}";
        const branchName = this.interpolate(template, data);
        
        const isClean = await this.gitService.checkGitStatus();
        if (!isClean) {
            throw new Error("Working directory is not clean. Please commit or stash changes.");
        }

        const base = data.baseBranch || 'master';
        await this.gitService.checkoutNewBranch(base, branchName);

        const nextStep = action.params?.nextStep || 'dev';
        const newContext: IWorkflowContext = {
            currentStep: nextStep,
            history: [{ timestamp: Date.now(), action: 'CreateBranch', data }],
            data: data, // Save initial form data
            lastUpdated: Date.now()
        };

        await this.stateManager.saveContext(newContext);
    }

    private async handleGitCommit(action: IActionDefinition, data: any) {
        const msg = await vscode.window.showInputBox({ prompt: "Enter commit message" });
        if (!msg) return; 

        const prefix = action.params?.prefix || "";
        await this.gitService.commit(prefix + msg);
        vscode.window.showInformationMessage("Commit successful");
    }

    private async handleTransition(action: IActionDefinition, data: any) {
        const context = await this.stateManager.loadContext();
        if (!context) throw new Error("No active workflow context found");

        if (action.params?.nextStep) {
            context.currentStep = action.params.nextStep;
            context.lastUpdated = Date.now();
            context.history.push({ timestamp: Date.now(), action: 'Transition', toStep: context.currentStep });
            
            await this.stateManager.saveContext(context);
        }

        if (action.params?.tag) {
             const tagName = this.interpolate(action.params.tag, { ...context.data, date: this.formatDate(new Date()) });
             await this.gitService.addTag(tagName);
        }
    }

    private async handleRollback(action: IActionDefinition, data: any) {
        const context = await this.stateManager.loadContext();
        if (!context) throw new Error("No active workflow context found");

        if (action.params?.requireReason) {
             // Logic to ask for reason could go here
        }

        if (action.params?.targetStep) {
            context.currentStep = action.params.targetStep;
             context.lastUpdated = Date.now();
            context.history.push({ timestamp: Date.now(), action: 'Rollback', toStep: context.currentStep });
            await this.stateManager.saveContext(context);
        }
    }
    
    private async handleMergeAndPush(action: IActionDefinition, data: any) {
        vscode.window.showInformationMessage("Merge and Push requested (Logic to be implemented in Phase 3)");
    }

    private async refreshContext() {
        const context = await this.stateManager.loadContext();
        const branch = await this.gitService.getCurrentBranch();
        
        if (context) {
             this.postMessage({ 
                type: 'workflow:update', 
                payload: { context, gitBranch: branch } 
            });
        }
    }

    private interpolate(str: string, data: any): string {
         return str.replace(/\$\{(\w+)\}/g, (_, key) => data[key] || '');
    }
    
    private formatDate(d: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
    }

    public postMessage(message: ToWebviewMessage) {
        this._webview.postMessage(message);
    }

    public dispose() {
        this._disposables.forEach(d => d.dispose());
    }
}
