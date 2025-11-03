import * as vscode from 'vscode';

export function getWorkspaceRoot(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    vscode.window.showWarningMessage('未检测到工作区，部分功能无法使用。');
    return undefined;
  }
  return folders[0].uri.fsPath;
}
