import * as vscode from 'vscode';

export abstract class BaseCommand<TArgs extends unknown[] = []> {
  constructor(
    protected readonly context: vscode.ExtensionContext,
    public readonly commandId: string,
  ) {
    const disposable = vscode.commands.registerCommand(this.commandId, (...args: unknown[]) => {
      return this.execute(...(args as TArgs));
    });
    this.context.subscriptions.push(disposable);
  }

  protected abstract execute(...args: TArgs): unknown | Promise<unknown>;
}
