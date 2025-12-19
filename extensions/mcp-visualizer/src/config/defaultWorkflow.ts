import { IWorkflowConfig } from '../features/workflow/types';

export const DEFAULT_WORKFLOW_CONFIG: IWorkflowConfig = {
  version: '6.0.0',
  steps: [
    {
      id: 'init',
      label: '1. Basic Info',
      type: 'form',
      fields: [
        { key: 'prdLink', label: 'PRD Link', type: 'url', required: true },
        { key: 'designLink', label: 'Design Link', type: 'url' },
        { key: 'meegleId', label: 'Meegle ID', type: 'number', required: true },
        {
          key: 'brief',
          label: 'Brief',
          type: 'string',
          required: true,
          pattern: '^[a-z0-9-]+$',
          description: 'Lowercase letters, numbers, and hyphens only (e.g. user-login)',
        },
        { key: 'backendPlan', label: 'Backend Plan', type: 'url' },
        { key: 'frontendPlan', label: 'Frontend Plan', type: 'url' },
        {
          key: 'baseBranch',
          label: 'Base Branch',
          type: 'select',
          options: ['master', 'main'],
          default: 'master',
          required: true,
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
  ],
};
