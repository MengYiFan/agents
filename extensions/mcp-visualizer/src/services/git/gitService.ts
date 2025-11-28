import * as cp from 'child_process';
import * as vscode from 'vscode';

export interface GitInfo {
  userName: string;
  currentBranch: string;
  isStandardBranch: boolean;
  featureId?: string;
}

export class GitService {
  private workspaceRoot: string | undefined;
  private _onDidBranchChange = new vscode.EventEmitter<void>();
  public readonly onDidBranchChange = this._onDidBranchChange.event;
  private watcher: vscode.FileSystemWatcher | undefined;

  constructor() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      this.workspaceRoot = workspaceFolders[0].uri.fsPath;
      this.initWatcher();
    }
  }

  private initWatcher() {
    if (!this.workspaceRoot) return;
    
    // Watch .git/HEAD for branch changes
    const pattern = new vscode.RelativePattern(this.workspaceRoot, '.git/HEAD');
    this.watcher = vscode.workspace.createFileSystemWatcher(pattern);
    
    this.watcher.onDidChange(() => {
      this._onDidBranchChange.fire();
    });
    this.watcher.onDidCreate(() => {
        this._onDidBranchChange.fire();
    });
  }

  public dispose() {
      this.watcher?.dispose();
      this._onDidBranchChange.dispose();
  }

  public async getGitInfo(): Promise<GitInfo> {
    if (!this.workspaceRoot) {
      return {
        userName: '',
        currentBranch: '',
        isStandardBranch: false,
      };
    }

    const userName = await this.execGit(['config', 'user.name']);
    const currentBranch = await this.execGit(['rev-parse', '--abbrev-ref', 'HEAD']);

    const { isStandard, featureId } = this.analyzeBranch(currentBranch, userName);

    return {
      userName,
      currentBranch,
      isStandardBranch: isStandard,
      featureId,
    };
  }

  private analyzeBranch(branchName: string, userName: string): { isStandard: boolean; featureId?: string } {
    // Pattern: {user}/{type}/{id}***
    // e.g. mishzhong/feat/123-test -> user=mishzhong, type=feat, id=123
    if (!branchName || !userName) {
        return { isStandard: false };
    }
    const parts = branchName.split('/');
    if (parts.length >= 3) {
      const featurePart = parts[2];
      const match = featurePart.match(/^(\d+)/);
      if (match) {
        return {
          isStandard: true,
          featureId: match[1],
        };
      }
    }

    return {
      isStandard: false,
    };
  }

  private async getCurrentBranch(): Promise<string> {
      return await this.execGit(['rev-parse', '--abbrev-ref', 'HEAD']);
  }

  public async createBranch(branchName: string): Promise<void> {
    await this.execGit(['checkout', '-b', branchName]);
  }

  public async generateCommitLog(): Promise<string> {
    // Generate a simple commit log template or fetch recent logs
    // For now, let's return a template based on recent changes
    try {
        const status = await this.execGit(['status', '-s']);
        return `feat: update workflow\n\nChanges:\n${status}`;
    } catch (e) {
        return 'feat: update workflow';
    }
  }

  public async commit(message: string): Promise<void> {
    await this.execGit(['add', '.']);
    await this.execGit(['commit', '-m', message]);
  }

  public async pushCode(): Promise<void> {
    const currentBranch = await this.getCurrentBranch();
    if (currentBranch) {
        await this.execGit(['push', 'origin', currentBranch]);
    }
  }

  public async syncMaster(): Promise<void> {
    // Assume master is the main branch, or try to detect main/master
    // For safety, let's try to fetch and merge origin/master
    try {
        await this.execGit(['fetch', 'origin', 'master']);
        await this.execGit(['merge', 'origin/master']);
    } catch (e) {
        // Fallback to main if master fails
        await this.execGit(['fetch', 'origin', 'main']);
        await this.execGit(['merge', 'origin/main']);
    }
  }

  private async execGit(args: string[]): Promise<string> {
    if (!this.workspaceRoot) {
      return '';
    }

    return new Promise((resolve) => {
      cp.exec(`git ${args.join(' ')}`, { cwd: this.workspaceRoot }, (err, stdout) => {
        if (err) {
          console.error(`Git error: ${err.message}`);
          resolve('');
          return;
        }
        resolve(stdout.trim());
      });
    });
  }
}
