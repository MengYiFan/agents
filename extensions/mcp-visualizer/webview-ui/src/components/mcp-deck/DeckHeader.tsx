import { Moon, Sun, Settings, Puzzle } from 'lucide-react';

interface DeckHeaderProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  locale?: string;
  onToggleLocale?: () => void;
}

export function DeckHeader({
  mode,
  onToggleTheme,
  locale = 'EN',
  onToggleLocale,
}: DeckHeaderProps) {
  return (
    <div className="flex flex-col gap-6 pt-4 pb-2">
      {/* Top Bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
            <Puzzle className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">
            MCP Deck
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            {mode === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Language */}
          <button
            onClick={onToggleLocale}
            className="px-3 py-1 text-xs font-bold text-gray-500 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {locale}
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-blue-500">Developer</span>
        </h1>
      </div>
    </div>
  );
}
