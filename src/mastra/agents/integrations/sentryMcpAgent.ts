import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import {
  SentryMcpClient,
  autoClassify,
  autoClassifyAll,
  type SentryAnnotatedIssue,
  type SentryIssue,
  type SentryIssueAnnotation,
  type SentryIssueTaxonomy,
} from "../../integrations/sentryMcp.js";

// ============ 类型定义 ============

type SentryAction = "fetchTopIssues" | "autoAnalyze" | "notifyHighRisk";

interface SentryCredentialsInput {
  baseUrl?: string;
  token?: string;
  organizationSlug?: string;
  projectSlug?: string;
  defaultLimit?: number;
}

interface SentryNotificationConfig {
  larkWebhook?: string;
  larkTemplate?: string;
  emailRecipients?: string[];
  emailFrom?: string;
  emailSubjectPrefix?: string;
  groupBy?: "risk" | "issueType";
}

interface SentryAgentInput {
  action: SentryAction;
  useMcp?: boolean;
  limit?: number;
  credentials?: SentryCredentialsInput;
  taxonomyOverrides?: Partial<SentryIssueTaxonomy>;
  annotations?: Record<string, SentryIssueAnnotation>;
  issues?: SentryIssue[];
  notificationConfig?: SentryNotificationConfig;
}

interface FetchIssuesPayload {
  action: "fetchTopIssues";
  issues: SentryIssue[];
  taxonomy: SentryIssueTaxonomy;
}

interface AutoAnalyzePayload {
  action: "autoAnalyze";
  issues: SentryIssue[];
  annotations: Record<string, SentryIssueAnnotation>;
  annotated: SentryAnnotatedIssue[];
  taxonomy: SentryIssueTaxonomy;
  summary: {
    total: number;
    bySeverity: Record<string, number>;
    byType: Record<string, number>;
    highRiskCount: number;
  };
}

interface NotificationPreview {
  channel: "lark" | "email";
  status: "skipped" | "sent" | "prepared";
  detail: string;
}

interface NotificationResultPayload {
  action: "notifyHighRisk";
  notifiedIssues: SentryAnnotatedIssue[];
  notifications: NotificationPreview[];
}

type SentryAgentResult = FetchIssuesPayload | AutoAnalyzePayload | NotificationResultPayload;

// ============ 辅助函数 ============

function buildSummary(annotated: SentryAnnotatedIssue[]): AutoAnalyzePayload["summary"] {
  const bySeverity: Record<string, number> = {};
  const byType: Record<string, number> = {};
  let highRiskCount = 0;

  for (const issue of annotated) {
    const severity = issue.riskLabel ?? issue.riskId ?? "unknown";
    const type = issue.issueTypeLabel ?? issue.issueTypeId ?? "unknown";

    bySeverity[severity] = (bySeverity[severity] ?? 0) + 1;
    byType[type] = (byType[type] ?? 0) + 1;

    if (issue.riskId === "critical" || issue.riskId === "major") {
      highRiskCount += 1;
    }
  }

  return {
    total: annotated.length,
    bySeverity,
    byType,
    highRiskCount,
  };
}

function formatLarkMessage(issues: SentryAnnotatedIssue[]): string {
  if (issues.length === 0) {
    return "Sentry 高风险告警：当前无高风险问题";
  }

  const lines = issues.map((issue) => {
    const risk = issue.riskLabel ?? issue.riskId ?? "未知";
    const type = issue.issueTypeLabel ?? "";
    const freq = issue.frequencyBandLabel ?? "";

    return `• [${risk}] ${issue.title}${type ? ` (${type})` : ""}${freq ? ` - ${freq}` : ""}\n  ${issue.permalink ?? ""}`;
  });

  return `🚨 Sentry 高风险告警（${issues.length} 条）\n\n${lines.join("\n\n")}`;
}

function formatEmailBody(issues: SentryAnnotatedIssue[], groupBy: "risk" | "issueType"): string {
  const grouped = issues.reduce<Record<string, SentryAnnotatedIssue[]>>((acc, issue) => {
    const key = groupBy === "issueType"
      ? issue.issueTypeLabel ?? issue.issueTypeId ?? "unknown"
      : issue.riskLabel ?? issue.riskId ?? "unknown";
    acc[key] = acc[key] ?? [];
    acc[key].push(issue);

    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([group, items]) => {
      const lines = items
        .map((item) => `- ${item.title} (${item.frequency ?? "?"} 次) ${item.permalink ?? ""}`)
        .join("\n");

      return `【${group}】\n${lines}`;
    })
    .join("\n\n");
}

// ============ Tool 定义 ============

const sentryTool = {
  id: "sentryMcp",
  description:
    "获取 Sentry Issue 并进行自动分类打标，支持高风险问题的 Lark/邮件告警。",
  inputSchema: z.object({
    action: z
      .enum(["fetchTopIssues", "autoAnalyze", "notifyHighRisk"])
      .describe("要执行的动作：获取 Issue、自动分析、或发送告警。"),
    useMcp: z
      .boolean()
      .optional()
      .describe("是否使用官方 Sentry MCP Server，默认 true。设为 false 使用 REST API。"),
    limit: z.number().optional().describe("获取 Issue 的数量，默认 20。"),
    credentials: z
      .object({
        baseUrl: z.string().optional(),
        token: z.string().optional(),
        organizationSlug: z.string().optional(),
        projectSlug: z.string().optional(),
        defaultLimit: z.number().optional(),
      })
      .optional()
      .describe("Sentry 凭据配置，可覆盖环境变量。"),
    taxonomyOverrides: z
      .record(z.any())
      .optional()
      .describe("自定义分类词典覆盖（riskLevels, issueTypes, frequencyBands）。"),
    annotations: z
      .record(z.any())
      .optional()
      .describe("手动打标覆盖项，按 Issue ID 映射。若不提供则使用自动分类。"),
    issues: z
      .array(z.any())
      .optional()
      .describe("待通知的 Issue 列表，action=notifyHighRisk 时必填。"),
    notificationConfig: z
      .object({
        larkWebhook: z.string().optional(),
        larkTemplate: z.string().optional(),
        emailRecipients: z.array(z.string()).optional(),
        emailFrom: z.string().optional(),
        emailSubjectPrefix: z.string().optional(),
        groupBy: z.enum(["risk", "issueType"]).optional(),
      })
      .optional()
      .describe("告警通知配置。"),
  }),
  execute: async ({
    action,
    useMcp = true,
    limit = 20,
    credentials,
    taxonomyOverrides,
    annotations,
    issues,
    notificationConfig,
  }: SentryAgentInput): Promise<SentryAgentResult> => {
    const client = new SentryMcpClient({
      baseUrl: credentials?.baseUrl,
      token: credentials?.token,
      organizationSlug: credentials?.organizationSlug,
      projectSlug: credentials?.projectSlug,
      defaultLimit: credentials?.defaultLimit,
      useMcp,
    });

    try {
      switch (action) {
        case "fetchTopIssues": {
          const fetchedIssues = await client.fetchIssues(limit);
          const taxonomy = client.buildTaxonomy(taxonomyOverrides);

          return { action, issues: fetchedIssues, taxonomy };
        }

        case "autoAnalyze": {
          const { issues: fetchedIssues, annotations: autoAnnotations, annotated } = await client.fetchAndClassify(limit);

          const finalAnnotations = annotations
            ? { ...autoAnnotations, ...annotations }
            : autoAnnotations;

          const finalAnnotated = annotations
            ? client.annotateIssues(fetchedIssues, finalAnnotations, taxonomyOverrides)
            : annotated;

          const taxonomy = client.buildTaxonomy(taxonomyOverrides);
          const summary = buildSummary(finalAnnotated);

          return {
            action,
            issues: fetchedIssues,
            annotations: finalAnnotations,
            annotated: finalAnnotated,
            taxonomy,
            summary,
          };
        }

        case "notifyHighRisk": {
          if (!issues || issues.length === 0) {
            throw new Error("notifyHighRisk 需要传入 issues。先调用 autoAnalyze 获取已分类的 Issue 列表。");
          }

          const finalAnnotations = annotations ?? autoClassifyAll(issues);
          const annotated = client.annotateIssues(issues, finalAnnotations, taxonomyOverrides);
          const taxonomy = client.buildTaxonomy(taxonomyOverrides);

          const highRiskIds = new Set(
            taxonomy.riskLevels
              .filter((entry) => entry.severity === "high" || entry.severity === "critical")
              .map((entry) => entry.id),
          );

          const highRiskIssues = annotated.filter((issue) => issue.riskId && highRiskIds.has(issue.riskId));
          const notifications: NotificationPreview[] = [];

          if (notificationConfig?.larkWebhook) {
            const message = notificationConfig.larkTemplate ?? formatLarkMessage(highRiskIssues);
            const payload = { msg_type: "text", content: { text: message } };

            try {
              const response = await fetch(notificationConfig.larkWebhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                const detail = await response.text();
                notifications.push({
                  channel: "lark",
                  status: "skipped",
                  detail: `Lark 发送失败：${response.status} ${detail}`,
                });
              } else {
                notifications.push({ channel: "lark", status: "sent", detail: "已通过 Lark Webhook 发送。" });
              }
            } catch (error) {
              notifications.push({ channel: "lark", status: "skipped", detail: String(error) });
            }
          } else {
            notifications.push({ channel: "lark", status: "skipped", detail: "未配置 Lark webhook。" });
          }

          if (notificationConfig?.emailRecipients?.length) {
            const subjectPrefix = notificationConfig.emailSubjectPrefix ?? "[Sentry] 高风险告警";
            const emailBody = formatEmailBody(highRiskIssues, notificationConfig.groupBy ?? "risk");

            notifications.push({
              channel: "email",
              status: "prepared",
              detail: `From: ${notificationConfig.emailFrom ?? "sentry-bot"}\nTo: ${notificationConfig.emailRecipients.join(", ")}\nSubject: ${subjectPrefix}\n\n${emailBody}`,
            });
          } else {
            notifications.push({ channel: "email", status: "skipped", detail: "未配置邮件收件人。" });
          }

          return { action, notifiedIssues: highRiskIssues, notifications };
        }

        default:
          throw new Error(`未知的 Sentry 动作：${action}`);
      }
    } finally {
      await client.disconnect();
    }
  },
};

// ============ Agent 定义 ============

import { geminiModel } from "../../models.js";

export const sentryMcpAgent = new Agent({
  id: "sentry-mcp-agent",
  name: "sentry-mcp-agent",
  instructions: `你是 Sentry Issue 分析与预警专家。

核心能力：
1. **autoAnalyze**（推荐）：一键获取 Issue + 自动分类 + 生成分析报告
2. **fetchTopIssues**：仅获取原始 Issue 列表
3. **notifyHighRisk**：对高风险 Issue 发送 Lark/邮件告警

自动分类规则：
- 风险等级：基于 level (fatal/error/warning) + userCount
- 问题类型：基于 title/culprit 关键词匹配（网络/依赖/代码健壮性等）
- 频率分档：基于 frequency 阈值

使用建议：
1. 默认使用 autoAnalyze 获取完整分析报告
2. 重点关注 summary.highRiskCount 和 critical/major 级别的问题
3. 对高风险问题调用 notifyHighRisk 发送告警`,
  model: geminiModel,
  tools: { sentryMcp: sentryTool },
});
