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
  Input,
  Tooltip,
  message,
} from 'antd';
import {
  PlayCircleOutlined,
  ArrowLeftOutlined,
  LinkOutlined,
  FormatPainterOutlined,
  DatabaseOutlined,
  LayoutOutlined,
  BranchesOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { IActionDefinition, IStepDefinition } from '../../../../types/workflow';

const { Title, Text, Paragraph } = Typography;

interface InitStepProps {
  currentStep: IStepDefinition;
  gitBranch: string;
  form: FormInstance;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
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
  const [branchPreview, setBranchPreview] = useState<string>('feature/...');

  // If we already have context data (e.g. revisiting init step), show form immediately
  useEffect(() => {
    if (hasContextData) {
      setShowInitForm(true);
    }
  }, [hasContextData]);

  // Watch form changes to update preview
  const handleValuesChange = (_changedValues: any, allValues: any) => {
    const { meegleId, brief } = allValues;
    if (meegleId || brief) {
      const cleanBrief = (brief || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
      setBranchPreview(`feature/${meegleId || 'ID'}-${cleanBrief || 'BRIEF'}`);
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

  // Render LANDING VIEW
  if (!showInitForm) {
    return (
      <div className="workflow-init-landing-container flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
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
              You are currently on <strong>{gitBranch}</strong>. Initiate a new development task to
              create a feature branch.
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
    );
  }

  // Render FORM VIEW (Redesigned)
  return (
    <div className="init-step-container fixed inset-0 z-[100] flex flex-col bg-[#F8F9FB] dark:bg-[#1e1e1e]">
      {/* Header */}
      <div className="init-step-header flex-none flex items-center justify-between px-4 py-3 bg-white dark:bg-[#252526] border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
        <div className="header-left flex items-center gap-2">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setShowInitForm(false)}
            className="header-back-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          />
          <span className="header-title text-base font-semibold text-gray-900 dark:text-gray-100">
            Initialize Workflow
          </span>
        </div>
        <div className="header-branch-badge px-2.5 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 rounded-full flex items-center gap-1.5">
          <BranchesOutlined className="text-xs" />
          {gitBranch}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="init-step-content flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="form-wrapper max-w-2xl mx-auto">
          <div className="form-intro mb-6">
            <h1 className="intro-title text-xl font-bold text-gray-900 dark:text-white mb-1">
              Create New Feature
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
            {/* PRD Link */}
            <Form.Item
              name="prdLink"
              label="PRD Link"
              rules={[{ required: true, message: 'PRD Link is required' }]}
              className="form-item-prd mb-4"
            >
              <Input
                prefix={<LinkOutlined className="text-gray-400" />}
                placeholder="https://..."
                className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
              />
            </Form.Item>

            {/* Design Link */}
            <Form.Item
              name="designLink"
              label={
                <span className="text-gray-500 text-sm">
                  Design Link <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                </span>
              }
              className="form-item-design mb-4"
            >
              <Input
                prefix={<FormatPainterOutlined className="text-gray-400" />}
                placeholder="Figma or design URL"
                className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
              />
            </Form.Item>

            {/* ID & Brief */}
            <Row gutter={12} className="form-row-id-brief">
              <Col span={8}>
                <Form.Item
                  name="meegleId"
                  label="ID"
                  rules={[{ required: true, message: 'ID is required' }]}
                  className="form-item-id mb-4"
                >
                  <Input
                    placeholder="1234"
                    className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="brief"
                  label="Brief"
                  rules={[{ required: true, message: 'Brief is required' }]}
                  className="form-item-brief mb-4"
                >
                  <Input
                    placeholder="e.g. login-fix"
                    className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Technical Plans (Direct Display - No Collapse) */}
            <div className="form-section-tech-plans mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-3 text-blue-500 font-medium text-sm">
                <PlusCircleOutlined />
                <span>Add Technical Plans (Optional)</span>
              </div>

              <div className="tech-plans-inputs pl-2 border-l-2 border-blue-100 dark:border-blue-900/30 ml-1">
                <Form.Item
                  name="backendPlan"
                  label={<span className="text-xs text-gray-500">Backend Plan URL</span>}
                  className="form-item-backend mb-3"
                >
                  <Input
                    prefix={<DatabaseOutlined className="text-gray-400" />}
                    placeholder="https://..."
                    size="small"
                    className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400 text-sm"
                  />
                </Form.Item>

                <Form.Item
                  name="frontendPlan"
                  label={<span className="text-xs text-gray-500">Frontend Plan URL</span>}
                  className="form-item-frontend mb-0"
                >
                  <Input
                    prefix={<LayoutOutlined className="text-gray-400" />}
                    placeholder="https://..."
                    size="small"
                    className="!bg-white dark:!bg-[#333] !border-gray-300 dark:!border-gray-600 rounded-md !text-gray-900 dark:!text-gray-100 placeholder:!text-gray-400 text-sm"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Hidden Fields */}
            <Form.Item name="baseBranch" hidden initialValue="master">
              <Input />
            </Form.Item>
          </Form>

          {/* Spacer to prevent content being hidden by footer */}
          <div className="h-4"></div>
        </div>
      </div>

      {/* Footer / Action Area - Pinned Button */}
      <div className="init-step-footer flex-none p-4 bg-white dark:bg-[#252526] border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-20">
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
  );
};
