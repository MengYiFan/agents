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
      // Logic: Block N is visible if Block N-1 is completed (or if N=0)
      // Also handle optional blocks? If optional, maybe it doesn't block next?
      // Requirement: "Sequential step enforcement"
      
      for (let i = 1; i < blocks.length; i++) {
          const prevBlock = blocks[i - 1];
          if (prevBlock.status === 'completed' || (!prevBlock.required && prevBlock.status === 'pending')) {
               // Actually, if it's optional, do we require it to be marked completed?
               // Usually optional means you can skip it. But how do you skip?
               // Maybe just by proceeding?
               // Let's assume if it's optional, we show the next one regardless?
               // Or we require explicit "skip"?
               // For now, let's say if prev is completed.
               // If prev is optional, maybe we need a way to say "done" or "skip".
               // But for 'tech' (optional), inputting text makes it completed.
               // If empty, it's pending.
               // Let's strictly enforce: must be completed.
               // Wait, if it's optional, user might not fill it.
               // So if optional, we should probably allow next step if prev is visible?
               // No, that opens everything.
               // Let's stick to: Next block visible if Prev block is completed.
               // User must fill optional blocks? No that makes them required.
               // Let's change logic: 
               // If prev is required, must be completed.
               // If prev is optional, can be pending? 
               // If so, how do we know when to show next?
               // Maybe optional blocks are always "completed" effectively?
               // Let's just make 'tech' required for now to simplify, or assume user types something.
               // Or better: Optional blocks don't block.
               if (prevBlock.required && prevBlock.status !== 'completed') {
                   blocks[i].isVisible = false;
               } else {
                   blocks[i].isVisible = true;
               }
          } else {
              blocks[i].isVisible = false;
          }
      }
      // First block always visible
      blocks[0].isVisible = true;
  }

  // Helper for legacy support or specific link saving
  public async saveLink(branch: string, stepId: string, link: string): Promise<void> {
      await this.saveWorkflowStep(branch, stepId, link);
  }
}
