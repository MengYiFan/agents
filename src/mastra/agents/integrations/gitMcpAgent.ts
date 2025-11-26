import { Agent } from "@mastra/core/agent";
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
      "将完成开发的 feature 分支合入发布分支，并根据测试环境创建标签同步至 UAT/Stage，等待测试确认。",
    branchFocus: ["feature/<需求号>-<简述>", "release/<版本号>", "uat", "stage"],
    steps: [
      {
        title: "从 master 创建发布分支",
        commands: [
          "git checkout master",
          "git pull origin master",
          "git checkout -B release/<版本号> master",
        ],
        notes: "release 分支应从当前 master 派生，可复用已有版本分支。",
      },
      {
        title: "通过 MR 合并 feature 分支",
        commands: [
          "git merge --no-ff feature/<需求号>-<简述>",
          "git push origin release/<版本号>",
        ],
        notes: "合并需走 Code Review/MR 流程，保持 --no-ff 便于追踪。",
      },
      {
        title: "为测试环境创建标签",
        commands: [
          "git checkout release/<版本号>",
          "git pull origin release/<版本号>",
          "export RELEASE_VERSION=<release版本，例如2025.w33.02>",
          "export DEPLOY_SEQ=<发布号，例如01>",
          "export ENVIRONMENT_TAG=<环境标识，例如stage>",
          "git tag ${ENVIRONMENT_TAG:-stage}-${RELEASE_VERSION}-${DEPLOY_SEQ}",
          "git push origin ${ENVIRONMENT_TAG:-stage}-${RELEASE_VERSION}-${DEPLOY_SEQ}",
        ],
        notes:
          "先设置 RELEASE_VERSION/DEPLOY_SEQ/ENVIRONMENT_TAG，再执行打标。例如 stage-2025.w33.02-01，可按 stage/uat 区分。",
      },
      {
        title: "同步 UAT/Stage 环境分支",
        commands: [
          "git checkout uat",
          "git pull origin uat",
          "git merge release/<版本号>",
          "git push origin uat",
          "git checkout stage",
          "git pull origin stage",
          "git merge release/<版本号>",
          "git push origin stage",
        ],
        notes: "若通过标签自动部署，请确保标签与环境同步触发。",
      },
    ],
    reminders: [
      "确保 release 分支包含完整的提测说明、回滚方案及对应标签记录。",
      "提测阶段产生的缺陷需回到原 feature/* 分支修复，再次合入 release。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "体验",
  },
  experience: {
    key: "experience",
    name: "体验",
    summary:
      "使用 release 分支及对应标签验证 stage 环境，沉淀体验反馈并准备验收材料。",
    branchFocus: ["release/<版本号>", "stage", "stage 标签"],
    steps: [
      {
        title: "确认 stage 标签部署成功",
        commands: [
          "git checkout release/<版本号>",
          "git describe --tags --abbrev=0",
          "export STAGE_TAG=${STAGE_TAG:-stage-${RELEASE_VERSION}-${DEPLOY_SEQ}}",
          "git push origin ${STAGE_TAG}",
        ],
        notes:
          "确保 stage 标签（如 stage-2025.w33.02-01）已部署，可通过 STAGE_TAG 或前述环境变量复用命名。",
      },
      {
        title: "跟进体验反馈",
        commands: [
          "git checkout feature/<需求号>-<简述>",
          "git cherry-pick <修复提交>",
          "git push origin feature/<需求号>-<简述>",
        ],
        notes: "体验阶段的修复仍在 feature 分支完成，再通过 MR 合入 release。",
      },
    ],
    reminders: [
      "体验过程中如需回滚，先回退 stage 标签，再在 release 分支修复。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "验收",
  },
  acceptance: {
    key: "acceptance",
    name: "验收",
    summary:
      "通过 MR 将 release 分支合入 master，并在 pre-production 环境完成回归验证。",
    branchFocus: ["release/<版本号>", "master", "pre-production"],
    steps: [
      {
        title: "完成 release → master 合并",
        commands: [
          "git checkout master",
          "git pull origin master",
          "git merge --no-ff release/<版本号>",
          "git push origin master",
        ],
        notes: "必须走 Merge Request 与 Code Review，确保 master 记录完整。",
      },
      {
        title: "同步 pre-production 环境",
        commands: [
          "git checkout pre-production",
          "git pull origin pre-production",
          "git merge master",
          "git push origin pre-production",
        ],
        notes: "在预生产环境执行完整回归，记录阻塞项。",
      },
    ],
    reminders: [
      "验收通过后更新发布说明，并准备上线 checklist 与回滚预案。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "发布",
  },
  release: {
    key: "release",
    name: "发布",
    summary: "将已验收的 master 代码同步至 production，创建正式发布标签并执行上线。",
    branchFocus: ["master", "production", "生产标签"],
    steps: [
      {
        title: "合并 master 至 production",
        commands: [
          "git checkout production",
          "git pull origin production",
          "git merge master",
          "git push origin production",
        ],
        notes: "生产部署前再次确认预生产验证结果与回滚方案。",
      },
      {
        title: "创建并推送生产标签",
        commands: [
          "git checkout master",
          "git pull origin master",
          "export RELEASE_VERSION=<release版本，例如2025.w33.02>",
          "export DEPLOY_SEQ=<发布号，例如01>",
          "git tag production-${RELEASE_VERSION}-${DEPLOY_SEQ}",
          "git push origin production-${RELEASE_VERSION}-${DEPLOY_SEQ}",
        ],
        notes:
          "通过 export 指定版本与发布号后再执行打标，例如 production-2025.w33.02-01，并在上线操作后记录产线时间点。",
      },
    ],
    reminders: [
      "发布完成后需在 master、production 上标记版本，并通知相关方与监控生产指标。",
    ],
    recommendedCommands: ["merge", "push", "status", "lifecycleGuide"],
    nextStage: "运营",
  },
  operation: {
    key: "operation",
    name: "运营",
    summary:
      "面对产线问题，优先评估是否回滚标签，再选择 bugfix 或 hotfix 分支修复并回灌主干。",
    branchFocus: ["master", "production", "bugfix/<编号>", "hotfix/<编号>", "release/<版本号>"],
    steps: [
      {
        title: "处理普通线上缺陷",
        commands: [
          "git checkout master",
          "git pull origin master",
          "git checkout -b bugfix/<编号>",
          "git add <files>",
          "git commit -m 'fix: <描述>'",
          "git push origin bugfix/<编号>",
        ],
        notes: "普通缺陷从 master 开分支，复用完整提测/发布流程回灌 release 与 master。",
      },
      {
        title: "处理紧急产线缺陷",
        commands: [
          "git checkout production",
          "git pull origin production",
          "git tag -f rollback-<版本号> <上个稳定版本>",
          "git checkout -b hotfix/<编号>",
          "git add <files>",
          "git commit -m 'fix: <描述>'",
          "git push origin hotfix/<编号>",
        ],
        notes: "先回滚生产标签，再基于 production 创建 hotfix，修复完成后回灌 master/release。",
      },
    ],
    reminders: [
      "无论 bugfix 还是 hotfix，修复完成后需合并回 master、release/<版本号> 及 production。",
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
  id: "gitWorkflow",
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

import { openaiModel } from "../../models.js";

export const gitMcpAgent = new Agent({
  name: "git-mcp-agent",
  instructions:
    "你是 Git 工作流专家。根据用户意图调用 gitWorkflow 工具执行操作，并基于返回的生命周期指引（lifecycleGuide）提供下一步建议。对于 status/diff 结果，需简要分析变更点；对于 commit/push 操作，需确认是否符合分支规范。",
  system:
    "1) 优先使用 gitWorkflow 执行操作；2) 每次操作后检查返回的 reminders 与 recommendedCommands；3) 遇到分支不规范时，引用 branchCompliance 的建议引导用户；4) 涉及代码审查时，提示用户关注 review 状态。",
  model: openaiModel,
  tools: { gitWorkflow: gitWorkflowTool },
});
