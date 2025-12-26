/* eslint-disable no-console */
import { WorkflowActionService } from '../modules/workflow/services/WorkflowActionService';
import { MockGitService } from './mocks/MockGitService';
import { MockStateManager } from './mocks/MockStateManager';
import * as assert from 'assert';

// Mock VS Code Window
(global as any).vscode = {
  window: {
    showWarningMessage: async (msg: string, ...items: string[]) => {
      console.log(`[MockVSCode] Warning: ${msg}`);
      // Default behavior: mimic "Create New" or "Stash" if asked
      if (items.includes('Switch to Existing Branch')) return 'Create New'; // Don't switch
      if (items.includes('Stash & Continue')) return 'Stash & Continue';
      return items[0];
    },
    showInputBox: async (opts: any) => {
      console.log(`[MockVSCode] Input: ${opts.prompt}`);
      return opts.value || 'mock-input-value';
    },
    showInformationMessage: async (msg: string) => {
      console.log(`[MockVSCode] Info: ${msg}`);
    },
    showErrorMessage: async (msg: string) => {
      console.error(`[MockVSCode] Error: ${msg}`);
    },
  },
} as any;

async function runTests() {
  console.log('--- Starting WorkflowActionService Tests ---');

  const git = new MockGitService();
  const state = new MockStateManager();
  const service = new WorkflowActionService(git as any, state as any);

  // Test 1: Create Branch
  console.log('\nTest 1: Create Branch');
  const actionCreate = {
    type: 'CreateBranch',
    label: 'Start',
    params: { template: 'feature/${meegleId}', nextStep: 'development' },
  } as any;
  const context = {
    currentStep: 'init',
    data: { meegleId: '123' },
    history: [],
    branch: 'master',
    lastUpdated: 0,
  } as any;

  await service.handleCreateBranch(actionCreate, context);

  assert.strictEqual(git.currentBranch, 'feature/123');
  assert.strictEqual(context.branch, 'feature/123');
  assert.strictEqual(context.currentStep, 'development');
  console.log('✅ Create Branch Passed');

  // Test 2: Transition
  console.log('\nTest 2: Transition');
  const actionTrans = {
    type: 'Transition',
    label: 'Next',
    params: { nextStep: 'test', tag: 'v1.0-${MMDD}' },
  } as any;

  await service.handleTransition(actionTrans, context);

  assert.strictEqual(context.currentStep, 'test');
  assert.strictEqual(git.tags.length, 1);
  assert.ok(git.tags[0].startsWith('v1.0-'));
  console.log('✅ Transition Passed');

  console.log('\n--- All Tests Passed ---');
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
