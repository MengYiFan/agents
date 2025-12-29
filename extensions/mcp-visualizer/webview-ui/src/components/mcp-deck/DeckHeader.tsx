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
    <div className="flex flex-col gap-4 pt-3 pb-1">
      {/* Top Bar */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
            <Puzzle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
            MCP Deck
          </span>
        </div>

        <div className="flex items-center gap-1">
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
          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome back, <span className="text-blue-500">Developer</span>
        </h1>
      </div>
    </div>
  );
}
