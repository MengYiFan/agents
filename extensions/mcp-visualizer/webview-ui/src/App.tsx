
import { useEffect, useState } from 'react';
import { vscode } from '@/lib/vscode';
import { Header } from '@/components/Header';
import { McpList } from '@/components/McpList';
import WorkflowVisualizer from './WorkflowVisualizer';
import { InitialData } from '@/types';
import { Loader2 } from 'lucide-react';

function App() {
    const [data, setData] = useState<InitialData | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'workflow'>('list');

    // Derived states for easier access
    const docs = data?.docs || [];
    const instructions = data?.instructions || [];
    const gitInfo = data?.gitInfo || null;
    const workflowData = data?.workflowData || null;
    const releaseBranches = data?.releaseBranches || [];
    const uiText = data?.uiText;

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'initialData':
                    setData(message);
                    // Only switch tab if this is the first data load
                    if (!data && message.gitInfo?.currentBranch.startsWith('feature/')) {
                        setActiveTab('workflow');
                    }
                    if (message.theme) {
                         const isDark = message.theme.kind?.includes('dark');
                         if (isDark) {
                             document.documentElement.classList.add('dark');
                             document.documentElement.classList.remove('light');
                         } else {
                             document.documentElement.classList.remove('dark');
                             document.documentElement.classList.add('light');
                         }
                    }
                    break;
                case 'gitInfoUpdated':
                    setData(prev => prev ? ({ ...prev, gitInfo: message.gitInfo, workflowData: message.workflow || prev.workflowData }) : null);
                    break;
                case 'workflowUpdated':
                    setData(prev => prev ? ({ ...prev, workflowData: message.workflow }) : null);
                    break;
                case 'docContent':
                    console.log('Doc content received (handled by McpList if we implement full view, but simply opening for now)');
                    break;
                case 'themeChanged':
                     // Update theme dynamically
                     const isDark = message.theme.kind?.includes('dark');
                     document.documentElement.classList.toggle('dark', isDark);
                     document.documentElement.classList.toggle('light', !isDark);
                     break;
            }
        };

        window.addEventListener('message', handler);
        vscode.postMessage({ type: 'requestInitialData' });
        return () => window.removeEventListener('message', handler);
    }, []);

    if (!data) {
        return <div className="flex items-center justify-center h-screen text-muted-foreground"><Loader2 className="animate-spin mr-2" /> Loading Visualizer...</div>;
    }

    return (
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
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'list' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                   {activeTab === 'list' && (
                       <div className="h-full overflow-auto">
                           <McpList docs={docs} instructions={instructions} uiText={uiText} />
                       </div>
                   )}
                </div>
                <div className={`absolute inset-0 transition-opacity duration-300 ${activeTab === 'workflow' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
                    {activeTab === 'workflow' && (
                        <WorkflowVisualizer 
                            gitInfo={gitInfo} 
                            workflow={workflowData} 
                            releaseBranches={releaseBranches}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
