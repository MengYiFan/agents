import React from 'react';

export interface ActionCardGroupProps {
  /** 组标题 */
  title: string;
  /** 头部右侧操作 (如 "Manage" 入口) */
  headerAction?: {
    label: string;
    onClick: () => void;
  };
  /** 卡片内容 (ActionCard 组件) */
  children: React.ReactNode;
  /** 布局模式: list = 垂直列表, grid = 网格 */
  layout?: 'list' | 'grid';
  /** 自定义类名 */
  className?: string;
}

/**
 * 卡片组组件 - ActionCardGroup
 * 包含标题栏和可配置的卡片列表
 */
export const ActionCardGroup: React.FC<ActionCardGroupProps> = ({
  title,
  headerAction,
  children,
  layout = 'list',
  className = '',
}) => {
  const layoutClasses = {
    list: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 gap-3',
  };

  return (
    <div className={`action-card-group ${className}`}>
      {/* Header */}
      <div className="action-card-group-header flex items-center justify-between mb-3">
        <h3 className="action-card-group-title text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        {headerAction && (
          <button
            className="action-card-group-action text-xs font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            onClick={headerAction.onClick}
          >
            {headerAction.label}
          </button>
        )}
      </div>

      {/* Cards Container */}
      <div className={`action-card-group-content ${layoutClasses[layout]}`}>{children}</div>
    </div>
  );
};
