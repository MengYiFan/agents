import { Puzzle } from 'lucide-react';
import { HeaderActions } from './HeaderActions';

import { useTranslation } from '../../hooks/useTranslation';

interface DeckHeaderProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  locale?: string;
  onToggleLocale?: () => void;
  onSettings?: () => void;
  userName?: string;
}

export function DeckHeader({
  mode,
  onToggleTheme,
  locale = 'EN',
  onToggleLocale,
  onSettings,
  userName,
}: DeckHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="deck-header-container flex flex-col gap-4 pt-3 pb-1">
      {/* Top Bar */}
      <header className="deck-header-top-bar flex items-center justify-between">
        <div className="deck-header-title-group flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
            <Puzzle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
            {t('header.title')}
          </span>
        </div>

        <HeaderActions
          mode={mode}
          onToggleTheme={onToggleTheme}
          locale={locale}
          onToggleLocale={onToggleLocale}
          onSettings={onSettings}
        />
      </header>

      {/* Greeting */}
      <div>
        <h1 className="deck-header-greeting text-xl font-bold text-gray-900 dark:text-white">
          {t('header.welcome')}
          <span className="text-blue-500">{userName || t('header.developer')}</span>
        </h1>
      </div>
    </div>
  );
}
