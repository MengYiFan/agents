/**
 * IntegrationsBar 集成服务横条
 *
 * 显示顶部第三方集成服务图标
 */

import type { ICardItem } from '@/types/section';
import { getIconComponent } from '@/components/sections/iconUtils';

interface IntegrationsBarProps {
  integrations: ICardItem[];
  onItemClick?: (item: ICardItem) => void;
}

export function IntegrationsBar({ integrations, onItemClick }: IntegrationsBarProps) {
  if (!integrations.length) {
    return null;
  }

  const handleClick = (item: ICardItem) => {
    if (onItemClick) {
      onItemClick(item);

      return;
    }

    if (item.actionType === 'link' && item.actionPayload) {
      window.open(item.actionPayload, '_blank');
    }
  };

  return (
    <div className="integrations-bar flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {integrations.map((item) => {
        const Icon = getIconComponent(item.icon);
        const isActive = true;

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`integrations-bar-item relative group flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-[#1e293b] shadow-sm border border-gray-100 dark:border-gray-700/50'
                : 'bg-gray-50 dark:bg-slate-800/50 border border-transparent opacity-60 hover:opacity-100'
            }`}
            title={item.title}
          >
            <div className="flex items-center justify-center w-5 h-5">
              {typeof Icon === 'string' ? (
                <img src={Icon} alt={item.title} className="w-4 h-4 object-contain" />
              ) : (
                <Icon
                  className={`w-4 h-4 transition-colors duration-200 ${
                    item.iconColor || 'text-purple-500'
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
