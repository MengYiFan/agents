import * as path from 'path';
import { promises as fs } from 'fs';
import { marked } from 'marked';
import { McpDocEntry } from '../types';

export async function collectDocs(workspaceRoot?: string): Promise<McpDocEntry[]> {
  if (!workspaceRoot) {
    return [];
  }

  const docEntries: McpDocEntry[] = [];
  let rootEntry: McpDocEntry | undefined;
  const docsDir = path.join(workspaceRoot, 'docs');

  try {
    const docsDirStat = await fs.stat(docsDir);
    if (docsDirStat.isDirectory()) {
      const nestedEntries = await walkForReadme(docsDir, workspaceRoot);
      docEntries.push(...nestedEntries);
    }
  } catch (error) {
    // 无 docs 目录时忽略
  }

  try {
    const rootReadme = path.join(workspaceRoot, 'README.md');
    const stat = await fs.stat(rootReadme);
    if (stat.isFile()) {
      rootEntry = {
        id: rootReadme,
        title: '项目 README',
        filePath: rootReadme,
        description: '仓库根目录说明',
      };
    }
  } catch (error) {
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
    const html = marked.parse(markdown, { mangle: false, headerIds: false });
    return html as string;
  } catch (error) {
    return `<p>无法读取文档：${(error as Error).message}</p>`;
  }
}

async function walkForReadme(dir: string, workspaceRoot: string): Promise<McpDocEntry[]> {
  const result: McpDocEntry[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...await walkForReadme(entryPath, workspaceRoot));
    } else if (entry.isFile() && entry.name.toLowerCase() === 'readme.md') {
      const title = path.basename(path.dirname(entryPath)) || 'README';
      result.push({
        id: entryPath,
        title,
        filePath: entryPath,
        description: path.relative(workspaceRoot, entryPath),
      });
    }
  }
  return result;
}
