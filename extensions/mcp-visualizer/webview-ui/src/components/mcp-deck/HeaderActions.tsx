import React from 'react';
import { Moon, Sun, Settings } from 'lucide-react';

interface HeaderActionsProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  mode,
  onToggleTheme,
  locale = 'EN',
  onToggleLocale,
  onSettings,
}) => {
  return (
    <div className="deck-header-actions flex items-center gap-1">
      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        {mode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </button>

      {/* Language */}
      <button
        onClick={onToggleLocale}
        className="px-2 py-0.5 text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {locale}
      </button>

      {/* Settings */}
      <button
        onClick={onSettings}
        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
};
