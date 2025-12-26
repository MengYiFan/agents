import * as path from 'path';
import { promises as fs } from 'fs';
import { IWorkflowConfig } from './types';
import { DEFAULT_WORKFLOW_CONFIG } from '../../config/defaultWorkflow';

/**
 * Loads the Workflow Configuration.
 * Tries `workflow.config.json` first, falls back to internal default.
 */
export class WorkflowConfigLoader {
  private readonly configFileName = 'workflow.config.json';

  constructor(private readonly workspaceRoot?: string) {}

  public async loadConfig(): Promise<IWorkflowConfig> {
    if (!this.workspaceRoot) {
      return this.getDefaultConfig();
    }
    const configPath = path.join(this.workspaceRoot, this.configFileName);
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      const userConfig = JSON.parse(content);
      return {
        ...this.getDefaultConfig(), // Merge with default to ensure minimal structure
        ...userConfig,
      };
    } catch (error) {
      // Fallback to default if file likely doesn't exist or is invalid
      console.log('Using default workflow config (local config not found or invalid)');
      return this.getDefaultConfig();
    }
  }

  public getDefaultConfig(): IWorkflowConfig {
    return DEFAULT_WORKFLOW_CONFIG;
  }
}
