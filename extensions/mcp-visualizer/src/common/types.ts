/**
 * Shared type definitions for VS Code Extension <-> Webview communication
 */

export type Theme = 'light' | 'dark';

/**
 * Messages sent from the VS Code Extension to the Webview
 */
export type ToWebviewMessage = 
  | { type: 'style:set-theme'; payload: Theme }
  | { type: 'themeChanged'; theme: { kind: string } }
  | { type: 'workflow:init'; payload: any }
  | { type: 'workflow:update'; payload: any };

/**
 * Messages sent from the Webview to the VS Code Extension
 */
export type FromWebviewMessage =
  | { type: 'webview:ready' }
  | { type: 'workflow:create'; payload: any }
  | { type: 'workflow:log'; payload: string };
