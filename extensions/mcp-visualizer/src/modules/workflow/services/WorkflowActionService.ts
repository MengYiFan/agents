import * as vscode from 'vscode';
import { GitService } from '../../../services/git/GitService';
import { WorkflowStateManager } from '../WorkflowStateManager';
import { IActionDefinition, IWorkflowContext } from '../types';

export class WorkflowActionService {
  constructor(
    private readonly gitService: GitService,
    private readonly stateManager: WorkflowStateManager,
  ) {}

  async handleCreateBranch(action: IActionDefinition, context: IWorkflowContext): Promise<void> {
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

    // Commit context if we are on the branch
    try {
      await this.gitService.commit('docs: init workflow context');
    } catch (e) {
      // Ignore "nothing to commit" if we just switched to existing branch and nothing changed
      console.warn('Commit failed (likely nothing to commit)', e);
    }
  }

  async handleGitCommit(action: IActionDefinition): Promise<void> {
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

  async handleTransition(action: IActionDefinition, context: IWorkflowContext): Promise<void> {
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

  async handleLoadStep(action: IActionDefinition, context: IWorkflowContext): Promise<void> {
    if (action.params?.stepId) {
      context.currentStep = action.params.stepId;
      context.lastUpdated = Date.now();
      await this.stateManager.saveContext(context);
    }
  }

  async handleMergeAndPush(action: IActionDefinition, context: IWorkflowContext): Promise<void> {
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
    } catch (error) {
      const err = error as { type?: string; message?: string };
      if (err.type === 'Conflict') {
        vscode.window.showErrorMessage(
          'Merge Conflict detected. Please resolve manually then commit & push.',
        );
      } else {
        throw error;
      }
    }
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
}
