/**
 * Workflow Configuration Types
 * Mirrors the schema of workflow.config.json
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
  display?: string[]; // Array of strings, supports variable interpolation
}

export interface IFieldDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'url' | 'select';
  required?: boolean;
  pattern?: string; // Regex string
  options?: string[]; // For 'select' type
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
  autoRun?: boolean; // If true, might run automatically on stage entry (future support)
}

/**
 * Workflow Context Types
 * Mirrors the schema of .vscode/workflow-context.json
 */

export interface IWorkflowContext {
  currentStep: string; // ID of the current step
  history: IHistoryEntry[];
  data: Record<string, any>; // Stores form data (meegleId, brief, etc.)
  lastUpdated: number; // Timestamp
}

export interface IHistoryEntry {
  timestamp: number;
  action: string;
  fromStep?: string;
  toStep?: string;
  operator?: string; // User or System
  data?: any;
}
