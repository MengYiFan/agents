import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";

const PROMPTS_DIRECTORY = path.resolve(process.cwd(), "prompts");

type PromptMetadata = Record<string, string | undefined>;

interface PromptDefinition {
  promptName: string;
  name: string;
  description?: string;
  version?: string;
  content: string;
  metadata: PromptMetadata;
}

interface LoadPromptToolInput {
  promptName: string;
}

const parseMetadataBlock = (rawContent: string): {
  metadata: PromptMetadata;
  metadataBlock?: string;
} => {
  const metadataMatch = rawContent.match(/<!--([\s\S]*?)-->/);

  if (!metadataMatch) {
    return { metadata: {} };
  }

  const metadataLines = metadataMatch[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const metadata: PromptMetadata = {};

  for (const line of metadataLines) {
    const [rawKey, ...rawValue] = line.split(":");

    if (!rawKey || rawValue.length === 0) {
      continue;
    }

    const key = rawKey.trim();
    const value = rawValue.join(":").trim();

    if (key.length > 0 && value.length > 0) {
      metadata[key] = value;
    }
  }

  return { metadata, metadataBlock: metadataMatch[0] };
};

const readPromptFromFile = async (promptName: string): Promise<PromptDefinition> => {
  const promptPath = path.join(PROMPTS_DIRECTORY, `${promptName}.md`);
  const rawContent = await fs.readFile(promptPath, "utf8");
  const { metadata, metadataBlock } = parseMetadataBlock(rawContent);
  const contentWithoutMetadata = metadataBlock
    ? rawContent.replace(metadataBlock, "").trimStart()
    : rawContent;

  const trimmedContent = contentWithoutMetadata.trim();

  const name = metadata.name ?? promptName;
  const description = metadata.description;
  const version = metadata.version;

  return {
    promptName,
    name,
    description,
    version,
    content: trimmedContent,
    metadata,
  };
};

const loadPromptTool = {
  id: "loadPrompt",
  description:
    "读取 prompts 目录中的 Markdown 提示定义，并返回解析后的注释元数据和 Markdown 内容。",
  inputSchema: z.object({
    promptName: z.string().describe("要加载的提示文件名称（不包含 .md 后缀）。"),
  }),
  execute: async ({ promptName }: LoadPromptToolInput): Promise<PromptDefinition> => {
    try {
      return await readPromptFromFile(promptName);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new Error(`未找到提示文件: ${promptName}.md`);
      }

      throw error;
    }
  },
};

import { openaiModel } from "../../models.js";

export const promptLibraryAgent = new Agent({
  id: "prompt-library-agent",
  name: "prompt-library-agent",
  instructions:
    "根据用户提供的 prompt 名称，从 prompts 目录加载对应的 Markdown，并提供结构化的提示定义。",
  system:
    "你是一名提示库助手，可以解析 prompts 目录下的 Markdown 文件，提取注释中的元数据并返回提示内容。",
  model: openaiModel,
  tools: { loadPrompt: loadPromptTool },
});
