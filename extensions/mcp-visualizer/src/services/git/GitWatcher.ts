import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * GitWatcher
 *
 * Helper class to watch for Git branch changes via file system events
 * and polling fallback.
 */
export class GitWatcher implements vscode.Disposable {
  private readonly _onDidBranchChange = new vscode.EventEmitter<void>();
  public readonly onDidBranchChange = this._onDidBranchChange.event;

  private _disposables: vscode.Disposable[] = [];
  private _pollInterval: NodeJS.Timeout | undefined;
  private _lastHead: string = '';

  constructor(private readonly rootPath: string) {
    this._setupWatcher();
    this._setupPolling();
  }

  private _setupWatcher() {
    // Watch .git/HEAD for changes
    if (this.rootPath) {
      const gitHeadPath = new vscode.RelativePattern(this.rootPath, '.git/HEAD');
      const watcher = vscode.workspace.createFileSystemWatcher(gitHeadPath);

      watcher.onDidChange(() => {
        this._checkHeadChange('FileWatcher');
      });
      watcher.onDidCreate(() => {
        this._checkHeadChange('FileWatcher (Create)');
      });

      this._disposables.push(watcher);
    }
  }

  private _setupPolling() {
    // Fallback polling every 2 seconds
    this._pollInterval = setInterval(() => {
      this._checkHeadChange('Polling');
    }, 2000);
  }

  private async _checkHeadChange(source: string) {
    try {
      if (!this.rootPath) return;

      const headPath = path.join(this.rootPath, '.git', 'HEAD');
      // Read HEAD content
      if (fs.existsSync(headPath)) {
        const content = await fs.promises.readFile(headPath, 'utf-8');
        const currentHead = content.trim();

        if (this._lastHead !== currentHead) {
          console.log(`[GitWatcher] HEAD changed (${source}): ${this._lastHead} -> ${currentHead}`);
          this._lastHead = currentHead;
          this._onDidBranchChange.fire();
        }
      }
    } catch (error) {
      // Ignore errors during read (e.g. lock contention)
      console.warn(`[GitWatcher] Error checking HEAD:`, error);
    }
  }

  public dispose() {
    this._disposables.forEach((d) => d.dispose());
    if (this._pollInterval) {
      clearInterval(this._pollInterval);
    }
  }
}
