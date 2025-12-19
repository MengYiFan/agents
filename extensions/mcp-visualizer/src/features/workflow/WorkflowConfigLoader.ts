import * as path from 'path';
import { promises as fs } from 'fs';
import { IWorkflowConfig } from './types';

/**
 * Loads the Workflow Configuration.
 * Tries `workflow.config.json` first, falls back to internal default.
 */
export class WorkflowConfigLoader {
    private readonly configFileName = 'workflow.config.json';

    constructor(private readonly workspaceRoot: string) {}

    public async loadConfig(): Promise<IWorkflowConfig> {
        const configPath = path.join(this.workspaceRoot, this.configFileName);
        try {
            const content = await fs.readFile(configPath, 'utf-8');
            const userConfig = JSON.parse(content);
            return {
                ...this.getDefaultConfig(), // Merge with default to ensure minimal structure
                ...userConfig
            };
        } catch (error) {
            // Fallback to default if file likely doesn't exist or is invalid
            console.log('Using default workflow config (local config not found or invalid)');
            return this.getDefaultConfig();
        }
    }

    public getDefaultConfig(): IWorkflowConfig {
        return {
            version: "1.0.0",
            variables: {
                "featurePrefix": "feature/"
            },
            steps: [
                {
                    id: "init",
                    label: "需求初始化 (Init)",
                    type: "form",
                    fields: [
                        {
                            key: "meegleId",
                            label: "Meegle ID",
                            type: "number",
                            required: true,
                            defaultValue: ""
                        },
                        {
                            key: "brief",
                            label: "任务简述 (Brief)",
                            type: "string",
                            pattern: "^[a-zA-Z0-9-]+$",
                            required: true
                        },
                        {
                            key: "prdLink",
                            label: "PRD Link",
                            type: "url",
                            required: true
                        },
                        {
                            key: "designLink",
                            label: "Design Link",
                            type: "url",
                            required: false
                        },
                        {
                            key: "baseBranch",
                            label: "Base Branch",
                            type: "select",
                            options: ["master", "main"],
                            defaultValue: "master"
                        }
                    ],
                    actions: [
                        {
                            type: "CreateBranch",
                            label: "创建 & 进入开发",
                            style: "primary",
                            params: {
                                template: "${featurePrefix}${meegleId}-${brief}",
                                nextStep: "dev"
                            }
                        }
                    ]
                },
                {
                    id: "dev",
                    label: "开发阶段 (Development)",
                    type: "process",
                    display: [
                        "PRD: [Link](${prdLink})",
                        "Design: [Link](${designLink})"
                    ],
                    actions: [
                        {
                            type: "GitCommit",
                            label: "提交代码",
                            style: "secondary"
                        },
                        {
                            type: "Transition",
                            label: "开发完成，进入测试",
                            style: "primary",
                            params: {
                                nextStep: "test",
                                tag: "test-feature/${meegleId}-${date}-dev-end"
                            }
                        }
                    ]
                },
                {
                    id: "test",
                    label: "测试阶段 (Testing)",
                    type: "process",
                    display: [
                        "当前状态：测试中",
                        "请在测试环境验证功能，修复 Bug 后再次提交。"
                    ],
                    actions: [
                        {
                            type: "GitCommit",
                            label: "修复 Bug & 提交",
                            style: "secondary",
                            params: {
                                prefix: "fix: "
                            }
                        },
                        {
                            type: "Rollback",
                            label: "回退至开发",
                            style: "ghost",
                            params: {
                                targetStep: "dev",
                                requireReason: true
                            }
                        },
                        {
                            type: "Transition",
                            label: "测试通过，进入验收",
                            style: "primary",
                            params: {
                                nextStep: "acceptance",
                                tag: "test-feature/${meegleId}-${date}-test-pass"
                            }
                        }
                    ]
                },
                {
                    id: "acceptance",
                    label: "验收阶段 (Acceptance)",
                    type: "process",
                    display: [
                        "当前状态：验收中",
                        "等待产品经理或设计师验收。"
                    ],
                    actions: [
                        {
                            type: "GitCommit",
                            label: "验收修复 & 提交",
                            style: "secondary"
                        },
                        {
                            type: "Rollback",
                            label: "验收不通过",
                            style: "ghost",
                            params: {
                                targetStep: "dev", // Or test, depending on policy, PRD defaults usually implied back to work
                                requireReason: true
                            }
                        },
                        {
                            type: "Transition",
                            label: "验收通过，准备上线",
                            style: "primary",
                            params: {
                                nextStep: "release",
                                tag: "stage-feature/${meegleId}-${date}-accepted"
                            }
                        }
                    ]
                },
                {
                    id: "release",
                    label: "上线阶段 (Release)",
                    type: "release",
                    display: [
                        "准备发布到生产环境。",
                        "请选择 Release 分支进行合并。"
                    ],
                    actions: [
                        {
                            type: "MergeAndPush",
                            label: "合并并推送",
                            style: "primary"
                        }
                    ]
                }
            ]
        };
    }
}
