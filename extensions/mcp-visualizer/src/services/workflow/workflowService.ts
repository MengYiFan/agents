import * as vscode from 'vscode';

export type WorkflowStageId = 'basic' | 'development' | 'testing' | 'acceptance' | 'release';

export type WorkflowFieldType = 'link' | 'number' | 'text';

export type WorkflowStatus = 'pending' | 'completed';

export interface WorkflowField {
  id: string;
  label: string;
  type: WorkflowFieldType;
  required: boolean;
  value?: string;
}

export interface WorkflowStage {
  id: WorkflowStageId;
  title: string;
  status: WorkflowStatus;
  completedAt?: string;
  fields?: WorkflowField[];
}

export interface WorkflowData {
  stages: WorkflowStage[];
  activeStage: WorkflowStageId;
  startedFromNonDev: boolean;
}

const STORAGE_KEY = 'mcp-workflow-data-v2';

// 初始化阶段定义，控制必填项和步骤顺序
const createInitialStages = (): WorkflowStage[] => [
  {
    id: 'basic',
    title: '基本信息',
    status: 'pending',
    fields: [
      { id: 'prd', label: 'PRD', type: 'link', required: true },
      { id: 'design', label: '设计稿', type: 'link', required: false },
      { id: 'meegleId', label: 'Meege ID', type: 'number', required: true },
      { id: 'backendPlan', label: '后端技术方案', type: 'link', required: false },
      { id: 'frontendPlan', label: '前端技术方案', type: 'link', required: false },
    ],
  },
  { id: 'development', title: '开发阶段', status: 'pending' },
  { id: 'testing', title: '测试阶段', status: 'pending' },
  { id: 'acceptance', title: '验收阶段', status: 'pending' },
  { id: 'release', title: '上线阶段', status: 'pending' },
];

export class WorkflowService {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public getWorkflowData(branch: string): WorkflowData {
    const store = this.context.workspaceState.get<Record<string, WorkflowData>>(STORAGE_KEY) || {};
    if (!store[branch]) {
      store[branch] = this.createInitialWorkflow();
      void this.context.workspaceState.update(STORAGE_KEY, store);
    }

    return store[branch];
  }

  public async startWorkflow(branch: string): Promise<WorkflowData> {
    const store = this.context.workspaceState.get<Record<string, WorkflowData>>(STORAGE_KEY) || {};
    const workflow = store[branch] ?? this.createInitialWorkflow();
    workflow.startedFromNonDev = true;
    store[branch] = workflow;
    await this.context.workspaceState.update(STORAGE_KEY, store);

    return workflow;
  }

  public async saveField(branch: string, stageId: WorkflowStageId, fieldId: string, value: string): Promise<WorkflowData> {
    const store = this.context.workspaceState.get<Record<string, WorkflowData>>(STORAGE_KEY) || {};
    const workflow = store[branch] ?? this.createInitialWorkflow();
    const targetStage = workflow.stages.find((item) => item.id === stageId);
    if (targetStage?.fields) {
      const targetField = targetStage.fields.find((field) => field.id === fieldId);
      if (targetField) {
        targetField.value = value;
      }
    }
    store[branch] = workflow;
    await this.context.workspaceState.update(STORAGE_KEY, store);

    return workflow;
  }

  public async completeStage(branch: string, stageId: WorkflowStageId): Promise<WorkflowData> {
    const store = this.context.workspaceState.get<Record<string, WorkflowData>>(STORAGE_KEY) || {};
    const workflow = store[branch] ?? this.createInitialWorkflow();
    const targetStage = workflow.stages.find((item) => item.id === stageId);
    if (targetStage && targetStage.status !== 'completed') {
      targetStage.status = 'completed';
      targetStage.completedAt = new Date().toISOString();
      const nextStage = this.findNextStage(workflow, stageId);
      workflow.activeStage = nextStage?.id ?? stageId;
    }
    store[branch] = workflow;
    await this.context.workspaceState.update(STORAGE_KEY, store);

    return workflow;
  }

  private createInitialWorkflow(): WorkflowData {
    const stages = createInitialStages();

    return { stages, activeStage: 'basic', startedFromNonDev: false };
  }

  private findNextStage(workflow: WorkflowData, currentId: WorkflowStageId): WorkflowStage | undefined {
    const currentIndex = workflow.stages.findIndex((item) => item.id === currentId);
    if (currentIndex < 0) {

      return undefined;
    }
    const nextStage = workflow.stages.slice(currentIndex + 1).find((item) => item.status !== 'completed');

    return nextStage;
  }
}
