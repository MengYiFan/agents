import * as path from 'path';
import { promises as fs } from 'fs';
import type { Dirent } from 'fs';
import { marked } from 'marked';
import type { DocVariant, McpDocEntry, SupportedLanguage } from '../../types';

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  'zh-CN': '中文',
  'en-US': 'English',
};

const LANGUAGE_ORDER: Record<SupportedLanguage, number> = {
  'zh-CN': 0,
  'en-US': 1,
};

export const DEFAULT_DOC_DIRECTORIES = [
  'docs',
  'extensions',
  'prompts',
  'packages',
  'apps',
  'services',
  'mcp',
  'src',
];
const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  'dist',
  'out',
  '.turbo',
  '.vscode',
  '.idea',
]);

export async function collectDocs(
  workspaceRoot?: string,
  searchPaths: string[] = DEFAULT_DOC_DIRECTORIES,
): Promise<McpDocEntry[]> {
  if (!workspaceRoot) {
    return [];
  }

  const docEntries: McpDocEntry[] = [];
  let rootEntry: McpDocEntry | undefined;

  const uniqueSearchPaths = Array.from(new Set(searchPaths)).filter(Boolean);
  const normalizedSearchPaths =
    uniqueSearchPaths.length > 0 ? uniqueSearchPaths : DEFAULT_DOC_DIRECTORIES;
  const searchDirectories = normalizedSearchPaths.map((dir) => path.join(workspaceRoot, dir));

  for (const directory of searchDirectories) {
    try {
      const stats = await fs.stat(directory);
      if (stats.isDirectory()) {
        const nestedEntries = await walkForReadme(directory, workspaceRoot);
        docEntries.push(...nestedEntries);
      }
    } catch {
      // 无对应目录时忽略
    }
  }

  try {
    const rootVariants = await collectVariants(workspaceRoot);
    if (rootVariants.length > 0) {
      const preferred =
        rootVariants.find(
          (variant) => path.basename(variant.filePath).toLowerCase() === 'readme.md',
        ) ?? rootVariants[0];
      rootEntry = await buildDocEntry(preferred.filePath, workspaceRoot, {
        id: 'root-readme',
        title: '项目 README',
        description: '仓库根目录说明',
      });
    }
  } catch {
    // 无根 README 时忽略
  }

  docEntries.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
  if (rootEntry) {
    docEntries.unshift(rootEntry);
  }
  return docEntries;
}

export async function loadDocContent(filePath: string): Promise<string> {
  try {
    const markdown = await fs.readFile(filePath, 'utf-8');
    const html = marked.parse(markdown);
    return html as string;
  } catch (error) {
    return `<p>无法读取文档：${(error as Error).message}</p>`;
  }
}

async function walkForReadme(dir: string, workspaceRoot: string): Promise<McpDocEntry[]> {
  const result: McpDocEntry[] = [];
  let entries: Dirent[] = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return result;
  }

  const readmeFiles = entries
    .filter((entry) => entry.isFile() && isReadmeFile(entry.name))
    .map((entry) => path.join(dir, entry.name));

  if (readmeFiles.length > 0) {
    const preferred =
      readmeFiles.find((file) => path.basename(file).toLowerCase() === 'readme.md') ??
      readmeFiles[0];
    const docEntry = await buildDocEntry(preferred, workspaceRoot);
    if (docEntry) {
      result.push(docEntry);
    }
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !IGNORED_DIRECTORIES.has(entry.name)) {
      const nested = await walkForReadme(path.join(dir, entry.name), workspaceRoot);
      result.push(...nested);
    }
  }

  return result;
}

async function buildDocEntry(
  primaryFile: string,
  workspaceRoot: string,
  overrides?: Partial<Pick<McpDocEntry, 'id' | 'title' | 'description'>>,
): Promise<McpDocEntry | undefined> {
  const directory = path.dirname(primaryFile);
  const variants = await collectVariants(directory);

  if (variants.length === 0) {
    return undefined;
  }

  const defaultVariant =
    variants.find((variant) => variant.filePath === primaryFile) ??
    variants.find((variant) => variant.language === 'zh-CN') ??
    variants[0];

  const derivedId = path.relative(workspaceRoot, directory) || directory;
  const derivedTitle = path.basename(directory) || 'README';
  const derivedDescription =
    overrides?.description ?? path.relative(workspaceRoot, defaultVariant.filePath);

  return {
    id: overrides?.id ?? derivedId,
    title: overrides?.title ?? derivedTitle,
    description: derivedDescription || undefined,
    variants,
    defaultLanguage: defaultVariant.language,
  };
}

async function collectVariants(directory: string): Promise<DocVariant[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(directory);
  } catch {
    return [];
  }

  const readmeFiles = entries.filter((name) => isReadmeFile(name)).sort();
  const variants = new Map<SupportedLanguage, DocVariant>();

  for (const fileName of readmeFiles) {
    const language = inferLanguage(fileName);
    if (!variants.has(language)) {
      variants.set(language, {
        language,
        label: LANGUAGE_LABELS[language],
        filePath: path.join(directory, fileName),
      });
    }
  }

  return Array.from(variants.values()).sort(
    (a, b) => LANGUAGE_ORDER[a.language] - LANGUAGE_ORDER[b.language],
  );
}

function inferLanguage(fileName: string): SupportedLanguage {
  if (/[._-](en|english|us)\.md$/i.test(fileName)) {
    return 'en-US';
  }
  return 'zh-CN';
}

function isReadmeFile(name: string): boolean {
  return /^readme(?:[._-][\w-]+)?\.md$/i.test(name);
}
