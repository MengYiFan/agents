import React from 'react';
import { Button, Alert } from 'antd';
import {
  CodeOutlined,
  FileTextOutlined,
  BgColorsOutlined,
  ArrowRightOutlined,
  DeploymentUnitOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  IWorkflowConfig,
  IWorkflowContext,
  IStepDefinition,
  IActionDefinition,
} from '../../../../types/workflow';
import { StepLayout } from '../../common/StepLayout';

interface DevelopmentStepProps {
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

export const DevelopmentStep: React.FC<DevelopmentStepProps> = ({
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
  // Header Actions
  mode,
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
}) => {
  // Identify actions
  const commitAction =
    currentStep.actions?.find((a) => a.type === 'GitCommit') ||
    ({ label: 'Commit Code', type: 'GitCommit' } as IActionDefinition);
  const transitionAction =
    currentStep.actions?.find((a) => a.type === 'Transition') ||
    ({ label: 'Commit & Next', type: 'Transition' } as IActionDefinition);

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

    return (
      <div className="flex gap-3">
        <Button
          type="primary"
          size="large"
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-500 border-none shadow-md rounded-xl font-medium"
          icon={<DeploymentUnitOutlined />}
          loading={loadingAction === commitAction.type}
          onClick={() => onAction(commitAction)}
        >
          {commitAction.label || 'Commit Code'}
        </Button>

        <Button
          size="large"
          className="flex-1 h-11 rounded-xl font-medium hover:text-blue-500 hover:border-blue-500 dark:bg-[#333] dark:text-white dark:border-gray-600 dark:hover:border-blue-500"
          onClick={() => onAction(transitionAction)}
        >
          <div className="flex items-center justify-center gap-2">
            {transitionAction.label || 'Commit & Next'}
            <ArrowRightOutlined className="text-xs" />
          </div>
        </Button>
      </div>
    );
  };

  return (
    <StepLayout
      config={config}
      context={context}
      gitBranch={gitBranch}
      currentStep={currentStep}
      title="Development"
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
      <div className="development-step-container flex flex-col gap-4 min-h-[60vh] pb-24 relative">
        {/* 1. Development Phase Card */}
        <div className="phase-card bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <CodeOutlined />
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                Development Phase
              </span>
            </div>

            {/* Start New Workflow Entry */}
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              className="text-xs px-0"
              onClick={() => {
                // Try to find setup/init step
                const setupStep = config.steps.find((s) => s.id === 'setup');
                if (setupStep && onStepClick) {
                  onStepClick(setupStep.id);
                }
              }}
            >
              Start New
            </Button>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 dark:text-gray-400">Current Branch</span>
            <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded text-xs font-mono border border-blue-100 dark:border-blue-900/50">
              {gitBranch}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className="font-medium text-gray-900 dark:text-white">In Development</span>
          </div>
        </div>

        {/* 2. Project Resources */}
        <div className="resources-section">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
            Project Resources
          </div>
          <div className="space-y-3">
            {/* PRD Link */}
            {context.data.prdLink && (
              <div
                className="resource-card bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group"
                onClick={() => window.open(context.data.prdLink, '_blank')}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-900/30 shrink-0">
                    <FileTextOutlined className="text-lg" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 group-hover:text-blue-600 transition-colors truncate">
                      Product Requirements
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-[200px]">
                      {context.data.prdLink}
                    </span>
                  </div>
                </div>
                <ArrowRightOutlined className="text-gray-300 group-hover:text-blue-500 -rotate-45 shrink-0" />
              </div>
            )}

            {/* Design Link */}
            {context.data.designLink && (
              <div
                className="resource-card bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group"
                onClick={() => window.open(context.data.designLink, '_blank')}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 border border-purple-100 dark:border-purple-900/30 shrink-0">
                    <BgColorsOutlined className="text-lg" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 group-hover:text-blue-600 transition-colors truncate">
                      Figma / Design
                    </span>
                    <span className="text-xs text-gray-400 truncate max-w-[200px]">
                      {context.data.designLink}
                    </span>
                  </div>
                </div>
                <ArrowRightOutlined className="text-gray-300 group-hover:text-blue-500 -rotate-45 shrink-0" />
              </div>
            )}

            {/* Tech Plans */}
            {(context.data.backendPlan || context.data.frontendPlan) && (
              <>
                {context.data.backendPlan && (
                  <div
                    className="resource-card bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group"
                    onClick={() => window.open(context.data.backendPlan, '_blank')}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 border border-cyan-100 dark:border-cyan-900/30 shrink-0">
                        <CodeOutlined className="text-lg" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 group-hover:text-blue-600 transition-colors truncate">
                          Backend Plan
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-[200px]">
                          {context.data.backendPlan}
                        </span>
                      </div>
                    </div>
                    <ArrowRightOutlined className="text-gray-300 group-hover:text-blue-500 -rotate-45 shrink-0" />
                  </div>
                )}
                {context.data.frontendPlan && (
                  <div
                    className="resource-card bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between hover:border-blue-200 dark:hover:border-blue-800 transition-colors cursor-pointer group"
                    onClick={() => window.open(context.data.frontendPlan, '_blank')}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center text-pink-500 border border-pink-100 dark:border-pink-900/30 shrink-0">
                        <BgColorsOutlined className="text-lg" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-200 group-hover:text-blue-600 transition-colors truncate">
                          Frontend Plan
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-[200px]">
                          {context.data.frontendPlan}
                        </span>
                      </div>
                    </div>
                    <ArrowRightOutlined className="text-gray-300 group-hover:text-blue-500 -rotate-45 shrink-0" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* FIXED Info Alert - positioned above footer */}
      {context.data.info && (
        <div className="fixed bottom-[80px] left-0 right-0 px-6 z-[90] pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <Alert
              message="Deep Research Insight"
              description={context.data.info}
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
