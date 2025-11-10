import * as path from 'path';
import { promises as fs } from 'fs';
import * as vscode from 'vscode';
import { getWorkspaceRoot } from '../../shared/workspace/workspaceRoot';

export interface ProjectStandardSource {
  id: string;
  displayName: string;
  targetFileName: string;
  loadContent: () => Promise<string>;
}

export interface Context7Preset {
  id: string;
  packageName: string;
  versionPattern?: RegExp;
  displayName: string;
  loadContent: () => Promise<string>;
}

interface ProjectStandardDefinition {
  id: string;
  displayName: string;
  templateSegments: string[];
  targetFileName: string;
}

interface Context7Definition {
  id: string;
  packageName: string;
  versionPattern?: RegExp;
  displayName: string;
  templateSegments: string[];
}

const DEFAULT_PROJECT_STANDARDS: ProjectStandardDefinition[] = [
  {
    id: 'vue2_not_ts',
    displayName: 'Vue 2（无 TypeScript）',
    templateSegments: ['assets', 'presets', 'standards', 'vue2_not_ts_default_standard.md'],
    targetFileName: 'vue2_not_ts_default_standard.md',
  },
];

const DEFAULT_CONTEXT7_PRESETS: Context7Definition[] = [
  {
    id: 'vue-2',
    packageName: 'vue',
    versionPattern: /^2\./,
    displayName: 'Vue 2.x',
    templateSegments: ['assets', 'presets', 'context7', 'vue@2.md'],
  },
];

export async function resolveProjectStandardSource(
  extensionUri: vscode.Uri,
): Promise<ProjectStandardSource | undefined> {
  const configuration = vscode.workspace.getConfiguration('mcpVisualizer');
  const preferredId = configuration.get<string>('instructions.projectStandardId');
  const overrideMap = configuration.get<Record<string, unknown>>('instructions.projectStandardMap') ?? {};

  const sources = new Map<string, ProjectStandardSource>();

  for (const definition of DEFAULT_PROJECT_STANDARDS) {
    sources.set(definition.id, {
      id: definition.id,
      displayName: definition.displayName,
      targetFileName: definition.targetFileName,
      loadContent: () => loadAsset(extensionUri, definition.templateSegments),
    });
  }

  for (const [id, rawValue] of Object.entries(overrideMap)) {
    const value = rawValue as { templatePath?: string; content?: string; displayName?: string; targetFileName?: string };
    if (!value.templatePath && !value.content) {
      continue;
    }

    if (value.content) {
      sources.set(id, {
        id,
        displayName: value.displayName ?? id,
        targetFileName: value.targetFileName ?? `${id}_default_standard.md`,
        loadContent: async () => value.content ?? '',
      });
      continue;
    }

    if (value.templatePath) {
      const resolvedPath = resolvePath(value.templatePath);
      if (resolvedPath) {
        sources.set(id, {
          id,
          displayName: value.displayName ?? id,
          targetFileName: value.targetFileName ?? path.basename(resolvedPath),
          loadContent: () => fs.readFile(resolvedPath, 'utf-8'),
        });
      }
    }
  }

  if (sources.size === 0) {
    return undefined;
  }

  if (preferredId && sources.has(preferredId)) {
    return sources.get(preferredId);
  }

  const first = sources.values().next().value as ProjectStandardSource | undefined;
  return first;
}

export async function resolveContext7Presets(
  extensionUri: vscode.Uri,
): Promise<Context7Preset[]> {
  const configuration = vscode.workspace.getConfiguration('mcpVisualizer');
  const overrides = configuration.get<unknown[]>('instructions.context7Prompts') ?? [];

  const presets: Context7Preset[] = DEFAULT_CONTEXT7_PRESETS.map((definition) => ({
    id: definition.id,
    packageName: definition.packageName,
    versionPattern: definition.versionPattern,
    displayName: definition.displayName,
    loadContent: () => loadAsset(extensionUri, definition.templateSegments),
  }));

  overrides.forEach((raw) => {
    const item = raw as {
      id?: string;
      packageName?: string;
      versionPattern?: string;
      displayName?: string;
      templatePath?: string;
      content?: string;
    };

    if (!item.packageName || (!item.templatePath && !item.content)) {
      return;
    }

    const presetId = item.id ?? `${item.packageName}-${presets.length}`;
    const versionPattern = item.versionPattern ? safeRegExp(item.versionPattern) : undefined;

    if (item.content) {
      presets.push({
        id: presetId,
        packageName: item.packageName,
        versionPattern,
        displayName: item.displayName ?? item.packageName,
        loadContent: async () => item.content ?? '',
      });
      return;
    }

    if (item.templatePath) {
      const resolvedPath = resolvePath(item.templatePath);
      if (resolvedPath) {
        presets.push({
          id: presetId,
          packageName: item.packageName,
          versionPattern,
          displayName: item.displayName ?? item.packageName,
          loadContent: () => fs.readFile(resolvedPath, 'utf-8'),
        });
      }
    }
  });

  return presets;
}

async function loadAsset(extensionUri: vscode.Uri, segments: string[]): Promise<string> {
  const resourceUri = vscode.Uri.joinPath(extensionUri, ...segments);
  return fs.readFile(resourceUri.fsPath, 'utf-8');
}

function resolvePath(inputPath: string): string | undefined {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }

  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return undefined;
  }
  return path.join(workspaceRoot, inputPath);
}

function safeRegExp(pattern: string): RegExp | undefined {
  try {
    return new RegExp(pattern);
  } catch {
    return undefined;
  }
}
