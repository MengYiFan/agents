import React, { ReactNode } from 'react';
import { Button, Steps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { HeaderActions } from '@/components/mcp-deck/HeaderActions';
import { useTranslation } from '@/hooks/useTranslation';
import { IWorkflowConfig, IWorkflowContext, IStepDefinition } from '@/types/workflow';

interface StepLayoutProps {
  config?: IWorkflowConfig;
  context?: IWorkflowContext;
  gitBranch?: string;
  currentStep?: IStepDefinition;

  // Slots
  footer?: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode; // Optional custom actions or use default

  // Options
  onBack?: () => void;
  title?: string;
  onStepClick?: (stepId: string) => void;
  activeStepId?: string;

  // Header Actions Props (pass through)
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
}

export const StepLayout: React.FC<StepLayoutProps> = ({
  config,
  currentStep,
  children,
  footer,
  onBack,
  title,
  onStepClick,
  activeStepId,
  mode,
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
}) => {
  const { t } = useTranslation();

  // Find index of the step currently being VIEWED
  const currentStepIndex =
    config?.steps.findIndex((s: IStepDefinition) => s.id === currentStep?.id) ?? 0;

  // Find index of the REAL active step to control clickable state
  const activeStepIndex =
    config?.steps.findIndex((s: IStepDefinition) => s.id === activeStepId) ??
    config?.steps.length ??
    0;

  return (
    <div className="step-layout-container fixed inset-0 z-[100] flex flex-col bg-[#F8F9FB] dark:bg-[#1e1e1e]">
      {/* 1. Header (Pinned Top) */}
      <div className="step-layout-header flex-none flex items-center justify-between px-4 py-3 bg-white dark:bg-[#252526] border-b border-gray-200 dark:border-gray-700 shadow-sm z-30">
        <div className="header-left flex items-center gap-3">
          {onBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="header-back-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 !p-0"
            />
          )}
          <span className="header-title text-base font-semibold text-gray-900 dark:text-gray-100">
            {title || (currentStep?.id ? t(`steps.${currentStep.id}.name`) : 'Workflow Step')}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="header-right">
          <HeaderActions
            mode={mode || 'light'}
            onToggleTheme={onToggleTheme || (() => {})}
            locale={locale || 'EN'}
            onToggleLocale={onToggleLocale}
            onSettings={onSettings}
          />
        </div>
      </div>

      {/* 2. Stepper Area */}
      <div className="step-layout-stepper flex-none bg-white/50 dark:bg-[#252526]/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-20 px-8 py-4">
        <Steps
          size="small"
          current={currentStepIndex}
          labelPlacement="vertical"
          direction="horizontal"
          responsive={false}
          className="workflow-steps w-full"
          onChange={(newIndex) => {
            if (onStepClick && config?.steps[newIndex]) {
              onStepClick(config.steps[newIndex].id);
            }
          }}
          items={config?.steps?.map((step: IStepDefinition) => {
            const stepIndex = config.steps.findIndex((s: IStepDefinition) => s.id === step.id);
            // Steps are clickable if they are 'previous' or 'current' active step
            // But Steps component `onChange` handles validation mostly.
            // We can rely on `onChange` triggering and parent validation.
            // For visual disabled state, AntD handles it: 'wait', 'process', 'finish'.
            // We can explicitly set status if needed, but default is usually fine given `current`.

            // Map dynamic title and description
            return {
              title: t(`steps.${step.id}.title`) || step.label,
              description: t(`steps.${step.id}.description`),
              disabled: stepIndex > activeStepIndex, // Disable future steps
            };
          })}
        />
      </div>

      {/* 3. Main Content (Scrollable) */}
      <div className="step-layout-content flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar relative">
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>

      {/* 4. Footer (Pinned Bottom) */}
      {footer && (
        <div className="step-layout-footer flex-none px-6 py-4 bg-white dark:bg-[#252526] border-t border-gray-200 dark:border-gray-700 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto w-full">{footer}</div>
        </div>
      )}
    </div>
  );
};
