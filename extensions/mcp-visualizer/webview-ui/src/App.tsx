import { useEffect, useState } from 'react';
import { vscode } from '@/lib/vscode';
import { Header } from '@/components/Header';
import { McpList } from '@/modules/mcp/McpList';
import { InitialData } from '@/types';
import { IWorkflowConfig, IWorkflowContext } from '@/types/workflow';
import { Loader2 } from 'lucide-react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { WorkflowRenderer } from '@/modules/workflow/WorkflowRenderer';

function App() {
  const [data, setData] = useState<InitialData | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'workflow'>('list');

  // Workflow State
  const [workflowConfig, setWorkflowConfig] = useState<IWorkflowConfig | null>(null);
  const [workflowContext, setWorkflowContext] = useState<IWorkflowContext | null>(null);
  const [workflowBranch, setWorkflowBranch] = useState<string>('');

  // Derived states for easier access
  const docs = data?.docs || [];
  const instructions = data?.instructions || [];
  const uiText = data?.uiText;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      switch (message.type) {
        case 'initialData':
          setData(message);
          // Request workflow init after main init
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
          // Re-trigger workflow fetch on branch change
          vscode.postMessage({ type: 'webview:ready' });
          break;
        case 'themeChanged':
          const isDark = message.theme.kind?.includes('dark');
          document.documentElement.classList.toggle('dark', isDark);
          document.documentElement.classList.toggle('light', !isDark);

          // Dispatch event for ThemeProvider
          window.dispatchEvent(
            new CustomEvent('theme-changed', {
              detail: { theme: isDark ? 'dark' : 'light' },
            }),
          );
          break;
      }
    };

    window.addEventListener('message', handler);
    vscode.postMessage({ type: 'requestInitialData' });
    return () => window.removeEventListener('message', handler);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <Loader2 className="animate-spin mr-2" /> Loading Visualizer...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
        <Header
          compact={activeTab === 'workflow'}
          uiText={uiText}
          authorizations={data?.authorizations}
          locale={data?.locale}
          availableLocales={data?.availableLocales}
        />

        <div className="flex border-b bg-card px-4 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'list' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Available MCPs
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'workflow' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            R&D Workflows
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'list' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {activeTab === 'list' && (
              <div className="h-full overflow-auto">
                <McpList docs={docs} instructions={instructions} uiText={uiText} />
              </div>
            )}
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'workflow' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            {activeTab === 'workflow' && (
              <div className="h-full workflow-dev-layout">
                {workflowConfig && workflowContext ? (
                  <WorkflowRenderer
                    config={workflowConfig}
                    context={workflowContext}
                    gitBranch={workflowBranch}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="animate-spin mr-2" /> Loading Workflow...
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
