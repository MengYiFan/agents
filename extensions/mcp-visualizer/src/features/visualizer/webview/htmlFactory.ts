import * as vscode from 'vscode';
import type { LifecycleStage, SupportedLanguage } from '../../../types';
import type { UiText } from '../../../shared/localization/i18n';
import { renderBranchLanes, renderBranchNodes, renderStageNodes } from './diagram';

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  stages: LifecycleStage[],
  uiText: UiText,
  locale: SupportedLanguage,
): string {
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'assets', 'styles', 'main.css'),
  );
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'assets', 'scripts', 'main.js'),
  );
  const nonce = getNonce();
  const csp = `default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'`;

  return `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${uiText.header.title}</title>
    <link rel="stylesheet" href="${styleUri}">
  </head>
  <body>
    <header class="view-header">
      <div class="header-left">
        <div class="header-info">
          <h1 data-i18n="header.title">${uiText.header.title}</h1>
          <p data-i18n="header.subtitle">${uiText.header.subtitle}</p>
        </div>
        <div class="auth-badges" id="authBadges"></div>
      </div>
      <div class="header-right">
        <div class="locale-switcher" id="uiLocaleSwitcher"></div>
      </div>
    </header>
    <div class="tab-container">
      <div class="tab-header">
        <button class="tab-button active" data-target="listTab" data-i18n="tabs.list">${uiText.tabs.list}</button>
        <button class="tab-button" data-target="workflowTab" data-i18n="tabs.workflow">${uiText.tabs.workflow}</button>
      </div>
      <div id="listTab" class="tab-content active">
        <div class="mcp-grid" id="mcpList"></div>
        <div class="instruction-list" id="instructionList"></div>
      </div>
      <div id="workflowTab" class="tab-content">
        <div id="workflowContainer" class="workflow-container"></div>
        <div id="stageActions" class="stage-actions"></div>
        <div id="workflowMessage" class="workflow-message hidden"></div>
      </div>
    </div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
}

