import type { InstructionCommand } from '../../../types';

export const INSTRUCTION_ITEMS: InstructionCommand[] = [
  {
    id: 'inject-standard',
    title: '注入代码规范',
    description:
      '在当前项目的 .github/prompts 目录注入默认代码规范模板，支持通过配置调整项目与模板的映射关系。',
    actionLabel: '注入规范',
    actionId: 'inject-standard',
    requiresConfirmation: true,
    confirmMessage: '将创建或覆盖默认的代码规范模板，是否继续？',
  },
  {
    id: 'update-context7',
    title: '一键更新 context7',
    description:
      '扫描 package.json 中的依赖，写入匹配的 context7 prompt 到 .github/prompts/{包名@版本}_context7.md。',
    actionLabel: '更新 context7',
    actionId: 'update-context7',
  },
];
