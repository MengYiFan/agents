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
import { activeServices, availableMCPs, quickActions } from './data';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/slices/themeSlice';

function App() {
  const [data, setData] = useState<InitialData | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'workflow'>('list');

  // Workflow State
  const [workflowConfig, setWorkflowConfig] = useState<IWorkflowConfig | null>(null);
  const [workflowContext, setWorkflowContext] = useState<IWorkflowContext | null>(null);
  const [workflowBranch, setWorkflowBranch] = useState<string>('');

  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

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
          vscode.postMessage({ type: 'webview:ready' });
          break;
        case 'themeChanged':
          // Existing logic handled by ThemeProvider/Redux but keeping specifically for the class toggle if needed
          // The Header component in legacy code handled this via Redux effect.
          // We rely on the useSelector effect below or ThemeProvider.
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
    dispatch(toggleTheme());
  };

  const handleToggleLocale = () => {
    // Mock toggle or implementation
    const current = data?.locale || 'en-US';
    const nextLocale = current === 'en-US' ? 'zh-CN' : 'en-US';
    vscode.postMessage({ type: 'switchLocale', language: nextLocale });
  };

  // We allow rendering without 'data' to show the UI shell as per requirements (Mock Data priority)

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0f172a] text-foreground transition-colors duration-300 font-sans selection:bg-blue-100 selection:text-blue-900">
        <div className="w-full max-w-full md:max-w-4xl lg:max-w-6xl mx-auto px-4 md:px-6 h-full flex flex-col">
          {/* Header */}
          <DeckHeader
            mode={mode}
            onToggleTheme={handleToggleTheme}
            locale={data?.locale === 'zh-cn' ? 'CN' : 'EN'}
            onToggleLocale={handleToggleLocale}
          />

          {/* Active Integrations */}
          <div className="mt-4 mb-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap mr-1">
                Active Integrations
              </span>
              {activeServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <SegmentedControl activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="flex-1 relative">
            {/* Explore MCPs Tab */}
            {activeTab === 'list' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Available MCPs */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Available MCPs
                    </h2>
                    <button className="text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                      Manage
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableMCPs.map((item) => (
                      <MCPCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>

                {/* Quick Actions */}
                <section className="pb-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                      <QuickActionCard key={action.id} action={action} />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Workflows Tab */}
            {activeTab === 'workflow' && (
              <div className="h-[600px] animate-in fade-in zoom-in-95 duration-300">
                {workflowConfig && workflowContext ? (
                  <WorkflowRenderer
                    config={workflowConfig}
                    context={workflowContext}
                    gitBranch={workflowBranch}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-white dark:bg-[#1e293b] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <Loader2 className="animate-spin w-8 h-8 mb-4 text-blue-500" />
                    <p>Loading Active Workflow...</p>
                    <p className="text-xs mt-2 opacity-50">Checking workflow context...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
