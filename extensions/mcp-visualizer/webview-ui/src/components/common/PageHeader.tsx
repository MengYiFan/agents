import React from 'react';
import { ChevronLeft, Puzzle } from 'lucide-react';
import { HeaderActions } from '@/components/mcp-deck/HeaderActions';

interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 显示返回按钮 */
  showBack?: boolean;
  /** 返回回调 */
  onBack?: () => void;
  /** 显示 Logo (用于主页) */
  showLogo?: boolean;
  /** 显示 HeaderActions (主题、语言、设置) */
  showActions?: boolean;
  /** 主题模式 */
  mode?: 'light' | 'dark';
  onToggleTheme?: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
  /** 自定义右侧内容 */
  rightContent?: React.ReactNode;
}

/**
 * 统一页面头部组件 - PageHeader
 * 支持主页 Logo 模式和普通页面返回模式
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showLogo = false,
  showActions = false,
  mode = 'light',
  onToggleTheme,
  locale,
  onToggleLocale,
  onSettings,
  rightContent,
}) => {
  return (
    <header className="page-header sticky top-0 z-50 flex items-center justify-between pt-3 pb-1 bg-background">
      {/* Left: Logo or Title */}
      <div className="page-header-left flex items-center gap-2">
        {showLogo && (
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
            <Puzzle className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
          {title}
        </span>
      </div>

      {/* Right: Actions or Back Button */}
      <div className="page-header-right">
        {showActions && (
          <HeaderActions
            mode={mode}
            onToggleTheme={onToggleTheme!}
            locale={locale}
            onToggleLocale={onToggleLocale}
            onSettings={onSettings}
          />
        )}
        {showBack && (
          <button
            onClick={onBack}
            className="p-1 -mr-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
        )}
        {rightContent}
      </div>
    </header>
  );
};
