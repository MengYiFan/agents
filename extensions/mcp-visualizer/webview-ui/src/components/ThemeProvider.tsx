import React from 'react';
import { ConfigProvider, theme, App } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

// 基础 VS Code 主题 token - 用于暗色模式
const vscodeThemeToken = {
  colorBgContainer: 'var(--vscode-editor-background)',
  colorBgElevated: 'var(--vscode-editorWidget-background)',
  colorBgLayout: 'var(--vscode-sideBar-background)',
  colorText: 'var(--vscode-editor-foreground)',
  colorTextSecondary: 'var(--vscode-descriptionForeground)',
  colorTextPlaceholder: 'var(--vscode-input-placeholderForeground)',
  colorPrimary: 'var(--vscode-button-background)',
  colorPrimaryHover: 'var(--vscode-button-hoverBackground)',
  colorPrimaryActive: 'var(--vscode-button-background)',
  colorBorder: 'var(--vscode-panel-border)',
  colorBorderSecondary: 'var(--vscode-input-border)',
  controlItemBgActive: 'var(--vscode-list-activeSelectionBackground)',
  controlItemBgHover: 'var(--vscode-list-hoverBackground)',
};

// 亮色模式固定颜色 - 不依赖 VS Code 变量
const lightModeColors = {
  inputBg: '#ffffff',
  inputText: '#1f2937',
  inputBorder: '#d1d5db',
  selectBg: '#ffffff',
  stepsBg: '#ffffff',
};

// 暗色模式固定颜色
const darkModeColors = {
  inputBg: '#333333',
  inputText: '#f3f4f6',
  inputBorder: '#4b5563',
  selectBg: '#333333',
  stepsBg: '#1e293b',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === 'dark';
  const colors = isDark ? darkModeColors : lightModeColors;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: vscodeThemeToken,
        components: {
          Layout: {
            bodyBg: isDark ? 'var(--vscode-sideBar-background)' : '#f8fafc',
            headerBg: isDark ? 'var(--vscode-editor-background)' : '#ffffff',
          },
          Input: {
            colorBgContainer: colors.inputBg,
            colorText: colors.inputText,
            colorBorder: colors.inputBorder,
          },
          Select: {
            colorBgContainer: colors.selectBg,
            colorText: colors.inputText,
            colorBorder: colors.inputBorder,
            selectorBg: colors.selectBg,
            optionSelectedBg: isDark ? '#374151' : '#dbeafe',
          },
          Steps: {
            colorBgContainer: colors.stepsBg,
            colorPrimary: isDark ? '#22c55e' : '#22c55e',
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};
