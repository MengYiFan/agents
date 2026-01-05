import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Alert, Space, Typography, FormInstance } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { IActionDefinition, IStepDefinition } from '../../../../types/workflow';
import { StepField } from '../../common/StepField';
import { StepActions } from '../../common/StepActions';

const { Title, Paragraph } = Typography;

interface InitStepProps {
  currentStep: IStepDefinition;
  gitBranch: string;
  form: FormInstance;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
  // Context to determine if we are revisiting this step or starting fresh
  hasContextData?: boolean;
}

export const InitStep: React.FC<InitStepProps> = ({
  currentStep,
  gitBranch,
  form,
  loadingAction,
  onAction,
  hasContextData,
}) => {
  const [showInitForm, setShowInitForm] = useState(false);

  // If we already have context data (e.g. revisiting init step), show form immediately
  useEffect(() => {
    if (hasContextData) {
      setShowInitForm(true);
    }
  }, [hasContextData]);

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

  // View B: Form View
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
              {currentStep.fields?.map((field) => (
                <StepField key={field.key} field={field} />
              ))}
            </Form>
          </Card>
        </div>
      </div>
      <div className="workflow-action-bar">
        <StepActions
          actions={currentStep.actions}
          loadingAction={loadingAction}
          onAction={onAction}
        />
      </div>
    </div>
  );
};
