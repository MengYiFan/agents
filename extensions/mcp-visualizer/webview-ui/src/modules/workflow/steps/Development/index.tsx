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

interface DevelopmentStepProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  currentStep: IStepDefinition;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
}

export const DevelopmentStep: React.FC<DevelopmentStepProps> = ({
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
        <Title level={4}>In Progress: {currentStep.label}</Title>
        <Paragraph type="secondary">
          Make your changes, commit code, and when ready, proceed to the next stage. Make sure your
          Git status is clean before transitioning.
        </Paragraph>
      </div>
    </StepLayout>
  );
};
