import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ThemeMode = 'dark' | 'light';

// 带 localStorage 持久化的主题 atom
export const themeAtom = atomWithStorage<ThemeMode>('mcp_visualizer_theme_preference', 'dark');

// 切换主题的 action atom (write-only)
export const toggleThemeAtom = atom(null, (get, set) => {
  const current = get(themeAtom);
  set(themeAtom, current === 'dark' ? 'light' : 'dark');
});
