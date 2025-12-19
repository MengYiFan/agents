
export interface GitInfo {
    currentBranch: string;
    hasUncommitted: boolean;
    isClean: boolean;
}

export interface McpDocEntry {
    id: string;
    title: string;
    description: string;
    defaultLanguage: string;
    languages: { language: string; label: string }[];
    content?: string;
}

export interface InstructionItem {
    id: string;
    title: string;
    description: string;
    actionLabel: string;
    requiresConfirmation: boolean;
    confirmMessage?: string;
}

export interface WorkflowStepData {
    status: 'pending' | 'active' | 'completed';
    data?: any;
    completedAt?: number; // based on logic
}

export interface WorkflowState {
    steps: {
        basic_info?: WorkflowStepData;
        development?: WorkflowStepData;
        testing?: WorkflowStepData;
        acceptance?: WorkflowStepData;
        release?: WorkflowStepData;
        [key: string]: WorkflowStepData | undefined;
    };
    fields?: {
        meegleId?: string;
        prdBrief?: string;
        prdLink?: string;
        designLink?: string;
        backendLink?: string;
        frontendLink?: string;
        baseBranch?: string;
    };
}

export interface UiText {
    header: { title: string; subtitle: string };
    tabs: { list: string; workflow: string };
    // Add other keys as needed from getUiText implementation if possible, 
    // but for now we can infer or map loosely
    [key: string]: any; 
}

export interface InitialData {
    docs: McpDocEntry[];
    instructions: InstructionItem[];
    gitInfo: GitInfo;
    workflowData: WorkflowState;
    releaseBranches: string[];
    uiText: UiText;
    authorizations: { id: string; authorized: boolean; iconPath?: string; label?: string }[];
    availableLocales: string[];
    locale: string;
    theme: { kind: string; colorScheme: string };
}
