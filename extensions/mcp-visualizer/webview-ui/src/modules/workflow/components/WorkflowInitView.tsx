import React from 'react';
import { Button, Card, Form, Alert, Space, Typography, FormInstance } from 'antd';
import { IStepDefinition, IFieldDefinition } from '../../../types/workflow';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface WorkflowInitViewProps {
  gitBranch: string;
  showInitForm: boolean;
  setShowInitForm: (show: boolean) => void;
  form: FormInstance;
  currentStep: IStepDefinition;
  renderField: (field: IFieldDefinition) => React.ReactNode;
  renderActionButtons: (isInline?: boolean) => React.ReactNode;
}

export const WorkflowInitView: React.FC<WorkflowInitViewProps> = ({
  gitBranch,
  showInitForm,
  setShowInitForm,
  form,
  currentStep,
  renderField,
  renderActionButtons,
}) => {
  // View A: Landing View
  if (!showInitForm) {
    return (
      <div className="workflow-init-card-container">
        <Card
          bordered={false}
          className="workflow-init-card"
          style={{ textAlign: 'center', padding: '40px 0' }}
        >
          <Space direction="vertical" size="large">
            <div style={{ fontSize: 48, color: 'var(--vscode-textLink-foreground)' }}>
              <PlayCircleOutlined />
            </div>
            <Title level={3}>Start New Workflow</Title>
            <Paragraph type="secondary">
              You are currently on <strong>{gitBranch}</strong>. Initiate a new development task to
              create a feature branch.
            </Paragraph>

            <Button
              type="primary"
              size="large"
              onClick={() => {
                form.resetFields();
                setShowInitForm(true);
              }}
            >
              Initialize Workflow
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  // Step 1: Basic Info Form
  return (
    <div className="workflow-init-layout">
      <div className="workflow-init-content">
        <div className="workflow-init-card-container">
          <Card
            bordered={false}
            className="workflow-init-card"
            title={
              <Space>
                <PlayCircleOutlined /> {currentStep.label}
              </Space>
            }
          >
            <Alert
              message="Workflow Initialization"
              description="Please fill in the details to create your development branch."
              type="info"
              showIcon
              className="workflow-init-alert"
            />

            <Form form={form} layout="vertical">
              {currentStep.fields?.map(renderField)}
            </Form>
          </Card>
        </div>
      </div>
      <div className="workflow-action-bar">{renderActionButtons()}</div>
    </div>
  );
};
