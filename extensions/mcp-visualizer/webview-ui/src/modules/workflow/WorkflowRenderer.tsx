import React, { useEffect } from 'react';
import { Form, Result, Button } from 'antd';
import { IWorkflowConfig, IWorkflowContext, IStepDefinition } from '../../types/workflow';
import { useWorkflowActions } from './hooks/useWorkflowActions';
import './WorkflowRenderer.css';

// Steps
import { InitStep } from './steps/Init';
import { DevelopmentStep } from './steps/Development';
import { TestingStep } from './steps/Testing';
import { AcceptanceStep } from './steps/Acceptance';
import { ReleaseStep } from './steps/Release';

interface WorkflowRendererProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  releaseBranches?: string[];
}

export const WorkflowRenderer: React.FC<WorkflowRendererProps> = ({
  config,
  context,
  gitBranch,
  releaseBranches = [],
}) => {
  const [form] = Form.useForm();

  // Sync form data from context
  useEffect(() => {
    if (context.data) {
      form.setFieldsValue(context.data);
    }
  }, [context.data, form]);

  const currentStepId = context.currentStep;
  const currentStepIndex = config.steps.findIndex((s) => s.id === currentStepId);
  const currentStep: IStepDefinition = config.steps[currentStepIndex] || config.steps[0];

  const { handleAction, loadingAction } = useWorkflowActions(form, currentStep);

  // Render Logic based on Step ID
  switch (currentStep.id) {
    case 'init':
      return (
        <InitStep
          currentStep={currentStep}
          gitBranch={gitBranch}
          form={form}
          loadingAction={loadingAction}
          onAction={handleAction}
          hasContextData={Object.keys(context.data || {}).length > 0}
        />
      );

    case 'development':
      return (
        <DevelopmentStep
          config={config}
          context={context}
          gitBranch={gitBranch}
          currentStep={currentStep}
          loadingAction={loadingAction}
          onAction={handleAction}
        />
      );

    case 'testing':
      return (
        <TestingStep
          config={config}
          context={context}
          gitBranch={gitBranch}
          currentStep={currentStep}
          loadingAction={loadingAction}
          onAction={handleAction}
        />
      );

    case 'acceptance':
      return (
        <AcceptanceStep
          config={config}
          context={context}
          gitBranch={gitBranch}
          currentStep={currentStep}
          loadingAction={loadingAction}
          onAction={handleAction}
        />
      );

    case 'release':
      return (
        <ReleaseStep
          config={config}
          context={context}
          gitBranch={gitBranch}
          currentStep={currentStep}
          loadingAction={loadingAction}
          onAction={handleAction}
          form={form}
          releaseBranches={releaseBranches}
        />
      );

    default:
      return (
        <Result
          status="500"
          title="Unknown Step"
          subTitle={`Step ID "${currentStep.id}" is not recognized.`}
          extra={<Button type="primary">Reload</Button>}
        />
      );
  }
};
