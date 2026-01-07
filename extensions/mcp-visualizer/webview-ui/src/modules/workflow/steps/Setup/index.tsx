import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Form,
  Space,
  Typography,
  FormInstance,
  Row,
  Col,
  Collapse,
  Input,
  Select,
  Tooltip,
  message,
} from 'antd';
import {
  PlayCircleOutlined,
  LinkOutlined,
  BgColorsOutlined,
  LayoutOutlined,
  PlusCircleOutlined,
  BranchesOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { IWorkflowConfig, IActionDefinition, IStepDefinition } from '@/types/workflow';
import { StepLayout } from '@/modules/workflow/common/StepLayout';

const { Title, Paragraph, Text } = Typography;

interface SetupStepProps {
  config: IWorkflowConfig;
  currentStep: IStepDefinition;
  gitBranch: string;
  form: FormInstance;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
  hasContextData?: boolean;
  // Common Props
  isReadOnly?: boolean;
  onGoToActive?: () => void;
  onBack?: () => void;
  onStepClick?: (stepId: string) => void;
  activeStepId?: string;
  // Header Actions
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
}

export const SetupStep: React.FC<SetupStepProps> = ({
  config,
  currentStep,
  gitBranch,
  form,
  loadingAction,
  onAction,
  hasContextData,
  onBack,
  onStepClick,
  activeStepId,
  mode,
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
}) => {
  const [showInitForm, setShowInitForm] = useState(false);
  const [branchPreview, setBranchPreview] = useState<string>('feature/...');

  // If we already have context data, show form immediately
  useEffect(() => {
    if (hasContextData) {
      setShowInitForm(true);
    }
  }, [hasContextData]);

  // Watch form changes to update preview
  const handleValuesChange = (_changedValues: any, allValues: any) => {
    // Find create action to get template
    const action = currentStep.actions?.find((a) => a.type === 'CreateBranch');
    const template = action?.params?.template; // e.g. "feature/${meegleId}-${brief}" or "fix/${bugId}"

    if (template) {
      let branch = template;

      // Regex replace ${variable}
      branch = branch.replace(/\$\{([^}]+)\}/g, (_match, key) => {
        const val = allValues[key];
        if (!val) return key.toUpperCase(); // Placeholder e.g. MEEGLEID
        return val
          .toString()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-');
      });

      setBranchPreview(branch);
    } else {
      setBranchPreview('feature/...');
    }
  };

  const copyBranchName = () => {
    navigator.clipboard.writeText(branchPreview);
    message.success('Branch name copied!');
  };

  // Find the primary "Create Branch" action
  const createAction = currentStep.actions?.find(
    (a) => a.type === 'CreateBranch' || a.label.includes('Create') || a.label.includes('Save'),
  );

  // Helper to render dynamic fields
  const renderField = (field: any) => {
    const rules = [];
    if (field.required) rules.push({ required: true, message: `${field.label} is required` });
    if (field.pattern)
      rules.push({
        pattern: new RegExp(field.pattern),
        message: field.description || 'Invalid format',
      });

    let inputComponent;
    let prefixIcon = null;

    // Resolve Icon
    if (field.icon === 'link') prefixIcon = <LinkOutlined className="text-gray-400" />;
    if (field.icon === 'design') prefixIcon = <BgColorsOutlined className="text-gray-400" />;
    if (field.icon === 'plan') prefixIcon = <LayoutOutlined className="text-gray-400" />;

    switch (field.type) {
      case 'url':
        inputComponent = (
          <Input
            prefix={prefixIcon || <LinkOutlined className="text-gray-400" />}
            placeholder={field.placeholder || 'https://...'}
            className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
          />
        );
        break;
      case 'select':
        inputComponent = (
          <Select
            options={field.options?.map((opt: string) => ({ label: opt, value: opt }))}
            className="w-full"
            placeholder={field.placeholder}
          />
        );
        break;
      case 'number':
        inputComponent = (
          <Input
            type="number"
            placeholder={field.placeholder || '1234'}
            prefix={prefixIcon} // Only if needed? usually number inputs don't have icon unless specified
            className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
          />
        );
        break;
      default: // string, text
        inputComponent = (
          <Input
            placeholder={field.placeholder || 'Value...'}
            prefix={prefixIcon}
            className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
          />
        );
    }

    const colSpan = field.colSpan || 24;

    return (
      <Col span={colSpan} key={field.key}>
        <Form.Item
          name={field.key}
          label={field.label}
          rules={rules}
          initialValue={field.default || field.defaultValue}
          className={`form-item-${field.key} mb-4`}
          tooltip={field.description}
        >
          {inputComponent}
        </Form.Item>
      </Col>
    );
  };

  return (
    <StepLayout
      config={config}
      currentStep={currentStep}
      gitBranch={gitBranch}
      onBack={onBack}
      title={showInitForm ? 'Initialize Workflow' : 'Start New Workflow'}
      onStepClick={onStepClick}
      activeStepId={activeStepId}
      mode={mode}
      onToggleTheme={onToggleTheme}
      locale={locale}
      onToggleLocale={onToggleLocale}
      onSettings={onSettings}
    >
      {!showInitForm ? (
        <div className="workflow-init-landing-container flex items-center justify-center h-full">
          <Card
            bordered={false}
            className="workflow-init-landing-card w-full max-w-md shadow-lg !bg-white dark:!bg-[#1f1f1f]"
            style={{ textAlign: 'center', padding: '40px 0' }}
          >
            <Space direction="vertical" size="large" className="workflow-init-landing-content">
              <div
                className="workflow-init-icon"
                style={{ fontSize: 48, color: 'var(--vscode-textLink-foreground)' }}
              >
                <PlayCircleOutlined />
              </div>
              <Title level={3} className="workflow-init-title !text-gray-900 dark:!text-gray-100">
                Start New Workflow
              </Title>
              <Paragraph
                type="secondary"
                className="workflow-init-desc !text-gray-500 dark:!text-gray-400"
              >
                You are currently on <strong>{gitBranch}</strong>. Initiate a new development task
                to create a feature branch.
              </Paragraph>

              <Button
                type="primary"
                size="large"
                className="workflow-init-btn"
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
      ) : (
        <div className="form-wrapper max-w-2xl mx-auto pb-24">
          <div className="form-intro mb-6">
            <h1 className="intro-title text-xl font-bold text-gray-900 dark:text-white mb-1">
              {currentStep.label || 'Create New Feature'}
            </h1>
            <p className="intro-subtitle text-sm text-gray-500 dark:text-gray-400">
              Configure details to generate a branch.
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            className="init-step-form"
            requiredMark={(label, { required }) => (
              <span className="text-sm">
                {required && <span className="text-red-500 mr-1">*</span>}
                {label}
              </span>
            )}
          >
            {/* Ungrouped Fields (Main) */}
            <Row gutter={12}>
              {currentStep.fields
                ?.filter((f: any) => !f.group)
                .map((field: any) => renderField(field))}
            </Row>

            {/* Dynamic Groups */}
            {currentStep.groups?.map((group) => {
              const groupFields = currentStep.fields?.filter((f: any) => f.group === group.id);
              if (!groupFields || groupFields.length === 0) return null;

              const content = (
                <Row gutter={12}>{groupFields.map((field: any) => renderField(field))}</Row>
              );

              if (group.collapsible) {
                return (
                  <div key={group.id} className="mt-2">
                    <Collapse
                      ghost
                      defaultActiveKey={group.defaultCollapsed ? undefined : [group.id]}
                      expandIcon={({ isActive }) => (
                        <PlusCircleOutlined
                          rotate={isActive ? 45 : 0}
                          className="text-blue-500 text-lg"
                        />
                      )}
                      expandIconPosition="start"
                      className="site-collapse-custom-collapse"
                    >
                      <Collapse.Panel
                        header={<span className="text-blue-500 font-medium">{group.label}</span>}
                        key={group.id}
                        className="!p-0"
                      >
                        <div className="pt-2">{content}</div>
                      </Collapse.Panel>
                    </Collapse>
                  </div>
                );
              }

              return (
                <div key={group.id} className="mt-4">
                  <div className="group-header mb-2 font-medium text-gray-700 dark:text-gray-300">
                    {group.label}
                  </div>
                  {content}
                </div>
              );
            })}

            {/* Fallback for fields with legacy groups not in definitions */}
            {currentStep.fields?.some(
              (f: any) => f.group && !currentStep.groups?.find((g) => g.id === f.group),
            ) && (
              <div className="mt-4">
                <Row gutter={12}>
                  {currentStep.fields
                    ?.filter(
                      (f: any) => f.group && !currentStep.groups?.find((g) => g.id === f.group),
                    )
                    .map((field: any) => renderField(field))}
                </Row>
              </div>
            )}
          </Form>

          {/* Fixed Footer for Actions */}
          <div className="init-step-footer fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#252526] border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50">
            <div className="footer-content max-w-2xl mx-auto w-full">
              {/* Branch Preview Card */}
              <div className="branch-preview-card bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-4 relative flex items-center justify-between">
                <div className="preview-info flex flex-col min-w-0">
                  <span className="preview-label text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Generated Branch
                  </span>
                  <div className="preview-value flex items-center gap-2 overflow-hidden">
                    <BranchesOutlined className="text-blue-500 text-sm" />
                    <span
                      className="branch-name font-mono text-sm font-medium text-gray-800 dark:text-gray-200 truncate select-all"
                      title={branchPreview}
                    >
                      {branchPreview}
                    </span>
                  </div>
                </div>

                <Tooltip title="Copy Branch Name">
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={copyBranchName}
                    className="copy-btn text-gray-400 hover:text-blue-500 flex-shrink-0"
                  />
                </Tooltip>
              </div>

              {/* Action Button */}
              {createAction && (
                <div className="action-btn-wrapper">
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<CheckCircleOutlined />}
                    loading={loadingAction === createAction.type}
                    onClick={() => onAction(createAction)}
                    className="create-btn h-11 text-base font-medium bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-500/25 rounded-xl hover:scale-[1.01] transition-transform"
                  >
                    {createAction.label}
                  </Button>
                </div>
              )}

              <div className="footer-note text-center mt-2">
                <Text type="secondary" className="note-text text-[10px] text-gray-400">
                  Starts a local branch & generates .context7 config.
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </StepLayout>
  );
};
