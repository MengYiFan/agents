import { LifecycleStage } from '../types';

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'clarify',
    name: '需求澄清',
    description: '从最新 master 派生需求分支，确认需求背景与范围。',
    recommendedBranches: ['master', 'feature/<需求号>-<简述>'],
  },
  {
    id: 'development',
    name: '开发',
    description: '在 feature 分支持续开发，保持与主干同步并自测。',
    recommendedBranches: ['feature/<需求号>-<简述>'],
  },
  {
    id: 'testing',
    name: '提测',
    description: '准备提测版本，必要时创建 release/<版本号> 分支。',
    recommendedBranches: ['feature/<需求号>-<简述>', 'release/<版本号>'],
  },
  {
    id: 'experience',
    name: '体验',
    description: '体验环境验证，确保 release 分支可用于体验。',
    recommendedBranches: ['release/<版本号>'],
  },
  {
    id: 'acceptance',
    name: '验收',
    description: '处理验收反馈，可能需要 hotfix/<缺陷号> 支持。',
    recommendedBranches: ['release/<版本号>', 'hotfix/<缺陷号>'],
  },
  {
    id: 'release',
    name: '发布',
    description: '合并回 master 并打 tag，准备生产发布。',
    recommendedBranches: ['master', 'release/<版本号>'],
  },
  {
    id: 'operation',
    name: '运营',
    description: '关注线上运行情况，使用 hotfix 流程快速修复。',
    recommendedBranches: ['master', 'hotfix/<缺陷号>'],
  },
];
