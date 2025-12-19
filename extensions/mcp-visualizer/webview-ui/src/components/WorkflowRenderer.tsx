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
  theme,
  Layout,
  Space,
  Typography,
  Tag,
  Divider,
} from 'antd';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IFieldDefinition,
  IActionDefinition,
  IStepDefinition,
} from '../types/workflow';
import { usePostMessage } from '../hooks/useVscodeMessage';
import { 
    RocketOutlined, 
    GithubOutlined, 
    CheckCircleOutlined, 
    BranchesOutlined,
    PlayCircleOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

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
  const { token } = theme.useToken();
  const { message } = App.useApp();

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
  const isInitView = currentStepId === 'init';

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

      // Special handling for Rollback input (backend handles it usually, but we can pass flag)
      // Special handling for MergeAndPush: we need targetBranch if not in formData?
      // If renderReleaseStep uses Form, it is in formData.

      setLoadingAction(action.type);

      postMessage({
        type: 'executeAction',
        payload: {
          action,
          stepId: currentStep.id,
          data: formData,
        },
      });

      // Clear loading after timeout or context update (context update resets via Refresh probably)
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
                    return <Button key={idx} {...props}>{action.label}</Button>
                })}
            </Space>
         );
    }

    return (
      <Space>
        {currentStep.actions.map((action, idx) => {
          const props = getActionProps(action);
          return (
            <Button
              key={idx}
              {...props}
            >
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
      else if (action.style === 'danger') { btnType = 'primary'; danger = true; }
      else if (action.style === 'ghost') btnType = 'text';
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
          disabled: loadingAction !== null
      };
  }

  // View A: Initialization
  // Renders the 'form' step (init)
  const renderInitView = () => {
    return (
      <div style={{ maxWidth: 800, margin: '24px auto' }}>
        <Card
            bordered={false}
            style={{ 
                boxShadow: token.boxShadowSecondary,
                textAlign: 'left' // Form usually left aligned, but container is centered
            }}
            title={<Space><PlayCircleOutlined /> {currentStep.label}</Space>}
        >
             <Alert 
                message="Workflow Initialization"
                description={`You are on branch "${gitBranch}". Please provide details to start a new development workflow.`}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
             />
             
             <Form form={form} layout="vertical">
                 {currentStep.fields?.map(renderField)}
             </Form>

             <Divider />
             
             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                 {renderActionButtons(true)}
             </div>
        </Card>
      </div>
    );
  };

  // View B: Development Steps
  const renderDevView = () => {
     // Filter steps to exclude 'init' from the Steps bar if strictly separating views.
     const devSteps = config.steps.filter(s => s.id !== 'init');
     const stepsCurrent = devSteps.findIndex(s => s.id === currentStepId);

     return (
        <Layout style={{ height: '100vh', background: token.colorBgLayout, display: 'flex', flexDirection: 'column' }}>
             {/* Top: Steps - Pinned */}
             <div style={{
                 background: token.colorBgContainer,
                 padding: '8px 16px',
                 borderBottom: `1px solid ${token.colorBorderSecondary}`,
                 flexShrink: 0,
                 zIndex: 10
             }}>
                 <Steps
                    type="navigation"
                    size="small"
                    current={stepsCurrent}
                    items={devSteps.map(s => ({
                        title: s.label,
                        icon: s.type === 'release' ? <RocketOutlined/> : undefined
                    }))}
                    className="site-navigation-steps"
                    style={{ 
                        marginBottom: 0,
                        boxShadow: 'none',
                        background: 'transparent'
                    }}
                 />
             </div>

             {/* Middle: Content - Scrollable */}
             <Content style={{ 
                 padding: '16px', 
                 overflowY: 'auto', 
                 flex: 1,
                 scrollBehavior: 'smooth'
             }}>
                 <div style={{ maxWidth: 900, margin: '0 auto' }}>
                     {/* Status Header */}
                     <Card 
                        size="small" 
                        bordered={false}
                        style={{ marginBottom: 16, boxShadow: token.boxShadowTertiary }}
                    >
                         <Descriptions title="Current Context" size="small" column={2}>
                             <Descriptions.Item label="Step">{currentStep.label}</Descriptions.Item>
                             <Descriptions.Item label="Branch"><Tag icon={<GithubOutlined/>}>{gitBranch}</Tag></Descriptions.Item>
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
             <div style={{
                 background: token.colorBgContainer,
                 padding: '12px 24px',
                 borderTop: `1px solid ${token.colorBorderSecondary}`,
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 flexShrink: 0,
                 zIndex: 10
             }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                      {currentStep.id === 'release' ? 'Final Stage' : 'Development in Progress'}
                  </Text>
                  {renderActionButtons()}
             </div>
        </Layout>
     );
  };

  const renderStepContent = () => {
      // Dynamic rendering based on type
      if (currentStep.type === 'process') {
          // Process steps (Dev, Test, Acceptance) have no fields in v6.0.
          // Just show instructions or status.
          return (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                   <Title level={4}>In Progress: {currentStep.label}</Title>
                   <Paragraph type="secondary">
                       Make your changes, commit code, and when ready, proceed to the next stage.
                       Make sure your Git status is clean before transitioning.
                   </Paragraph>
                   
                   {/* We could show specific alerts if dirty? But frontend validates on action click mostly. */}
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
                    style={{ marginBottom: 24 }}
                  />
                  <Form form={form} layout="vertical">
                       <Form.Item 
                            name="targetBranch" 
                            label="Target Release Branch" 
                            rules={[{required: true, message: 'Please select a release branch'}]}
                            tooltip="The branch where this feature will be merged."
                       >
                            <Select 
                                placeholder="Select branch (e.g. release/v6.0)" 
                                options={releaseBranches.map(b => ({ label: b, value: b }))}
                                // If list is empty, maybe allow generic input? Or show empty state.
                                notFoundContent={releaseBranches.length === 0 ? "No release branches found" : undefined}
                            />
                       </Form.Item>
                  </Form>
             </Card>
          );
      }

      if (currentStep.type === 'form') {
           // Should not really happen in Dev View unless there is a form step inside dev flow?
           // Just in case:
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
  if (isInitView) {
      return (
          <Layout style={{ minHeight: '100vh', background: token.colorBgLayout, overflowY: 'auto' }}>
               <Content style={{ padding: 24 }}>
                   {renderInitView()}
               </Content>
          </Layout>
      );
  }

  return renderDevView();
};
