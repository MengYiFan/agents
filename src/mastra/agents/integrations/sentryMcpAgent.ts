import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import {
  SentryMcpClient,
  type SentryAnnotatedIssue,
  type SentryIssue,
  type SentryIssueAnnotation,
  type SentryIssueTaxonomy,
} from "../../integrations/sentryMcp.js";

type SentryAction = "fetchTopIssues" | "notifyHighRisk";

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

type SentryAgentResult = FetchIssuesPayload | NotificationResultPayload;

const sentryTool = {
  id: "sentryMcp",
  description:
    "通过 Sentry MCP 获取 Issue 并基于可配置枚举进行打标，可对高风险问题触发 Lark/邮件通知。自动缓存登录态以减少重复认证。",
  inputSchema: z.object({
    action: z
      .enum(["fetchTopIssues", "notifyHighRisk"])
      .describe("要执行的动作：获取 issue 或发送告警。"),
    limit: z.number().optional().describe("获取 issue 的数量，默认 20。"),
    credentials: z
      .object({
        baseUrl: z.string().optional(),
        token: z.string().optional(),
        organizationSlug: z.string().optional(),
        projectSlug: z.string().optional(),
        defaultLimit: z.number().optional(),
      })
      .optional()
      .describe("可选的 Sentry MCP 凭据覆盖项，支持自定义 baseUrl、token、组织和项目。"),
    taxonomyOverrides: z.record(z.any()).optional().describe("可选的枚举值词典覆盖项，用于风险、问题类型、频率分档。"),
    annotations: z
      .record(z.any())
      .optional()
      .describe("按 issue id 提交的打标结果（riskId、issueTypeId、frequencyBandId 等）。"),
    issues: z.array(z.any()).optional().describe("待通知的已打标 issue 列表，当 action=notifyHighRisk 时必填。"),
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
      .describe("告警通知配置，包括 Lark webhook 和邮件收件人等。"),
  }),
  execute: async ({
    action,
    limit,
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
    });

    switch (action) {
      case "fetchTopIssues": {
        const fetched = await client.fetchIssues(limit);
        const taxonomy = client.buildTaxonomy(taxonomyOverrides);
        return { action, issues: fetched, taxonomy };
      }
      case "notifyHighRisk": {
        if (!issues || issues.length === 0) {
          throw new Error("notifyHighRisk 需要传入已打标的 issues。先调用 fetchTopIssues 并完成打标。");
        }

        const annotated = client.annotateIssues(issues, annotations ?? {}, taxonomyOverrides);
        const taxonomy = client.buildTaxonomy(taxonomyOverrides);
        const highRiskIds = new Set(
          taxonomy.riskLevels
            .filter((entry) => entry.severity === "high" || entry.severity === "critical")
            .map((entry) => entry.id),
        );

        const highRiskIssues = annotated.filter((issue) => issue.riskId && highRiskIds.has(issue.riskId));
        const notifications: NotificationPreview[] = [];

        if (notificationConfig?.larkWebhook) {
          const payload = {
            msg_type: "text",
            content: {
              text:
                notificationConfig.larkTemplate ??
                `Sentry 高风险告警（${highRiskIssues.length} 条）：\n` +
                highRiskIssues
                  .map((item) => `${item.title} [${item.riskLabel ?? item.riskId}] -> ${item.permalink ?? ""}`)
                  .join("\n"),
            },
          };

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
                detail: `Lark 通知发送失败：${response.status} ${detail}`,
              });
            } else {
              notifications.push({ channel: "lark", status: "sent", detail: "已通过 Lark Webhook 发送。" });
            }
          } catch (error) {
            notifications.push({ channel: "lark", status: "skipped", detail: String(error) });
          }
        } else {
          notifications.push({ channel: "lark", status: "skipped", detail: "未配置 Lark webhook，跳过。" });
        }

        if (notificationConfig?.emailRecipients?.length) {
          const subjectPrefix = notificationConfig.emailSubjectPrefix ?? "[Sentry] 高风险告警";
          const grouped = highRiskIssues.reduce<Record<string, SentryAnnotatedIssue[]>>((acc, issue) => {
            const key =
              notificationConfig.groupBy === "issueType"
                ? issue.issueTypeLabel ?? issue.issueTypeId ?? "unknown"
                : issue.riskLabel ?? issue.riskId ?? "unknown";
            acc[key] = acc[key] ?? [];
            acc[key].push(issue);
            return acc;
          }, {});

          const emailBody = Object.entries(grouped)
            .map(([group, items]) => {
              const lines = items
                .map((item) => `- ${item.title} (${item.frequency ?? "?"} 次) ${item.permalink ?? ""}`)
                .join("\n");
              return `【${group}】\n${lines}`;
            })
            .join("\n\n");

          notifications.push({
            channel: "email",
            status: "prepared",
            detail: `From: ${notificationConfig.emailFrom ?? "sentry-bot"}\nTo: ${notificationConfig.emailRecipients.join(", ")}\nSubject: ${subjectPrefix}\n\n${emailBody}`,
          });
        } else {
          notifications.push({ channel: "email", status: "skipped", detail: "未配置邮件收件人，跳过。" });
        }

        return { action, notifiedIssues: highRiskIssues, notifications };
      }
      default:
        throw new Error(`未知的 Sentry 动作：${action}`);
    }
  },
};

import { geminiModel } from "../../models.js";

export const sentryMcpAgent = new Agent({
  id: "sentry-mcp-agent",
  name: "sentry-mcp-agent",
  instructions:
    "你是 Sentry Issue 的分析与预警专家。通过 Sentry MCP 拉取最新问题，优先检查 top20，并按照风险、问题类型、频率等枚举词典完成打标。保持登录态，确保授权有效；高风险问题要准备 Lark 和邮件通知摘要。所有枚举值须使用提供的词典或覆盖项，必要时给出补充说明与下一步行动建议。",
  system:
    "1) 默认获取并分析最近的前 20 条 issue；2) 输出时要列出风险等级、问题类型、频率分档，并说明判定依据；3) 对高风险问题给出通知摘要和责任人建议；4) 可以按需请求自定义枚举词典或告警配置。",
  model: geminiModel,
  tools: { sentryMcp: sentryTool },
});
