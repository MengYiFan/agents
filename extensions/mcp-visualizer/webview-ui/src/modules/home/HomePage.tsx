/**
 * HomePage 首页模块
 *
 * 显示集成服务、标签页和楼层内容
 */

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useHomeConfig } from '@/hooks/useHomeConfig';
import { useTabContent } from '@/hooks/useTabContent';
import { DeckHeader } from '@/components/mcp-deck/DeckHeader';
import { WorkflowRenderer } from '@/modules/workflow/WorkflowRenderer';
import { IntegrationsBar, TabBar, SectionRenderer, EmptyState } from '@/components/sections';
import type { InitialData } from '@/types';
import type { IWorkflowConfig, IWorkflowContext } from '@/types/workflow';

interface HomePageProps {
  data: InitialData | null;
  mode: 'light' | 'dark';
  workflowConfig: IWorkflowConfig | null;
  workflowContext: IWorkflowContext | null;
  workflowBranch: string;
  onToggleTheme: () => void;
  onToggleLocale: (lang?: string) => void;
  onSettings: () => void;
}

export function HomePage({
  data,
  mode,
  workflowConfig,
  workflowContext,
  workflowBranch,
  onToggleTheme,
  onToggleLocale,
  onSettings,
}: HomePageProps) {
  const { t, locale } = useTranslation();

  const { config, loading: configLoading } = useHomeConfig(
    data?.gitInfo.userName,
    data?.gitInfo.userEmail,
  );

  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (config?.defaultTab && !activeTab) {
      setActiveTab(config.defaultTab);
    }
  }, [config?.defaultTab, activeTab]);

  const { content: tabContent, loading: contentLoading } = useTabContent(activeTab);

  // 加载状态
  if (configLoading) {
    return (
      <div className="home-page-loading w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  // 空权限状态
  if (config?.emptyMessage) {
    return (
      <div className="home-page-empty w-full h-full flex flex-col">
        <DeckHeader
          mode={mode}
          onToggleTheme={onToggleTheme}
          locale={locale === 'zh-CN' ? 'CN' : 'EN'}
          onToggleLocale={() => onToggleLocale()}
          onSettings={onSettings}
          userName={data?.gitInfo.userName}
        />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState message={config.emptyMessage} />
        </div>
      </div>
    );
  }

  return (
    <div className="home-page flex-1 flex flex-col px-5">
      {/* Header */}
      <DeckHeader
        mode={mode}
        onToggleTheme={onToggleTheme}
        locale={locale === 'zh-CN' ? 'CN' : 'EN'}
        onToggleLocale={() => onToggleLocale()}
        onSettings={onSettings}
        userName={data?.gitInfo.userName}
      />

      {/* 集成服务横条 */}
      {config?.integrations && <IntegrationsBar integrations={config.integrations} />}

      {/* 标签页切换 */}
      {config?.tabs && <TabBar tabs={config.tabs} activeTab={activeTab} onChange={setActiveTab} />}

      {/* 内容区域 */}
      <div className="home-page-content flex-1 relative">
        {/* Explore 标签页 */}
        {activeTab === 'list' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {contentLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
              </div>
            ) : tabContent?.sections?.length ? (
              tabContent.sections
                .filter((s) => s.visible)
                .sort((a, b) => a.order - b.order)
                .map((section) => <SectionRenderer key={section.id} section={section} />)
            ) : tabContent?.emptyMessage ? (
              <EmptyState message={tabContent.emptyMessage} />
            ) : null}
          </div>
        )}

        {/* Workflow 标签页 */}
        {activeTab === 'workflow' && (
          <div className="workflows-tab-content h-[600px] animate-in fade-in zoom-in-95 duration-300">
            {workflowConfig && workflowContext ? (
              <WorkflowRenderer
                config={workflowConfig}
                context={workflowContext}
                gitBranch={workflowBranch}
                onBack={() => setActiveTab('list')}
                mode={mode}
                onToggleTheme={onToggleTheme}
                locale={data?.locale === 'zh-CN' ? 'CN' : 'EN'}
                onToggleLocale={() => onToggleLocale()}
                onSettings={onSettings}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-white dark:bg-[#1e293b] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-500" />
                <p>{t('home.loadingWorkflow')}</p>
                <p className="text-xs mt-2 opacity-50">{t('home.checkingContext')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
