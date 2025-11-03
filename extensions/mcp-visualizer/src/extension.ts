import * as vscode from 'vscode';
import { McpVisualizerProvider } from './providers/mcpVisualizerProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new McpVisualizerProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('mcpVisualizer.view', provider),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('mcpVisualizer.refresh', () => provider.refresh()),
  );
}

export function deactivate() {
  // no-op
}
