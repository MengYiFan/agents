import { execFile } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';

const execFileAsync = promisify(execFile);

async function runGitCommand(
  workspaceRoot: string,
  args: string[],
): Promise<{ success: true } | { success: false; message: string }> {
  try {
    await execFileAsync('git', args, { cwd: workspaceRoot });
    return { success: true };
  } catch (error) {
    const err = error as { message?: string; stderr?: string };
    const message = err.stderr?.trim() || err.message || 'Git 命令执行失败。';
    return { success: false, message };
  }
}

export async function checkoutBranch(
  workspaceRoot: string | undefined,
  branch: string,
): Promise<void> {
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

  let checkoutSucceeded = false;
  let failureMessage: string | undefined;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `切换分支：${targetBranch}`,
    },
    async (progress) => {
      progress.report({ message: '同步远程分支信息…' });
      const fetchResult = await runGitCommand(workspaceRoot, ['fetch', '--all', '--prune']);
      if (!fetchResult.success) {
        vscode.window.showWarningMessage(`同步远程分支失败：${fetchResult.message}`);
      }

      progress.report({ message: '尝试切换分支…' });
      const checkoutResult = await runGitCommand(workspaceRoot, ['checkout', targetBranch]);
      if (checkoutResult.success) {
        checkoutSucceeded = true;
        return;
      }

      if (/did not match any file\(s\) known to git|pathspec/i.test(checkoutResult.message)) {
        progress.report({ message: '未找到本地分支，尝试跟踪远程…' });
        const trackResult = await runGitCommand(workspaceRoot, [
          'checkout',
          '--track',
          `origin/${targetBranch}`,
        ]);
        if (trackResult.success) {
          checkoutSucceeded = true;
          return;
        }
        failureMessage = trackResult.message;
        return;
      }

      failureMessage = checkoutResult.message;
    },
  );

  if (checkoutSucceeded) {
    vscode.window.showInformationMessage(`已切换到分支 ${targetBranch}`);
  } else {
    vscode.window.showErrorMessage(`切换分支失败：${failureMessage ?? '未知原因。'}`);
  }
}
