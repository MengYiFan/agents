import React, { useEffect, useState } from 'react';
import { Button, Steps, Form, Input, Select } from 'antd';
import { IWorkflowConfig, IWorkflowContext, IFieldDefinition, IActionDefinition } from '../types/workflow';
import { usePostMessage } from '../hooks/useVscodeMessage';
import { RocketOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

interface WorkflowRendererProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
}

export const WorkflowRenderer: React.FC<WorkflowRendererProps> = ({ config, context, gitBranch }) => {
  const postMessage = usePostMessage();
  const [form] = Form.useForm();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Sync form data from context
  useEffect(() => {
    if (context.data) {
      form.setFieldsValue(context.data);
    }
  }, [context.data, form]);

  const currentStepIndex = config.steps.findIndex(s => s.id === context.currentStep);
  const currentStep = config.steps[currentStepIndex] || config.steps[0];

  const handleAction = async (action: IActionDefinition) => {
    try {
      // Validate form if step type is form and action is primary (usually implies submit)
      if (currentStep.type === 'form' && action.style === 'primary') {
        await form.validateFields();
      }

      setLoadingAction(action.type);
      
      // Collect current form values
      const formData = form.getFieldsValue();

      postMessage({
        type: 'executeAction',
        payload: {
          action,
          stepId: currentStep.id,
          data: formData
        }
      });
      
      // Loading state will be cleared when backend sends updated context or error
      // But for safety/UX, we might want a timeout or listener. 
      // For now, relies on parent re-rendering or backend response clearing it via message?
      // Actually, since this is a controlled component, we should probably listen for "actionCompleted" 
      // but simplistic approach: keep loading until props change or timeout.
      setTimeout(() => setLoadingAction(null), 10000); // Failsafe timeout

    } catch (error) {
      console.error("Validation failed:", error);
      // Form validation error, do not submit
      setLoadingAction(null);
    }
  };

  const interpolate = (text: string, data: any) => {
    return text.replace(/\$\{(\w+)\}/g, (_, key) => data[key] || '');
  };

  const renderFields = (fields: IFieldDefinition[]) => {
    return fields.map(field => {
      let inputNode;
      switch (field.type) {
        case 'select':
          inputNode = <Select options={field.options?.map(o => ({ label: o, value: o }))} />;
          break;
        case 'number':
          inputNode = <Input type="number" />;
          break;
        case 'url':
          inputNode = <Input type="url" placeholder="https://..." />;
          break;
        default:
          inputNode = <Input />;
      }

      return (
        <Form.Item
          key={field.key}
          name={field.key}
          label={field.label}
          rules={[{ required: field.required, message: `Please enter ${field.label}` }, { pattern: field.pattern ? new RegExp(field.pattern) : undefined, message: 'Invalid format' }]}
          initialValue={field.defaultValue}
        >
          {inputNode}
        </Form.Item>
      );
    });
  };

  const renderContent = () => {
    switch (currentStep.type) {
      case 'form':
        return (
          <Form form={form} layout="vertical" className="max-w-md mx-auto py-4">
            {currentStep.fields && renderFields(currentStep.fields)}
          </Form>
        );
      case 'process':
        return (
          <div className="max-w-lg mx-auto py-6 space-y-4">
            {currentStep.display?.map((line, idx) => (
              <div key={idx} className="bg-gray-50/50 p-3 rounded border border-gray-100 dark:bg-gray-800/30 dark:border-gray-700">
                <ReactMarkdown>{interpolate(line, { ...context.data, date: new Date().toLocaleDateString() })}</ReactMarkdown>
              </div>
            ))}
          </div>
        );
      case 'release':
        return (
            <div className="max-w-md mx-auto py-6 text-center">
                 <RocketOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                 <h3 className="text-lg font-medium mb-2">Ready for Release</h3>
                 <p className="text-gray-500">Current Branch: {gitBranch}</p>
                 {/* Release branch selector could go here if managed dynamically */}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stepper */}
      <div className="px-6 py-4 border-b bg-gray-50/50 dark:bg-gray-900/20">
        <Steps 
            current={currentStepIndex} 
            items={config.steps.map(s => ({ 
                title: s.label,
                icon: s.type === 'release' ? <RocketOutlined /> : undefined
            }))} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-6">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
            <div className="flex-1">
                {renderContent()}
            </div>
            
            {/* Actions Bar */}
            <div className="py-6 border-t mt-4 flex justify-end gap-3">
                {currentStep.actions?.map((action, idx) => {
                    const isDanger = action.style === 'danger';
                    const isGhost = action.style === 'ghost';
                    const isPrimary = action.style === 'primary';
                    
                    return (
                        <Button
                            key={idx}
                            type={isPrimary ? 'primary' : isGhost ? 'text' : isDanger ? 'primary' : 'default'}
                            danger={isDanger}
                            onClick={() => handleAction(action)}
                            loading={loadingAction === action.type}
                            disabled={loadingAction !== null}
                            size="large"
                        >
                            {action.label}
                        </Button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};
