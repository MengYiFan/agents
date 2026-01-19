/**
 * CardListSection 通用卡片列表组件
 *
 * 设计原则：
 * - 单一职责：只负责渲染卡片列表
 * - 易扩展：通过 layout 和 actionType 配置不同展示和交互
 * - 可组合：支持自定义卡片渲染器
 */

import { ArrowRight, Eye, Play } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import type { ICardListData, ICardItem } from '@/types/section';
import { getIconComponent } from '@/components/sections/iconUtils';

interface CardListSectionProps {
  data: ICardListData;
  onCardAction?: (item: ICardItem) => void;
  renderCard?: (item: ICardItem, onAction: () => void) => React.ReactNode;
}

export function CardListSection({ data, onCardAction, renderCard }: CardListSectionProps) {
  const { t } = useTranslation();
  const { title, layout, columns = 3, showManageButton, items } = data;

  const handleCardAction = (item: ICardItem) => {
    if (onCardAction) {
      onCardAction(item);

      return;
    }

    // 默认行为
    switch (item.actionType) {
      case 'link':
        if (item.actionPayload) {
          window.open(item.actionPayload, '_blank');
        }
        break;
      case 'modal':
        console.log(`[Modal] ${item.actionPayload}`);
        break;
      case 'action':
        console.log(`[Action] ${item.actionPayload}`);
        break;
    }
  };

  const gridClassName =
    layout === 'grid'
      ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-3`
      : `grid grid-cols-1 md:grid-cols-${columns} gap-3`;

  return (
    <section className="card-list-section mb-6">
      {title && (
        <div className="card-list-header flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">{t(title)}</h2>
          {showManageButton && (
            <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
              {t('home.manage')}
            </button>
          )}
        </div>
      )}
      <div className={gridClassName}>
        {items.map((item) =>
          renderCard ? (
            renderCard(item, () => handleCardAction(item))
          ) : layout === 'grid' ? (
            <GridCard key={item.id} item={item} onAction={() => handleCardAction(item)} />
          ) : (
            <HorizontalCard key={item.id} item={item} onAction={() => handleCardAction(item)} />
          ),
        )}
      </div>
    </section>
  );
}

// ============================================================
// 内置卡片渲染器
// ============================================================

interface CardProps {
  item: ICardItem;
  onAction: () => void;
}

/** Grid 布局卡片 (类似 MCPCard) */
function GridCard({ item, onAction }: CardProps) {
  const Icon = getIconComponent(item.icon);
  const ActionIcon = item.actionType === 'action' ? Play : Eye;

  return (
    <div className="card-list-grid-card group flex h-full items-center justify-between p-3 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl ${item.iconBg || 'bg-gray-100 dark:bg-gray-800'}`}
        >
          {typeof Icon === 'string' ? (
            <img src={Icon} alt={item.title} className="w-5 h-5 object-contain" />
          ) : (
            <Icon className={`w-5 h-5 ${item.iconColor || 'text-gray-600'}`} />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{item.title}</h3>
          {item.description && (
            <div className="flex items-center gap-1.5 mt-0.5">
              {item.statusColor && (
                <span
                  className={`w-1.5 h-1.5 rounded-full ${item.statusColor.replace('text-', 'bg-')}`}
                />
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {item.description}
              </span>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onAction}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ActionIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

/** Horizontal 布局卡片 (类似 QuickActionCard) */
function HorizontalCard({ item, onAction }: CardProps) {
  const Icon = getIconComponent(item.icon);

  return (
    <div className="card-list-horizontal-card flex items-start gap-3 p-4 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50">
      <div
        className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${item.iconBg || 'bg-gray-100 dark:bg-gray-800'}`}
      >
        {typeof Icon === 'string' ? (
          <img src={Icon} alt={item.title} className="w-5 h-5 object-contain" />
        ) : (
          <Icon className={`w-5 h-5 ${item.iconColor || 'text-gray-600'}`} />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
        {item.description && (
          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-3">
            {item.description}
          </p>
        )}
        {item.buttonText && (
          <button
            onClick={onAction}
            className="flex items-center justify-center w-full py-2 rounded-xl bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors group"
          >
            {item.buttonText}
            <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
