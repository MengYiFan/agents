import type { ExtensionContext } from 'vscode';
import { registerFeatures } from './activation/registerFeatures';

export function activate(context: ExtensionContext) {
  registerFeatures(context);
}

export function deactivate() {
  // no-op: VS Code handles cleanup through disposables registered in the context
}
