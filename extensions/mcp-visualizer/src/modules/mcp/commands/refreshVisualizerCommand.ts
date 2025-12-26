import * as vscode from 'vscode';
import type { ExtensionContext } from 'vscode';
import { BaseCommand } from '../../../shared/commands/baseCommand';
import { VisualizerViewProvider } from '../providers/visualizerViewProvider';
import { getMessages, type Locale } from '../../../shared/localization/messages';

export class RefreshVisualizerCommand extends BaseCommand {
  constructor(
    context: ExtensionContext,
    private readonly provider: VisualizerViewProvider,
    private readonly locale: Locale = 'zh-CN',
  ) {
    super(context, 'mcpVisualizer.refresh');
  }

  protected async execute(): Promise<void> {
    await this.provider.refresh();
    const { refreshCommand } = getMessages(this.locale);
    vscode.window.setStatusBarMessage(refreshCommand, 2500);
  }
}
