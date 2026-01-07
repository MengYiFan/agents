import * as vscode from 'vscode';

/**
 * Git 操作结果信息
 */
export interface GitInfo {
  currentBranch: string;
  isClean: boolean;
  uncommittedChanges: number;
  hasUncommitted: boolean;
  userName?: string;
  userEmail?: string;
}

/**
 * Git 操作接口 - IGitOperations
 *
 * 定义 Git 后端必须实现的操作，支持 simple-git 和 yummy 两种后端
 */
export interface IGitOperations {
  /** 事件: 分支切换时触发 */
  readonly onDidBranchChange: vscode.Event<string>;

  /** 获取当前分支 */
  getCurrentBranch(): Promise<string>;

  /** 检查工作区是否干净 */
  checkGitStatus(): Promise<boolean>;

  /** 获取 Git 详细信息 */
  getGitInfo(): Promise<GitInfo>;

  /** 从基础分支创建新分支 */
  checkoutNewBranch(base: string, target: string): Promise<void>;

  /** 切换到指定分支 */
  checkout(branchName: string): Promise<void>;

  /** 添加并提交更改 */
  commit(message: string): Promise<void>;

  /** 添加 Tag（如存在则覆盖）*/
  addTag(tagName: string): Promise<void>;

  /** 推送 Tags 到远程 */
  pushTags(): Promise<void>;

  /** 推送代码到远程 */
  push(): Promise<void>;

  /** 合并分支并推送 */
  mergeAndPush(source: string, target: string): Promise<void>;

  /** 列出 release 分支 */
  listReleaseBranches(): Promise<string[]>;

  /** 暂存更改 */
  stashChanges(): Promise<void>;

  /** 检查分支是否存在 */
  branchExists(branchName: string): Promise<boolean>;
}

/**
 * Git 后端类型
 */
export type GitBackendType = 'git' | 'yummy';
