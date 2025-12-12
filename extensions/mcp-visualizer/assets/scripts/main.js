(function () {
  const vscode = acquireVsCodeApi();
  let persistedState = vscode.getState() || {};

  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-content'));
  const mcpList = document.getElementById('mcpList');
  const instructionList = document.getElementById('instructionList');
  const workflowContainer = document.getElementById('workflowContainer');
  const uiLocaleSwitcher = document.getElementById('uiLocaleSwitcher');

  let docs = [];
  let currentLocale = persistedState.locale || 'zh-CN';
  let uiText = persistedState.uiText || null;
  let gitInfo = null;
  let workflowData = null;
  let releaseBranches = [];
  let branchBlocked = false;
  let baseBranchChoice = 'master';

  const stepOrder = ['basic', 'development', 'testing', 'acceptance', 'release'];

  function updateState(patch) {
    persistedState = { ...persistedState, ...patch };
    vscode.setState(persistedState);
  }

  function getText(path) {
    if (!uiText) return '';
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), uiText) || '';
  }

  function applyTranslations(text, locale) {
    if (text) uiText = text;
    if (locale) currentLocale = locale;
    if (uiText) updateState({ uiText, locale: currentLocale });
    document.documentElement.lang = currentLocale;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      const value = getText(key);
      if (value) node.textContent = value;
    });

    updateLocaleButtons();
  }

  function updateLocaleButtons() {
    if (!uiLocaleSwitcher) return;
    Array.from(uiLocaleSwitcher.querySelectorAll('.locale-button')).forEach((button) => {
      button.classList.toggle('active', button.dataset.locale === currentLocale);
    });
  }

  function applyTheme(theme) {
    if (!theme) return;
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
    button.addEventListener('click', () => switchTab(button.dataset.target));
  });

  function renderUiLocaleSwitcher(locales) {
    if (!uiLocaleSwitcher) return;
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
        if (locale === currentLocale) return;
        vscode.postMessage({ type: 'switchLocale', language: locale });
      });
      uiLocaleSwitcher.appendChild(button);
    });
  }

  function renderDocList(docEntries) {
    docs = docEntries;
    if (!mcpList) return;
    mcpList.innerHTML = '';

    if (docEntries.length === 0) {
      const empty = document.createElement('p');
      empty.style.gridColumn = '1/-1';
      empty.style.textAlign = 'center';
      empty.style.color = 'var(--vscode-descriptionForeground)';
      empty.textContent = 'No MCPs found.';
      mcpList.appendChild(empty);
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
    list.className = 'instruction-grid';
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

  function isDevelopmentBranch() {
    return gitInfo && gitInfo.branchType === 'development';
  }

  // 渲染整体研发流程视图
  function renderWorkflow() {
    if (!workflowContainer || !workflowData || !gitInfo) return;
    workflowContainer.innerHTML = '';

    if (!isDevelopmentBranch() && !workflowData.startedFromNonDev) {
      renderStartButton();
      return;
    }

    renderStepper();
    const currentStage = workflowData.stages.find((item) => item.id === workflowData.activeStage) || workflowData.stages[0];
    renderStage(currentStage);
  }

  function renderStartButton() {
    const wrapper = document.createElement('div');
    wrapper.className = 'create-workflow-container';
    const btn = document.createElement('button');
    btn.className = 'create-workflow-btn';
    btn.textContent = '开始新的研发周期';
    btn.addEventListener('click', () => {
      vscode.postMessage({ type: 'startWorkflow', branch: gitInfo.currentBranch });
    });
    wrapper.appendChild(btn);
    workflowContainer.appendChild(wrapper);
  }

  // 顶部阶段导航
  function renderStepper() {
    const list = document.createElement('div');
    list.className = 'workflow-timeline';
    workflowData.stages.forEach((stage) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      if (stage.status === 'completed') item.classList.add('completed');
      if (stage.id === workflowData.activeStage) item.classList.add('active');
      const marker = document.createElement('div');
      marker.className = `timeline-marker ${stage.status}`;
      item.appendChild(marker);
      const card = document.createElement('div');
      card.className = 'workflow-block';
      const title = document.createElement('div');
      title.className = 'block-title';
      title.textContent = stage.title;
      card.appendChild(title);
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.textContent = '查看';
      btn.addEventListener('click', () => setActiveStage(stage.id));
      card.appendChild(btn);
      item.appendChild(card);
      list.appendChild(item);
    });
    workflowContainer.appendChild(list);
  }

  function setActiveStage(stageId) {
    workflowData.activeStage = stageId;
    renderWorkflow();
  }

  // 渲染当前阶段内容
  function renderStage(stage) {
    const panel = document.createElement('div');
    panel.className = 'workflow-panel';

    const title = document.createElement('h3');
    title.textContent = stage.title;
    panel.appendChild(title);

    if (stage.id === 'basic') {
      panel.appendChild(renderBasicForm(stage));
    } else {
      panel.appendChild(renderStageActions(stage));
    }

    workflowContainer.appendChild(panel);
  }

  function renderBasicForm(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'basic-form';

    stage.fields.forEach((field) => {
      const row = document.createElement('div');
      row.className = 'input-wrapper';
      const label = document.createElement('label');
      label.textContent = `${field.label}${field.required ? ' *' : ''}`;
      const input = document.createElement('input');
      input.type = field.type === 'number' ? 'number' : 'text';
      input.value = field.value || '';
      input.placeholder = field.label;
      input.addEventListener('input', () => (field.value = input.value));
      row.appendChild(label);
      row.appendChild(input);
      wrapper.appendChild(row);
    });

    if (!isDevelopmentBranch()) {
      const selectWrapper = document.createElement('div');
      selectWrapper.className = 'input-wrapper';
      const label = document.createElement('label');
      label.textContent = '基准分支';
      const select = document.createElement('select');
      ['master', 'main', gitInfo.currentBranch].forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        if (name === baseBranchChoice) option.selected = true;
        select.appendChild(option);
      });
      select.addEventListener('change', (e) => {
        baseBranchChoice = e.target.value;
      });
      selectWrapper.appendChild(label);
      selectWrapper.appendChild(select);
      wrapper.appendChild(selectWrapper);
    }

    const btnRow = document.createElement('div');
    btnRow.className = 'btn-group';

    if (!isDevelopmentBranch()) {
      const createBtn = document.createElement('button');
      createBtn.className = 'action-btn primary';
      createBtn.textContent = '创建&生成开发分支';
      createBtn.addEventListener('click', () => handleBranchRequest(stage));
      btnRow.appendChild(createBtn);

      if (branchBlocked) {
        const stashBtn = document.createElement('button');
        stashBtn.className = 'action-btn';
        stashBtn.textContent = 'Stash 暂存';
        stashBtn.addEventListener('click', () => vscode.postMessage({ type: 'stashAndCreate' }));
        const resetBtn = document.createElement('button');
        resetBtn.className = 'action-btn danger';
        resetBtn.textContent = '强制清除代码更新';
        resetBtn.addEventListener('click', () => vscode.postMessage({ type: 'resetAndCreate' }));
        btnRow.appendChild(stashBtn);
        btnRow.appendChild(resetBtn);
      }
    } else {
      const saveBtn = document.createElement('button');
      saveBtn.className = 'action-btn primary';
      saveBtn.textContent = '保存&下一步';
      saveBtn.addEventListener('click', () => saveBasic(stage));
      btnRow.appendChild(saveBtn);
    }

    wrapper.appendChild(btnRow);
    return wrapper;
  }

  // 通用阶段操作面板
  function renderStageActions(stage) {
    const wrapper = document.createElement('div');
    wrapper.className = 'stage-actions';

    const desc = document.createElement('p');
    desc.textContent = '完成当前阶段后才可进入下一步。';
    wrapper.appendChild(desc);

    if (stage.status !== 'completed') {
      const submitBtn = document.createElement('button');
      submitBtn.className = 'action-btn primary';
      submitBtn.textContent = '提交&下一步';
      submitBtn.addEventListener('click', () => completeStage(stage.id));
      wrapper.appendChild(submitBtn);
    } else {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'action-btn';
      nextBtn.textContent = '下一步';
      nextBtn.addEventListener('click', () => jumpNext(stage.id));
      wrapper.appendChild(nextBtn);
    }

    if (stage.id === 'release') {
      const select = document.createElement('select');
      select.className = 'branch-select';
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = '选择 release 分支';
      select.appendChild(empty);
      releaseBranches.forEach((name) => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
      });
      wrapper.appendChild(select);
      const mergeBtn = document.createElement('button');
      mergeBtn.className = 'action-btn primary';
      mergeBtn.textContent = '关联并合并';
      mergeBtn.disabled = true;
      select.addEventListener('change', () => {
        mergeBtn.disabled = !select.value;
      });
      mergeBtn.addEventListener('click', () => completeStage(stage.id));
      wrapper.appendChild(mergeBtn);
    }

    return wrapper;
  }

  function validateBasic(stage) {
    const prd = stage.fields.find((f) => f.id === 'prd');
    const meegle = stage.fields.find((f) => f.id === 'meegleId');
    const linkPattern = /^(http|https):\/\/[^\s]+$/;
    if (!prd?.value || !linkPattern.test(prd.value)) return false;
    if (!meegle?.value) return false;
    const optionalLinks = stage.fields.filter((f) => f.required === false && f.value);
    return optionalLinks.every((f) => linkPattern.test(f.value));
  }

  function saveBasic(stage) {
    if (!validateBasic(stage)) {
      window.alert('请完成必填项且提供有效链接');
      return;
    }
    stage.fields.forEach((field) => {
      vscode.postMessage({
        type: 'saveField',
        branch: gitInfo.currentBranch,
        stageId: stage.id,
        fieldId: field.id,
        data: field.value || '',
      });
    });
    completeStage(stage.id);
  }

  function handleBranchRequest(stage) {
    if (!validateBasic(stage)) {
      window.alert('请完成必填项且提供有效链接');
      return;
    }
    const prd = stage.fields.find((f) => f.id === 'prd');
    const meegle = stage.fields.find((f) => f.id === 'meegleId');
    const brief = extractBrief(prd.value);
    branchBlocked = false;
    stage.fields.forEach((field) => {
      vscode.postMessage({
        type: 'saveField',
        branch: gitInfo.currentBranch,
        stageId: stage.id,
        fieldId: field.id,
        data: field.value || '',
      });
    });
    vscode.postMessage({
      type: 'createDevBranch',
      baseBranch: baseBranchChoice,
      meegleId: meegle.value,
      prdBrief: brief,
    });
  }

  function extractBrief(url) {
    try {
      const parts = new URL(url).pathname.split('/').filter(Boolean);
      return parts.pop() || 'feature';
    } catch (e) {
      return 'feature';
    }
  }

  function completeStage(stageId) {
    vscode.postMessage({ type: 'completeStage', branch: gitInfo.currentBranch, stageId });
  }

  function jumpNext(stageId) {
    const currentIndex = stepOrder.indexOf(stageId);
    const next = stepOrder[currentIndex + 1];
    if (next) setActiveStage(next);
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
        gitInfo = message.gitInfo;
        workflowData = message.workflowData;
        releaseBranches = message.releaseBranches || [];
        renderWorkflow();
        break;
      case 'workflowUpdated':
        workflowData = message.workflow;
        renderWorkflow();
        break;
      case 'gitInfoUpdated':
        gitInfo = message.gitInfo;
        workflowData = message.workflow;
        renderWorkflow();
        break;
      case 'branchBlocked':
        branchBlocked = true;
        renderWorkflow();
        break;
      case 'branchCreated':
        branchBlocked = false;
        gitInfo = message.gitInfo;
        workflowData = message.workflow;
        renderWorkflow();
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
