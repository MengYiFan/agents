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

interface AcceptanceStepProps {
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

export const AcceptanceStep: React.FC<AcceptanceStepProps> = ({
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
      title="Acceptance"
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
        <Title level={4}>Acceptance Phase: {currentStep.label}</Title>
        <Paragraph type="secondary">
          Final validation before release. Verify everything matches requirements.
        </Paragraph>
      </div>
    </StepLayout>
  );
};
