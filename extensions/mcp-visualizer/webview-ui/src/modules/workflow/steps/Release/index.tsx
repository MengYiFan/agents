import React from 'react';
import { Card, Form, Alert, FormInstance, Select, Button, Space } from 'antd';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IStepDefinition,
  IActionDefinition,
} from '../../../../types/workflow';
import { StepLayout } from '../../common/StepLayout';

interface ReleaseStepProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  currentStep: IStepDefinition;
  form: FormInstance;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
  releaseBranches?: string[];
  // New props
  isReadOnly?: boolean;
  onGoToActive?: () => void;
  onBack?: () => void;
  onStepClick?: (stepId: string) => void;
  activeStepId?: string;
}

export const ReleaseStep: React.FC<ReleaseStepProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  form,
  loadingAction,
  onAction,
  onBack,
  onStepClick,
  activeStepId,
  releaseBranches = [],
}) => {
  return (
    <StepLayout
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      title="Release"
      onBack={onBack}
      onStepClick={onStepClick}
      activeStepId={activeStepId}
      footer={
        <Space>
          {currentStep.actions?.map((action) => (
            <Button
              key={action.type}
              type="primary"
              loading={loadingAction === action.type}
              onClick={() => onAction(action)}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      }
    >
      <Card bordered={false} title="Release Configuration">
        <Alert
          message="Merge & Release"
          description="Select the target release branch to merge your changes into."
          type="warning"
          showIcon
          className="workflow-release-alert"
        />
        <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item
            name="targetBranch"
            label="Target Release Branch"
            rules={[{ required: true, message: 'Please select a release branch' }]}
            tooltip="The branch where this feature will be merged."
          >
            <Select
              placeholder="Select branch (e.g. release/v6.0)"
              options={releaseBranches.map((b) => ({ label: b, value: b }))}
              notFoundContent={
                releaseBranches.length === 0 ? 'No release branches found' : undefined
              }
            />
          </Form.Item>
        </Form>
      </Card>
    </StepLayout>
  );
};
