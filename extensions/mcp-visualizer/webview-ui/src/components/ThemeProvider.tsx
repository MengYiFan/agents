import React from 'react';
import { ConfigProvider, theme, App } from 'antd';

// Map AntD tokens to VS Code CSS variables
// This allows Ant Design to adapt to the VS Code theme automatically
const vscodeThemeToken = {
  // Backgrounds
  // In Light mode, 'editor-background' is often pure white.
  // We map 'colorBgLayout' to 'sideBar.background' (often slightly grey) to distinguish from Cards (container)
  colorBgContainer: 'var(--vscode-editor-background)',
  colorBgElevated: 'var(--vscode-editorWidget-background)',
  colorBgLayout: 'var(--vscode-sideBar-background)', // Better contrast in light mode

  // Text
  colorText: 'var(--vscode-editor-foreground)',
  colorTextSecondary: 'var(--vscode-descriptionForeground)',
  colorTextPlaceholder: 'var(--vscode-input-placeholderForeground)',

  // Primary Color (Buttons, Links)
  colorPrimary: 'var(--vscode-button-background)',
  colorPrimaryHover: 'var(--vscode-button-hoverBackground)',
  colorPrimaryActive: 'var(--vscode-button-background)', // Fallback closest

  // Borders
  // Use panel-border for general borders, input-border for lighter ones
  colorBorder: 'var(--vscode-panel-border)',
  colorBorderSecondary: 'var(--vscode-input-border)',

  // Components
  controlItemBgActive: 'var(--vscode-list-activeSelectionBackground)',
  controlItemBgHover: 'var(--vscode-list-hoverBackground)',
};

import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get theme from Redux
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: vscodeThemeToken,
        components: {
          Layout: {
            // Ensure layout background uses our mapped token
            bodyBg: 'var(--vscode-sideBar-background)',
            headerBg: 'var(--vscode-editor-background)',
          },
          Input: {
            colorBgContainer: 'var(--vscode-input-background)',
            colorText: 'var(--vscode-input-foreground)',
            colorBorder: 'var(--vscode-input-border)',
          },
          Select: {
            colorBgContainer: 'var(--vscode-input-background)',
            colorText: 'var(--vscode-input-foreground)',
            colorBorder: 'var(--vscode-input-border)',
            selectorBg: 'var(--vscode-input-background)',
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
};
