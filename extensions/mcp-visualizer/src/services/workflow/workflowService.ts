import * as vscode from 'vscode';

export interface WorkflowBlock {
  id: string;
  title: string;
  type: 'input' | 'number' | 'toggle' | 'complex';
  required: boolean;
  status: 'pending' | 'completed';
  data: any;
  isVisible: boolean;
  placeholder?: string;
  description?: string;
}

export interface WorkflowData {
  blocks: WorkflowBlock[];
}

const INITIAL_BLOCKS: WorkflowBlock[] = [
    { id: 'prd', title: 'PRD', type: 'input', required: true, status: 'pending', data: null, isVisible: true, placeholder: '请输入 PRD 链接', description: '产品需求文档链接' },
    { id: 'meegleId', title: 'Meegle ID', type: 'number', required: true, status: 'pending', data: null, isVisible: false, placeholder: '请输入 Meegle ID', description: '需求 ID' },
    { id: 'design', title: 'Design Draft', type: 'input', required: true, status: 'pending', data: null, isVisible: false, placeholder: '请输入设计稿链接', description: 'UI/UX 设计稿' },
    { id: 'tech', title: 'Tech Scheme', type: 'input', required: false, status: 'pending', data: null, isVisible: false, placeholder: '请输入技术方案链接', description: '技术方案文档 (可选)' },
    { id: 'development', title: 'Development', type: 'complex', required: true, status: 'pending', data: null, isVisible: false, description: '代码开发与分支管理' },
    { id: 'testing', title: 'Testing', type: 'toggle', required: true, status: 'pending', data: false, isVisible: false, description: '自测与 QA 测试' },
    { id: 'acceptance', title: 'Acceptance', type: 'toggle', required: true, status: 'pending', data: false, isVisible: false, description: '产品验收' },
    { id: 'completion', title: 'Completion', type: 'toggle', required: true, status: 'pending', data: false, isVisible: false, description: '上线完成' }
];

export class WorkflowService {
  private context: vscode.ExtensionContext;
  private storageKey = 'mcp-workflow-data';

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  public getWorkflowData(branch: string): WorkflowData {
      const allData = this.context.workspaceState.get<Record<string, WorkflowData>>(this.storageKey) || {};
      if (!allData[branch]) {
          // Return deep copy of initial blocks
          return { blocks: JSON.parse(JSON.stringify(INITIAL_BLOCKS)) };
      }
      return allData[branch];
  }

  public async saveWorkflowStep(branch: string, blockId: string, data: any): Promise<void> {
      const allData = this.context.workspaceState.get<Record<string, WorkflowData>>(this.storageKey) || {};
      
      if (!allData[branch]) {
          allData[branch] = { blocks: JSON.parse(JSON.stringify(INITIAL_BLOCKS)) };
      }

      const blocks = allData[branch].blocks;
      const blockIndex = blocks.findIndex(b => b.id === blockId);
      
      if (blockIndex !== -1) {
          blocks[blockIndex].data = data;
          // Update status based on data
          if (data) {
              blocks[blockIndex].status = 'completed';
          } else {
              blocks[blockIndex].status = 'pending';
          }

          // Update visibility of subsequent blocks
          this.updateVisibility(blocks);

          await this.context.workspaceState.update(this.storageKey, allData);
      }
  }

  private updateVisibility(blocks: WorkflowBlock[]) {
      // Logic: Block N is visible if Block N-1 is visible AND (Block N-1 is completed OR Block N-1 is optional)
      
      // First block always visible
      blocks[0].isVisible = true;

      for (let i = 1; i < blocks.length; i++) {
          const prevBlock = blocks[i - 1];
          
          if (prevBlock.isVisible) {
              if (prevBlock.status === 'completed' || !prevBlock.required) {
                  blocks[i].isVisible = true;
              } else {
                  blocks[i].isVisible = false;
              }
          } else {
              blocks[i].isVisible = false;
          }
      }
  }

  // Helper for legacy support or specific link saving
  public async saveLink(branch: string, stepId: string, link: string): Promise<void> {
      await this.saveWorkflowStep(branch, stepId, link);
  }
}
