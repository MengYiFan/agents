import { IGitOperations, GitBackendType } from './IGitOperations';
import { GitService } from './GitService';
import { YummyBackend } from './YummyBackend';

/**
 * Git Backend Factory (Git 后端工厂)
 *
 * 根据设置创建对应的 Git 后端实例
 *
 * Usage:
 * ```typescript
 * const backend = GitBackendFactory.create('git', workspaceRoot);
 * // or
 * const backend = GitBackendFactory.create('yummy', workspaceRoot);
 * ```
 */
export class GitBackendFactory {
  /**
   * 创建 Git 后端实例
   * @param type 后端类型: 'git' (simple-git) 或 'yummy' (yummy CLI)
   * @param workspaceRoot 工作区根目录
   */
  public static create(type: GitBackendType, workspaceRoot?: string): IGitOperations {
    switch (type) {
      case 'yummy':
        return new YummyBackend(workspaceRoot);
      case 'git':
      default:
        return new GitService(workspaceRoot);
    }
  }
}
