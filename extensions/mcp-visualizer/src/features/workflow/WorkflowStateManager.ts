import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';
import { IWorkflowContext } from './types';

/**
 * Manages the persistence of workflow state for the current branch.
 * Stores data in .vscode/workflow-context.json
 */
export class WorkflowStateManager {
    private readonly contextFileName = 'workflow-context.json';

    constructor(private readonly workspaceRoot?: string) {}

    /**
     * Loads the workflow context for the given branch.
     * Note: Currently the file is shared per workspace, but logically we associate it
     * with the current branch via the context data itself or by ensuring we only
     * read/write when on the correct branch. 
     * 
     * Per PRD 2.2: "Follow branch" strategy implies the file travels with the branch.
     * So we just read the file from the disk.
     */
    public async loadContext(): Promise<IWorkflowContext | null> {
        if (!this.workspaceRoot) return null;
        const filePath = this.getContextFilePath();
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content) as IWorkflowContext;
        } catch (error) {
            // If file doesn't exist, return null
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                return null;
            }
            console.error('Failed to load workflow context:', error);
            return null;
        }
    }

    /**
     * Saves the workflow context to disk.
     */
    public async saveContext(context: IWorkflowContext): Promise<void> {
        if (!this.workspaceRoot) {
            throw new Error('Cannot save workflow context: No workspace root');
        }
        const filePath = this.getContextFilePath();
        try {
            // Ensure .vscode directory exists
            const dirPath = path.dirname(filePath);
            await fs.mkdir(dirPath, { recursive: true });

            await fs.writeFile(filePath, JSON.stringify(context, null, 2), 'utf-8');
        } catch (error) {
            console.error('Failed to save workflow context:', error);
            throw error;
        }
    }

    /**
     * Deletes the context file (e.g. when workflow is reset)
     */
    public async deleteContext(): Promise<void> {
        if (!this.workspaceRoot) return;
        const filePath = this.getContextFilePath();
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
                throw error;
            }
        }
    }

    private getContextFilePath(): string {
        return path.join(this.workspaceRoot!, '.vscode', this.contextFileName);
    }
}
