import { execFile } from 'child_process';
import * as vscode from 'vscode';

export async function checkoutBranch(workspaceRoot: string | undefined, branch: string): Promise<void> {
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('请先打开一个 Git 仓库工作区。');
    return;
  }

  let targetBranch = branch;
  if (/[<>]|REQ|BUG|vX/.test(branch)) {
    const input = await vscode.window.showInputBox({
      prompt: `请输入实际的分支名称（默认建议：${branch}）`,
      placeHolder: branch,
    });
    if (!input) {
      return;
    }
    targetBranch = input.trim();
  }

  await new Promise<void>((resolve) => {
    execFile('git', ['checkout', targetBranch], { cwd: workspaceRoot }, (error, _stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`切换分支失败：${stderr || error.message}`);
      } else {
        vscode.window.showInformationMessage(`已切换到分支 ${targetBranch}`);
      }
      resolve();
    });
  });
}
