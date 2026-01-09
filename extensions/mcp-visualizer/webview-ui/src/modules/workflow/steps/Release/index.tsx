import React from 'react';
import { Card, Form, Alert, FormInstance, Select, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IStepDefinition,
  IActionDefinition,
} from '@/types/workflow';
import { StepLayout } from '@/modules/workflow/common/StepLayout';

interface ReleaseStepProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  currentStep: IStepDefinition;
  form: FormInstance;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
  releaseBranches?: string[];
  loadingBranches?: boolean;
  onRefreshBranches?: () => void;
  // Common props
  isReadOnly?: boolean;
  onGoToActive?: () => void;
  onBack?: () => void;
  onStepClick?: (stepId: string) => void;
  activeStepId?: string;
  // Header Actions Props
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
}

export const ReleaseStep: React.FC<ReleaseStepProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  form,
  loadingAction,
  onAction,
  onBack,
  onStepClick,
  activeStepId,
  releaseBranches = [],
  loadingBranches = false,
  onRefreshBranches,
  // Header Actions
  mode,
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
}) => {
  return (
    <StepLayout
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      title="Release"
      onBack={onBack}
      onStepClick={onStepClick}
      activeStepId={activeStepId}
      mode={mode}
      onToggleTheme={onToggleTheme}
      locale={locale}
      onToggleLocale={onToggleLocale}
      onSettings={onSettings}
      footer={
        <div className="footer-actions flex gap-3 w-full">
          {/* 全局 Commit 按钮 */}
          <Button
            type="default"
            size="large"
            className="footer-btn-commit flex-1 h-12 rounded-xl font-medium"
            loading={loadingAction === 'GitCommit'}
            onClick={() =>
              onAction({
                type: 'GitCommit',
                label: 'Commit',
                style: 'default',
                params: {},
              })
            }
          >
            Commit
          </Button>
          {/* 主操作按钮 */}
          {currentStep.actions?.map((action) => (
            <Button
              key={action.type}
              type="primary"
              size="large"
              className="flex-1 h-12 rounded-xl font-medium"
              loading={loadingAction === action.type}
              onClick={() => onAction(action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      }
    >
      <Card bordered={false} title="Release Configuration" className="release-config-card">
        <Alert
          message="Merge & Release"
          description="Select the target release branch to merge your changes into."
          type="warning"
          showIcon
          className="workflow-release-alert mb-4"
        />
        <Form form={form} layout="vertical">
          <Form.Item
            name="targetBranch"
            label={
              <div className="flex items-center justify-between w-full">
                <span>Target Release Branch</span>
                {onRefreshBranches && (
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined spin={loadingBranches} />}
                    onClick={onRefreshBranches}
                    className="ml-2 text-blue-500 hover:text-blue-600"
                  >
                    Refresh
                  </Button>
                )}
              </div>
            }
            rules={[{ required: true, message: 'Please select a release branch' }]}
            tooltip="The branch where this feature will be merged."
          >
            <Select
              placeholder="Select branch (e.g. release/v6.0)"
              loading={loadingBranches}
              options={releaseBranches.map((b) => ({ label: b, value: b }))}
              notFoundContent={
                loadingBranches
                  ? 'Loading...'
                  : releaseBranches.length === 0
                    ? 'No release branches found'
                    : undefined
              }
            />
          </Form.Item>
        </Form>
      </Card>
    </StepLayout>
  );
};
