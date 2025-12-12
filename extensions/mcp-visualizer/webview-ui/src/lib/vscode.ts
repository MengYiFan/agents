
export interface VSCodeApi {
    postMessage(message: unknown): void;
    getState(): unknown;
    setState(state: unknown): void;
}

declare global {
    interface Window {
        acquireVsCodeApi(): VSCodeApi;
    }
}

class VSCodeWrapper {
    private readonly vsCodeApi: VSCodeApi | undefined;

    constructor() {
        if (typeof window.acquireVsCodeApi === "function") {
            this.vsCodeApi = window.acquireVsCodeApi();
        }
    }

    public postMessage(message: unknown) {
        if (this.vsCodeApi) {
            this.vsCodeApi.postMessage(message);
        } else {
            console.log("PostMessage:", message);
        }
    }

    public getState(): unknown {
        if (this.vsCodeApi) {
            return this.vsCodeApi.getState();
        }
        return {};
    }

    public setState(state: unknown) {
        if (this.vsCodeApi) {
            this.vsCodeApi.setState(state);
        } else {
            console.log("SetState:", state);
        }
    }
}

export const vscode = new VSCodeWrapper();
