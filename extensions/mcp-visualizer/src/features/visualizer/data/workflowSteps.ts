import type { WorkflowStep } from '../../../types';

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'prd',
    title: 'PRD 链接',
    description: '输入需求文档 PRD 链接，确保所有成员均可访问。',
    type: 'link',
    placeholder: 'https://',
  },
  {
    id: 'figma',
    title: 'Figma 链接',
    description: '可选：关联交互与视觉稿，验证是否获得设计平台访问权限。',
    type: 'link',
    optional: true,
    placeholder: 'https://www.figma.com/',
  },
  {
    id: 'backend-docs',
    title: '后端技术文档',
    description: '可选：补充接口协议、数据结构与部署说明。',
    type: 'link',
    optional: true,
    placeholder: 'https://',
  },
  {
    id: 'frontend-docs',
    title: '前端技术文档',
    description: '可选：记录前端方案、组件划分与技术要点。',
    type: 'link',
    optional: true,
    placeholder: 'https://',
  },
  {
    id: 'git-workflow',
    title: 'Git 管理流程',
    description: '根据生命周期节点执行规范化的分支策略与合并流程。',
    type: 'diagram',
  },
  {
    id: 'testing-archive',
    title: '测试用例与归档',
    description: '汇总测试用例结果与归档说明，确保产出可追溯。',
    type: 'notes',
  },
];
