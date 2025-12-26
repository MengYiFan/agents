import React from 'react';
import { Steps, Layout, Card, Descriptions, Tag } from 'antd';
import { RocketOutlined, GithubOutlined } from '@ant-design/icons';
import { IWorkflowConfig, IWorkflowContext, IStepDefinition } from '../../../types/workflow';

const { Content } = Layout;

interface WorkflowDevViewProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  currentStep: IStepDefinition;
  currentStepIndex: number;
  renderStepContent: () => React.ReactNode;
  renderActionButtons: (isInline?: boolean) => React.ReactNode;
}

export const WorkflowDevView: React.FC<WorkflowDevViewProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  currentStepIndex,
  renderStepContent,
  renderActionButtons,
}) => {
  return (
    <Layout className="workflow-dev-layout">
      {/* Top: Steps - Pinned */}
      <div className="workflow-steps-header">
        <Steps
          type="navigation"
          size="small"
          current={currentStepIndex}
          items={config.steps.map((s: IStepDefinition) => ({
            title: s.label,
            icon: s.type === 'release' ? <RocketOutlined /> : undefined,
          }))}
          className="site-navigation-steps workflow-steps"
          responsive={false}
        />
      </div>

      {/* Middle: Content - Scrollable */}
      <Content className="workflow-main-content">
        <div className="workflow-inner-content">
          {/* Status Header */}
          <Card size="small" bordered={false} className="workflow-status-card">
            <Descriptions title="Current Context" size="small" column={1}>
              <Descriptions.Item label="Step">{currentStep.label}</Descriptions.Item>
              <Descriptions.Item label="Branch">
                <Tag icon={<GithubOutlined />}>{gitBranch}</Tag>
              </Descriptions.Item>
              {context.data.meegleId && (
                <Descriptions.Item label="Meegle ID">{context.data.meegleId}</Descriptions.Item>
              )}
              {context.data.brief && (
                <Descriptions.Item label="Brief">{context.data.brief}</Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </Content>

      {/* Bottom: Actions - Pinned */}
      <div className="workflow-action-bar">{renderActionButtons()}</div>
    </Layout>
  );
};
