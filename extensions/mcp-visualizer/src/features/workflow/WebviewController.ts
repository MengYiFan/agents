import * as vscode from 'vscode';
import { ToWebviewMessage, FromWebviewMessage } from '../../common/types';

/**
 * Controller for the Workflow Webview.
 * Handles communication between the Extension and the Webview.
 */
export class WebviewController implements vscode.Disposable {
    private readonly _disposables: vscode.Disposable[] = [];

    constructor(
        private readonly _webview: vscode.Webview,
        private readonly _context: vscode.ExtensionContext
    ) {
        this._webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._context.extensionUri, 'dist'),
                vscode.Uri.joinPath(this._context.extensionUri, 'assets'),
            ]
        };

        this._setupMessageListener();
        this._setupThemeListener();
    }

    private _setupMessageListener() {
        this._webview.onDidReceiveMessage(
            (message: FromWebviewMessage) => this._handleMessage(message),
            null,
            this._disposables
        );
    }

    private _setupThemeListener() {
        // Send initial theme
        this._updateTheme();

        // Listen for changes
        this._disposables.push(
            vscode.window.onDidChangeActiveColorTheme(() => this._updateTheme())
        );
    }

    private _updateTheme() {
        const isDark = [
            vscode.ColorThemeKind.Dark,
            vscode.ColorThemeKind.HighContrast
        ].includes(vscode.window.activeColorTheme.kind);

        this.postMessage({
            type: 'style:set-theme',
            payload: isDark ? 'dark' : 'light'
        });
    }

    private async _handleMessage(message: FromWebviewMessage) {
        switch (message.type) {
            case 'webview:ready':
                // Send initialization data if needed
                this._updateTheme();
                this.postMessage({ 
                    type: 'workflow:init', 
                    payload: { status: 'ready' } 
                });
                break;
                
            case 'workflow:create':
                vscode.window.showInformationMessage('Workflow Create requested');
                break;
                
            case 'workflow:log':
                console.log(`[Webview Log]: ${message.payload}`);
                break;
        }
    }

    public postMessage(message: ToWebviewMessage) {
        this._webview.postMessage(message);
    }

    public dispose() {
        this._disposables.forEach(d => d.dispose());
    }
}
