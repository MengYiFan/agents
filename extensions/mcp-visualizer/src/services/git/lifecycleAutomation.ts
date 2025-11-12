import { execFile } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';
import type { LifecycleActionId } from '../../types';

const execFileAsync = promisify(execFile);

type GitExecutionResult = {
  stdout: string;
  stderr: string;
};

export interface LifecycleActionResult {
  success: boolean;
  message: string;
  executedCommands: string[];
  cancelled?: boolean;
}

async function runGitCommand(
  workspaceRoot: string,
  args: string[],
  executedCommands: string[],
): Promise<GitExecutionResult> {
  executedCommands.push(`git ${args.join(' ')}`);
  try {
    const { stdout, stderr } = await execFileAsync('git', args, { cwd: workspaceRoot });
    return { stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`git ${args.join(' ')} 执行失败：${message}`);
  }
}

async function ensureCleanWorkingTree(workspaceRoot: string): Promise<{
  clean: boolean;
  details?: string;
}> {
  const { stdout } = await execFileAsync('git', ['status', '--porcelain'], { cwd: workspaceRoot });
  const details = stdout.trim();
  return { clean: details.length === 0, details };
}

function sanitizeSegment(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9._-]/g, '-');
}

function getDefaultReleaseVersion(): string {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${year}.w${String(week).padStart(2, '0')}.01`;
}

async function promptReleaseVersion(): Promise<string | undefined> {
  const input = await vscode.window.showInputBox({
    prompt: '请输入 release 版本号（示例：2025.w33.02）',
    placeHolder: '2025.w33.02',
    value: getDefaultReleaseVersion(),
    validateInput: (value) => {
      if (!value || !sanitizeSegment(value)) {
        return '版本号不能为空。';
      }
      return undefined;
    },
  });

  if (!input) {
    return undefined;
  }

  return sanitizeSegment(input);
}

function getDefaultHotfixBranch(): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  return `hotfix/${timestamp}`;
}

async function promptHotfixBranch(): Promise<string | undefined> {
  const input = await vscode.window.showInputBox({
    prompt: '请输入 hotfix 分支名称（示例：hotfix/BUG-1234）',
    placeHolder: 'hotfix/BUG-1234',
    value: getDefaultHotfixBranch(),
    validateInput: (value) => {
      if (!value) {
        return '分支名称不能为空。';
      }
      const sanitized = sanitizeSegment(value.includes('/') ? value : `hotfix/${value}`);
      if (!sanitized.startsWith('hotfix/')) {
        return '分支需要以 hotfix/ 开头。';
      }
      if (sanitized.replace('hotfix/', '').length === 0) {
        return '请补充具体的缺陷编号或描述。';
      }
      return undefined;
    },
  });

  if (!input) {
    return undefined;
  }

  const sanitized = sanitizeSegment(input.includes('/') ? input : `hotfix/${input}`);
  return sanitized.startsWith('hotfix/') ? sanitized : `hotfix/${sanitized}`;
}

async function createReleaseBranch(workspaceRoot: string): Promise<LifecycleActionResult> {
  const executedCommands: string[] = [];
  try {
    const { clean } = await ensureCleanWorkingTree(workspaceRoot);
    if (!clean) {
      return {
        success: false,
        message: '检测到未提交的改动，请先提交或暂存后再执行提测分支创建。',
        executedCommands,
      };
    }

    const releaseVersion = await promptReleaseVersion();
    if (!releaseVersion) {
      return {
        success: false,
        message: '已取消创建 release 分支。',
        executedCommands,
        cancelled: true,
      };
    }

    const branchName = `release/${releaseVersion}`;

    return await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '提测准备：创建 release 分支',
      },
      async (progress) => {
        try {
          progress.report({ message: '切换到 master' });
          await runGitCommand(workspaceRoot, ['checkout', 'master'], executedCommands);

          progress.report({ message: '拉取 master 最新代码' });
          await runGitCommand(workspaceRoot, ['pull', 'origin', 'master'], executedCommands);

          progress.report({ message: `创建 ${branchName}` });
          await runGitCommand(workspaceRoot, ['checkout', '-B', branchName, 'master'], executedCommands);

          return {
            success: true,
            message: `已创建并切换到 ${branchName}。`,
            executedCommands,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            success: false,
            message,
            executedCommands,
          };
        }
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message, executedCommands };
  }
}

async function createHotfixBranch(workspaceRoot: string): Promise<LifecycleActionResult> {
  const executedCommands: string[] = [];
  try {
    const { clean, details } = await ensureCleanWorkingTree(workspaceRoot);
    if (!clean) {
      return {
        success: false,
        message: `当前工作区存在未提交改动：\n${details}\n请先清理后再执行紧急缺陷流程。`,
        executedCommands,
      };
    }

    const branchName = await promptHotfixBranch();
    if (!branchName) {
      return {
        success: false,
        message: '已取消创建 hotfix 分支。',
        executedCommands,
        cancelled: true,
      };
    }

    return await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '紧急缺陷：准备 hotfix 分支',
      },
      async (progress) => {
        try {
          progress.report({ message: '切换到 master' });
          await runGitCommand(workspaceRoot, ['checkout', 'master'], executedCommands);

          progress.report({ message: '同步 master 最新代码' });
          await runGitCommand(workspaceRoot, ['pull', 'origin', 'master'], executedCommands);

          progress.report({ message: `创建 ${branchName}` });
          await runGitCommand(workspaceRoot, ['checkout', '-b', branchName], executedCommands);

          return {
            success: true,
            message: `已创建并切换到 ${branchName}，请开始修复。`,
            executedCommands,
          };
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          return {
            success: false,
            message,
            executedCommands,
          };
        }
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, message, executedCommands };
  }
}

export async function executeLifecycleAction(
  workspaceRoot: string,
  actionId: LifecycleActionId,
): Promise<LifecycleActionResult> {
  switch (actionId) {
    case 'testing.createReleaseBranch':
      return createReleaseBranch(workspaceRoot);
    case 'operation.prepareHotfixBranch':
      return createHotfixBranch(workspaceRoot);
    default:
      return {
        success: false,
        message: `暂不支持的生命周期动作：${actionId}`,
        executedCommands: [],
      };
  }
}
