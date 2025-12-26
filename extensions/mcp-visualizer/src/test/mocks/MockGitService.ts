export class MockGitService {
  public branches: string[] = ['master'];
  public currentBranch = 'master';
  public dirty = false;
  public tags: string[] = [];
  public commits: string[] = [];
  public remotePushes: string[] = [];

  async branchExists(branch: string): Promise<boolean> {
    return this.branches.includes(branch);
  }

  async checkGitStatus(): Promise<boolean> {
    return !this.dirty;
  }

  async checkout(branch: string): Promise<void> {
    if (!this.branches.includes(branch)) {
      throw new Error(`Branch ${branch} does not exist`);
    }
    this.currentBranch = branch;
  }

  async checkoutNewBranch(base: string, branch: string): Promise<void> {
    if (!this.branches.includes(base)) {
      throw new Error(`Base branch ${base} does not exist`);
    }
    this.branches.push(branch);
    this.currentBranch = branch;
  }

  async getCurrentBranch(): Promise<string> {
    return this.currentBranch;
  }

  async stashChanges(): Promise<void> {
    this.dirty = false;
  }

  async commit(message: string): Promise<void> {
    this.commits.push(message);
  }

  async addTag(tag: string): Promise<void> {
    this.tags.push(tag);
  }

  async push(): Promise<void> {
    this.remotePushes.push('push');
  }

  async pushTags(): Promise<void> {
    this.remotePushes.push('pushTags');
  }

  async listReleaseBranches(): Promise<string[]> {
    return this.branches.filter((b) => b.startsWith('release/'));
  }

  async mergeAndPush(source: string, target: string): Promise<void> {
    this.commits.push(`Merge ${source} into ${target}`);
    this.remotePushes.push(`push ${target}`);
  }
}
