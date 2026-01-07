import * as vscode from 'vscode';
import { VisualizerViewProvider } from '@modules/mcp/providers/visualizerViewProvider';
import { RefreshVisualizerCommand } from '@modules/mcp/commands/refreshVisualizerCommand';

export function registerVisualizerFeature(context: vscode.ExtensionContext): void {
  const provider = new VisualizerViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('mcpVisualizer.view', provider),
  );

  new RefreshVisualizerCommand(context, provider);
}
