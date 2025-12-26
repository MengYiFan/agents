import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { vscode } from '@/lib/vscode';
import { UiText } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { toggleTheme } from '@/store/slices/themeSlice';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  uiText?: UiText;
  authorizations?: { id: string; authorized: boolean; iconPath?: string; label?: string }[];
  locale?: string;
  availableLocales?: string[];
}

export function Header({
  title,
  subtitle,
  compact,
  uiText,
  authorizations = [],
  locale,
}: HeaderProps) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

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

  const handleLocaleChange = () => {
    const current = locale || 'en-US';
    // Simple toggle between en-US and zh-CN
    const nextLocale = current === 'en-US' ? 'zh-CN' : 'en-US';
    vscode.postMessage({ type: 'switchLocale', language: nextLocale });
  };

  return (
    <header
      className={cn(
        'header-container flex items-center justify-between border-b bg-card px-4 py-3 transition-all',
        compact && 'py-2',
      )}
    >
      <div className="flex flex-col">
        <h1 className={cn('text-xl font-bold transition-all', compact && 'text-base')}>
          {title || uiText?.header?.title || 'MCP Visualizer'}
        </h1>
        {!compact && (
          <p className="text-sm text-muted-foreground">
            {subtitle || uiText?.header?.subtitle || 'Mastra Agentic Framework'}
          </p>
        )}

        {/* Auth Badges */}
        {!compact && authorizations.length > 0 && (
          <div className="flex gap-2 mt-2">
            {authorizations.map((auth) => (
              <div
                key={auth.id}
                className={cn(
                  'flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                  auth.authorized
                    ? 'bg-green-500/10 text-green-600 border-green-500/20'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {auth.iconPath && <img src={auth.iconPath} className="w-3 h-3" alt="" />}
                <span>{auth.label || auth.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLocaleChange}
          className="text-xs font-mono"
        >
          {locale === 'zh-cn' ? 'CN' : 'EN'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleTheme}
          title="Switch Theme"
          className="theme-toggle-btn"
        >
          {mode === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}
