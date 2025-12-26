import type { SupportedLanguage } from '../../types';

export type DiagramText = {
  lanes: {
    feature: string;
    main: string;
    release: string;
    hotfix: string;
    tags: string;
  };
  nodes: {
    featurePlan: string;
    featureBuild: string;
    mainSync: string;
    releasePrep: string;
    releaseVerify: string;
    hotfix: string;
    production: string;
  };
};

export type UiText = {
  header: {
    title: string;
    subtitle: string;
  };
  tabs: {
    list: string;
    workflow: string;
  };
  docs: {
    title: string;
    subtitle: string;
    placeholder: string;
  };
  instructions: {
    title: string;
    subtitle: string;
  };
  workflow: {
    optionalLabel: string;
    notesCasesPlaceholder: string;
    notesArchivePlaceholder: string;
  };
  stage: {
    infoTitle: string;
    infoDescription: string;
    branchesTitle: string;
    actionsTitle: string;
    actionsEmpty: string;
    commandsTitle: string;
    commandsEmpty: string;
    autoBadge: string;
    status: {
      success: string;
      error: string;
      cancelled: string;
      executedAt: string;
      commandsTitle: string;
    };
  };
  diagram: DiagramText;
};

const FALLBACK_LANGUAGE: SupportedLanguage = 'en-US';

const UI_TEXTS: Record<SupportedLanguage, UiText> = {
  'zh-CN': {
    header: {
      title: '可视化助手',
      subtitle: '串联需求、规范与分支，让协作一目了然。',
    },
    tabs: {
      list: '列表集',
      workflow: '开发流程',
    },
    docs: {
      title: 'MCP 列表',
      subtitle: '集中展示当前项目的 MCP 文档',
      placeholder: '请选择一个 MCP 查看说明。',
    },
    instructions: {
      title: '指令列表',
      subtitle: '常用自动化动作',
    },
    workflow: {
      optionalLabel: '可选',
      notesCasesPlaceholder: '测试用例覆盖情况',
      notesArchivePlaceholder: '归档说明、上线记录',
    },
    stage: {
      infoTitle: '选择一个阶段',
      infoDescription: '点击上方阶段获取生命周期指导。',
      branchesTitle: '推荐分支',
      actionsTitle: '自动化动作',
      actionsEmpty: '该阶段暂无自动化动作。',
      commandsTitle: 'Git 建议命令',
      commandsEmpty: '暂无推荐命令。',
      autoBadge: '节点点击自动触发',
      status: {
        success: '执行成功',
        error: '执行失败',
        cancelled: '已取消',
        executedAt: '最近执行：{timestamp}',
        commandsTitle: '已执行命令：',
      },
    },
    diagram: {
      lanes: {
        feature: 'feature/*',
        main: 'master/main',
        release: 'release/*',
        hotfix: 'hotfix/*',
        tags: 'tags',
      },
      nodes: {
        featurePlan: '需求梳理',
        featureBuild: '功能开发',
        mainSync: '主干同步',
        releasePrep: '提测准备',
        releaseVerify: '验证发布',
        hotfix: '紧急修复',
        production: '生产标签',
      },
    },
  },
  'en-US': {
    header: {
      title: 'MCP Visualizer~4',
      subtitle: 'Connect requirements, standards, and branches at a glance.',
    },
    tabs: {
      list: 'Library',
      workflow: 'Workflow',
    },
    docs: {
      title: 'MCP Documents',
      subtitle: 'Browse MCP guidance for this project',
      placeholder: 'Select an MCP to view the details.',
    },
    instructions: {
      title: 'Automation',
      subtitle: 'Frequently used actions',
    },
    workflow: {
      optionalLabel: 'Optional',
      notesCasesPlaceholder: 'Test coverage notes',
      notesArchivePlaceholder: 'Release notes & archive records',
    },
    stage: {
      infoTitle: 'Choose a stage',
      infoDescription: 'Click a stage above to view lifecycle guidance.',
      branchesTitle: 'Recommended branches',
      actionsTitle: 'Automations',
      actionsEmpty: 'No automations are defined for this stage yet.',
      commandsTitle: 'Git command hints',
      commandsEmpty: 'No command suggestions available.',
      autoBadge: 'Runs on stage select',
      status: {
        success: 'Succeeded',
        error: 'Failed',
        cancelled: 'Cancelled',
        executedAt: 'Last run: {timestamp}',
        commandsTitle: 'Executed commands:',
      },
    },
    diagram: {
      lanes: {
        feature: 'feature/*',
        main: 'main/master',
        release: 'release/*',
        hotfix: 'hotfix/*',
        tags: 'tags',
      },
      nodes: {
        featurePlan: 'Plan feature',
        featureBuild: 'Build feature',
        mainSync: 'Sync mainline',
        releasePrep: 'Prepare release',
        releaseVerify: 'Validate release',
        hotfix: 'Hotfix',
        production: 'Production tag',
      },
    },
  },
};

export function resolveSupportedLanguage(locale: string | undefined): SupportedLanguage {
  if (!locale) {
    return FALLBACK_LANGUAGE;
  }

  const normalized = locale.toLowerCase();
  if (normalized.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en-US';
}

export function getUiText(language: SupportedLanguage): UiText {
  return UI_TEXTS[language] ?? UI_TEXTS[FALLBACK_LANGUAGE];
}
