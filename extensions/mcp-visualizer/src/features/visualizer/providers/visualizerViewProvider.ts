import * as vscode from 'vscode';
import { LIFECYCLE_STAGES } from '../data/lifecycleStages';
import { collectDocs, loadDocContent } from '../../../services/docs/documentService';
import { checkoutBranch } from '../../../services/git/gitOperations';
import { executeLifecycleAction } from '../../../services/git/lifecycleAutomation';
import type { LifecycleStage, McpDocEntry, StageAction, SupportedLanguage } from '../../../types';
import { getWorkspaceRoot } from '../../../shared/workspace/workspaceRoot';
import { getWebviewHtml } from '../webview/htmlFactory';
import { INSTRUCTION_ITEMS } from '../data/instructionCatalog';
import { WORKFLOW_STEPS } from '../data/workflowSteps';
import { executeInstructionAction } from '../../../services/instructions/instructionService';
import { getAuthorizationStatuses } from '../../../services/auth/authorizationStatusService';

interface WebviewMessage {
  type:
    | 'requestInitialData'
    | 'openDoc'
    | 'checkoutBranch'
    | 'switchStage'
    | 'executeInstruction'
    | 'executeStageAction';
  docId?: string;
  language?: SupportedLanguage;
  branch?: string;
  stageId?: string;
  instructionId?: string;
  stageActionId?: string;
}

export class VisualizerViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  private docs: McpDocEntry[] = [];

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    this.view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist'),
        vscode.Uri.joinPath(this.context.extensionUri, 'assets'),
      ],
    };

    webviewView.webview.html = getWebviewHtml(
      webviewView.webview,
      this.context.extensionUri,
      LIFECYCLE_STAGES,
    );
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
        case 'requestInitialData':
          await this.sendInitialData();
          break;
        case 'openDoc':
          if (message.docId) {
            await this.openDoc(message.docId, message.language);
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
              void this.autoRunStageActions(stage);
            }
          }
          break;
        case 'executeInstruction':
          if (message.instructionId) {
            await this.executeInstruction(message.instructionId);
          }
          break;
        case 'executeStageAction':
          if (message.stageId && message.stageActionId) {
            const stage = LIFECYCLE_STAGES.find((item) => item.id === message.stageId);
            const action = stage?.actions?.find((item) => item.id === message.stageActionId);
            if (stage && action) {
              await this.runStageAction(stage, action, 'manual');
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
    this.docs = await collectDocs(workspaceRoot);
    const firstDoc: McpDocEntry | undefined = this.docs[0];
    const initialVariant = firstDoc
      ? this.selectVariant(firstDoc, firstDoc.defaultLanguage)
      : undefined;
    const initialContent = initialVariant ? await loadDocContent(initialVariant.filePath) : '';

    const webview = this.view?.webview;

    this.postMessage({
      type: 'initialData',
      docs: this.docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        defaultLanguage: doc.defaultLanguage,
        languages: doc.variants.map((variant) => ({
          language: variant.language,
          label: variant.label,
        })),
      })),
      initialDocId: firstDoc?.id,
      initialLanguage: initialVariant?.language ?? firstDoc?.defaultLanguage,
      initialContent,
      instructions: INSTRUCTION_ITEMS.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        actionLabel: item.actionLabel,
        requiresConfirmation: item.requiresConfirmation ?? false,
        confirmMessage: item.confirmMessage,
      })),
      workflow: WORKFLOW_STEPS,
      authorizations: webview
        ? getAuthorizationStatuses(webview, this.context.extensionUri)
        : [],
    });
  }

  private postMessage(message: unknown) {
    this.view?.webview.postMessage(message);
  }

  private selectVariant(doc: McpDocEntry, language?: SupportedLanguage) {
    if (language) {
      const variant = doc.variants.find((item) => item.language === language);
      if (variant) {
        return variant;
      }
    }
    return doc.variants[0];
  }

  private async openDoc(docId: string, language?: SupportedLanguage) {
    const entry = this.docs.find((doc) => doc.id === docId);
    if (!entry) {
      return;
    }

    const variant = this.selectVariant(entry, language ?? entry.defaultLanguage);
    if (!variant) {
      return;
    }

    const html = await loadDocContent(variant.filePath);
    this.postMessage({ type: 'docContent', id: docId, language: variant.language, html });
  }

  private async executeInstruction(instructionId: string) {
    const instruction = INSTRUCTION_ITEMS.find((item) => item.id === instructionId);
    if (!instruction) {
      return;
    }

    if (instruction.requiresConfirmation) {
      const confirmation = await vscode.window.showWarningMessage(
        instruction.confirmMessage ?? '确定执行该指令？',
        { modal: true },
        '继续',
        '取消',
      );
      if (confirmation !== '继续') {
        return;
      }
    }

    await executeInstructionAction(this.context, instruction.actionId);
  }

  private async autoRunStageActions(stage: LifecycleStage): Promise<void> {
    if (!stage.actions || stage.actions.length === 0) {
      return;
    }

    for (const action of stage.actions) {
      if (action.autoRunOnSelect) {
        await this.runStageAction(stage, action, 'auto');
      }
    }
  }

  private async runStageAction(
    stage: LifecycleStage,
    action: StageAction,
    trigger: 'auto' | 'manual',
  ): Promise<void> {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      this.postMessage({
        type: 'stageActionStatus',
        stageId: stage.id,
        actionId: action.id,
        status: 'error',
        message: '未检测到有效的工作区，无法执行 Git 自动化操作。',
        executedCommands: [],
      });
      return;
    }

    if (action.requiresConfirmation) {
      const confirmation = await vscode.window.showInformationMessage(
        action.confirmMessage ?? '是否执行该自动化动作？',
        { modal: trigger === 'auto' },
        '执行',
        '取消',
      );
      if (confirmation !== '执行') {
        this.postMessage({
          type: 'stageActionStatus',
          stageId: stage.id,
          actionId: action.id,
          status: 'cancelled',
          message: '已取消执行。',
          executedCommands: [],
        });
        return;
      }
    }

    const result = await executeLifecycleAction(workspaceRoot, action.id);
    const status = result.cancelled ? 'cancelled' : result.success ? 'success' : 'error';

    if (status === 'success') {
      vscode.window.showInformationMessage(result.message);
    } else if (status === 'cancelled') {
      vscode.window.showWarningMessage(result.message);
    } else {
      vscode.window.showErrorMessage(result.message);
    }

    this.postMessage({
      type: 'stageActionStatus',
      stageId: stage.id,
      actionId: action.id,
      status,
      message: result.message,
      executedCommands: result.executedCommands,
    });
  }
}
