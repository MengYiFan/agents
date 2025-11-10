(function () {
  const vscode = acquireVsCodeApi();
  let persistedState = vscode.getState() || {};

  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-content'));
  const mcpNav = document.getElementById('mcpNav');
  const mcpContent = document.getElementById('mcpContent');
  const languageSwitcher = document.getElementById('languageSwitcher');
  const instructionList = document.getElementById('instructionList');
  const workflowSteps = document.getElementById('workflowSteps');
  const authBadges = document.getElementById('authBadges');

  let docs = [];
  let currentDocId = persistedState.selectedDocId || null;
  let currentLanguage = persistedState.selectedLanguage || null;
  const workflowState = persistedState.workflowValues || {};

  function updateState(patch) {
    persistedState = { ...persistedState, ...patch };
    vscode.setState(persistedState);
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
    mcpNav.innerHTML = '';
    docEntries.forEach((doc) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'mcp-item';
      item.textContent = doc.title;
      item.dataset.id = doc.id;
      if (doc.description) {
        item.title = doc.description;
      }
      item.addEventListener('click', () => {
        selectDoc(doc.id, doc.defaultLanguage);
      });
      mcpNav.appendChild(item);
    });
  }

  function renderLanguageOptions(doc) {
    languageSwitcher.innerHTML = '';
    doc.languages.forEach((lang) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'language-button';
      button.dataset.language = lang.language;
      button.textContent = lang.label;
      const isActive = lang.language === currentLanguage;
      button.classList.toggle('active', isActive);
      button.disabled = doc.languages.length === 1;
      button.addEventListener('click', () => {
        if (currentLanguage === lang.language) {
          return;
        }
        currentLanguage = lang.language;
        updateState({ selectedLanguage: currentLanguage });
        updateLanguageActive();
        requestDocContent(doc.id, currentLanguage);
      });
      languageSwitcher.appendChild(button);
    });
  }

  function updateLanguageActive() {
    Array.from(languageSwitcher.querySelectorAll('.language-button')).forEach((button) => {
      button.classList.toggle('active', button.dataset.language === currentLanguage);
    });
  }

  function highlightDocItem(docId) {
    Array.from(document.querySelectorAll('.mcp-item')).forEach((item) => {
      item.classList.toggle('active', item.dataset.id === docId);
    });
  }

  function requestDocContent(docId, language) {
    vscode.postMessage({ type: 'openDoc', docId, language });
  }

  function selectDoc(docId, language) {
    const doc = docs.find((item) => item.id === docId);
    if (!doc) {
      return;
    }
    currentDocId = docId;
    currentLanguage = language || doc.defaultLanguage;
    updateState({ selectedDocId: currentDocId, selectedLanguage: currentLanguage });
    highlightDocItem(docId);
    renderLanguageOptions(doc);
    requestDocContent(docId, currentLanguage);
  }

  function renderInstructions(instructions) {
    instructionList.innerHTML = '';
    instructions.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'instruction-item';

      const title = document.createElement('h3');
      title.textContent = item.title;
      card.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = item.description;
      card.appendChild(desc);

      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'instruction-action';
      action.textContent = item.actionLabel;
      action.addEventListener('click', () => {
        vscode.postMessage({ type: 'executeInstruction', instructionId: item.id });
      });
      card.appendChild(action);

      instructionList.appendChild(card);
    });
  }

  function renderWorkflow(steps) {
    workflowSteps.innerHTML = '';
    steps.forEach((step, index) => {
      const item = document.createElement('li');
      item.className = 'workflow-step';
      item.dataset.step = step.id;

      const header = document.createElement('div');
      header.className = 'step-header';

      const badge = document.createElement('span');
      badge.className = 'step-index';
      badge.textContent = String(index + 1).padStart(2, '0');
      header.appendChild(badge);

      const title = document.createElement('h3');
      title.textContent = step.title;
      header.appendChild(title);

      if (step.optional) {
        const optionalLabel = document.createElement('span');
        optionalLabel.className = 'step-optional';
        optionalLabel.textContent = '可选';
        header.appendChild(optionalLabel);
      }

      item.appendChild(header);

      const description = document.createElement('p');
      description.className = 'step-description';
      description.textContent = step.description;
      item.appendChild(description);

      if (step.type === 'link') {
        item.appendChild(createLinkInput(step));
      } else if (step.type === 'diagram') {
        item.appendChild(createDiagramSection());
      } else if (step.type === 'notes') {
        item.appendChild(createNotesSection(step));
      }

      workflowSteps.appendChild(item);
    });

    attachStageListeners();
    attachBranchListeners();
  }

  function createLinkInput(step) {
    const wrapper = document.createElement('div');
    wrapper.className = 'workflow-input';

    const input = document.createElement('input');
    input.type = 'url';
    input.placeholder = step.placeholder || 'https://';
    input.value = workflowState[step.id] || '';
    input.addEventListener('input', () => {
      workflowState[step.id] = input.value;
      updateState({ workflowValues: workflowState });
    });

    wrapper.appendChild(input);
    return wrapper;
  }

  function createNotesSection(step) {
    const wrapper = document.createElement('div');
    wrapper.className = 'workflow-notes';

    const casesField = document.createElement('textarea');
    casesField.placeholder = '测试用例覆盖情况';
    casesField.value = workflowState[`${step.id}:cases`] || '';
    casesField.addEventListener('input', () => {
      workflowState[`${step.id}:cases`] = casesField.value;
      updateState({ workflowValues: workflowState });
    });

    const archiveField = document.createElement('textarea');
    archiveField.placeholder = '归档说明、上线记录';
    archiveField.value = workflowState[`${step.id}:archive`] || '';
    archiveField.addEventListener('input', () => {
      workflowState[`${step.id}:archive`] = archiveField.value;
      updateState({ workflowValues: workflowState });
    });

    wrapper.appendChild(casesField);
    wrapper.appendChild(archiveField);
    return wrapper;
  }

  function createDiagramSection() {
    const template = document.getElementById('gitWorkflowDiagram');
    if (!template) {
      return document.createElement('div');
    }
    return template.content.cloneNode(true);
  }

  function updateStageInfo(stage) {
    if (!stage) {
      return;
    }
    const title = document.getElementById('stageTitle');
    const desc = document.getElementById('stageDesc');
    const branchList = document.getElementById('stageBranches');
    if (!title || !desc || !branchList) {
      return;
    }
    title.textContent = stage.name;
    desc.textContent = stage.description;
    branchList.innerHTML = '';
    stage.recommendedBranches.forEach((branch) => {
      const li = document.createElement('li');
      li.textContent = branch;
      branchList.appendChild(li);
    });
  }

  function attachStageListeners() {
    document.querySelectorAll('.stage-node').forEach((node) => {
      node.addEventListener('click', () => {
        const stageId = node.getAttribute('data-stage');
        document.querySelectorAll('.stage-node').forEach((el) => el.classList.remove('active'));
        node.classList.add('active');
        vscode.postMessage({ type: 'switchStage', stageId });
      });
    });
  }

  function attachBranchListeners() {
    document.querySelectorAll('.branch-node').forEach((node) => {
      node.addEventListener('click', () => {
        const branch = node.getAttribute('data-branch');
        document.querySelectorAll('.branch-node').forEach((el) => el.classList.remove('active'));
        node.classList.add('active');
        vscode.postMessage({ type: 'checkoutBranch', branch });
      });
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

      const icon = document.createElement('img');
      icon.src = item.iconPath;
      icon.alt = item.name;
      badge.appendChild(icon);

      const label = document.createElement('span');
      label.textContent = item.name;
      badge.appendChild(label);

      authBadges.appendChild(badge);
    });
  }

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'initialData':
        renderDocList(message.docs || []);
        renderInstructions(message.instructions || []);
        renderWorkflow(message.workflow || []);
        updateAuthBadges(message.authorizations || []);
        {
          const persistedDoc = docs.find((doc) => doc.id === currentDocId);
          if (persistedDoc) {
            const language =
              currentLanguage && persistedDoc.languages.some((lang) => lang.language === currentLanguage)
                ? currentLanguage
                : persistedDoc.defaultLanguage;
            selectDoc(persistedDoc.id, language);
          } else if (message.initialDocId) {
            selectDoc(message.initialDocId, message.initialLanguage);
            if (message.initialContent && mcpContent) {
              mcpContent.innerHTML = message.initialContent;
            }
          } else if (docs[0]) {
            selectDoc(docs[0].id, docs[0].defaultLanguage);
          }
        }
        break;
      case 'docContent':
        if (currentDocId === message.id && mcpContent) {
          currentLanguage = message.language || currentLanguage;
          updateState({ selectedLanguage: currentLanguage });
          updateLanguageActive();
          mcpContent.innerHTML = message.html;
        }
        break;
      case 'stageInfo':
        updateStageInfo(message.stage);
        break;
      default:
        break;
    }
  });

  vscode.postMessage({ type: 'requestInitialData' });
})();
