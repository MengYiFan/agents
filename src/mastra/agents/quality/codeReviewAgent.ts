import { Agent } from "@mastra/core/agent";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 由于质量相关代理位于 src/agents/quality，需要向上三级回到仓库根目录以便读取共享提示词与指令。
const repoRoot = path.resolve(__dirname, "../../..");

const loadInstructionsFile = (relativePath: string): string => {
  const fullPath = path.resolve(repoRoot, relativePath);

  if (!existsSync(fullPath)) {
    return "";
  }

  try {
    return readFileSync(fullPath, "utf-8").trim();
  } catch (error) {
    return "";
  }
};

const projectInstructions = loadInstructionsFile("instructions.md");
const defaultReviewPrompt =
  loadInstructionsFile(path.join("prompts", "codeReviewDefault.md")) ||
  `你是专业的代码质量审核员。优先阅读项目指令，其次参考 CODE_STANDARD.md，再使用此默认指令。

- 审查 diff 中的所有改动，关注类型安全、潜在异常、性能与安全风险。
- 输出中文报告，按 P0、P1、P2 的严重程度列出问题，提供修改建议及必要的代码示例。
- 总结部分需统计改动文件数、行数及风险评估。`;

const combinedInstructions = [
  "你是 Mastra MCP 平台中的代码审核代理，需要基于 diff 提供可执行的中文审查报告。",
  projectInstructions
    ? `项目 instructions.md（优先级最高）：\n${projectInstructions}`
    : "未找到项目 instructions.md，将直接依赖默认代码审核提示词。",
  defaultReviewPrompt,
  "在引用规范或问题时，请标明具体文件路径与行号，确保建议可操作。",
].join("\n\n");

import { deepseekModel } from "../../models.js";

export const codeReviewAgent = new Agent({
  name: "code-review-agent",
  instructions: combinedInstructions,
  system: combinedInstructions,
  model: deepseekModel,
  tools: {},
});
