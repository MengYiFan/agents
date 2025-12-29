import React, { useState } from 'react';
import {
  ChevronLeft,
  Sun,
  Moon,
  Globe,
  Share2,
  Workflow,
  History,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  userName?: string;
  userEmail?: string;
  locale?: string;
  onToggleLocale?: (lang: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

/**
 * SettingsPage Component
 *
 * Implements a responsive settings interface.
 */
const SettingsPage: React.FC<SettingsPageProps> = ({
  onBack,
  userName,
  userEmail,
  locale = 'en-US',
  onToggleLocale,
  theme,
  onToggleTheme,
}) => {
  // Plugin Behavior State
  const [autoSync, setAutoSync] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  // Language Dropdown State
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Mock Data
  const displayName = userName || 'Developer';
  const displayEmail = userEmail || 'No email configured';

  const user = {
    name: displayName,
    role: 'Senior Developer',
    email: displayEmail,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    status: 'online',
  };

  const getLanguageLabel = (l: string) => {
    return l === 'zh-CN' ? '中文' : 'English';
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* 1. Header */}
      <header className="flex items-center justify-between py-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="w-10"></div>
      </header>

      {/* 2. User Profile Section */}
      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="relative">
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="w-16 h-16 rounded-full bg-gray-200 object-cover"
          />
          {/* Online Status Indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold">{user.name}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.role} {user.email ? `· ${user.email}` : ''}
          </span>
        </div>
      </div>

      {/* 3. Appearance Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Appearance</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Light Mode Card */}
          <button
            onClick={() => {
              if (theme !== 'light') onToggleTheme();
            }}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 bg-white dark:bg-[#1e293b] ${
              theme === 'light'
                ? 'border-blue-500 shadow-md'
                : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-1">
              <Sun className="text-orange-500" size={32} />
            </div>
            <span className="self-start font-medium">Light</span>
            <div
              className={`absolute bottom-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                theme === 'light' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {theme === 'light' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            onClick={() => {
              if (theme !== 'dark') onToggleTheme();
            }}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 bg-white dark:bg-[#1e293b] ${
              theme === 'dark'
                ? 'border-blue-500 shadow-md'
                : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <div className="w-full h-24 bg-[#0f172a] rounded-lg flex items-center justify-center mb-1">
              <Moon className="text-indigo-400" size={32} />
            </div>
            <span className="self-start font-medium">Dark</span>
            <div
              className={`absolute bottom-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                theme === 'dark' ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {theme === 'dark' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
            </div>
          </button>
        </div>
      </div>

      {/* 4. Language Section */}
      <div className="relative">
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="w-full bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Globe size={20} />
            </div>
            <span className="font-medium">Language</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">{getLanguageLabel(locale)}</span>
            <ChevronRight
              size={20}
              className={`transition-transform ${isLangOpen ? 'rotate-90' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isLangOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                onToggleLocale?.('en-US');
                setIsLangOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between ${locale === 'en-US' ? 'text-blue-500 font-medium' : ''}`}
            >
              <span>English</span>
              {locale === 'en-US' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
            <div className="h-px bg-gray-100 dark:bg-gray-700" />
            <button
              onClick={() => {
                onToggleLocale?.('zh-CN');
                setIsLangOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between ${locale === 'zh-CN' ? 'text-blue-500 font-medium' : ''}`}
            >
              <span>中文</span>
              {locale === 'zh-CN' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          </div>
        )}
      </div>

      {/* 5. Plugin Behavior Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Plugin Behavior</h2>
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm overflow-hidden">
          {/* Auto-sync MCPs */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Share2 size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-medium">Auto-sync MCPs</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Manage server connections
                </span>
              </div>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out relative ${
                autoSync ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-200 shadow-sm ${
                  autoSync ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* R&D Workflow */}
          <button className="w-full p-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Workflow size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-medium">R&D Workflow</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Context awareness: Standard
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          {/* Auto-save Logs */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <History size={20} />
              </div>
              <span className="font-medium">Auto-save Logs</span>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out relative ${
                autoSave ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-200 shadow-sm ${
                  autoSave ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Documentation & Support */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm overflow-hidden">
        {/* Documentation */}
        <a
          href="#"
          className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="font-medium">Documentation</span>
          <ExternalLink size={20} className="text-gray-400" />
        </a>
        {/* Help & Support */}
        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
          <span className="font-medium">Help & Support</span>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* 7. Footer Action */}
      <div className="flex flex-col items-center gap-4 mt-4 pb-8">
        <button className="w-full bg-white dark:bg-[#1e293b] text-red-500 font-semibold py-4 rounded-2xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Clear data
        </button>
        <span className="text-xs text-gray-400">Version 1.2.0 (Build 492)</span>
      </div>
    </div>
  );
};

export default SettingsPage;
