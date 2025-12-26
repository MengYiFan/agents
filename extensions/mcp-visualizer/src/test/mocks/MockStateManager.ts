import { IWorkflowContext } from '../../modules/workflow/types';

export class MockStateManager {
  private context: IWorkflowContext | null = null;

  async loadContext(): Promise<IWorkflowContext | null> {
    return this.context;
  }

  async saveContext(context: IWorkflowContext): Promise<void> {
    this.context = context;
  }
}
