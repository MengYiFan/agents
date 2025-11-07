import type { ExtensionContext } from 'vscode';
import { registerVisualizerFeature } from '../features/visualizer';

export function registerFeatures(context: ExtensionContext): void {
  registerVisualizerFeature(context);
}
