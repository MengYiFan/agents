/**
 * useTranslation Hook & I18nProvider
 *
 * 多语言支持
 */

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import en from '@/i18n/en.json';
import cn from '@/i18n/cn.json';

type Locale = 'en-US' | 'zh-CN';

function getNestedValue(obj: Record<string, unknown>, key: string): string {
  const result = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }

    return undefined;
  }, obj);

  return typeof result === 'string' ? result : key;
}

interface I18nContextValue {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  t: (key) => key,
  locale: 'en-US',
  setLocale: () => {},
});

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale?: string;
  onLocaleChange?: (locale: Locale) => void;
}

export function I18nProvider({
  children,
  initialLocale = 'en-US',
  onLocaleChange,
}: I18nProviderProps) {
  const normalizeLocale = (l: string): Locale => {
    return l === 'zh-CN' || l === 'zh-cn' ? 'zh-CN' : 'en-US';
  };

  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(initialLocale));

  // 同步外部 locale 变化
  useEffect(() => {
    setLocaleState(normalizeLocale(initialLocale));
  }, [initialLocale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      onLocaleChange?.(newLocale);
    },
    [onLocaleChange],
  );

  const translations = locale === 'zh-CN' ? cn : en;

  const t = useCallback(
    (key: string) => getNestedValue(translations as Record<string, unknown>, key),
    [translations],
  );

  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
