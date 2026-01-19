/**
 * TabBar 标签页切换组件
 *
 * 渲染从接口获取的标签入口
 */

import { useTranslation } from '@/hooks/useTranslation';
import type { ITabItem } from '@/types/section';
import { getIconComponent } from '@/components/sections/iconUtils';

interface TabBarProps {
  tabs: ITabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

// 标签 ID 到翻译 key 的映射
const TAB_TRANSLATION_MAP: Record<string, string> = {
  list: 'home.tabs.explore',
  workflow: 'home.tabs.workflow',
};

export function TabBar({ tabs, activeTab, onChange }: TabBarProps) {
  const { t } = useTranslation();

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="tab-bar flex p-1 bg-gray-100 dark:bg-[#1e293b] rounded-xl mb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon ? getIconComponent(tab.icon) : null;
        const isActive = activeTab === tab.id;
        const translationKey = TAB_TRANSLATION_MAP[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`tab-bar-item flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {Icon && typeof Icon !== 'string' && <Icon className="w-3.5 h-3.5" />}
            {translationKey ? t(translationKey) : tab.label}
          </button>
        );
      })}
    </div>
  );
}
