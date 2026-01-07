import * as vscode from 'vscode';

/**
 * Message Handler Type (消息处理器类型)
 */
export type MessageHandler<T = unknown> = (payload: T) => Promise<void>;

/**
 * Message Types for type-safe message handling
 */
export interface WebviewMessage {
  type: string;
  payload?: unknown;
}

/**
 * MessageRouter - Decouples message handling from controller (消息路由器)
 *
 * 用于将消息分发到对应的处理器，使 WebviewController 更加简洁
 *
 * Usage:
 * ```typescript
 * const router = new MessageRouter();
 * router.register('webview:ready', async () => { ... });
 * router.register('executeAction', async (payload) => { ... });
 *
 * // In message handler
 * await router.dispatch(message);
 * ```
 */
export class MessageRouter {
  private readonly handlers = new Map<string, MessageHandler>();

  /**
   * 注册消息处理器
   * @param type 消息类型
   * @param handler 处理函数
   */
  public register<T = unknown>(type: string, handler: MessageHandler<T>): void {
    this.handlers.set(type, handler as MessageHandler);
  }

  /**
   * 分发消息到对应处理器
   * @param message 消息对象
   * @returns 是否成功处理
   */
  public async dispatch(message: WebviewMessage): Promise<boolean> {
    const handler = this.handlers.get(message.type);

    if (!handler) {
      console.warn(`[MessageRouter] No handler registered for message type: ${message.type}`);

      return false;
    }

    try {
      await handler(message.payload);

      return true;
    } catch (error) {
      const err = error as Error;
      vscode.window.showErrorMessage(`[MessageRouter] Handler error: ${err.message}`);

      return false;
    }
  }

  /**
   * 检查是否有对应类型的处理器
   */
  public has(type: string): boolean {
    return this.handlers.has(type);
  }

  /**
   * 获取所有已注册的消息类型
   */
  public getRegisteredTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}
