import * as vscode from 'vscode';
import simpleGit, { SimpleGit, ResetMode } from 'simple-git';
import { GitOperationError, GitErrorType } from '../../common/errors/GitOperationError';

export interface GitInfo {
  currentBranch: string;
  isClean: boolean;
  uncommittedChanges: number;
  hasUncommitted: boolean;
}

/**
 * Service to handle all Git operations for the Workflow module.
 * Wraps simple-git and provides atomic operations with error handling.
 */
export class GitService {
  private git: SimpleGit;

  // Event emitter for branch changes
  private readonly _onDidBranchChange = new vscode.EventEmitter<string>();
  public readonly onDidBranchChange = this._onDidBranchChange.event;

  constructor(workspaceRoot?: string) {
    this.git = simpleGit(workspaceRoot);
  }

  public setWorkspaceRoot(root: string) {
    this.git = simpleGit(root);
  }

  public async getCurrentBranch(): Promise<string> {
    try {
      const status = await this.git.status();
      return status.current || '';
    } catch (error) {
      throw this.handleError('Failed to get current branch', error);
    }
  }

  public async checkGitStatus(): Promise<boolean> {
    try {
      const status = await this.git.status();
      return status.isClean();
    } catch (error) {
      throw this.handleError('Failed to check git status', error);
    }
  }

  public async getGitInfo(): Promise<GitInfo> {
    try {
      const status = await this.git.status();
      return {
        currentBranch: status.current || '',
        isClean: status.isClean(),
        uncommittedChanges: status.files.length,
        hasUncommitted: !status.isClean(),
      };
    } catch (error) {
      throw this.handleError('Failed to get git info', error);
    }
  }

  public async checkoutNewBranch(base: string, target: string): Promise<void> {
    try {
      await this.git.fetch('origin', base).catch(() => console.warn('Fetch failed, trying local'));
      await this.git.checkoutBranch(target, base);
      this._onDidBranchChange.fire(target);
    } catch (error) {
      throw this.handleError(`Failed to checkout new branch ${target} from ${base}`, error);
    }
  }

  public async commit(message: string): Promise<void> {
    try {
      await this.git.add('.');
      await this.git.commit(message);
    } catch (error) {
      throw this.handleError('Failed to commit changes', error);
    }
  }

  public async addTag(tagName: string): Promise<void> {
    try {
      await this.git.addTag(tagName);
    } catch (error) {
      throw this.handleError(`Failed to add tag ${tagName}`, error);
    }
  }

  public async pushTags(): Promise<void> {
    try {
      await this.git.pushTags('origin');
    } catch (error) {
      // Log warning but don't hard fail workflow? or throw?
      // PRD implies we should push.
      throw this.handleError('Failed to push tags', error);
    }
  }

  public async push(): Promise<void> {
    try {
      await this.git.push('origin', await this.getCurrentBranch());
    } catch (error) {
      throw this.handleError('Failed to push code', error);
    }
  }

  public async mergeAndPush(source: string, target: string): Promise<void> {
    try {
      await this.git.fetch();
      await this.git.checkout(target);
      await this.git.pull('origin', target);
      try {
        await this.git.merge([source]);
      } catch (mergeError: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        const status = await this.git.status();
        if (status.conflicted.length > 0) {
          throw new GitOperationError(
            `Merge conflict detected between ${source} and ${target}. Please resolve conflicts manually.`,
            'Conflict',
            mergeError
          );
        }
        throw mergeError;
      }
      await this.git.push('origin', target);
      this._onDidBranchChange.fire(target);
    } catch (error) {
      if (error instanceof GitOperationError) throw error;
      throw this.handleError(`Failed to merge ${source} into ${target}`, error);
    }
  }

  public async listReleaseBranches(): Promise<string[]> {
    try {
      const branches = await this.git.branchLocal();
      return branches.all.filter((b) => b.startsWith('release/'));
    } catch (error) {
      return [];
    }
  }

  public async stashChanges(): Promise<void> {
    try {
      await this.git.stash();
    } catch (error) {
      throw this.handleError('Failed to stash changes', error);
    }
  }

  public async resetWorkingTree(): Promise<void> {
    try {
      await this.git.reset(ResetMode.HARD);
    } catch (error) {
      throw this.handleError('Failed to reset working tree', error);
    }
  }

  public async generateDevelopmentBranch(baseBranch: string, meegleId: string, prdBrief: string): Promise<string> {
    const branchName = `feature/${meegleId}-${prdBrief}`; // Simple Logic
    await this.checkoutNewBranch(baseBranch, branchName);
    return branchName;
  }

  private handleError(message: string, error: any): GitOperationError { // eslint-disable-line @typescript-eslint/no-explicit-any
    let type: GitErrorType = 'Unknown';
    const errStr = String(error).toLowerCase();

    if (errStr.includes('conflict') || errStr.includes('merge conflict')) {
      type = 'Conflict';
    } else if (
      errStr.includes('network') ||
      errStr.includes('econnrefused') ||
      errStr.includes('ssh') ||
      errStr.includes('could not resolve host')
    ) {
      type = 'Network';
    }

    return new GitOperationError(`${message}: ${error.message || error}`, type, error);
  }
}
