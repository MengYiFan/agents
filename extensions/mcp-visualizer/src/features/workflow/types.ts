export type StepType = 'form' | 'process' | 'release';

export interface IFieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'url' | 'select' | 'string';
  required?: boolean;
  placeholder?: string;
  description?: string;
  options?: string[]; // For select
  pattern?: string;   // Regex string
  defaultValue?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  default?: any;      // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface IActionDefinition {
  type: 'CreateBranch' | 'GitCommit' | 'Transition' | 'MergeAndPush' | 'LoadStep';
  label: string;
  style?: 'primary' | 'default' | 'danger' | 'ghost' | 'secondary' | 'link';
  validation?: 'none' | 'required' | 'all';
  params?: {
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
  };
}

export interface IUiElements {
  infoText?: string;     // Top alert/info
  displayFields?: string[]; // Fields from data to display in card
}

export interface IStepDefinition {
  id: string;
  label: string;
  type: StepType;
  fields?: IFieldDefinition[];      // for 'form'
  actions?: IActionDefinition[];    // Buttons
  uiElements?: IUiElements;         // Display config
  display?: string[];               // Lines of text to display
}

export interface IWorkflowConfig {
  version: string;
  steps: IStepDefinition[];
}

export interface IWorkflowContext {
  currentStep: string;
  history: Array<{
    timestamp: number;
    action: string;
    data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    toStep?: string;
  }>;
  data: {
    meegleId?: number;
    brief?: string;
    prdLink?: string;
    designLink?: string;
    backendLink?: string;
    frontendLink?: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  lastUpdated: number;
}
