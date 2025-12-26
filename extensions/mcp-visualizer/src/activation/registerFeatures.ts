import type { ExtensionContext } from 'vscode';
import { registerVisualizerFeature } from '../modules/mcp';

export function registerFeatures(context: ExtensionContext): void {
  registerVisualizerFeature(context);
}
