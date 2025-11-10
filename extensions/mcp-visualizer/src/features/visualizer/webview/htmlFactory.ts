import * as vscode from 'vscode';
import type { LifecycleStage } from '../../../types';
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
): string {
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'assets', 'styles', 'main.css'));
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'assets', 'scripts', 'main.js'));
  const nonce = getNonce();
  const csp = `default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https: data:; script-src 'nonce-${nonce}'`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MCP 可视化</title>
    <link rel="stylesheet" href="${styleUri}">
  </head>
  <body>
    <header class="view-header">
      <div class="view-title">
        <h1>MCP 可视化助手</h1>
        <p>串联需求、规范与分支，让协作一目了然。</p>
      </div>
      <div class="auth-badges" id="authBadges"></div>
    </header>
    <div class="tab-container">
      <div class="tab-header">
        <button class="tab-button active" data-target="listTab">列表集</button>
        <button class="tab-button" data-target="workflowTab">开发流程</button>
      </div>
      <div id="listTab" class="tab-content active">
        <section class="panel">
          <header class="panel-header">
            <h2>MCP 列表</h2>
            <p>集中展示当前项目的 MCP 文档</p>
          </header>
          <div class="mcp-panel">
            <nav id="mcpNav" class="mcp-nav"></nav>
            <section class="mcp-preview">
              <div class="preview-header">
                <div class="language-switcher" id="languageSwitcher"></div>
              </div>
              <article class="mcp-content" id="mcpContent">请选择一个 MCP 查看说明。</article>
            </section>
          </div>
        </section>
        <section class="panel">
          <header class="panel-header">
            <h2>指令列表</h2>
            <p>常用自动化动作</p>
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
                ${renderBranchLanes()}
                ${renderBranchNodes()}
              </svg>
            </div>
            <aside class="stage-info">
              <h3 id="stageTitle">选择一个阶段</h3>
              <p id="stageDesc">点击上方阶段获取生命周期指导。</p>
              <h4>推荐分支</h4>
              <ul id="stageBranches"></ul>
            </aside>
          </div>
        </template>
      </div>
    </div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
</html>`;
}
