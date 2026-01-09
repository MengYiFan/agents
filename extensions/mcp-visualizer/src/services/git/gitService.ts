import * as vscode from 'vscode';
import simpleGit, { SimpleGit, ResetMode } from 'simple-git';
import { GitOperationError, GitErrorType } from '@common/errors/GitOperationError';
import { IGitOperations, GitInfo } from '@services/git/IGitOperations';

/**
 * Service to handle all Git operations for the Workflow module.
 * Wraps simple-git and provides atomic operations with error handling.
 *
 * Implements IGitOperations interface for backend abstraction.
 */
export class GitService implements IGitOperations {
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
      let userName: string | undefined;
      let userEmail: string | undefined;

      try {
        const config = await this.git.listConfig();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const all = config.all as any;
        userName = all['user.name'];
        userEmail = all['user.email'];
      } catch (e) {
        console.warn('Failed to get git config user info', e);
      }

      return {
        currentBranch: status.current || '',
        isClean: status.isClean(),
        uncommittedChanges: status.files.length,
        hasUncommitted: !status.isClean(),
        userName,
        userEmail,
      };
    } catch (error) {
      throw this.handleError('Failed to get git info', error);
    }
  }

  private async retryWithLockCheck<T>(
    operation: () => Promise<T>,
    retries = 3,
    delay = 1000,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (retries > 0 && String(error).includes('index.lock')) {
        console.warn(
          `Git index.lock detected. Retrying in ${delay}ms... (${retries} retries left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));

        return this.retryWithLockCheck(operation, retries - 1, delay);
      }
      throw error;
    }
  }

  public async checkoutNewBranch(base: string, target: string): Promise<void> {
    try {
      // 1. Fetch latest base from origin to ensure we are up to date
      await this.git
        .fetch('origin', base)
        .catch((err) => console.warn('Fetch failed, trying local', err));

      // 2. Checkout new branch from origin/base
      // This ensures we start from the latest remote state
      await this.retryWithLockCheck(async () => {
        // Check if origin/base exists
        const remotes = await this.git.branch(['-r']);
        const remoteBase = `origin/${base}`;
        const hasRemote = remotes.all.includes(remoteBase);

        if (hasRemote) {
          await this.git.checkoutBranch(target, remoteBase);
        } else {
          // Fallback to local base if remote doesn't exist
          console.warn(`Remote branch ${remoteBase} not found, using local ${base}`);
          await this.git.checkoutBranch(target, base);
        }
      });
      this._onDidBranchChange.fire(target);
    } catch (error) {
      throw this.handleError(`Failed to checkout new branch ${target} from ${base}`, error);
    }
  }

  public async commit(message: string): Promise<void> {
    try {
      // Check if there are changes to commit
      const status = await this.git.status();
      if (status.isClean()) {
        console.log('Working tree is clean, skipping commit.');
        return;
      }

      await this.retryWithLockCheck(async () => {
        await this.git.add('.');
        await this.git.commit(message);
      });
    } catch (error) {
      throw this.handleError('Failed to commit changes', error);
    }
  }

  /**
   * 添加 Tag - 根据配置处理重复 Tag
   * @param tagName Tag 名称
   */
  public async addTag(tagName: string): Promise<void> {
    try {
      // 获取配置：重复 Tag 处理方式
      const config = vscode.workspace.getConfiguration('mcpVisualizer.git');
      const duplicateTagBehavior = config.get<string>('duplicateTagBehavior', 'autoDelete');

      await this.retryWithLockCheck(async () => {
        // 检查 tag 是否已存在
        const tags = await this.git.tags();
        if (tags.all.includes(tagName)) {
          console.log(`Tag '${tagName}' already exists.`);

          if (duplicateTagBehavior === 'confirmOverwrite') {
            // 二次确认模式
            const selection = await vscode.window.showWarningMessage(
              `Tag '${tagName}' already exists. Do you want to overwrite it?`,
              { modal: true },
              'Overwrite',
              'Cancel',
            );

            if (selection !== 'Overwrite') {
              throw new Error(`Tag creation cancelled by user`);
            }
          }

          // 删除本地 tag
          console.log(`Deleting existing tag '${tagName}'...`);
          await this.git.tag(['-d', tagName]);

          // 删除远程 tag (忽略错误，可能不存在)
          try {
            await this.git.push(['origin', `:refs/tags/${tagName}`]);
          } catch (e) {
            console.warn(`Failed to delete remote tag '${tagName}' (may not exist):`, e);
          }
        }

        // 创建新 tag
        await this.git.addTag(tagName);
      });
    } catch (error) {
      throw this.handleError(`Failed to add tag ${tagName}`, error);
    }
  }

  public async pushTags(): Promise<void> {
    try {
      await this.retryWithLockCheck(async () => await this.git.pushTags('origin'));
    } catch (error) {
      // Log warning but don't hard fail workflow? or throw?
      // PRD implies we should push.
      throw this.handleError('Failed to push tags', error);
    }
  }

  public async push(): Promise<void> {
    try {
      await this.retryWithLockCheck(
        async () => await this.git.push('origin', await this.getCurrentBranch()),
      );
    } catch (error) {
      throw this.handleError('Failed to push code', error);
    }
  }

  public async mergeAndPush(source: string, target: string): Promise<void> {
    try {
      await this.git.fetch();
      await this.retryWithLockCheck(async () => {
        await this.git.checkout(target);
        await this.git.pull('origin', target);
      });

      try {
        await this.retryWithLockCheck(async () => await this.git.merge([source]));
      } catch (mergeError: unknown) {
        const status = await this.git.status();
        if (status.conflicted.length > 0) {
          throw new GitOperationError(
            `Merge conflict detected between ${source} and ${target}. Please resolve conflicts manually.`,
            'Conflict',
            mergeError,
          );
        }
        throw mergeError;
      }
      await this.retryWithLockCheck(async () => await this.git.push('origin', target));
      this._onDidBranchChange.fire(target);
    } catch (error) {
      if (error instanceof GitOperationError) throw error;
      throw this.handleError(`Failed to merge ${source} into ${target}`, error);
    }
  }

  /**
   * 获取远程 release/ 分支列表
   * @param fetchFirst 是否先 fetch 更新远程信息
   */
  public async listReleaseBranches(fetchFirst = true): Promise<string[]> {
    try {
      // 先 fetch 最新的远程分支信息
      if (fetchFirst) {
        await this.git.fetch(['--prune']);
      }

      // 获取远程分支
      const branches = await this.git.branch(['-r']);

      // 过滤出 origin/release/ 开头的分支，去掉 origin/ 前缀
      return branches.all
        .filter((b) => b.startsWith('origin/release/'))
        .map((b) => b.replace('origin/', ''));
    } catch (error) {
      console.warn('Failed to list release branches:', error);

      return [];
    }
  }

  public async stashChanges(): Promise<void> {
    try {
      await this.retryWithLockCheck(async () => await this.git.stash());
    } catch (error) {
      throw this.handleError('Failed to stash changes', error);
    }
  }

  public async resetWorkingTree(): Promise<void> {
    try {
      await this.retryWithLockCheck(async () => await this.git.reset(ResetMode.HARD));
    } catch (error) {
      throw this.handleError('Failed to reset working tree', error);
    }
  }

  public async generateDevelopmentBranch(
    baseBranch: string,
    meegleId: string,
    prdBrief: string,
  ): Promise<string> {
    const branchName = `feature/${meegleId}-${prdBrief}`; // Simple Logic
    await this.checkoutNewBranch(baseBranch, branchName);
    return branchName;
  }

  private handleError(message: string, error: unknown): GitOperationError {
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
    const errMessage = error instanceof Error ? error.message : String(error);

    return new GitOperationError(`${message}: ${errMessage}`, type, error);
  }

  public async branchExists(branchName: string): Promise<boolean> {
    try {
      const branches = await this.git.branchLocal();
      return branches.all.includes(branchName);
    } catch (error) {
      throw this.handleError(`Failed to check if branch ${branchName} exists`, error);
    }
  }

  public async checkout(branchName: string): Promise<void> {
    try {
      await this.retryWithLockCheck(async () => await this.git.checkout(branchName));
      this._onDidBranchChange.fire(branchName);
    } catch (error) {
      throw this.handleError(`Failed to checkout branch ${branchName}`, error);
    }
  }
}
