import React, { useEffect, useState } from 'react';
import {
  Button,
  Steps,
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  Descriptions,
  Alert,
  App,
  Layout,
  Space,
  Typography,
  Tag,
} from 'antd';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IFieldDefinition,
  IActionDefinition,
  IStepDefinition,
} from '../../types/workflow';
import { usePostMessage } from '../../hooks/useVscodeMessage';
import {
  RocketOutlined,
  GithubOutlined,
  CheckCircleOutlined,
  BranchesOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import './WorkflowRenderer.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface WorkflowRendererProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  releaseBranches?: string[];
}

export const WorkflowRenderer: React.FC<WorkflowRendererProps> = ({
  config,
  context,
  gitBranch,
  releaseBranches = [],
}) => {
  const postMessage = usePostMessage();
  const [form] = Form.useForm();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { message } = App.useApp();

  // State to control Init View (View A) vs Basic Info Form
  const [showInitForm, setShowInitForm] = useState(false);

  // Sync form data from context
  useEffect(() => {
    if (context.data) {
      form.setFieldsValue(context.data);
    }
  }, [context.data, form]);

  const currentStepId = context.currentStep;
  const currentStepIndex = config.steps.findIndex((s) => s.id === currentStepId);
  const currentStep: IStepDefinition = config.steps[currentStepIndex] || config.steps[0];

  // Determine View Mode
  // If branch starts with 'feature/', we are in Dev View.
  const isDevBranch = gitBranch && gitBranch.startsWith('feature/');
  // If not dev branch, we defaults to Init View Logic

  const handleAction = async (action: IActionDefinition) => {
    try {
      const isFormStep = currentStep.type === 'form' || currentStep.type === 'release';

      // Validation Logic
      let shouldValidate = false;
      if (action.validation === 'all' || action.validation === 'required') {
        shouldValidate = true;
      }
      if (!action.validation && isFormStep && action.style === 'primary') {
        shouldValidate = true;
      }

      let formData = {};

      if (shouldValidate && isFormStep) {
        await form.validateFields();
        formData = form.getFieldsValue();
      } else if (isFormStep) {
        formData = form.getFieldsValue();
      }

      setLoadingAction(action.type);

      postMessage({
        type: 'executeAction',
        payload: {
          action,
          stepId: currentStep.id,
          data: formData,
        },
      });

      // Clear loading after timeout
      setTimeout(() => setLoadingAction(null), 8000);
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please fix form errors before proceeding.');
      setLoadingAction(null);
    }
  };

  const renderField = (field: IFieldDefinition) => {
    let inputNode;
    switch (field.type) {
      case 'select':
        inputNode = (
          <Select
            options={field.options?.map((o) => ({ label: o, value: o }))}
            placeholder={field.placeholder}
          />
        );
        break;
      case 'number':
        inputNode = <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />;
        break;
      case 'text':
      case 'string':
        inputNode = <Input placeholder={field.placeholder} />;
        break;
      case 'url':
        inputNode = <Input prefix="🔗" placeholder={field.placeholder || 'https://...'} />;
        break;
      default:
        inputNode = <Input placeholder={field.placeholder} />;
    }

    const rules: any[] = [];
    if (field.required) {
      rules.push({ required: true, message: `${field.label} is required` });
    }
    if (field.pattern) {
      rules.push({
        pattern: new RegExp(field.pattern),
        message: field.description || 'Format invalid',
      });
    }

    return (
      <Form.Item
        key={field.key}
        name={field.key}
        label={field.label}
        rules={rules}
        tooltip={field.description}
        initialValue={field.defaultValue || field.default}
      >
        {inputNode}
      </Form.Item>
    );
  };

  const renderActionButtons = (isInline = false) => {
    if (!currentStep.actions?.length) return null;

    if (isInline) {
      return (
        <Space>
          {currentStep.actions.map((action, idx) => {
            const props = getActionProps(action);
            return (
              <Button key={idx} {...props}>
                {action.label}
              </Button>
            );
          })}
        </Space>
      );
    }

    return (
      <Space>
        {currentStep.actions.map((action, idx) => {
          const props = getActionProps(action);
          return (
            <Button key={idx} {...props} block>
              {action.label}
            </Button>
          );
        })}
      </Space>
    );
  };

  const getActionProps = (action: IActionDefinition) => {
    let btnType: any = 'default';
    let danger = false;

    // Map config styles to AntD Button props
    if (action.style === 'primary') btnType = 'primary';
    else if (action.style === 'danger') {
      btnType = 'primary';
      danger = true;
    } else if (action.style === 'ghost') btnType = 'text';
    else if (action.style === 'link') btnType = 'link';

    // Icons
    let icon = undefined;
    if (action.type === 'GitCommit') icon = <CheckCircleOutlined />;
    else if (action.type === 'Transition') icon = <RocketOutlined />;
    else if (action.type === 'CreateBranch') icon = <BranchesOutlined />;
    else if (action.type === 'MergeAndPush') icon = <GithubOutlined />;

    return {
      type: btnType,
      danger,
      icon,
      onClick: () => handleAction(action),
      loading: loadingAction === action.type,
      disabled: loadingAction !== null,
    };
  };

  // View A: Initialization
  // Renders the Landing View (View A) OR the Form Step (Step 1 Basic Info)
  const renderInitView = () => {
    // If we are on non-dev branch and haven't started (showInitForm is false), show View A (Landing)
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
                You are currently on <strong>{gitBranch}</strong>. Initiate a new development task
                to create a feature branch.
              </Paragraph>

              {/* This button transitions from View A to Step 1 (Basic Info Form) */}
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
    );
  };

  // View B: Development Steps
  const renderDevView = () => {
    // Determine steps for steps bar. Assuming we include all steps.
    const stepsCurrent = config.steps.findIndex((s) => s.id === currentStepId);

    return (
      <Layout className="workflow-dev-layout">
        {/* Top: Steps - Pinned */}
        <div className="workflow-steps-header">
          <Steps
            type="navigation"
            size="small"
            current={stepsCurrent}
            items={config.steps.map((s) => ({
              title: s.label,
              icon: s.type === 'release' ? <RocketOutlined /> : undefined,
            }))}
            className="site-navigation-steps workflow-steps"
            responsive={false} // We handle responsiveness via CSS
          />
        </div>

        {/* Middle: Content - Scrollable */}
        <Content className="workflow-main-content">
          <div className="workflow-inner-content">
            {/* Status Header */}
            {/* UPDATED: Descriptions column={1} */}
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
        <div className="workflow-action-bar">
          {/* We hid the text via CSS to allow full width buttons */}
          {renderActionButtons()}
        </div>
      </Layout>
    );
  };

  const renderStepContent = () => {
    // Dynamic rendering based on type
    if (currentStep.type === 'process') {
      return (
        <div className="workflow-process-step">
          <Title level={4}>In Progress: {currentStep.label}</Title>
          <Paragraph type="secondary">
            Make your changes, commit code, and when ready, proceed to the next stage. Make sure
            your Git status is clean before transitioning.
          </Paragraph>
        </div>
      );
    }

    if (currentStep.type === 'release') {
      // Release Step specific UI
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

  // Main Render
  if (!isDevBranch) {
    return (
      <Layout className="workflow-init-layout">
        <Content className="workflow-init-content">{renderInitView()}</Content>
        {showInitForm && <div className="workflow-action-bar">{renderActionButtons()}</div>}
      </Layout>
    );
  }

  return renderDevView();
};
