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
}

export const AcceptanceStep: React.FC<AcceptanceStepProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  loadingAction,
  onAction,
}) => {
  return (
    <StepLayout
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      showSteps={true}
      showStatusCard={true}
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
