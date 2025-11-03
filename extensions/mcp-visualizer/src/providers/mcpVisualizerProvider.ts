import * as vscode from 'vscode';
import { LIFECYCLE_STAGES } from '../constants/lifecycleStages';
import { collectDocs, loadDocContent } from '../services/docService';
import { checkoutBranch } from '../services/gitService';
import { McpDocEntry } from '../types';
import { getWorkspaceRoot } from '../utils/workspace';
import { getWebviewHtml } from '../webview/htmlFactory';

interface WebviewMessage {
  type: 'requestDocs' | 'openDoc' | 'checkoutBranch' | 'switchStage';
  id?: string;
  branch?: string;
  stageId?: string;
}

export class McpVisualizerProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.context.extensionUri, 'media'),
      ],
    };

    webviewView.webview.html = getWebviewHtml(webviewView.webview, this.context.extensionUri, LIFECYCLE_STAGES);
    this.bindMessageListener(webviewView);
    await this.sendInitialData();
  }

  public async refresh(): Promise<void> {
    if (!this.view) {
      return;
    }
    await this.sendInitialData();
  }

  private bindMessageListener(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage(async (message: WebviewMessage) => {
      switch (message.type) {
        case 'requestDocs':
          await this.sendInitialData();
          break;
        case 'openDoc':
          if (message.id) {
            const html = await loadDocContent(message.id);
            this.postMessage({ type: 'docContent', id: message.id, html });
          }
          break;
        case 'checkoutBranch':
          if (message.branch) {
            await checkoutBranch(getWorkspaceRoot(), message.branch);
          }
          break;
        case 'switchStage':
          if (message.stageId) {
            const stage = LIFECYCLE_STAGES.find((item) => item.id === message.stageId);
            if (stage) {
              this.postMessage({ type: 'stageInfo', stage });
            }
          }
          break;
        default:
          break;
      }
    });
  }

  private async sendInitialData() {
    const workspaceRoot = getWorkspaceRoot();
    const docs = await collectDocs(workspaceRoot);
    const firstDoc: McpDocEntry | undefined = docs[0];
    const initialContent = firstDoc ? await loadDocContent(firstDoc.filePath) : '';

    this.postMessage({ type: 'docs', docs, initialDocId: firstDoc?.id, initialContent });
    this.postMessage({ type: 'lifecycle', stages: LIFECYCLE_STAGES });
  }

  private postMessage(message: unknown) {
    this.view?.webview.postMessage(message);
  }
}
