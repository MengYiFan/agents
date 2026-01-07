/**
 * Workflow Types - Single Source of Truth (统一类型定义)
 * 供 Backend 和 Frontend 共同使用
 */

// ============================================
// Step Types (步骤类型)
// ============================================

export type StepType = 'form' | 'process' | 'release';

// ============================================
// Field Definition (字段定义)
// ============================================

export type FieldType = 'text' | 'number' | 'url' | 'select' | 'string';

export interface IFieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: string[];
  pattern?: string;
  defaultValue?: string | number | boolean;
  default?: string | number | boolean;
  // Layout
  colSpan?: number;
  group?: string;
  icon?: string;
}

// ============================================
// Action Definition (操作定义)
// ============================================

export type ActionType =
  | 'CreateBranch'
  | 'GitCommit'
  | 'Transition'
  | 'MergeAndPush'
  | 'LoadStep'
  | 'Rollback';

export type ActionStyle = 'primary' | 'default' | 'danger' | 'ghost' | 'secondary' | 'link';

export interface IActionParams {
  // CreateBranch
  template?: string;
  baseBranch?: string;
  nextStep?: string;
  // Transition
  tag?: string;
  // LoadStep
  stepId?: string;
  // GitCommit
  prefix?: string;
  // MergeAndPush
  targetBranch?: string;
  // Rollback
  targetStep?: string;
  requireReason?: boolean;
}

export interface IActionDefinition {
  type: ActionType;
  label: string;
  style?: ActionStyle;
  validation?: 'none' | 'required' | 'all';
  params?: IActionParams;
}

// ============================================
// Group Definition (分组定义)
// ============================================

export interface IGroupDefinition {
  id: string;
  label: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// ============================================
// UI Elements (UI 元素配置)
// ============================================

export interface IUiElements {
  infoText?: string;
  displayFields?: string[];
}

// ============================================
// Step Definition (步骤定义)
// ============================================

export interface IStepDefinition {
  id: string;
  label: string;
  type: StepType;
  trigger?: string; // Optional trigger condition
  fields?: IFieldDefinition[];
  groups?: IGroupDefinition[];
  actions?: IActionDefinition[];
  uiElements?: IUiElements;
  display?: string[];
}

// ============================================
// Workflow Config (工作流配置)
// ============================================

export interface IWorkflowDefinition {
  label: string;
  description?: string;
  steps: IStepDefinition[];
}

export interface IWorkflowConfig {
  version: string;
  branchPattern?: Record<string, string>;
  workflows?: Record<string, IWorkflowDefinition>;
  steps: IStepDefinition[];
}

// ============================================
// Workflow Context (工作流上下文)
// ============================================

export interface IHistoryEntry {
  timestamp: number;
  action: string;
  data?: Record<string, unknown>;
  toStep?: string;
}

export interface IWorkflowData {
  meegleId?: number;
  brief?: string;
  prdLink?: string;
  designLink?: string;
  backendLink?: string;
  frontendLink?: string;
  targetBranch?: string;
  baseBranch?: string;
  info?: string; // Optional info message
  [key: string]: unknown;
}

export interface IWorkflowContext {
  currentStep: string;
  branch?: string;
  history: IHistoryEntry[];
  data: IWorkflowData;
  lastUpdated: number;
}
