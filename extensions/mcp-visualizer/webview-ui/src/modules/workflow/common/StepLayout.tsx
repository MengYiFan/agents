import React from 'react';
import { Steps, Layout, Card, Descriptions, Tag } from 'antd';
import { RocketOutlined, GithubOutlined } from '@ant-design/icons';
import { IWorkflowConfig, IWorkflowContext, IStepDefinition } from '../../../types/workflow';

const { Content } = Layout;

interface StepLayoutProps {
  config?: IWorkflowConfig;
  context?: IWorkflowContext;
  gitBranch?: string;
  currentStep?: IStepDefinition;

  // Slots
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;

  // Options
  showSteps?: boolean;
  showStatusCard?: boolean;
}

/**
 * Standard Layout for Workflow Steps
 * Structure:
 * - Header (Steps Navigation)
 * - Content (Scrollable)
 *   - Status Card (Optional)
 *   - Main Content
 * - Footer (Action Bar)
 */
export const StepLayout: React.FC<StepLayoutProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  children,
  footer,
  showSteps = false,
  showStatusCard = false,
}) => {
  const renderSteps = () => {
    if (!showSteps || !config || !currentStep) return null;

    // Calculate current index
    const index = config.steps.findIndex((s) => s.id === currentStep.id);

    return (
      <div className="workflow-steps-header">
        <Steps
          type="navigation"
          size="small"
          current={index}
          items={config.steps.map((s) => ({
            title: s.label,
            icon: s.type === 'release' ? <RocketOutlined /> : undefined,
          }))}
          className="site-navigation-steps workflow-steps"
          responsive={false}
        />
      </div>
    );
  };

  const renderStatus = () => {
    if (!showStatusCard || !context || !gitBranch) return null;

    return (
      <Card size="small" bordered={false} className="workflow-status-card">
        <Descriptions title="Current Context" size="small" column={1}>
          <Descriptions.Item label="Step">{currentStep?.label}</Descriptions.Item>
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
    );
  };

  return (
    <Layout className="workflow-dev-layout" style={{ height: '100vh' }}>
      {/* Top: Steps - Pinned */}
      {renderSteps()}

      {/* Middle: Content - Scrollable */}
      <Content className="workflow-main-content">
        <div className="workflow-inner-content">
          {renderStatus()}
          {children}
        </div>
      </Content>

      {/* Bottom: Actions - Pinned */}
      {footer && <div className="workflow-action-bar">{footer}</div>}
    </Layout>
  );
};
