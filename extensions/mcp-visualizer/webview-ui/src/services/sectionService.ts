/**
 * Section Service (楼层服务)
 *
 * Mock API 服务，模拟后端接口。后期接入真实后端时只需替换此服务即可。
 * - API A: getHomeConfig - 获取首页配置
 * - API B: getTabContent - 获取标签页内容
 */

import type {
  ICardItem,
  IHomeConfigResponse,
  ITabContentResponse,
  ISectionConfig,
  ICardListData,
} from '@/types/section';

// ============================================================
// Mock 数据
// ============================================================

const MOCK_INTEGRATIONS: ICardItem[] = [
  {
    id: 'google',
    title: 'Google',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
    actionType: 'link',
    actionPayload: 'https://google.com',
  },
  {
    id: 'figma',
    title: 'Figma',
    icon: 'Figma',
    actionType: 'modal',
    actionPayload: 'figma-detail',
  },
  {
    id: 'grafana',
    title: 'Grafana',
    icon: 'BarChart3',
    iconColor: 'text-orange-500',
    actionType: 'link',
    actionPayload: 'https://grafana.com',
  },
];

const MOCK_MCP_LIST: ICardItem[] = [
  {
    id: 'grafana',
    title: 'Grafana',
    description: 'Connected',
    status: 'connected',
    statusColor: 'text-emerald-500',
    icon: 'BarChart3',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    actionType: 'modal',
    actionPayload: 'grafana-detail',
  },
  {
    id: 'codereview',
    title: 'Code review',
    description: 'Auto-check',
    status: 'autocheck',
    statusColor: 'text-blue-500',
    icon: 'MessageSquare',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    actionType: 'action',
    actionPayload: 'runCodeReview',
  },
  {
    id: 'guidelines',
    title: 'Code guidelines',
    description: 'Rules & Standards',
    status: 'standard',
    statusColor: 'text-gray-500',
    icon: 'Book',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    actionType: 'modal',
    actionPayload: 'guidelines-detail',
  },
];

const MOCK_QUICK_ACTIONS: ICardItem[] = [
  {
    id: 'inject-rules',
    title: 'Inject Code Rules',
    description:
      'Inject default code standards into .github/prompts. Customizable via project config.',
    icon: 'Code',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    buttonText: 'Inject Rules',
    actionType: 'action',
    actionPayload: 'injectRules',
  },
  {
    id: 'update-context',
    title: 'Update context7',
    description: 'Scan package.json dependencies and write matching context7 prompts.',
    icon: 'RefreshCw',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    buttonText: 'Update Context',
    actionType: 'action',
    actionPayload: 'updateContext',
  },
];

// ============================================================
// 工具函数
// ============================================================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Service 实现
// ============================================================

export const sectionService = {
  /**
   * API A: 获取首页配置
   * 根据用户信息返回可用的集成服务和标签入口
   */
  async getHomeConfig(userName?: string, _userEmail?: string): Promise<IHomeConfigResponse> {
    await delay(100);

    // 模拟无权限场景
    if (userName === 'guest') {
      return {
        integrations: [],
        tabs: [],
        defaultTab: '',
        emptyMessage: 'You do not have access to any features. Please contact your administrator.',
      };
    }

    return {
      integrations: MOCK_INTEGRATIONS,
      tabs: [
        { id: 'list', label: 'Explore', icon: 'LayoutGrid' },
        { id: 'workflow', label: 'Workflow', icon: 'Workflow' },
      ],
      defaultTab: 'list',
    };
  },

  /**
   * API B: 获取标签页内容
   * 根据标签 ID 返回对应的楼层配置
   */
  async getTabContent(tabId: string): Promise<ITabContentResponse> {
    await delay(80);

    if (tabId === 'list') {
      const sections: ISectionConfig<ICardListData>[] = [
        {
          id: 'available-mcps',
          type: 'card-list',
          visible: true,
          order: 1,
          data: {
            title: 'home.availableMcps',
            layout: 'grid',
            columns: 3,
            showManageButton: true,
            items: MOCK_MCP_LIST,
          },
        },
        {
          id: 'quick-actions',
          type: 'card-list',
          visible: true,
          order: 2,
          data: {
            title: 'home.quickActions',
            layout: 'horizontal',
            columns: 2,
            items: MOCK_QUICK_ACTIONS,
          },
        },
      ];

      return { tabId, sections };
    }

    // workflow 标签页暂无楼层
    return {
      tabId,
      sections: [],
      emptyMessage: 'Workflow content is loaded separately.',
    };
  },
};
