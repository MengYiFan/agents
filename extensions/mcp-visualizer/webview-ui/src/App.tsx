import { useEffect, useState } from 'react';
import { vscode } from '@/lib/vscode';
import { InitialData } from '@/types';
import { IWorkflowConfig, IWorkflowContext } from '@/types/workflow';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { WorkflowRenderer } from '@/modules/workflow/WorkflowRenderer';
import { DeckHeader } from '@/components/mcp-deck/DeckHeader';
import { ServiceCard } from '@/components/mcp-deck/ServiceCard';
import { SegmentedControl } from '@/components/mcp-deck/SegmentedControl';
import { MCPCard } from '@/components/mcp-deck/MCPCard';
import { QuickActionCard } from '@/components/mcp-deck/QuickActionCard';
import { activeServices, availableMCPs, quickActions } from '@/data';
import { useAtom, useSetAtom } from 'jotai';
import { themeAtom, toggleThemeAtom } from '@/atoms/themeAtom';
import SettingsPage from '@/components/SettingsPage';
import { I18nProvider, useTranslation } from '@/hooks/useTranslation';

// Inner component to use translation hook
const MainContent = ({
  view,
  setView,
  data,
  activeTab,
  setActiveTab,
  availableMCPs,
  quickActions,
  activeServices,
  handleToggleTheme,
  handleToggleLocale,
  mode,
  workflowConfig,
  workflowContext,
  workflowBranch,
}: any) => {
  const { t } = useTranslation();

  return (
    <div className="app-container w-full h-full flex flex-col">
      {view === 'settings' ? (
        <SettingsPage
          onBack={() => setView('home')}
          userName={data?.gitInfo.userName}
          userEmail={data?.gitInfo.userEmail}
          locale={data?.locale}
          onToggleLocale={(lang) => handleToggleLocale(lang)} // Fix signature match
          theme={mode}
          onToggleTheme={handleToggleTheme}
        />
      ) : (
        <div className="app-main-content flex-1 flex flex-col px-5">
          {/* Header */}
          <DeckHeader
            mode={mode}
            onToggleTheme={handleToggleTheme}
            locale={data?.locale === 'zh-CN' ? 'CN' : 'EN'}
            onToggleLocale={() => handleToggleLocale()}
            onSettings={() => setView('settings')}
            userName={data?.gitInfo.userName}
          />

          {/* Active Integrations */}
          <div className="active-integrations-section flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap mr-1">
            {t('home.activeIntegrations')}
          </span> */}
            {activeServices.map((service: any) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Tabs */}
          <div className="tabs-container mb-4">
            <SegmentedControl activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="flex-1 relative">
            {/* Explore MCPs Tab */}
            {activeTab === 'list' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Available MCPs */}
                <section className="available-mcps-section">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                      {t('home.availableMcps')}
                    </h2>
                    <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                      {t('home.manage')}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableMCPs.map((item: any) => (
                      <MCPCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions-section pb-6">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">
                    {t('home.quickActions')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickActions.map((action: any) => (
                      <QuickActionCard key={action.id} action={action} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Workflows Tab */}
            {activeTab === 'workflow' && (
              <div className="workflows-tab-content h-[600px] animate-in fade-in zoom-in-95 duration-300">
                {workflowConfig && workflowContext ? (
                  <WorkflowRenderer
                    config={workflowConfig}
                    context={workflowContext}
                    gitBranch={workflowBranch}
                    onBack={() => setActiveTab('list')}
                    // Header Props
                    mode={mode}
                    onToggleTheme={handleToggleTheme}
                    locale={data?.locale === 'zh-CN' ? 'CN' : 'EN'}
                    onToggleLocale={() => handleToggleLocale()}
                    onSettings={() => setView('settings')}
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
      )}
    </div>
  );
};

function App() {
  const [data, setData] = useState<InitialData | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'workflow'>('list');
  const [view, setView] = useState<'home' | 'settings'>('home');

  // Workflow State
  const [workflowConfig, setWorkflowConfig] = useState<IWorkflowConfig | null>(null);
  const [workflowContext, setWorkflowContext] = useState<IWorkflowContext | null>(null);
  const [workflowBranch, setWorkflowBranch] = useState<string>('');

  const [mode] = useAtom(themeAtom);
  const toggleTheme = useSetAtom(toggleThemeAtom);

  // Refresh Git Info when entering settings
  useEffect(() => {
    if (view === 'settings') {
      vscode.postMessage({ type: 'requestGitInfo' });
    }
  }, [view]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case 'initialData':
          setData(message);
          vscode.postMessage({ type: 'webview:ready' });
          break;
        case 'workflow:init':
        case 'workflow:update':
          if (message.payload) {
            setWorkflowConfig(message.payload.config || null);
            setWorkflowContext(message.payload.context || null);
            setWorkflowBranch(message.payload.gitBranch || '');
          }
          break;
        case 'gitInfoUpdated':
          setData((prev) => (prev ? { ...prev, gitInfo: message.gitInfo } : null));
          break;
        case 'themeChanged':
          // 主题变化现在由 Jotai atom 自动处理
          break;
      }
    };

    window.addEventListener('message', handler);
    // Request initial data but don't block UI on it for the visual demo
    vscode.postMessage({ type: 'requestInitialData' });

    return () => window.removeEventListener('message', handler);
  }, []);

  // Sync theme with HTML class
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [mode]);

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleToggleLocale = (lang?: string) => {
    // Mock toggle or implementation
    let nextLocale = lang;
    if (!nextLocale) {
      const current = data?.locale || 'en-US';
      nextLocale = current === 'en-US' ? 'zh-CN' : 'en-US';
    }
    vscode.postMessage({ type: 'switchLocale', language: nextLocale });
  };

  // We allow rendering without 'data' to show the UI shell as per requirements (Mock Data priority)

  return (
    <ThemeProvider>
      <I18nProvider initialLocale={data?.locale}>
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-blue-100 selection:text-blue-900">
          <MainContent
            view={view}
            setView={setView}
            data={data}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            availableMCPs={availableMCPs}
            quickActions={quickActions}
            activeServices={activeServices}
            handleToggleTheme={handleToggleTheme}
            handleToggleLocale={handleToggleLocale}
            mode={mode}
            workflowConfig={workflowConfig}
            workflowContext={workflowContext}
            workflowBranch={workflowBranch}
          />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
