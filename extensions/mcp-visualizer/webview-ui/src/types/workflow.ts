/**
 * Workflow Configuration Types (Frontend Copy)
 * Mirrors src/features/workflow/types.ts
 */

export interface IWorkflowConfig {
    version: string;
    variables?: Record<string, string>;
    steps: IWorkflowStep[];
  }
  
  export type StepType = 'form' | 'process' | 'release';
  
  export interface IWorkflowStep {
    id: string;
    label: string;
    type: StepType;
    fields?: IFieldDefinition[];
    actions?: IActionDefinition[];
    display?: string[];
  }
  
  export interface IFieldDefinition {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'url' | 'select';
    required?: boolean;
    pattern?: string;
    options?: string[];
    defaultValue?: any;
  }
  
  export type ActionType = 
    | 'CreateBranch' 
    | 'GitCommit' 
    | 'Transition' 
    | 'Rollback' 
    | 'MergeAndPush' 
    | 'GitStash'
    | 'GitReset';
  
  export interface IActionDefinition {
    type: ActionType;
    label: string;
    style?: 'primary' | 'secondary' | 'ghost' | 'danger';
    params?: Record<string, any>;
    autoRun?: boolean;
  }
  
  export interface IWorkflowContext {
    currentStep: string;
    history: IHistoryEntry[];
    data: Record<string, any>;
    lastUpdated: number;
  }
  
  export interface IHistoryEntry {
    timestamp: number;
    action: string;
    fromStep?: string;
    toStep?: string;
    operator?: string;
    data?: any;
  }
