import { Agent } from "mastra";
import { execFile } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";

const execFileAsync = promisify(execFile);

// 封装 Git 操作时常用的可选项，便于在不同动作之间共享预提交审查配置。
interface PreCommitReviewOptions {
  enabled?: boolean;
  reviewPrompt?: string;
  approval?: boolean;
}

type GitAction =
  | "status"
  | "pull"
  | "commit"
  | "merge"
  | "checkout"
  | "createBranch"
  | "push"
  | "lifecycleGuide";

interface GitOperationInput {
  action: GitAction;
  options?: Record<string, unknown>;
  preCommitReview?: PreCommitReviewOptions;
}

interface GitOperationResult {
  action: GitAction;
  executedCommands: string[];
  output: string;
  reminders: string[];
  recommendedCommands: string[];
  review?: {
    status: "pending" | "completed";
    combinedPrompt?: string;
    diff?: string;
    notes?: string;
  };
  branchCompliance?: {
    currentBranch: string;
    isCompliant: boolean;
    expectations: string[];
    suggestions: string[];
  };
  lifecycle?: {
    stageKey: LifecycleStageKey;
    stageName: string;
    summary: string;
    branchFocus: string[];
    steps: LifecycleStep[];
    nextStage?: string;
    notes?: string[];
  };
}

type LifecycleStageKey =
  | "clarify"
  | "development"
  | "testing"
  | "experience"
  | "acceptance"
  | "release"
  | "operation";

interface LifecycleStep {
  title: string;
  commands: string[];
  notes?: string;
}

interface LifecycleStageDefinition {
  key: LifecycleStageKey;
  name: string;
  summary: string;
  branchFocus: string[];
  steps: LifecycleStep[];
  reminders: string[];
  recommendedCommands: string[];
  nextStage?: string;
  notes?: string[];
}

// 统一执行 git 子命令的入口，自动指定仓库根目录并扩容缓冲区以适配大仓库输出。
const runGitCommand = async (args: string[]): Promise<{ stdout: string; stderr: string }> => {
  const { stdout, stderr } = await execFileAsync("git", args, {
    cwd: process.cwd(),
    maxBuffer: 1024 * 1024 * 10,
  });

  return { stdout: stdout.trim(), stderr: stderr.trim() };
};

// Kai 是内部生成式工具，若存在自定义流程指引则合并到提醒列表里。
const loadKaiInstructions = async (): Promise<string | undefined> => {
  const kaiPath = path.resolve(process.cwd(), ".kai/instructions.md");

  try {
    return await fs.readFile(kaiPath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
};

// 在执行预提交审查时，需要采集当前暂存区的 diff 作为输入提示词。
const collectStagedDiff = async (): Promise<string> => {
  const { stdout } = await runGitCommand(["diff", "--staged"]);
  return stdout;
};

const ensureArray = (value: unknown): string[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  return [String(value)];
};

// 将指定文件加入暂存区，缺省时默认全部跟踪变更，避免遗漏提交。
const stageFiles = async (paths?: string[]): Promise<string> => {
  if (!paths || paths.length === 0) {
    const { stdout } = await runGitCommand(["add", "--all"]);
    return stdout;
  }

  const uniquePaths = Array.from(new Set(paths));
  const { stdout } = await runGitCommand(["add", "--", ...uniquePaths]);
  return stdout;
};

// 生命周期阶段支持中英文同义词，统一转为内部的枚举值。
const normalizeLifecycleStage = (value: unknown): LifecycleStageKey | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = String(value).trim().toLowerCase();

  switch (normalized) {
    case "clarify":
    case "需求澄清":
      return "clarify";
    case "development":
    case "开发":
      return "development";
    case "testing":
    case "提测":
      return "testing";
    case "experience":
    case "体验":
      return "experience";
    case "acceptance":
    case "验收":
      return "acceptance";
    case "release":
    case "发布":
      return "release";
    case "operation":
    case "运营":
      return "operation";
    default:
      return undefined;
  }
};

const lifecycleGuidance: Record<LifecycleStageKey, LifecycleStageDefinition> = {
  clarify: {
    key: "clarify",
    name: "需求澄清",
    summary: "确认需求范围后，从最新的主干创建专属 feature 分支以承载研发任务。",
    branchFocus: ["master", "feature/<需求号>-<简述>"],
    steps: [
      {
        title: "同步主干确保基线最新",
        commands: ["git checkout master", "git pull origin master"],
        notes: "所有新的需求分支都应从最新 master 派生，避免后续重复合并。",
      },
      {
        title: "创建规范命名的需求分支",
        commands: ["git checkout -b feature/<需求号>-<简述>"],
        notes: "命名建议包含需求或任务编号，保持 traceability。",
      },
    ],
    reminders: [
      "需求澄清完成后即可进入开发阶段，保持 feature 分支命名与需求编号一致。",
    ],
    recommendedCommands: ["status", "commit", "push", "lifecycleGuide"],
    nextStage: "开发",
  },
  development: {
    key: "development",
    name: "开发",
    summary: "在 feature 分支上完成编码与自测，保持与 master 的同步并及时推送。",
    branchFocus: ["feature/<需求号>-<简述>"],
    steps: [
      {
        title: "开发前检查工作区",
        commands: ["git status", "git fetch origin master", "git rebase origin/master"],
        notes: "保持与主干同步，减少后续冲突。",
      },
      {
        title: "提交并推送开发进度",
        commands: [
          "git add <files>",
          "git commit -m 'feat: <描述>'",
          "git push -u origin feature/<需求号>-<简述>",
        ],
        notes: "提交信息需要清晰描述变更，首次推送记得设置 upstream。",
      },
    ],
    reminders: [
      "自测通过后为提测做准备，可提前补充文档或脚本。",
      "如需多人协作，请保持分支共享并定期 rebase。",
    ],
    recommendedCommands: ["status", "commit", "pull", "lifecycleGuide"],
    nextStage: "提测",
  },
  testing: {
    key: "testing",
    name: "提测",
    summary:
      "将完成开发的 feature 分支合入发布分支，并同步至 UAT 环境分支等待测试确认。",
    branchFocus: ["feature/<需求号>-<简述>", "release/<版本号>", "uat"],
    steps: [
      {
        title: "准备发布分支",
        commands: [
          "git checkout master",
          "git pull origin master",
          "git checkout -B release/<版本号> master",
        ],
        notes: "release 分支应从当前 master 派生，可复用已有版本分支。",
      },
      {
        title: "合并需求分支进入 release",
        commands: ["git merge --no-ff feature/<需求号>-<简述>", "git push origin release/<版本号>"],
        notes: "保持 --no-ff 便于追踪合并记录。",
      },
      {
        title: "同步 UAT 环境分支",
        commands: ["git checkout uat", "git pull origin uat", "git merge release/<版本号>", "git push origin uat"],
        notes: "UAT 分支更新后请通知测试同学开始验证。",
      },
    ],
    reminders: [
      "确保 release 分支包含完整的提测说明与回滚方案。",
      "提测期间不要在 release 分支上直接开发新功能。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "体验",
  },
  experience: {
    key: "experience",
    name: "体验",
    summary: "将已通过 UAT 的代码同步至 stage 环境，准备业务体验或灰度。",
    branchFocus: ["uat", "stage"],
    steps: [
      {
        title: "同步 stage 环境分支",
        commands: ["git checkout stage", "git pull origin stage", "git merge uat", "git push origin stage"],
        notes: "确保 stage 的配置或数据准备就绪，并记录体验反馈。",
      },
    ],
    reminders: [
      "体验过程中若有问题需回滚，请在 release 分支修复并重新同步。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "验收",
  },
  acceptance: {
    key: "acceptance",
    name: "验收",
    summary: "将 stage 分支结果合入 master，为最终上线做准备。",
    branchFocus: ["stage", "master"],
    steps: [
      {
        title: "合并 stage 至 master",
        commands: ["git checkout master", "git pull origin master", "git merge stage", "git push origin master"],
        notes: "验收完成后 master 应保持与 stage 一致。",
      },
    ],
    reminders: [
      "验收通过后记得更新发布说明，并准备上线 checklist。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "发布",
  },
  release: {
    key: "release",
    name: "发布",
    summary: "将 master 的最终代码部署至 production，并创建对应标签。",
    branchFocus: ["master", "production"],
    steps: [
      {
        title: "同步生产分支并上线",
        commands: [
          "git checkout production",
          "git pull origin production",
          "git merge master",
          "git push origin production",
        ],
        notes: "上线完成后建议打 tag 记录版本。",
      },
      {
        title: "创建并推送版本标签",
        commands: ["git tag v<版本号>", "git push origin v<版本号>"],
        notes: "标签命名需与发布版本一致，便于追踪。",
      },
    ],
    reminders: [
      "发布完成后需通知相关方，并监控生产指标。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "运营",
  },
  operation: {
    key: "operation",
    name: "运营",
    summary: "发布后如需紧急修复，可基于 production-hotfix 分支管理补丁。",
    branchFocus: ["production", "production-hotfix", "hotfix/<问题号>", "release/<版本号>"],
    steps: [
      {
        title: "准备 hotfix 分支",
        commands: [
          "git checkout production",
          "git pull origin production",
          "git checkout -B production-hotfix production",
        ],
        notes: "hotfix 分支仅用于紧急修复，修复后需回灌 master。",
      },
      {
        title: "创建并处理 hotfix",
        commands: [
          "git checkout -b hotfix/<问题号>",
          "git add <files>",
          "git commit -m 'fix: <描述>'",
          "git push origin hotfix/<问题号>",
        ],
        notes: "hotfix 提交需同步到 release/master，避免版本漂移。",
      },
    ],
    reminders: [
      "完成修复后记得合并回 master、release 及 production 分支。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    notes: ["运营阶段可根据需要创建新的需求分支进入下一轮迭代。"],
  },
};

const getActionGuidance = (
  action: GitAction,
  stageDefinition?: LifecycleStageDefinition,
): { reminders: string[]; recommendedCommands: string[] } => {
  const defaultGuidance = {
    reminders: ["保持分支历史清晰，必要时更新变更日志。"],
    recommendedCommands: ["status", "pull", "commit", "push"],
  };

  const actionGuidance: Partial<
    Record<
      GitAction,
      {
        reminders: string[];
        recommendedCommands: string[];
      }
    >
  > = {
    status: {
      reminders: ["检查状态后可考虑执行 pull 或 commit 操作以保持分支同步。"],
      recommendedCommands: ["pull", "commit", "push"],
    },
    pull: {
      reminders: ["如遇冲突请及时处理，并再次查看 git status。"],
      recommendedCommands: ["status", "commit", "push"],
    },
    commit: {
      reminders: ["提交后请及时 push，并在必要时创建合并请求。"],
      recommendedCommands: ["push", "status", "merge"],
    },
    merge: {
      reminders: ["合并后请运行测试，并考虑 push 结果到远程。"],
      recommendedCommands: ["status", "push", "commit"],
    },
    checkout: {
      reminders: ["切换分支前后请确保工作树干净，必要时先提交或暂存变更。"],
      recommendedCommands: ["status", "pull", "commit"],
    },
    createBranch: {
      reminders: ["新分支创建后请立即 checkout 并同步远程仓库。"],
      recommendedCommands: ["checkout", "pull", "push"],
    },
    push: {
      reminders: ["推送后请在远端创建或更新合并请求，并通知评审人。"],
      recommendedCommands: ["status", "pull", "merge"],
    },
    lifecycleGuide: {
      reminders: ["根据当前阶段梳理必备的分支操作，确保流程顺畅。"],
      recommendedCommands: ["status", "merge", "push"],
    },
  };

  const base = actionGuidance[action] ?? defaultGuidance;

  if (!stageDefinition) {
    return base;
  }

  const stageReminders = [
    `当前处于「${stageDefinition.name}」阶段：${stageDefinition.summary}`,
    ...stageDefinition.reminders,
  ];

  const stageRecommended = stageDefinition.recommendedCommands;

  return {
    reminders: Array.from(new Set([...stageReminders, ...base.reminders])),
    recommendedCommands: Array.from(new Set([...stageRecommended, ...base.recommendedCommands])),
  };
};

const branchComplianceRules: { pattern: RegExp; description: string }[] = [
  { pattern: /^master$/, description: "主干分支，用于验收通过后的最终代码。" },
  { pattern: /^uat$/, description: "用户验收测试环境分支，来源于 release。" },
  { pattern: /^stage$/, description: "预发体验环境分支，需保持与 UAT 同步。" },
  { pattern: /^production$/, description: "线上生产分支，仅接受已验收的代码。" },
  { pattern: /^production-hotfix$/, description: "线上紧急修复分支，需及时回灌主干。" },
  { pattern: /^feature\/[\w.-]+$/, description: "需求/特性分支，命名包含需求编号与简述。" },
  { pattern: /^release\/[\w.-]+$/, description: "发布分支，承载提测和发布阶段。" },
  { pattern: /^hotfix\/[\w.-]+$/, description: "Hotfix 分支，用于线上紧急问题修复。" },
];

const formatLifecycleOutput = (definition: LifecycleStageDefinition): string => {
  const header = `阶段：${definition.name}\n概述：${definition.summary}`;
  const branchInfo = `重点分支：${definition.branchFocus.join(", ")}`;
  const steps = definition.steps
    .map((step, index) => {
      const commandList = step.commands.map((command) => `    - ${command}`).join("\n");
      const notes = step.notes ? `\n    备注：${step.notes}` : "";
      return `${index + 1}. ${step.title}\n${commandList}${notes}`;
    })
    .join("\n\n");

  const notes = definition.notes?.length ? `\n附加说明：${definition.notes.join("；")}` : "";
  const nextStage = definition.nextStage ? `\n下一阶段：${definition.nextStage}` : "";

  return [header, branchInfo, steps + notes + nextStage].join("\n\n");
};

const getCurrentBranch = async (): Promise<string | undefined> => {
  try {
    const { stdout } = await runGitCommand(["rev-parse", "--abbrev-ref", "HEAD"]);
    return stdout;
  } catch (error) {
    return undefined;
  }
};

const evaluateBranchCompliance = (
  branch: string | undefined,
  stageDefinition?: LifecycleStageDefinition,
): GitOperationResult["branchCompliance"] => {
  if (!branch) {
    return undefined;
  }

  const matchedRule = branchComplianceRules.find((rule) => rule.pattern.test(branch));
  const isCompliant = Boolean(matchedRule);

  const expectations: string[] = [];
  const suggestions: string[] = [];

  if (matchedRule) {
    expectations.push(matchedRule.description);
  } else {
    expectations.push("当前分支未匹配到规范命名，请对照流程重新命名或切换。");
  }

  if (stageDefinition) {
    suggestions.push(`阶段「${stageDefinition.name}」推荐使用：${stageDefinition.branchFocus.join(", ")}`);
  }

  if (!isCompliant) {
    suggestions.push("可使用 lifecycleGuide 操作获取规范步骤并调整分支。");
  }

  return {
    currentBranch: branch,
    isCompliant,
    expectations,
    suggestions,
  };
};

const gitWorkflowTool = {
  name: "gitWorkflow",
  description:
    "根据结构化指令执行 Git 工作流操作（如状态查询、拉取、提交、合并、推送等），并提供后续提醒与推荐指令。",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: [
          "status",
          "pull",
          "commit",
          "merge",
          "checkout",
          "createBranch",
          "push",
          "lifecycleGuide",
        ],
        description: "要执行的 Git 操作。",
      },
      options: {
        type: "object",
        description: "针对指定操作的额外参数。",
      },
      preCommitReview: {
        type: "object",
        description: "提交前的代码审查配置。仅在 action=commit 时生效。",
      },
    },
    required: ["action"],
  },
  execute: async ({ action, options, preCommitReview }: GitOperationInput): Promise<GitOperationResult> => {
    const executedCommands: string[] = [];
    let output = "";
    let review: GitOperationResult["review"] | undefined;

    const stageKey = normalizeLifecycleStage(options?.stage ?? options?.lifecycleStage);
    const stageDefinition = stageKey ? lifecycleGuidance[stageKey] : undefined;
    const lifecycleInfo = stageDefinition
      ? {
          stageKey: stageDefinition.key,
          stageName: stageDefinition.name,
          summary: stageDefinition.summary,
          branchFocus: stageDefinition.branchFocus,
          steps: stageDefinition.steps,
          nextStage: stageDefinition.nextStage,
          notes: stageDefinition.notes,
        }
      : undefined;

    switch (action) {
      case "status": {
        const { stdout } = await runGitCommand(["status", "--short", "--branch"]);
        executedCommands.push("git status --short --branch");
        output = stdout;
        break;
      }
      case "pull": {
        const remote = options?.remote ? String(options.remote) : undefined;
        const branch = options?.branch ? String(options.branch) : undefined;
        const args = ["pull"];

        if (remote) {
          args.push(remote);
        }

        if (branch) {
          args.push(branch);
        }

        const { stdout, stderr } = await runGitCommand(args);
        executedCommands.push(`git ${args.join(" ")}`);
        output = [stdout, stderr].filter(Boolean).join("\n");
        break;
      }
      case "checkout": {
        const branch = options?.branch ? String(options.branch) : undefined;

        if (!branch) {
          throw new Error("执行 checkout 需要提供目标分支名称 (options.branch)。");
        }

        const { stdout, stderr } = await runGitCommand(["checkout", branch]);
        executedCommands.push(`git checkout ${branch}`);
        output = [stdout, stderr].filter(Boolean).join("\n");
        break;
      }
      case "createBranch": {
        const branch = options?.branch ? String(options.branch) : undefined;

        if (!branch) {
          throw new Error("执行 createBranch 需要提供新分支名称 (options.branch)。");
        }

        const fromBranch = options?.from ? String(options.from) : undefined;
        const args = ["checkout", "-b", branch];

        if (fromBranch) {
          args.push(fromBranch);
        }

        const { stdout, stderr } = await runGitCommand(args);
        executedCommands.push(`git ${args.join(" ")}`);
        output = [stdout, stderr].filter(Boolean).join("\n");
        break;
      }
      case "merge": {
        const sourceBranch = options?.source ? String(options.source) : undefined;

        if (!sourceBranch) {
          throw new Error("执行 merge 需要提供来源分支名称 (options.source)。");
        }

        const args = ["merge"];

        if (options?.noFastForward) {
          args.push("--no-ff");
        }

        if (options?.squash) {
          args.push("--squash");
        }

        args.push(sourceBranch);

        const { stdout, stderr } = await runGitCommand(args);
        executedCommands.push(`git ${args.join(" ")}`);
        output = [stdout, stderr].filter(Boolean).join("\n");
        break;
      }
      case "push": {
        const remote = options?.remote ? String(options.remote) : undefined;
        const branch = options?.branch ? String(options.branch) : undefined;
        const setUpstream = Boolean(options?.setUpstream);
        const args = ["push"];

        if (setUpstream && remote && branch) {
          args.push("--set-upstream", remote, branch);
        } else {
          if (remote) {
            args.push(remote);
          }

          if (branch) {
            args.push(branch);
          }
        }

        const { stdout, stderr } = await runGitCommand(args);
        executedCommands.push(`git ${args.join(" ")}`);
        output = [stdout, stderr].filter(Boolean).join("\n");
        break;
      }
      case "commit": {
        const message = options?.message ? String(options.message) : undefined;

        if (!message) {
          throw new Error("执行 commit 需要提供提交说明 (options.message)。");
        }

        const paths = ensureArray(options?.paths);
        const allowEmpty = Boolean(options?.allowEmpty);
        const signoff = Boolean(options?.signoff);

        await stageFiles(paths);
        executedCommands.push(
          `git add ${paths && paths.length > 0 ? `-- ${paths.join(" ")}` : "--all"}`,
        );

        const { stdout: stagedStatus } = await runGitCommand(["diff", "--staged", "--name-status"]);

        if (!allowEmpty && stagedStatus.trim().length === 0) {
          throw new Error("没有检测到已暂存的文件，请先修改或通过 options.allowEmpty=true 允许空提交。");
        }

        if (preCommitReview?.enabled && !preCommitReview.approval) {
          const diff = await collectStagedDiff();
          const kaiInstructions = await loadKaiInstructions();
          const prompts: string[] = [];

          if (preCommitReview.reviewPrompt) {
            prompts.push(preCommitReview.reviewPrompt.trim());
          }

          if (kaiInstructions) {
            prompts.push(kaiInstructions.trim());
          }

          review = {
            status: "pending",
            combinedPrompt: prompts.join("\n\n"),
            diff,
            notes:
              "已开启提交前审查。请根据 combinedPrompt 的规范检查 diff 内容，通过后重新执行并设置 preCommitReview.approval=true。",
          };

          output = "提交已暂停，等待代码审查确认。";
          break;
        }

        const commitArgs = ["commit", "-m", message];

        if (allowEmpty) {
          commitArgs.push("--allow-empty");
        }

        if (signoff) {
          commitArgs.push("--signoff");
        }

        const { stdout, stderr } = await runGitCommand(commitArgs);
        executedCommands.push(`git ${commitArgs.join(" ")}`);
        output = [stdout, stderr].filter(Boolean).join("\n");

        if (preCommitReview?.enabled) {
          review = { status: "completed" };
        }

        break;
      }
      case "lifecycleGuide": {
        if (!stageDefinition) {
          throw new Error(
            "执行 lifecycleGuide 需要提供生命周期阶段 (options.stage 或 options.lifecycleStage)。",
          );
        }

        output = formatLifecycleOutput(stageDefinition);
        break;
      }
      default: {
        throw new Error(`暂不支持的 Git 操作: ${action}`);
      }
    }

    const currentBranch = await getCurrentBranch();
    const branchCompliance = evaluateBranchCompliance(currentBranch, stageDefinition);
    const { reminders, recommendedCommands } = getActionGuidance(action, stageDefinition);

    return {
      action,
      executedCommands,
      output,
      reminders,
      recommendedCommands,
      review,
      branchCompliance,
      lifecycle: action === "lifecycleGuide" ? lifecycleInfo : undefined,
    };
  },
};

export const gitMcpAgent = new Agent({
  name: "git-mcp-agent",
  instructions:
    "提供结构化的 Git 分支管理功能，可执行提交、拉取、合并等操作，并在需要时挂起提交流程以等待代码审查。",
  system:
    "你是一名 Git 工作流管家。根据调用方的结构化参数执行 git 命令，确保输出包含关键提醒与推荐指令。",
  tools: [gitWorkflowTool],
});
