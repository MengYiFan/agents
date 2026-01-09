import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { IWorkflowConfig, IWorkflowContext, IStepDefinition } from '@/types/workflow';
import { useWorkflowActions } from '@/modules/workflow/hooks/useWorkflowActions';
import { vscode } from '@/lib/vscode';
import '@/modules/workflow/WorkflowRenderer.css';

// Steps
import { SetupStep } from '@/modules/workflow/steps/Setup';
import { GenericProcessStep } from '@/modules/workflow/steps/GenericProcess';
import { ReleaseStep } from '@/modules/workflow/steps/Release';

interface WorkflowRendererProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  releaseBranches?: string[];
  onBack?: () => void;
  // Header Actions
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
}

export const WorkflowRenderer: React.FC<WorkflowRendererProps> = ({
  config,
  context,
  gitBranch,
  releaseBranches: initialReleaseBranches = [],
  onBack,
  mode,
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
}) => {
  const [form] = Form.useForm();

  // Track which step the user is currently viewing (READ-ONLY if != context.currentStep)
  const [viewingStepId, setViewingStepId] = useState<string>(context.currentStep);

  // Release branches with local state for refresh
  const [releaseBranches, setReleaseBranches] = useState<string[]>(initialReleaseBranches);
  const [loadingBranches, setLoadingBranches] = useState(false);

  // Update viewing step when context changes (e.g. step transition)
  useEffect(() => {
    // If context.currentStep is 'init' (or 'setup' depending on config), verify mapping
    // We treat 'init' and 'setup' as equivalent for the Setup phase
    setViewingStepId(context.currentStep);
  }, [context.currentStep]);

  // Update release branches when prop changes
  useEffect(() => {
    setReleaseBranches(initialReleaseBranches);
  }, [initialReleaseBranches]);

  // Sync form data from context
  useEffect(() => {
    if (context.data) {
      form.setFieldsValue(context.data);
    }
  }, [context.data, form]);

  // Listen for releaseBranches:update message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === 'releaseBranches:update') {
        setReleaseBranches(message.payload.releaseBranches);
        setLoadingBranches(false);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const currentStepId = context.currentStep;

  // The step object to render corresponds to viewingStepId, NOT context.currentStep (unless they match)
  const viewingStepIndex = config.steps.findIndex((s) => s.id === viewingStepId);
  const viewingStep: IStepDefinition = config.steps[viewingStepIndex] || config.steps[0];

  // Real active step for logic (where actions are valid)
  const activeStepIndex = config.steps.findIndex((s) => s.id === currentStepId);

  const { handleAction, loadingAction } = useWorkflowActions(form, viewingStep);

  const isReadOnly = viewingStepId !== currentStepId;

  const handleStepClick = (stepId: string) => {
    // Navigate to any previous step or the current step
    const clickedIndex = config.steps.findIndex((s) => s.id === stepId);
    if (clickedIndex <= activeStepIndex) {
      setViewingStepId(stepId);
    }
  };

  const handleRefreshBranches = () => {
    setLoadingBranches(true);
    vscode.postMessage({ type: 'refreshReleaseBranches' });
  };

  // Common props for all steps
  const commonProps = {
    config,
    context,
    gitBranch,
    currentStep: viewingStep, // Render the VIEWING step
    loadingAction,
    onAction: handleAction,
    // Navigation props
    isReadOnly,
    onBack,
    onStepClick: handleStepClick,
    activeStepId: currentStepId,
    onGoToActive: () => setViewingStepId(currentStepId),
    // Header Actions
    mode,
    onToggleTheme,
    locale,
    onToggleLocale,
    onSettings,
  };

  // Render Logic based on Step TYPE
  switch (viewingStep.type) {
    case 'form':
      return (
        <SetupStep
          {...commonProps}
          form={form}
          hasContextData={Object.keys(context.data || {}).length > 0}
          onBack={onBack}
        />
      );

    case 'process':
      return <GenericProcessStep {...commonProps} />;

    case 'release':
      return (
        <ReleaseStep
          {...commonProps}
          releaseBranches={releaseBranches}
          loadingBranches={loadingBranches}
          onRefreshBranches={handleRefreshBranches}
          form={form}
        />
      );

    default:
      return (
        <div className="p-4 text-center">
          <p>Unknown Step Type: {viewingStep.type}</p>
          <p>ID: {viewingStep.id}</p>
        </div>
      );
  }
};
