import type { LifecycleStage } from '../../../types';

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'clarify',
    name: '需求澄清',
    description: '从最新 master 派生需求分支，确认需求背景与范围。',
    recommendedBranches: ['master/main', 'feature/<需求号>-<简述>'],
    commandHints: [
      'git checkout master',
      'git pull --ff-only',
      'git checkout -b feature/<需求号>-<简述>',
    ],
  },
  {
    id: 'development',
    name: '开发',
    description: '在 feature 分支持续开发，保持与主干同步并自测。',
    recommendedBranches: ['feature/<需求号>-<简述>'],
    commandHints: [
      'git fetch origin',
      'git rebase origin/master',
      'git push -u origin feature/<需求号>-<简述>',
    ],
  },
  {
    id: 'testing',
    name: '提测',
    description: '准备提测版本，必要时创建 release/<版本号> 分支。',
    recommendedBranches: ['feature/<需求号>-<简述>', 'release/<版本号>'],
    commandHints: [
      'git checkout master',
      'git pull origin master',
      'git checkout -B release/<版本号> master',
      'git push -u origin release/<版本号>',
      'git status --short',
    ],
    actions: [
      {
        id: 'testing.createReleaseBranch',
        label: '提测：创建 release 分支',
        description: '自动切换到 master，拉取最新代码并创建 release/<版本号> 分支。',
        autoRunOnSelect: true,
        requiresConfirmation: true,
        confirmMessage: '将根据 SOP 创建 release/<版本号> 分支，是否继续？',
      },
    ],
  },
  {
    id: 'experience',
    name: '体验',
    description: '体验环境验证，确保 release 分支可用于体验。',
    recommendedBranches: ['release/<版本号>'],
    commandHints: ['git checkout release/<版本号>', 'git push origin release/<版本号>'],
  },
  {
    id: 'acceptance',
    name: '验收',
    description: '处理验收反馈，可能需要 hotfix/<缺陷号> 支持。',
    recommendedBranches: ['release/<版本号>', 'hotfix/<缺陷号>'],
    commandHints: [
      'git checkout release/<版本号>',
      'git cherry-pick <commit>',
      'git merge hotfix/<缺陷号>',
      'git push origin release/<版本号>',
    ],
  },
  {
    id: 'release',
    name: '发布',
    description: '合并回 master 并打 tag，准备生产发布。',
    recommendedBranches: ['master/main', 'release/<版本号>'],
    commandHints: [
      'git checkout master',
      'git merge --ff-only release/<版本号>',
      'git tag vX.Y.Z',
      'git push origin master --tags',
      'git branch -d release/<版本号>',
    ],
  },
  {
    id: 'operation',
    name: '运营',
    description: '关注线上运行情况，使用 hotfix 流程快速修复。',
    recommendedBranches: ['master', 'hotfix/<缺陷号>'],
    commandHints: [
      'git checkout master',
      'git checkout -b hotfix/<缺陷号>',
      'git push origin hotfix/<缺陷号>',
      'git cherry-pick <commit> # 回滚或同步关键修复',
    ],
    actions: [
      {
        id: 'operation.prepareHotfixBranch',
        label: '处理紧急产线缺陷',
        description: '检测工作区是否干净，并基于最新 master 创建 hotfix/<编号> 分支。',
        requiresConfirmation: true,
        confirmMessage: '将执行紧急产线缺陷流程，生成 hotfix/<编号> 分支，是否继续？',
      },
    ],
  },
];
