export type Locale = 'en' | 'zh-CN';

export interface Messages {
  refreshCommand: string;
}

const EN_MESSAGES: Messages = {
  refreshCommand: 'Refresh MCP Visualizer',
};

const ZH_MESSAGES: Messages = {
  refreshCommand: '刷新 MCP 可视化',
};

const LOCALES: Record<Locale, Messages> = {
  en: EN_MESSAGES,
  'zh-CN': ZH_MESSAGES,
};

export function getMessages(locale: Locale = 'zh-CN'): Messages {
  return LOCALES[locale] ?? LOCALES['zh-CN'];
}
