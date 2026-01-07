import React from 'react';
import { ArrowRightOutlined, LinkOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

export interface ActionCardProps {
  /** 卡片图标 */
  icon: React.ReactNode;
  /** 图标背景样式 (预设: orange, blue, green, purple, gray) */
  iconTheme?: 'orange' | 'blue' | 'green' | 'purple' | 'gray';
  /** 自定义图标容器类名 */
  iconClassName?: string;
  /** 卡片标题 */
  title: string;
  /** 卡片描述 */
  description?: string;
  /** 点击打开链接 */
  href?: string;
  /** 点击显示弹出内容 */
  popupContent?: React.ReactNode;
  /** 点击执行函数 */
  onClick?: () => void;
  /** 尾部图标 (默认根据类型自动选择) */
  actionIcon?: React.ReactNode;
  /** 尾部按钮 (替代图标) */
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  /** 自定义类名 */
  className?: string;
}

const iconThemeClasses: Record<string, string> = {
  orange: 'icon-orange',
  blue: 'icon-blue',
  green: 'icon-green',
  purple: 'icon-purple',
  gray: 'icon-gray',
};

/**
 * 可操作卡片组件 - ActionCard
 * 支持三种交互模式: 链接、弹窗、点击事件
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  iconTheme = 'gray',
  iconClassName,
  title,
  description,
  href,
  popupContent,
  onClick,
  actionIcon,
  actionButton,
  className = '',
}) => {
  // 根据交互类型决定默认图标
  const getDefaultIcon = () => {
    if (href) {
      return <LinkOutlined className="text-sm" />;
    }

    return <ArrowRightOutlined className="text-sm" />;
  };

  // 处理点击事件
  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');

      return;
    }
    if (onClick) {
      onClick();
    }
  };

  // 卡片内容
  const cardContent = (
    <div
      className={`action-card card-interactive p-4 flex items-center justify-between group ${className}`}
      onClick={popupContent ? undefined : handleClick}
      role={popupContent ? undefined : 'button'}
      tabIndex={popupContent ? undefined : 0}
    >
      {/* 左侧: 图标 + 文字 */}
      <div className="action-card-content flex items-center gap-3 overflow-hidden">
        {/* 图标容器 */}
        <div className={`icon-box ${iconThemeClasses[iconTheme]} ${iconClassName || ''}`}>
          {icon}
        </div>

        {/* 文字内容 */}
        <div className="action-card-text flex flex-col overflow-hidden">
          <span className="action-card-title text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            {title}
          </span>
          {description && (
            <span className="action-card-desc text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* 右侧: 操作元素 */}
      <div className="action-card-action shrink-0">
        {actionButton ? (
          <button
            className="btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              actionButton.onClick();
            }}
          >
            {actionButton.label}
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400 transition-colors">
            {actionIcon || getDefaultIcon()}
          </div>
        )}
      </div>
    </div>
  );

  // 如果有弹窗内容，包裹 Popover
  if (popupContent) {
    return (
      <Popover content={popupContent} trigger="click" placement="bottom">
        {cardContent}
      </Popover>
    );
  }

  return cardContent;
};
