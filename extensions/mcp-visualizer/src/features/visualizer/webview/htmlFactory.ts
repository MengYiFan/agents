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
      <div class="view-title">
        <h1 data-i18n="header.title">${uiText.header.title}</h1>
        <p data-i18n="header.subtitle">${uiText.header.subtitle}</p>
      </div>
      <div class="view-actions">
        <div class="locale-switcher" id="uiLocaleSwitcher"></div>
        <div class="auth-badges" id="authBadges"></div>
      </div>
    </header>
    <div class="tab-container">
      <div class="tab-header">
        <button class="tab-button active" data-target="listTab" data-i18n="tabs.list">${uiText.tabs.list}</button>
        <button class="tab-button" data-target="workflowTab" data-i18n="tabs.workflow">${uiText.tabs.workflow}</button>
      </div>
      <div id="listTab" class="tab-content active">
        <section class="panel">
          <header class="panel-header">
            <h2 data-i18n="docs.title">${uiText.docs.title}</h2>
            <p data-i18n="docs.subtitle">${uiText.docs.subtitle}</p>
          </header>
          <div class="mcp-panel">
            <nav id="mcpNav" class="mcp-nav"></nav>
            <section class="mcp-preview">
              <div class="preview-header">
                <div class="language-switcher" id="languageSwitcher"></div>
              </div>
              <article class="mcp-content" id="mcpContent" data-i18n="docs.placeholder">${uiText.docs.placeholder}</article>
            </section>
          </div>
        </section>
        <section class="panel">
          <header class="panel-header">
            <h2 data-i18n="instructions.title">${uiText.instructions.title}</h2>
            <p data-i18n="instructions.subtitle">${uiText.instructions.subtitle}</p>
          </header>
          <div class="instruction-list" id="instructionList"></div>
        </section>
      </div>
      <div id="workflowTab" class="tab-content">
        <ol class="workflow-steps" id="workflowSteps"></ol>
        <template id="gitWorkflowDiagram">
          <div class="diagram-container">
            <div class="diagram">
              <svg viewBox="0 0 1200 600">
                <g id="stageNodes">
                  ${renderStageNodes(stages)}
                </g>
                ${renderBranchLanes(uiText.diagram)}
                ${renderBranchNodes(uiText.diagram)}
              </svg>
            </div>
            <aside class="stage-info">
              <h3 id="stageTitle" data-i18n="stage.infoTitle">${uiText.stage.infoTitle}</h3>
              <p id="stageDesc" data-i18n="stage.infoDescription">${uiText.stage.infoDescription}</p>
              <h4 data-i18n="stage.branchesTitle">${uiText.stage.branchesTitle}</h4>
              <ul id="stageBranches"></ul>
              <h4 data-i18n="stage.actionsTitle">${uiText.stage.actionsTitle}</h4>
              <div id="stageActions" class="stage-actions">
                <p class="stage-actions-empty" data-i18n="stage.actionsEmpty">${uiText.stage.actionsEmpty}</p>
              </div>
              <div id="stageActionStatus" class="stage-action-status hidden"></div>
              <h4 data-i18n="stage.commandsTitle">${uiText.stage.commandsTitle}</h4>
              <ul id="stageCommands" class="stage-commands"></ul>
              <p id="stageCommandsEmpty" class="stage-commands-empty" data-i18n="stage.commandsEmpty">${uiText.stage.commandsEmpty}</p>
            </aside>
          </div>
        </template>
      </div>
    </div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
}
