import * as vscode from 'vscode';
import type { AuthorizationStatus } from '../../types';

interface ProviderDefinition {
  id: string;
  name: string;
  iconFile: string;
}

const DEFAULT_PROVIDERS: ProviderDefinition[] = [
  { id: 'lark', name: 'Lark', iconFile: 'lark.svg' },
  { id: 'google', name: 'Google Drive', iconFile: 'google.svg' },
  { id: 'figma', name: 'Figma', iconFile: 'figma.svg' },
];

export function getAuthorizationStatuses(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
): AuthorizationStatus[] {
  const configuration = vscode.workspace.getConfiguration('mcpVisualizer');
  const overrides = configuration.get<Record<string, boolean>>('authorizations') ?? {};

  return DEFAULT_PROVIDERS.map((provider) => ({
    id: provider.id,
    name: provider.name,
    authorized: Boolean(overrides[provider.id]),
    iconPath: webview
      .asWebviewUri(vscode.Uri.joinPath(extensionUri, 'assets', 'icons', 'platforms', provider.iconFile))
      .toString(),
  }));
}
