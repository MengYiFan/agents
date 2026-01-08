import { IWorkflowConfig, IStepDefinition } from '@modules/workflow/types';

const FEATURE_STEPS: IStepDefinition[] = [
  {
    id: 'setup',
    label: 'Create New Feature',
    type: 'form',
    trigger: 'default',
    groups: [
      {
        id: 'plans',
        label: 'Technical Plans',
        collapsible: true,
        defaultCollapsed: true,
      },
      {
        id: 'advanced',
        label: 'Advanced Settings',
        collapsible: true,
        defaultCollapsed: false,
      },
    ],
    fields: [
      { key: 'prdLink', label: 'PRD Link', type: 'url', required: true, icon: 'link' },
      { key: 'designLink', label: 'Design Link', type: 'url', icon: 'design' },
      // Row: ID (8) + Brief (16)
      {
        key: 'meegleId',
        label: 'ID',
        type: 'number',
        required: true,
        colSpan: 8,
        placeholder: '1234',
      },
      {
        key: 'brief',
        label: 'Brief',
        type: 'string',
        required: true,
        pattern: '^[a-z0-9-]+$',
        description: 'Lowercase letters, numbers, and hyphens only (e.g. user-login)',
        colSpan: 16,
        placeholder: 'e.g. login-fix',
      },
      // Technical Plans Group
      {
        key: 'backendPlan',
        label: 'Backend Plan URL',
        type: 'url',
        group: 'plans',
        icon: 'plan',
      },
      {
        key: 'frontendPlan',
        label: 'Frontend Plan URL',
        type: 'url',
        group: 'plans',
        icon: 'plan',
      },

      {
        key: 'baseBranch',
        label: 'Base Branch',
        type: 'select',
        options: ['master', 'main'],
        default: 'master',
        required: true,
        group: 'advanced',
      },
    ],
    actions: [
      {
        type: 'CreateBranch',
        label: 'Create & Start Dev',
        style: 'primary',
        validation: 'required',
        params: {
          template: 'feature/${meegleId}-${brief}',
          baseBranch: '${baseBranch}',
          nextStep: 'development',
        },
      },
    ],
  },
  {
    id: 'development',
    label: '2. Development',
    type: 'process',
    actions: [
      {
        type: 'GitCommit',
        label: 'Commit Code',
        style: 'default',
        params: {},
      },
      {
        type: 'Transition',
        label: 'Commit & Next',
        style: 'primary',
        validation: 'none',
        params: {
          tag: 'test-feature/${meegleId}-${MMDD}-${hh}-${mm}',
          nextStep: 'testing',
        },
      },
    ],
  },
  {
    id: 'testing',
    label: '3. Testing',
    type: 'process',
    actions: [
      {
        type: 'GitCommit',
        label: 'Fix & Commit',
        style: 'default',
        params: {},
      },
      {
        type: 'Transition',
        label: 'Pass & Next',
        style: 'primary',
        params: {
          tag: 'test-feature/${meegleId}-${MMDD}-${hh}-${mm}',
          nextStep: 'acceptance',
        },
      },
    ],
  },
  {
    id: 'acceptance',
    label: '4. Acceptance',
    type: 'process',
    actions: [
      {
        type: 'GitCommit',
        label: 'Fix & Commit',
        style: 'default',
        params: {},
      },
      {
        type: 'Transition',
        label: 'Accept & Next',
        style: 'primary',
        params: {
          // Note: Tag prefix changes to stage-feature
          tag: 'stage-feature/${meegleId}-${MMDD}-${hh}-${mm}',
          nextStep: 'release',
        },
      },
    ],
  },
  {
    id: 'release',
    label: '5. Release',
    type: 'release',
    actions: [
      {
        type: 'MergeAndPush',
        label: 'Merge & Push',
        style: 'primary',
      },
    ],
  },
];

export const DEFAULT_WORKFLOW_CONFIG: IWorkflowConfig = {
  version: '6.0.0',
  workflows: {
    feature: {
      label: 'Feature Development',
      description: 'Standard feature lifecycle',
      steps: FEATURE_STEPS,
    },
  },
  steps: FEATURE_STEPS,
};
