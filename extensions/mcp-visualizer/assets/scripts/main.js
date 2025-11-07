(function () {
  const vscode = acquireVsCodeApi();
  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-content'));
  const mcpNav = document.getElementById('mcpNav');
  const mcpContent = document.getElementById('mcpContent');
  let currentDocId = null;

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

  function renderDocList(docs) {
    mcpNav.innerHTML = '';
    docs.forEach((doc) => {
      const item = document.createElement('div');
      item.className = 'mcp-item';
      item.textContent = doc.title;
      item.dataset.id = doc.id;
      if (doc.description) {
        item.title = doc.description;
      }
      item.addEventListener('click', () => {
        if (currentDocId === doc.id) {
          return;
        }
        currentDocId = doc.id;
        vscode.postMessage({ type: 'openDoc', id: doc.id });
        document.querySelectorAll('.mcp-item').forEach((el) => el.classList.remove('active'));
        item.classList.add('active');
      });
      mcpNav.appendChild(item);
    });
  }

  function updateStageInfo(stage) {
    if (!stage) {
      return;
    }
    document.getElementById('stageTitle').textContent = stage.name;
    document.getElementById('stageDesc').textContent = stage.description;
    const branchList = document.getElementById('stageBranches');
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

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'docs':
        renderDocList(message.docs);
        if (message.initialDocId) {
          currentDocId = message.initialDocId;
          const active = Array.from(document.querySelectorAll('.mcp-item')).find(
            (item) => item.dataset.id === currentDocId,
          );
          if (active) {
            active.classList.add('active');
          }
        }
        if (message.initialContent) {
          mcpContent.innerHTML = message.initialContent;
        }
        break;
      case 'docContent':
        if (currentDocId === message.id) {
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

  vscode.postMessage({ type: 'requestDocs' });
  attachStageListeners();
  attachBranchListeners();
})();
