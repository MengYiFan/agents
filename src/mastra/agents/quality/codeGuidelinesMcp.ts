import { Agent } from "@mastra/core/agent";
import { promises as fs } from "fs";
import path from "path";

const PROJECT_ROOT = process.cwd();
const RULES_FILE_PATH = path.resolve(PROJECT_ROOT, ".rules");
const PACKAGE_JSON_PATH = path.resolve(PROJECT_ROOT, "package.json");

type DependencyMap = Record<string, string>;

interface PackageJson {
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
}

type TechnologyId = "nuxt2" | "vue2" | "midway" | "egg";

interface TechnologyGuidelineDefinition {
  id: TechnologyId;
  label: string;
  guidelines: string[];
}

interface DetectedTechnology extends TechnologyGuidelineDefinition {
  inferred: boolean;
}

const TECHNOLOGY_GUIDELINES: Record<TechnologyId, TechnologyGuidelineDefinition> = {
  nuxt2: {
    id: "nuxt2",
    label: "Nuxt 2",
    guidelines: [
      "使用 `pages/` 目录自动生成路由，避免在 `nuxt.config.js` 中手工声明重复路由逻辑。",
      "在 `asyncData` 与 `fetch` 中统一处理异常，确保页面首屏渲染不会因接口异常而崩溃。",
      "模块化配置 `nuxt.config.js`，常用插件放置在 `plugins/`，并确保仅在客户端需要时开启 `ssr: false`。",
      "使用 `layouts/` 统一页面骨架与 SEO 元信息，所有页面必须定义合理的 `head` 信息。",
    ],
  },
  vue2: {
    id: "vue2",
    label: "Vue 2",
    guidelines: [
      "组件使用单文件组件 (SFC) 结构，遵循 `<template> → <script> → <style>` 排序，并启用 `scoped` 或 CSS Modules。",
      "统一使用 Options API，复杂状态逻辑抽取到 `mixins` 或组合式工具函数，避免在组件中堆叠多层 watch/compute。",
      "事件与 props 需在组件顶部显式声明，所有对外事件以 `update:*` 或 `change` 系结尾，确保父子通信清晰。",
      "表单校验逻辑抽象为可复用的工具模块，避免在组件内直接编写冗长校验代码。",
    ],
  },
  midway: {
    id: "midway",
    label: "MidwayJS",
    guidelines: [
      "业务逻辑拆分为 Service 层与 Controller 层，确保 Controller 仅负责参数校验与响应封装。",
      "依赖注入使用 `@Inject()` 或 `@Config()` 装饰器，禁止手动实例化核心服务，便于测试与替换。",
      "中间件放置在 `src/middleware`，并通过 `configuration.ts` 进行集中注册，命名遵循 `*Middleware` 约定。",
      "所有接口输入参数使用 DTO 并结合 `class-validator` 做校验，错误统一交由异常过滤器处理。",
    ],
  },
  egg: {
    id: "egg",
    label: "Egg.js",
    guidelines: [
      "Controller 保持瘦身，业务逻辑沉淀到 `app/service`，并合理复用 plugin 与 helper。",
      "配置按环境拆分到 `config/config.{env}.ts`，默认配置保持最小化，敏感信息放在环境变量。",
      "自定义插件存放于 `app/plugin`，并在 `config/plugin.ts` 中声明启用与依赖顺序。",
      "统一使用框架提供的 `ctx.logger` 与 `ctx.helper`，禁止直接使用 console 输出生产日志。",
    ],
  },
};

const GENERAL_GUIDELINES = `## 通用工程规范
- 优先使用 TypeScript，并在 \`tsconfig.json\` 中开启严格模式，保证类型安全。
- 新增模块需包含概览注释，说明职责、输入输出与关键依赖。
- 函数保持单一职责，复杂流程拆分为可复用的工具方法或服务层。
- 所有公共 API 与工具方法补充单元测试或契约测试。

## 目录与命名约定
- 源码位于 \`src\` 目录并按业务域划分子目录，禁止出现巨型杂项文件夹。
- 文件名、导出的主要实体保持一致，使用 kebab-case (文件) 与 PascalCase (类/类型)。
- 常量统一使用 UPPER_SNAKE_CASE，布尔值采用正向命名，表达明确语义。

## 代码风格
- 使用 Prettier 与 ESLint 统一格式，缩进 2 空格、语句结尾保留分号、默认双引号。
- 异步逻辑使用 async/await，并捕获异常提供上下文信息；严禁无处理的 promise。
- 使用模板字符串而非字符串拼接，避免隐式类型转换。

## 质量与交付
- 提交前执行可用的自动化构建、测试与静态检查，确保产物可运行。
- PR 描述需包含改动背景、实现要点、测试结论与潜在风险。
- 在 CI 或本地为关键路径增加性能监控或日志埋点，便于快速定位问题。
`;

const DEFAULT_TECHNOLOGIES: TechnologyId[] = ["nuxt2", "vue2", "midway", "egg"];

const readPackageJson = async (): Promise<PackageJson | null> => {
  try {
    const raw = await fs.readFile(PACKAGE_JSON_PATH, "utf8");
    const parsed = JSON.parse(raw) as PackageJson;
    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }

    throw new Error(`无法读取 package.json: ${(error as Error).message}`);
  }
};

const getDependencyVersion = (map: DependencyMap | undefined, name: string): string | undefined =>
  map?.[name];

const findDependencyVersion = (
  pkg: PackageJson,
  names: string[],
): { name: string; version: string } | null => {
  for (const dependencyName of names) {
    const version =
      getDependencyVersion(pkg.dependencies, dependencyName) ??
      getDependencyVersion(pkg.devDependencies, dependencyName);

    if (typeof version === "string") {
      return { name: dependencyName, version };
    }
  }

  return null;
};

const versionMatchesMajor = (version: string, major: number) => {
  const sanitized = version.replace(/^[^\d]*/, "");
  const [majorToken] = sanitized.split(/\.|-/);
  const parsedMajor = Number.parseInt(majorToken, 10);

  if (Number.isNaN(parsedMajor)) {
    return false;
  }

  return parsedMajor === major;
};

const detectTechnologies = async (): Promise<DetectedTechnology[]> => {
  const pkg = await readPackageJson();

  if (!pkg) {
    return DEFAULT_TECHNOLOGIES.map((id) => ({
      ...TECHNOLOGY_GUIDELINES[id],
      inferred: true,
    }));
  }

  const detectedIds = new Set<TechnologyId>();

  const nuxtVersion = findDependencyVersion(pkg, ["nuxt"]);
  if (nuxtVersion && versionMatchesMajor(nuxtVersion.version, 2)) {
    detectedIds.add("nuxt2");
    detectedIds.add("vue2");
  }

  const vueVersion = findDependencyVersion(pkg, ["vue"]);
  if (vueVersion && versionMatchesMajor(vueVersion.version, 2)) {
    detectedIds.add("vue2");
  }

  const midwayVersion = findDependencyVersion(pkg, [
    "@midwayjs/core",
    "@midwayjs/koa",
    "@midwayjs/faas",
    "midway",
  ]);
  if (midwayVersion) {
    detectedIds.add("midway");
  }

  const eggVersion = findDependencyVersion(pkg, ["egg", "egg-core", "egg-bin", "egg-scripts"]);
  if (eggVersion) {
    detectedIds.add("egg");
  }

  if (detectedIds.size === 0) {
    return DEFAULT_TECHNOLOGIES.map((id) => ({
      ...TECHNOLOGY_GUIDELINES[id],
      inferred: true,
    }));
  }

  return Array.from(detectedIds).map((id) => ({
    ...TECHNOLOGY_GUIDELINES[id],
    inferred: false,
  }));
};

const buildRulesDocument = (technologies: DetectedTechnology[]): string => {
  const techSummary = technologies
    .map((tech) => (tech.inferred ? `${tech.label}（默认推荐）` : tech.label))
    .join("、");

  const intro =
    technologies.length > 0
      ? `> 文档由代码规范 MCP 自动生成，识别到的关键技术栈：${techSummary}。`
      : "> 文档由代码规范 MCP 自动生成，未能识别到特定技术栈，请按实际情况补充。";

  const technologySections = technologies
    .map((tech) => {
      const guidelines = tech.guidelines.map((item) => `- ${item}`).join("\n");
      const inferredNote = tech.inferred
        ? "\n> 未在 package.json 中检测到该依赖，以下规范基于默认推荐。\n"
        : "\n";
      const heading = tech.inferred ? `${tech.label}（默认推荐）` : tech.label;
      return `### ${heading}${inferredNote}${guidelines}`;
    })
    .join("\n\n");

  const technologyBlock = technologySections
    ? `## 技术栈特定规范\n${technologySections}\n`
    : "";

  return [`# 项目代码规范`, intro, GENERAL_GUIDELINES.trim(), technologyBlock.trim()].filter(Boolean).join("\n\n");
};

interface InjectRulesToolInput {
  overwrite?: boolean;
  customContent?: string;
}

interface InjectRulesToolResult {
  path: string;
  overwritten: boolean;
  content: string;
  message: string;
  detectedTechnologies: string[];
}

const injectCodeRulesDocumentTool = {
  id: "injectCodeRulesDocument",
  name: "injectCodeRulesDocument",
  description:
    "在当前项目根目录生成或更新 .rules 代码规范说明文档，可选择覆盖已有内容。",
  parameters: {
    type: "object",
    properties: {
      overwrite: {
        type: "boolean",
        description: "是否覆盖已存在的 .rules 文件，默认不覆盖。",
      },
      customContent: {
        type: "string",
        description: "可选的自定义文档内容，不提供时使用默认规范模板。",
      },
    },
  },
  execute: async (
    input: InjectRulesToolInput = {},
  ): Promise<InjectRulesToolResult> => {
    const { overwrite = false, customContent } = input;

    const useCustomContent =
      typeof customContent === "string" && customContent.trim().length > 0;

    const detectedTechnologyDefinitions = useCustomContent
      ? []
      : await detectTechnologies();

    const rulesDocument = useCustomContent
      ? (customContent as string)
      : buildRulesDocument(detectedTechnologyDefinitions);

    const detectedTechnologies = detectedTechnologyDefinitions.map((tech) => tech.label);

    let fileExists = false;

    try {
      await fs.access(RULES_FILE_PATH);
      fileExists = true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw new Error(`无法检查 .rules 文件是否存在: ${(error as Error).message}`);
      }
    }

    if (fileExists && !overwrite) {
      throw new Error(
        ".rules 文件已存在。如需覆盖，请在指令中将 overwrite 设置为 true。",
      );
    }

    await fs.writeFile(RULES_FILE_PATH, `${rulesDocument.trim()}\n`, "utf8");

    return {
      path: RULES_FILE_PATH,
      overwritten: fileExists,
      content: `${rulesDocument.trim()}\n`,
      message: fileExists
        ? "已覆盖现有的 .rules 文件。"
        : "已生成新的 .rules 代码规范文档。",
      detectedTechnologies,
    };
  },
};

import { openaiModel } from "../../models.js";

export const codeGuidelinesMcp = new Agent({
  name: "code-guidelines-mcp",
  instructions:
    "当开发者需要注入或更新项目的代码规范时，调用 injectCodeRulesDocument 工具生成 .rules 文件。",
  system:
    "你是一名代码规范维护助手，负责确保项目根目录存在最新的 .rules 规范文档。评估需求后再调用工具，避免重复覆盖。",
  model: openaiModel,
  tools: { injectCodeRulesDocument: injectCodeRulesDocumentTool },
});
