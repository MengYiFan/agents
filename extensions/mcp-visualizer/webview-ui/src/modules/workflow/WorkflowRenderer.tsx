import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, InputNumber, Space } from 'antd';
import {
  RocketOutlined,
  GithubOutlined,
  CheckCircleOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IFieldDefinition,
  IActionDefinition,
  IStepDefinition,
} from '../../types/workflow';
import { useWorkflowActions } from './hooks/useWorkflowActions';
import { WorkflowInitView } from './components/WorkflowInitView';
import { WorkflowDevView } from './components/WorkflowDevView';
import { WorkflowStepContent } from './components/WorkflowStepContent';
import './WorkflowRenderer.css';

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
  const [form] = Form.useForm();

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

  const { handleAction, loadingAction } = useWorkflowActions(form, currentStep);

  // Determine View Mode
  // If branch starts with 'feature/', we are in Dev View.
  const isDevBranch = gitBranch && gitBranch.startsWith('feature/');
  // If not dev branch, we defaults to Init View Logic

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

  if (!isDevBranch) {
    return (
      <WorkflowInitView
        gitBranch={gitBranch}
        showInitForm={showInitForm}
        setShowInitForm={setShowInitForm}
        form={form}
        currentStep={currentStep}
        renderField={renderField}
        renderActionButtons={renderActionButtons}
      />
    );
  }

  return (
    <WorkflowDevView
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      currentStepIndex={currentStepIndex}
      renderStepContent={() => (
        <WorkflowStepContent
          currentStep={currentStep}
          form={form}
          renderField={renderField}
          releaseBranches={releaseBranches}
        />
      )}
      renderActionButtons={renderActionButtons}
    />
  );
};
