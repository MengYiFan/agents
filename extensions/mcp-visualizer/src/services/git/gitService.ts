import * as cp from 'child_process';
import * as vscode from 'vscode';

export type BranchType = 'development' | 'release' | 'other';

export interface GitInfo {
  userName: string;
  currentBranch: string;
  branchType: BranchType;
  featureId?: string;
  hasUncommitted: boolean;
}

export class GitService {
  private workspaceRoot?: string;

  private branchWatcher?: vscode.FileSystemWatcher;

  private branchChangeEmitter = new vscode.EventEmitter<void>();

  public readonly onDidBranchChange = this.branchChangeEmitter.event;

  constructor() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      this.workspaceRoot = workspaceFolders[0].uri.fsPath;
      this.initWatcher();
    }
  }

  public dispose(): void {
    this.branchWatcher?.dispose();
    this.branchChangeEmitter.dispose();
  }

  public async getGitInfo(): Promise<GitInfo> {
    if (!this.workspaceRoot) {

      return {
        userName: '',
        currentBranch: '',
        branchType: 'other',
        featureId: undefined,
        hasUncommitted: false,
      };
    }

    const userName = await this.execGit(['config', 'user.name']);
    const currentBranch = await this.getCurrentBranch();
    const { type, featureId } = this.analyzeBranch(currentBranch);
    const hasUncommitted = await this.hasUncommittedChanges();

    return {
      userName,
      currentBranch,
      branchType: type,
      featureId,
      hasUncommitted,
    };
  }

  public async generateDevelopmentBranch(baseBranch: string, meegleId: string, prdBrief: string): Promise<string> {
    const safeBrief = prdBrief.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase();
    const branchName = `feature/${meegleId}-${safeBrief || 'feature'}`;

    await this.execGit(['fetch', 'origin', baseBranch]);
    await this.execGit(['checkout', '-B', branchName, `origin/${baseBranch}`]);

    return branchName;
  }

  public async stashChanges(): Promise<void> {
    await this.execGit(['stash']);
  }

  public async resetWorkingTree(): Promise<void> {
    await this.execGit(['reset', '--hard', 'HEAD']);
  }

  public async hasUncommittedChanges(): Promise<boolean> {
    const status = await this.execGit(['status', '--porcelain']);

    return !!status;
  }

  public async runYummyCommit(): Promise<void> {
    await this.execShellCommand('yummy commit');
  }

  public async createTag(tagName: string): Promise<void> {
    await this.execGit(['tag', '-a', tagName, '-m', tagName]);
    await this.execGit(['push', 'origin', tagName]);
  }

  public async mergeToRelease(targetRelease: string, sourceBranch: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.execGit(['fetch', 'origin', targetRelease]);
      await this.execGit(['checkout', targetRelease]);
      await this.execGit(['merge', sourceBranch]);
      await this.execGit(['push', 'origin', targetRelease]);

      return { success: true };
    } catch (error) {
      const err = error as { message?: string };

      return { success: false, message: err.message };
    }
  }

  public async listReleaseBranches(): Promise<string[]> {
    const output = await this.execGit(['ls-remote', '--heads', 'origin', 'release/*']);
    const lines = output.split('\n').filter(Boolean);
    const names = lines
      .map((line) => line.split('\t')[1])
      .filter(Boolean)
      .map((ref) => ref.replace('refs/heads/', ''))
      .filter((name) => /^release\/\d{4}\.w\d+\.\d+$/.test(name));

    return Array.from(new Set(names));
  }

  private initWatcher(): void {
    if (!this.workspaceRoot) {
      return;
    }

    const pattern = new vscode.RelativePattern(this.workspaceRoot, '.git/HEAD');
    this.branchWatcher = vscode.workspace.createFileSystemWatcher(pattern);
    this.branchWatcher.onDidChange(() => this.branchChangeEmitter.fire());
    this.branchWatcher.onDidCreate(() => this.branchChangeEmitter.fire());
  }

  private analyzeBranch(branchName: string): { type: BranchType; featureId?: string } {
    if (!branchName) {

      return { type: 'other' };
    }

    if (/^feature\/(\d+)-[a-z0-9-]+$/i.test(branchName)) {
      const match = branchName.match(/^feature\/(\d+)-/i);
      const featureId = match?.[1];

      return { type: 'development', featureId };
    }

    if (/^release\/\d{4}\.w\d+\.\d+$/i.test(branchName)) {

      return { type: 'release' };
    }


    return { type: 'other' };
  }

  private async getCurrentBranch(): Promise<string> {
    const branch = await this.execGit(['rev-parse', '--abbrev-ref', 'HEAD']);

    return branch;
  }

  private execGit(args: string[]): Promise<string> {
    if (!this.workspaceRoot) {

      return Promise.resolve('');
    }

    return new Promise((resolve, reject) => {
      cp.exec(`git ${args.join(' ')}`, { cwd: this.workspaceRoot }, (err, stdout) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(stdout.trim());
      });
    });
  }

  private execShellCommand(command: string): Promise<void> {
    if (!this.workspaceRoot) {

      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      cp.exec(command, { cwd: this.workspaceRoot }, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}
