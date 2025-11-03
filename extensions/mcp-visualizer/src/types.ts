export interface McpDocEntry {
  id: string;
  title: string;
  filePath: string;
  description?: string;
}

export interface LifecycleStage {
  id: string;
  name: string;
  description: string;
  recommendedBranches: string[];
}
