import React from 'react';
import { Typography } from 'antd';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IStepDefinition,
  IActionDefinition,
} from '../../../../types/workflow';
import { StepLayout } from '../../common/StepLayout';
import { StepActions } from '../../common/StepActions';

const { Title, Paragraph } = Typography;

interface TestingStepProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  currentStep: IStepDefinition;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
  // New props
  isReadOnly?: boolean;
  onGoToActive?: () => void;
  onBack?: () => void;
  onStepClick?: (stepId: string) => void;
  activeStepId?: string;
}

export const TestingStep: React.FC<TestingStepProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  loadingAction,
  onAction,
  onBack,
  onStepClick,
  activeStepId,
}) => {
  return (
    <StepLayout
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      title="Testing"
      onBack={onBack}
      onStepClick={onStepClick}
      activeStepId={activeStepId}
      footer={
        <StepActions
          actions={currentStep.actions}
          loadingAction={loadingAction}
          onAction={onAction}
        />
      }
    >
      <div className="workflow-process-step">
        <Title level={4}>Testing Phase: {currentStep.label}</Title>
        <Paragraph type="secondary">
          Verify functionality and fix bugs. Ensure all tests pass before moving to acceptance.
        </Paragraph>
      </div>
    </StepLayout>
  );
};
