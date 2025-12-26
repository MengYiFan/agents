import React from 'react';
import { Card, Form, Alert, Typography, Select, FormInstance } from 'antd';
import { IStepDefinition, IFieldDefinition } from '../../../types/workflow';

const { Title, Paragraph } = Typography;

interface WorkflowStepContentProps {
  currentStep: IStepDefinition;
  form: FormInstance;
  renderField: (field: IFieldDefinition) => React.ReactNode;
  releaseBranches: string[];
}

export const WorkflowStepContent: React.FC<WorkflowStepContentProps> = ({
  currentStep,
  form,
  renderField,
  releaseBranches,
}) => {
  if (currentStep.type === 'process') {
    return (
      <div className="workflow-process-step">
        <Title level={4}>In Progress: {currentStep.label}</Title>
        <Paragraph type="secondary">
          Make your changes, commit code, and when ready, proceed to the next stage. Make sure your
          Git status is clean before transitioning.
        </Paragraph>
      </div>
    );
  }

  if (currentStep.type === 'release') {
    return (
      <Card bordered={false} title="Release Configuration">
        <Alert
          message="Merge & Release"
          description="Select the target release branch to merge your changes into."
          type="warning"
          showIcon
          className="workflow-release-alert"
        />
        <Form form={form} layout="vertical">
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
    );
  }

  if (currentStep.type === 'form') {
    return (
      <Card bordered={false} title={currentStep.label}>
        <Form form={form} layout="vertical">
          {currentStep.fields?.map(renderField)}
        </Form>
      </Card>
    );
  }

  return null;
};
