(function () {
  const vscode = acquireVsCodeApi();
  let persistedState = vscode.getState() || {};

  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-content'));
  const mcpList = document.getElementById('mcpList');
  const instructionList = document.getElementById('instructionList');
  const workflowContainer = document.getElementById('workflowContainer');

  const authBadges = document.getElementById('authBadges');
  const uiLocaleSwitcher = document.getElementById('uiLocaleSwitcher');

  let docs = [];
  let currentLanguage = persistedState.selectedLanguage || null;
  let uiText = persistedState.uiText || null;
  let currentLocale = persistedState.locale || 'zh-CN';
  let gitInfo = null;
  let workflowData = null;

  function updateState(patch) {
    persistedState = { ...persistedState, ...patch };
    vscode.setState(persistedState);
  }

  function getText(path) {
    if (!uiText) {
      return '';
    }
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), uiText) || '';
  }

  function applyTranslations(text, locale) {
    if (text) {
      uiText = text;
    }
    if (locale) {
      currentLocale = locale;
    }
    if (uiText) {
      updateState({ uiText, locale: currentLocale });
    }
    document.documentElement.lang = currentLocale;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      const value = getText(key);
      if (value) {
        node.textContent = value;
      }
    });

    updateLocaleButtons();
  }

  function updateLocaleButtons() {
    if (!uiLocaleSwitcher) {
      return;
    }
    Array.from(uiLocaleSwitcher.querySelectorAll('.locale-button')).forEach((button) => {
      button.classList.toggle('active', button.dataset.locale === currentLocale);
    });
  }

  function applyTheme(theme) {
    if (!theme) {
      return;
    }
    document.documentElement.setAttribute('data-theme-kind', theme.kind);
    document.documentElement.style.setProperty(
      '--vscode-color-scheme',
      theme.colorScheme === 'light' ? 'light' : 'dark',
    );
  }

  function switchTab(targetId) {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.target === targetId;
      button.classList.toggle('active', isActive);
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === targetId);
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      switchTab(button.dataset.target);
    });
  });



  function renderDocList(docEntries) {
    docs = docEntries;
    mcpList.innerHTML = '';

    if (docEntries.length === 0) {
      mcpList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--vscode-descriptionForeground);">No MCPs found.</p>';
      return;
    }

    docEntries.forEach((doc) => {
      const card = document.createElement('div');
      card.className = 'mcp-card';
      card.dataset.id = doc.id;

      const title = document.createElement('div');
      title.className = 'mcp-card-title';
      title.textContent = doc.title;
      card.appendChild(title);

      const desc = document.createElement('div');
      desc.className = 'mcp-card-desc';
      desc.textContent = doc.description || 'No description available.';
      card.appendChild(desc);

      const meta = document.createElement('div');
      meta.className = 'mcp-card-meta';

      const langLabel = document.createElement('span');
      langLabel.textContent = doc.defaultLanguage === 'zh-CN' ? '中文' : 'English';
      meta.appendChild(langLabel);

      card.appendChild(meta);

      card.addEventListener('click', () => {
        // If content is already available (API agents), render it directly or ask extension to open it
        if (doc.content) {
          // For now, let's assume we want to open it in a new tab via extension
          // We pass the content or just the ID if the extension can handle it.
          // Since the extension expects to load file content, we might need to handle this differently.
          // But for now, let's stick to the existing message structure.
          vscode.postMessage({ type: 'openDoc', docId: doc.id, language: doc.defaultLanguage, content: doc.content });
        } else {
          vscode.postMessage({ type: 'openDoc', docId: doc.id, language: doc.defaultLanguage });
        }
      });
      mcpList.appendChild(card);
    });
  }

  function renderInstructions(instructions) {
    if (!instructionList) return;
    instructionList.innerHTML = '';

    if (!instructions || instructions.length === 0) return;

    const header = document.createElement('h3');
    header.textContent = '快捷指令';
    header.style.marginBottom = '10px';
    instructionList.appendChild(header);

    const list = document.createElement('div');
    list.className = 'instruction-grid'; // Use grid for layout

    instructions.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'instruction-button';
      btn.textContent = item.title;
      btn.title = item.description;
      btn.addEventListener('click', () => {
        vscode.postMessage({ type: 'executeInstruction', instructionId: item.id });
      });
      list.appendChild(btn);
    });
    instructionList.appendChild(list);
  }

  function renderWorkflow(data, git) {
    workflowContainer.innerHTML = '';

    // Check if we need to show "Create Requirement Workflow"
    // Condition: Not a standard branch AND no active workflow data (or empty blocks)
    // Actually, the requirement says: "对于非标准分支，需要显示按钮「创建需求流程」"
    // But if we already started a workflow on a non-standard branch (e.g. main), we should probably show it?
    // Let's assume if it's not standard, we show the button. 
    // BUT, if the user clicked the button, we should be in a state where we show the blocks.
    // The service returns blocks. If they are all pending/empty, maybe we show the button?
    // Or we rely on a flag? 
    // Let's use a simple heuristic: if it's not a standard branch, we prepend a "Create Workflow" section.
    // If the user clicks it, we might just start rendering the blocks (which are already returned by service).
    // Wait, if it's not a standard branch, the service returns initial blocks.
    // So we should check if the user has "started" it. 
    // Let's check if the first block has data or if we are in a "started" mode.
    // For simplicity: If not standard branch, show button. If button clicked, hide button and show blocks.
    // We can use a local state for this "started" flag if not persisted.
    // Or better: check if any block has status 'completed' or data.

    const hasProgress = data.blocks.some(b => b.status === 'completed' || b.data);
    const isStandard = git && git.isStandardBranch;

    if (!isStandard && !hasProgress) {
      renderCreateWorkflowButton();
      return;
    }

    // Render Blocks
    const timeline = document.createElement('div');
    timeline.className = 'workflow-timeline';

    data.blocks.forEach((block, index) => {
      if (!block.isVisible) return;

      const blockEl = document.createElement('div');
      blockEl.className = `workflow-block ${block.status}`;
      blockEl.dataset.id = block.id;

      // Header
      const header = document.createElement('div');
      header.className = 'block-header';

      const title = document.createElement('span');
      title.className = 'block-title';
      title.textContent = `${index + 1}. ${block.title}`;
      if (block.required) title.classList.add('required');

      const statusBadge = document.createElement('span');
      statusBadge.className = `status-badge ${block.status}`;
      statusBadge.textContent = getStatusLabel(block.status);

      header.appendChild(title);
      header.appendChild(statusBadge);
      blockEl.appendChild(header);

      // Content
      const content = document.createElement('div');
      content.className = 'block-content';

      if (block.description) {
        const desc = document.createElement('p');
        desc.className = 'block-desc';
        desc.textContent = block.description;
        content.appendChild(desc);
      }

      switch (block.type) {
        case 'input':
        case 'number':
          renderInputBlock(content, block, git);
          break;
        case 'toggle':
          renderToggleBlock(content, block, git);
          break;
        case 'complex':
          renderComplexBlock(content, block, git);
          break;
      }

      blockEl.appendChild(content);
      timeline.appendChild(blockEl);
    });

    workflowContainer.appendChild(timeline);
  }

  function renderCreateWorkflowButton() {
    const container = document.createElement('div');
    container.className = 'create-workflow-container';

    const btn = document.createElement('button');
    btn.className = 'create-workflow-btn';
    btn.textContent = '创建需求流程';
    btn.addEventListener('click', () => {
      // We can just reload with a flag, or simply start rendering blocks.
      // Since blocks are already there (just hidden/empty), we can just force render them?
      // Actually, the service returns them. 
      // We might need to "initialize" it on the backend?
      // Or just by saving the first empty block, we "start" it?
      // Let's just render the blocks immediately by calling renderWorkflow with the same data 
      // but bypassing this check? 
      // No, we need to persist that we started.
      // Let's just render the blocks. The user will fill the first one and save, which persists progress.
      // We need to manually trigger a re-render or just hide the button and show blocks.
      // But we need 'data' to render blocks. We have it.
      // So:
      workflowContainer.innerHTML = '';
      // We need to pass the data we had. We can store it in a global variable 'workflowData' (already exists).
      // But we need to bypass the check.
      // Let's set a flag on the data or locally.
      // Hack: just set a dummy data on first block to trigger "hasProgress"? No.
      // Let's just render the timeline directly.
      // We need to access 'workflowData' and 'gitInfo' which are global.
      renderWorkflowBlocks(workflowData, gitInfo);
    });

    container.appendChild(btn);
    workflowContainer.appendChild(container);
  }

  // Helper to render blocks directly (skipping the check)
  function renderWorkflowBlocks(data, git) {
    // Reuse the logic inside renderWorkflow but without the check
    // Refactoring renderWorkflow to separate the check
    // ... For now, let's just copy-paste the rendering part or restructure.
    // Let's restructure renderWorkflow slightly in the next step or just inline it here.
    // Actually, I can just set a flag `forceShow`?
    // Let's just call renderWorkflow with a flag? No, signature fixed.
    // Let's just manually render here.

    const timeline = document.createElement('div');
    timeline.className = 'workflow-timeline';

    data.blocks.forEach((block, index) => {
      if (!block.isVisible) return;
      // ... (Same rendering logic as above)
      // To avoid duplication, I should extract `createBlockElement`.
      const blockEl = createBlockElement(block, index, git);
      timeline.appendChild(blockEl);
    });
    workflowContainer.appendChild(timeline);
  }

  function createBlockElement(block, index, git) {
    const blockEl = document.createElement('div');
    blockEl.className = `workflow-block ${block.status}`;
    blockEl.dataset.id = block.id;

    // Header
    const header = document.createElement('div');
    header.className = 'block-header';

    const title = document.createElement('span');
    title.className = 'block-title';
    title.textContent = `${index + 1}. ${block.title}`;
    if (block.required) title.classList.add('required');

    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${block.status}`;
    statusBadge.textContent = getStatusLabel(block.status);

    header.appendChild(title);
    header.appendChild(statusBadge);
    blockEl.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'block-content';

    if (block.description) {
      const desc = document.createElement('p');
      desc.className = 'block-desc';
      desc.textContent = block.description;
      content.appendChild(desc);
    }

    switch (block.type) {
      case 'input':
      case 'number':
        renderInputBlock(content, block, git);
        break;
      case 'toggle':
        renderToggleBlock(content, block, git);
        break;
      case 'complex':
        renderComplexBlock(content, block, git);
        break;
    }

    blockEl.appendChild(content);
    return blockEl;
  }

  function renderInputBlock(container, block, git) {
    const input = document.createElement('input');
    input.type = block.type === 'number' ? 'number' : 'text';
    input.value = block.data || '';
    input.placeholder = block.placeholder || '';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.className = 'save-btn';
    saveBtn.addEventListener('click', () => {
      vscode.postMessage({
        type: 'saveWorkflowStep',
        branch: git.currentBranch,
        blockId: block.id,
        data: input.value
      });
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';
    wrapper.appendChild(input);
    wrapper.appendChild(saveBtn);
    container.appendChild(wrapper);
  }

  function renderToggleBlock(container, block, git) {
    const label = document.createElement('label');
    label.className = 'toggle-switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = !!block.data;
    input.addEventListener('change', () => {
      vscode.postMessage({
        type: 'saveWorkflowStep',
        branch: git.currentBranch,
        blockId: block.id,
        data: input.checked
      });
    });

    const slider = document.createElement('span');
    slider.className = 'slider round';

    label.appendChild(input);
    label.appendChild(slider);
    container.appendChild(label);
  }

  function renderComplexBlock(container, block, git) {
    // Development Block
    if (block.id === 'development') {
      if (!git.isStandardBranch) {
        const btn = document.createElement('button');
        btn.textContent = '生成需求分支';
        btn.className = 'action-btn primary';
        btn.addEventListener('click', () => {
          // We need PRD title and Meegle ID
          // We assume they are in previous blocks (prd, meegleId)
          // We can access them from global `workflowData`
          const prdBlock = workflowData.blocks.find(b => b.id === 'prd');
          const idBlock = workflowData.blocks.find(b => b.id === 'meegleId');

          if (prdBlock && idBlock && prdBlock.data && idBlock.data) {
            // Fetch title first
            vscode.postMessage({
              type: 'fetchPrdTitle',
              url: prdBlock.data
            });
            // We need to wait for title? 
            // The backend will send 'prdTitleFetched' message.
            // We should handle that.
            // For now, let's just trigger the fetch and handle the response in message listener.
            // But we need to know it's for branch generation.
            // Let's store a pending state?
            window.pendingBranchGen = { meegleId: idBlock.data };
          } else {
            // Alert user
            vscode.postMessage({ type: 'error', message: '请先填写 PRD 链接和 Meegle ID' });
          }
        });
        container.appendChild(btn);
      } else {
        // Standard Branch: Show Git Ops
        const actions = [
          { id: 'commit', label: '生成 Commit Log' },
          { id: 'push', label: '推代码' },
          { id: 'sync', label: '同步 Master' }
        ];

        const group = document.createElement('div');
        group.className = 'btn-group';

        actions.forEach(action => {
          const btn = document.createElement('button');
          btn.textContent = action.label;
          btn.className = 'action-btn';
          btn.addEventListener('click', () => {
            vscode.postMessage({
              type: 'gitOperation',
              operation: action.id
            });
          });
          group.appendChild(btn);
        });
        container.appendChild(group);
      }
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case 'pending': return '待完成';
      case 'completed': return '已完成';
      default: return status;
    }
  }

  function renderUiLocaleSwitcher(locales) {
    if (!uiLocaleSwitcher) {
      return;
    }
    const availableLocales = Array.isArray(locales) && locales.length > 0 ? locales : ['zh-CN', 'en-US'];
    uiLocaleSwitcher.innerHTML = '';
    availableLocales.forEach((locale) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'locale-button';
      button.dataset.locale = locale;
      button.textContent = locale === 'zh-CN' ? 'Cn' : 'En';
      button.classList.toggle('active', locale === currentLocale);
      button.addEventListener('click', () => {
        if (locale === currentLocale) {
          return;
        }
        vscode.postMessage({ type: 'switchLocale', language: locale });
      });
      uiLocaleSwitcher.appendChild(button);
    });
  }

  function updateAuthBadges(authorizations) {
    if (!authBadges) {
      return;
    }
    authBadges.innerHTML = '';
    authorizations.forEach((item) => {
      const badge = document.createElement('div');
      badge.className = 'auth-badge';
      badge.classList.toggle('active', item.authorized);
      badge.title = item.name;

      const icon = document.createElement('img');
      icon.src = item.iconPath;
      icon.alt = item.name;
      badge.appendChild(icon);

      authBadges.appendChild(badge);
    });
  }

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'initialData':
        applyTranslations(message.uiText, message.locale);
        applyTheme(message.theme);
        renderUiLocaleSwitcher(message.availableLocales);
        renderDocList(message.docs || []);
        renderInstructions(message.instructions || []);
        updateAuthBadges(message.authorizations || []);

        gitInfo = message.gitInfo;
        workflowData = message.workflowData;
        if (gitInfo && workflowData) {
          renderWorkflow(workflowData, gitInfo);
        }
        break;
      case 'workflowUpdated':
        workflowData = message.workflow;
        if (gitInfo && workflowData) {
          renderWorkflow(workflowData, gitInfo);
        }
        break;
      case 'gitInfoUpdated':
        gitInfo = message.gitInfo;
        if (gitInfo && workflowData) {
          renderWorkflow(workflowData, gitInfo);
        }
        break;
      case 'prdTitleFetched':
        if (window.pendingBranchGen) {
          const { meegleId } = window.pendingBranchGen;
          const prdTitle = message.title;
          // Trigger branch generation
          vscode.postMessage({
            type: 'generateBranch',
            meegleId: meegleId,
            prdTitle: prdTitle
          });
          delete window.pendingBranchGen;
        }
        break;
      case 'themeChanged':
        applyTheme(message.theme);
        break;
      default:
        break;
    }
  });

  vscode.postMessage({ type: 'requestInitialData' });
})();
