import { useState, useEffect, createContext, useContext } from 'react';
import en from '@/i18n/en.json';
import cn from '@/i18n/cn.json';

type Locale = 'en-US' | 'zh-CN';

// Helper to access nested keys (e.g., 'home.tabs.explore')
function getNestedValue(obj: any, key: string): string {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj) || key;
}

const I18nContext = createContext<{
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({
  t: (key) => key,
  locale: 'en-US',
  setLocale: () => {},
});

export function I18nProvider({
  children,
  initialLocale = 'en-US',
}: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  // Normalize locale string to match our types
  const normalizeLocale = (l: string): Locale => {
    return l === 'zh-CN' || l === 'zh-cn' ? 'zh-CN' : 'en-US';
  };

  const [locale, setLocale] = useState<Locale>(normalizeLocale(initialLocale));

  useEffect(() => {
    setLocale(normalizeLocale(initialLocale));
  }, [initialLocale]);

  const translations = locale === 'zh-CN' ? cn : en;

  const t = (key: string) => {
    return getNestedValue(translations, key);
  };

  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
