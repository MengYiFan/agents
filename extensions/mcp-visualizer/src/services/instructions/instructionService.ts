import * as path from 'path';
import { promises as fs } from 'fs';
import * as vscode from 'vscode';
import type { InstructionActionId } from '../../types';
import { getWorkspaceRoot } from '../../shared/workspace/workspaceRoot';
import { resolveContext7Presets, resolveProjectStandardSource } from './instructionConfigs';

export async function executeInstructionAction(
  context: vscode.ExtensionContext,
  actionId: InstructionActionId,
): Promise<void> {
  switch (actionId) {
    case 'inject-standard':
      await injectProjectStandard(context);
      break;
    case 'update-context7':
      await updateContext7Prompts(context);
      break;
    default:
      vscode.window.showWarningMessage(`未知指令：${actionId}`);
  }
}

async function injectProjectStandard(context: vscode.ExtensionContext): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('请先在工作区中打开目标项目以便注入规范。');
    return;
  }

  const source = await resolveProjectStandardSource(context.extensionUri);
  if (!source) {
    vscode.window.showWarningMessage('未找到可用的项目规范模板，请检查配置。');
    return;
  }

  try {
    const promptsDir = path.join(workspaceRoot, '.github', 'prompts');
    await fs.mkdir(promptsDir, { recursive: true });
    const targetPath = path.join(promptsDir, source.targetFileName);
    const content = await source.loadContent();
    await fs.writeFile(targetPath, content, 'utf-8');
    vscode.window.showInformationMessage(
      `已注入代码规范：${path.relative(workspaceRoot, targetPath)}`,
    );
  } catch (error) {
    vscode.window.showErrorMessage(`注入代码规范失败：${(error as Error).message}`);
  }
}

async function updateContext7Prompts(context: vscode.ExtensionContext): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage('请在包含 package.json 的工作区中运行该指令。');
    return;
  }

  const packageJsonPath = path.join(workspaceRoot, 'package.json');
  let packageContent: string;
  try {
    packageContent = await fs.readFile(packageJsonPath, 'utf-8');
  } catch (error) {
    vscode.window.showErrorMessage(`读取 package.json 失败：${(error as Error).message}`);
    return;
  }

  let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  try {
    pkg = JSON.parse(packageContent);
  } catch (error) {
    vscode.window.showErrorMessage(`解析 package.json 失败：${(error as Error).message}`);
    return;
  }

  const packages = new Map<string, string>();
  for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
    packages.set(name, version);
  }
  for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
    if (!packages.has(name)) {
      packages.set(name, version);
    }
  }

  if (packages.size === 0) {
    vscode.window.showWarningMessage('package.json 中未发现第三方依赖。');
    return;
  }

  const presets = await resolveContext7Presets(context.extensionUri);
  if (presets.length === 0) {
    vscode.window.showWarningMessage('未配置任何 context7 模板。');
    return;
  }

  const promptsDir = path.join(workspaceRoot, '.github', 'prompts');
  await fs.mkdir(promptsDir, { recursive: true });

  const createdFiles: string[] = [];

  for (const [name, rawVersion] of packages.entries()) {
    const normalizedVersion = normalizeVersion(rawVersion);
    if (!normalizedVersion) {
      continue;
    }

    const preset = presets.find((item) => {
      if (item.packageName !== name) {
        return false;
      }
      if (!item.versionPattern) {
        return true;
      }
      return item.versionPattern.test(normalizedVersion);
    });

    if (!preset) {
      continue;
    }

    const content = await preset.loadContent();
    const packageSlug = createPackageSlug(name, normalizedVersion);
    const targetPath = path.join(promptsDir, `${packageSlug}_context7.md`);
    await fs.writeFile(targetPath, content, 'utf-8');
    createdFiles.push(path.relative(workspaceRoot, targetPath));
  }

  if (createdFiles.length === 0) {
    vscode.window.showWarningMessage('未匹配到任何 context7 prompt 模板。');
  } else {
    vscode.window.showInformationMessage(
      `已生成 ${createdFiles.length} 个 context7 prompt：${createdFiles.join(', ')}`,
    );
  }
}

function normalizeVersion(version: string): string | undefined {
  const trimmed = version.trim();
  const match = trimmed.match(/[0-9][0-9A-Za-z.+-]*/);
  return match ? match[0] : undefined;
}

function createPackageSlug(name: string, version: string): string {
  return `${name}@${version}`.replace(/[\\/]/g, '__');
}
