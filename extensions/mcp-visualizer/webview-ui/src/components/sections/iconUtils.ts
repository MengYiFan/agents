/**
 * Icon 工具函数
 *
 * 根据图标名称返回对应的 Lucide 图标组件或图片 URL
 */

import type { LucideIcon } from 'lucide-react';
import {
  Figma,
  BarChart3,
  MessageSquare,
  Book,
  Code,
  RefreshCw,
  Play,
  Eye,
  LayoutGrid,
  Workflow,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Figma,
  BarChart3,
  MessageSquare,
  Book,
  Code,
  RefreshCw,
  Play,
  Eye,
  LayoutGrid,
  Workflow,
  ArrowRight,
};

/**
 * 获取图标组件
 * 如果是 URL 则返回字符串，否则返回 Lucide 图标组件
 */
export function getIconComponent(iconName: string): LucideIcon | string {
  // 如果是 URL，直接返回
  if (iconName.startsWith('http') || iconName.startsWith('/')) {
    return iconName;
  }

  // 查找对应的 Lucide 图标
  return ICON_MAP[iconName] || Code;
}
