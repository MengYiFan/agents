import React from 'react';
import { Button, Alert } from 'antd';
import {
  FileTextOutlined,
  ArrowRightOutlined,
  DeploymentUnitOutlined,
  CheckCircleOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IStepDefinition,
  IActionDefinition,
} from '@/types/workflow';
import { StepLayout } from '@/modules/workflow/common/StepLayout';
import { ActionCard, ActionCardGroup } from '@/components/ui';

interface GenericProcessStepProps {
  config: IWorkflowConfig;
  context: IWorkflowContext;
  gitBranch: string;
  currentStep: IStepDefinition;
  loadingAction: string | null;
  onAction: (action: IActionDefinition) => void;
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

export const GenericProcessStep: React.FC<GenericProcessStepProps> = ({
  config,
  context,
  gitBranch,
  currentStep,
  loadingAction,
  onAction,
  isReadOnly,
  onGoToActive,
  onBack,
  onStepClick,
  activeStepId,
  mode,
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
}) => {
  // Footer Content Logic
  const renderFooter = () => {
    if (isReadOnly) {
      return (
        <div className="flex justify-end">
          <Button type="default" onClick={onGoToActive} className="flex items-center gap-2">
            Next <ArrowRightOutlined />
          </Button>
        </div>
      );
    }

    const actions = currentStep.actions || [];
    // Separate Transition actions from others to styling
    const transitionActions = actions.filter((a) => a.type === 'Transition');
    const otherActions = actions.filter((a) => a.type !== 'Transition');

    return (
      <div className="flex gap-3">
        {otherActions.map((action, idx) => (
          <Button
            key={idx}
            type={action.style === 'default' ? 'default' : 'primary'}
            size="large"
            className={`flex-1 h-11 rounded-xl font-medium ${action.style !== 'default' ? 'bg-blue-600 hover:bg-blue-500 border-none shadow-md' : ''}`}
            icon={<DeploymentUnitOutlined />}
            loading={loadingAction === action.type}
            onClick={() => onAction(action)}
          >
            {action.label}
          </Button>
        ))}

        {transitionActions.map((action, idx) => (
          <Button
            key={`trans-${idx}`}
            size="large"
            className="flex-1 h-11 rounded-xl font-medium hover:text-blue-500 hover:border-blue-500 dark:bg-[#333] dark:text-white dark:border-gray-600 dark:hover:border-blue-500"
            onClick={() => onAction(action)}
          >
            <div className="flex items-center justify-center gap-2">
              {action.label}
              <ArrowRightOutlined className="text-xs" />
            </div>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <StepLayout
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      title={currentStep.label}
      onBack={onBack}
      onStepClick={onStepClick}
      activeStepId={activeStepId}
      footer={renderFooter()}
      mode={mode}
      onToggleTheme={onToggleTheme}
      locale={locale}
      onToggleLocale={onToggleLocale}
      onSettings={onSettings}
    >
      <div className="process-step-container flex flex-col gap-4 min-h-[60vh] pb-24 relative">
        {/* 1. Phase Card */}
        <div className="phase-card bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <CheckCircleOutlined />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                {currentStep.label}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400">Current Branch</span>
            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded text-xs font-mono border border-blue-100 dark:border-blue-900/50">
              {gitBranch}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {currentStep.label} Phase
            </span>
          </div>
        </div>

        {/* 2. Resources (Common for all steps) */}
        <ActionCardGroup title="Project Resources">
          {/* PRD Link */}
          {context.data.prdLink && (
            <ActionCard
              icon={<FileTextOutlined className="text-lg" />}
              iconTheme="orange"
              title="Product Requirements"
              description={context.data.prdLink}
              href={context.data.prdLink}
            />
          )}

          {/* Design Link */}
          {context.data.designLink && (
            <ActionCard
              icon={<BgColorsOutlined className="text-lg" />}
              iconTheme="purple"
              title="Design Mockups"
              description={context.data.designLink}
              href={context.data.designLink}
            />
          )}
        </ActionCardGroup>
      </div>

      {/* Info Alert */}
      {context.data.info && (
        <div className="fixed bottom-[80px] left-0 right-0 px-6 z-[90] pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <Alert
              message="Deep Research Insight"
              description={String(context.data.info)}
              type="info"
              showIcon
              className="shadow-lg border-blue-100 dark:border-blue-900/30 bg-blue-50/90 dark:bg-blue-900/20 backdrop-blur-sm"
            />
          </div>
        </div>
      )}
    </StepLayout>
  );
};
