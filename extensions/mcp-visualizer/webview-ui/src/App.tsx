import { useEffect, useState, useCallback } from 'react';
import { vscode } from '@/lib/vscode';
import { InitialData } from '@/types';
import { IWorkflowConfig, IWorkflowContext } from '@/types/workflow';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useAtom, useSetAtom } from 'jotai';
import { themeAtom, toggleThemeAtom } from '@/atoms/themeAtom';
import { I18nProvider } from '@/hooks/useTranslation';

// 页面模块
import { HomePage } from '@/modules/home';
import { SettingsPage } from '@/modules/settings';

function App() {
  const [data, setData] = useState<InitialData | null>(null);
  const [view, setView] = useState<'home' | 'settings'>('home');
  const [locale, setLocale] = useState<string>('en-US');

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
          if (message.locale) {
            setLocale(message.locale);
          }
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
        case 'localeChanged':
          if (message.locale) {
            setLocale(message.locale);
          }
          break;
        case 'themeChanged':
          break;
      }
    };

    window.addEventListener('message', handler);
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
    let nextLocale = lang;
    if (!nextLocale) {
      nextLocale = locale === 'en-US' ? 'zh-CN' : 'en-US';
    }

    // 立即更新本地状态（Dev 模式下生效）
    setLocale(nextLocale);

    // 通知 VS Code 扩展
    vscode.postMessage({ type: 'switchLocale', language: nextLocale });
  };

  // 处理 I18nProvider 的 locale 变化回调
  const handleLocaleChange = useCallback((newLocale: 'en-US' | 'zh-CN') => {
    setLocale(newLocale);
    vscode.postMessage({ type: 'switchLocale', language: newLocale });
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider initialLocale={locale} onLocaleChange={handleLocaleChange}>
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 font-sans selection:bg-blue-100 selection:text-blue-900">
          <div className="app-container w-full h-full flex flex-col">
            {view === 'settings' ? (
              <SettingsPage
                onBack={() => setView('home')}
                userName={data?.gitInfo.userName}
                userEmail={data?.gitInfo.userEmail}
                locale={locale}
                onToggleLocale={(lang) => handleToggleLocale(lang)}
                theme={mode}
                onToggleTheme={handleToggleTheme}
              />
            ) : (
              <HomePage
                data={data}
                mode={mode}
                workflowConfig={workflowConfig}
                workflowContext={workflowContext}
                workflowBranch={workflowBranch}
                onToggleTheme={handleToggleTheme}
                onToggleLocale={handleToggleLocale}
                onSettings={() => setView('settings')}
              />
            )}
          </div>
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
