/**
 * Section-based Homepage Types (楼层化首页类型定义)
 *
 * 支持动态楼层渲染，通过双接口架构实现：
 * - API A: /api/home/config - 获取首页配置（集成服务 + 标签入口）
 * - API B: /api/home/tab-content - 获取标签页楼层内容
 */

// ============================================================
// 楼层类型枚举
// ============================================================

/** 楼层组件类型 */
export type SectionType = 'card-list';

/** 卡片列表布局类型 */
export type CardListLayout = 'grid' | 'horizontal';

/** 卡片点击动作类型 */
export type CardActionType = 'modal' | 'action' | 'link';

// ============================================================
// 通用卡片配置
// ============================================================

/** 通用卡片项目 */
export interface ICardItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  iconBg?: string;
  iconColor?: string;
  status?: string;
  statusColor?: string;
  actionType: CardActionType;
  actionPayload?: string;
  buttonText?: string;
}

/** 卡片列表楼层数据 */
export interface ICardListData {
  title?: string;
  layout: CardListLayout;
  columns?: number;
  showManageButton?: boolean;
  items: ICardItem[];
}

// ============================================================
// 楼层配置
// ============================================================

/** 基础楼层配置 */
export interface ISectionConfig<T = unknown> {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  data: T;
}

// ============================================================
// API 响应类型
// ============================================================

/** 标签入口配置 */
export interface ITabItem {
  id: string;
  label: string;
  icon?: string;
}

/** API A 响应: 首页配置 */
export interface IHomeConfigResponse {
  integrations: ICardItem[];
  tabs: ITabItem[];
  defaultTab: string;
  /** 当用户无权限时，显示空状态消息 */
  emptyMessage?: string;
}

/** API B 响应: 标签页内容 */
export interface ITabContentResponse {
  tabId: string;
  sections: ISectionConfig<ICardListData>[];
  /** 当前标签页无楼层时，显示空状态消息 */
  emptyMessage?: string;
}
