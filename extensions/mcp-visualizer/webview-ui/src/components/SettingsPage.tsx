import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Globe,
  Share2,
  Workflow,
  History,
  ExternalLink,
  ChevronRight,
  Book,
  GitBranch,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { PageHeader } from '@/components/common';

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
  const { t } = useTranslation();

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
    role: t('settings.profile.role'),
    email: displayEmail,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`,
    status: 'online',
  };

  // Git Backend State
  const [gitBackend, setGitBackend] = useState<'git' | 'yummy'>('git');
  const [isGitBackendOpen, setIsGitBackendOpen] = useState(false);

  const getLanguageLabel = (l: string) => {
    return l === 'zh-CN' ? t('settings.language.chinese') : t('settings.language.english');
  };

  return (
    <div className="settings-page-container w-full h-full flex flex-col gap-6 px-5">
      {/* Header */}
      <PageHeader title={t('settings.title')} showBack onBack={onBack} />

      {/* 2. User Profile Section */}
      <div className="settings-profile-section bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={user.avatarUrl}
            alt="User Avatar"
            className="w-[64px] h-[64px] rounded-full bg-gray-200 object-cover"
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

      {/* Appearance Section */}
      <div className="settings-appearance-section">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 ml-1">
          {t('settings.appearance.title')}
        </h3>
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
            <span className="self-start font-medium">{t('settings.appearance.light')}</span>
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
            <span className="self-start font-medium">{t('settings.appearance.dark')}</span>
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

      {/* Language Section */}
      <div className="settings-language-section relative">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 ml-1">
          {t('settings.language.title')}
        </h3>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all text-gray-700 dark:text-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-medium">{getLanguageLabel(locale)}</span>
          </div>
          <ChevronRight
            size={20}
            className={`transition-transform ${isLangOpen ? 'rotate-90' : ''}`}
          />
        </button>

        {isLangOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                onToggleLocale?.('en-US');
                setIsLangOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between ${locale === 'en-US' ? 'text-blue-500 font-medium' : ''}`}
            >
              <span>{t('settings.language.english')}</span>
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
              <span>{t('settings.language.chinese')}</span>
              {locale === 'zh-CN' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          </div>
        )}
      </div>

      {/* Plugin Behavior Section */}
      <div className="settings-behavior-section">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 ml-1">
          {t('settings.pluginBehavior.title')}
        </h3>
        <div className="space-y-3">
          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t('settings.pluginBehavior.autoSync.title')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('settings.pluginBehavior.autoSync.description')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                autoSync ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  autoSync ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Workflow Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t('settings.pluginBehavior.workflow.title')}
                </div>
                <div className="text-xs text-gray-500">
                  {t('settings.pluginBehavior.workflow.description')}
                </div>
              </div>
            </div>
            <button className="text-xs font-bold px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg">
              Standard
            </button>
          </div>

          {/* Git Backend Dropdown */}
          <div className="settings-git-backend-section relative">
            <button
              onClick={() => setIsGitBackendOpen(!isGitBackendOpen)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Git Backend</div>
                  <div className="text-xs text-gray-500">Choose git or yummy CLI</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg">
                  {gitBackend === 'git' ? 'simple-git' : 'yummy'}
                </span>
                <ChevronRight
                  size={16}
                  className={`transition-transform text-gray-400 ${isGitBackendOpen ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {isGitBackendOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e293b] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => {
                    setGitBackend('git');
                    setIsGitBackendOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between ${gitBackend === 'git' ? 'text-blue-500 font-medium' : ''}`}
                >
                  <div>
                    <div>simple-git</div>
                    <div className="text-xs text-gray-400">Default Node.js Git wrapper</div>
                  </div>
                  {gitBackend === 'git' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </button>
                <div className="h-px bg-gray-100 dark:bg-gray-700" />
                <button
                  onClick={() => {
                    setGitBackend('yummy');
                    setIsGitBackendOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center justify-between ${gitBackend === 'yummy' ? 'text-blue-500 font-medium' : ''}`}
                >
                  <div>
                    <div>yummy</div>
                    <div className="text-xs text-gray-400">AI-powered Git workflow CLI</div>
                  </div>
                  {gitBackend === 'yummy' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Auto-Save Toggle */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <History className="w-5 h-5 text-orange-500" />
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {t('settings.pluginBehavior.autoSave.title')}
              </div>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                autoSave ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  autoSave ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Docs & Support */}
      <div className="settings-docs-section grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all text-sm font-medium text-gray-600 dark:text-gray-300">
          <Book className="w-4 h-4" />
          {t('settings.documentation.doc')}
        </button>
        <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-all text-sm font-medium text-gray-600 dark:text-gray-300">
          <ExternalLink className="w-4 h-4" />
          {t('settings.documentation.support')}
        </button>
      </div>

      {/* Footer Actions */}
      <div className="settings-footer mt-auto pt-6 pb-2 text-center space-y-4">
        <button className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
          {t('settings.footer.clearData')}
        </button>
        <div className="text-[10px] text-gray-400 font-mono">
          {t('settings.footer.version')} v0.3.1
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
