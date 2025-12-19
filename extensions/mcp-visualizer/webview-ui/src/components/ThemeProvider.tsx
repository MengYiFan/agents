import React, { useEffect, useState } from "react";
import { ConfigProvider, theme } from "antd";

// Map AntD tokens to VS Code CSS variables
// This allows Ant Design to adapt to the VS Code theme automatically
const vscodeThemeToken = {
  // Backgrounds
  colorBgContainer: "var(--vscode-editor-background)",
  colorBgElevated: "var(--vscode-editorWidget-background)",
  colorBgLayout: "var(--vscode-editor-background)", 
  
  // Text
  colorText: "var(--vscode-editor-foreground)",
  colorTextSecondary: "var(--vscode-descriptionForeground)",
  colorTextPlaceholder: "var(--vscode-input-placeholderForeground)",
  
  // Primary Color (Buttons, Links)
  colorPrimary: "var(--vscode-button-background)",
  colorPrimaryHover: "var(--vscode-button-hoverBackground)",
  colorPrimaryActive: "var(--vscode-button-background)", // Fallback closest
  
  // Borders
  colorBorder: "var(--vscode-panel-border)",
  colorBorderSecondary: "var(--vscode-input-border)",
  
  // Components
  controlItemBgActive: "var(--vscode-list-activeSelectionBackground)",
  controlItemBgHover: "var(--vscode-list-hoverBackground)",
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Function to check the current theme class on the body
    const checkTheme = () => {
      const bodyClass = document.body.className;
      // VS Code adds 'vscode-light', 'vscode-dark', or 'vscode-high-contrast'
      const dark = bodyClass.includes("vscode-dark") || bodyClass.includes("vscode-high-contrast");
      setIsDark(dark);
    };

    // Initial check
    checkTheme();

    // Observe body class changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: vscodeThemeToken,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
