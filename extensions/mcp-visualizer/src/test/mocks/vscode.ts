export const window = {
  showWarningMessage: async (msg: string, ...items: string[]) => {
    // console.log(`[MockVSCode] Warning: ${msg}`);
    if (items.includes('Switch to Existing Branch')) return 'Create New';
    if (items.includes('Stash & Continue')) return 'Stash & Continue';
    return items[0];
  },
  showInputBox: async (opts: any) => {
    // console.log(`[MockVSCode] Input: ${opts.prompt}`);
    return opts.value || 'mock-input-value';
  },
  showInformationMessage: async (msg: string) => {
    // console.log(`[MockVSCode] Info: ${msg}`);
  },
  showErrorMessage: async (msg: string) => {
    console.error(`[MockVSCode] Error: ${msg}`);
  },
  createOutputChannel: () => ({ appendLine: () => {} }),
};

export const commands = {
  executeCommand: async () => {},
};

export const workspace = {
  getConfiguration: () => ({ get: () => [] }),
  workspaceFolders: [],
};

export enum ViewColumn {
  One = 1,
}
