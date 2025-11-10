export type SupportedLanguage = 'zh-CN' | 'en-US';

export interface DocVariant {
  language: SupportedLanguage;
  label: string;
  filePath: string;
}

export interface McpDocEntry {
  id: string;
  title: string;
  description?: string;
  variants: DocVariant[];
  defaultLanguage: SupportedLanguage;
}

export interface LifecycleStage {
  id: string;
  name: string;
  description: string;
  recommendedBranches: string[];
}

export interface InstructionCommand {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  actionId: InstructionActionId;
  requiresConfirmation?: boolean;
  confirmMessage?: string;
}

export type InstructionActionId = 'inject-standard' | 'update-context7';

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  optional?: boolean;
  type: 'link' | 'diagram' | 'notes';
  placeholder?: string;
}

export interface AuthorizationStatus {
  id: string;
  name: string;
  authorized: boolean;
  iconPath: string;
}
