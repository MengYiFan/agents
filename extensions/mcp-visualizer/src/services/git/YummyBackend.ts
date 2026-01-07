import * as vscode from 'vscode';
import { spawn } from 'child_process';
import { IGitOperations, GitInfo } from './IGitOperations';

/**
 * Yummy Backend - yummy CLI wrapper
 *
 * 使用 yummy CLI 执行 Git 操作，适用于需要 AI 辅助的场景
 */
export class YummyBackend implements IGitOperations {
  private readonly workspaceRoot: string;

  // Event emitter for branch changes
  private readonly _onDidBranchChange = new vscode.EventEmitter<string>();
  public readonly onDidBranchChange = this._onDidBranchChange.event;

  constructor(workspaceRoot?: string) {
    this.workspaceRoot = workspaceRoot || '';
  }

  /**
   * 执行 yummy 命令
   */
  private async exec(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn('yummy', args, {
        cwd: this.workspaceRoot,
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(`yummy command failed: ${stderr || stdout}`));
        }
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to execute yummy: ${err.message}`));
      });
    });
  }

  /**
   * 执行 git 命令 (用于读取操作)
   */
  private async execGit(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const proc = spawn('git', args, {
        cwd: this.workspaceRoot,
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(stderr || stdout));
        }
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  }

  async getCurrentBranch(): Promise<string> {
    return this.execGit(['branch', '--show-current']);
  }

  async checkGitStatus(): Promise<boolean> {
    const status = await this.execGit(['status', '--porcelain']);

    return status === '';
  }

  async getGitInfo(): Promise<GitInfo> {
    const branch = await this.getCurrentBranch();
    const isClean = await this.checkGitStatus();

    return {
      currentBranch: branch,
      isClean,
      uncommittedChanges: isClean ? 0 : 1,
      hasUncommitted: !isClean,
    };
  }

  async checkoutNewBranch(base: string, target: string): Promise<void> {
    // yummy feature-start 使用 --meegle-id 和 -d，但这里我们使用 branch 命令
    await this.exec(['branch', '-b', target]);
    this._onDidBranchChange.fire(target);
  }

  async checkout(branchName: string): Promise<void> {
    await this.execGit(['checkout', branchName]);
    this._onDidBranchChange.fire(branchName);
  }

  async commit(message: string): Promise<void> {
    // yummy commit -m <message> 使用显式消息
    await this.exec(['commit', '-a', '-m', message]);
  }

  async addTag(tagName: string): Promise<void> {
    // yummy tag 用于环境标签，这里使用 git 直接操作
    try {
      await this.execGit(['tag', '-d', tagName]);
    } catch {
      // Tag 不存在，忽略
    }
    await this.execGit(['tag', tagName]);
  }

  async pushTags(): Promise<void> {
    await this.execGit(['push', '--tags']);
  }

  async push(): Promise<void> {
    const branch = await this.getCurrentBranch();
    await this.execGit(['push', 'origin', branch]);
  }

  async mergeAndPush(source: string, target: string): Promise<void> {
    await this.checkout(target);
    await this.execGit(['merge', source]);
    await this.push();
    this._onDidBranchChange.fire(target);
  }

  async listReleaseBranches(): Promise<string[]> {
    const output = await this.execGit(['branch', '--list', 'release/*']);

    return output
      .split('\n')
      .map((b) => b.trim().replace(/^\*?\s*/, ''))
      .filter(Boolean);
  }

  async stashChanges(): Promise<void> {
    await this.execGit(['stash']);
  }

  async branchExists(branchName: string): Promise<boolean> {
    try {
      await this.execGit(['rev-parse', '--verify', branchName]);

      return true;
    } catch {
      return false;
    }
  }
}
