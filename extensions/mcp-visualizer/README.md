# MCP Visualizer VS Code Extension

> 🚀 Visualize MCP documentation and Git workflow in a single side panel.

Customized for the Mastra MCP project, this extension adds an **MCP Visualizer** view to the VS Code Explorer sidebar, providing two tabs:

1. **MCP List**: Automatically scans the READMEs of MCP features in the current workspace. Click to read in a Webview.
2. **Workflow Guide**: visualized Git workflow (Requirements -> Development -> Test -> Deployment -> Production) with corresponding branch strategies. You can switch states and Git branches directly on the graph.

[简体中文](./README_CN.md)

---

## Features

### MCP Feature List

- Default search paths cover the project root and common locations like `docs/**/README.md`, `packages/**/README.md`.
- Search paths can be customized via the `mcpVisualizer.docSearchPaths` configuration (default includes `docs/extensions/prompts/packages/apps/services/mcp/src`).
- Reads Markdown content using Node.js `fs/promises` and renders it to HTML using `marked`.
- Caches documentation content in the Webview for instant switching.
- Provides the command **"MCP Visualizer: Refresh Indices"** to update the list immediately after adding/deleting READMEs.

### Git Workflow Visualization

- Illustrates the lifecycle of Requirements -> Development -> Test -> Deployment -> Production with a streamlined diagram.
- Each stage node is clickable, showing the required actions and suggested target branches (e.g., `feature/*`, `release/*`, `hotfix/*`) in the side panel.
- Supports interactive actions:
  - **Initialize Workflow**: Start a new feature branch from a clean state.
  - **Development**: Commit changes, create tags, and transition to the next stage.
  - **Release**: Merge feature branches into release branches.
- Lifecycle state switching is reflected in the Webview via a message channel, ensuring the diagram matches the current stage.

---

## Architecture

This extension follows a modular architecture:

### Frontend (`webview-ui`)

- Built with **React** and **Ant Design**.
- **Modular Structure**:
  - `modules/workflow/`: Contains the core workflow logic.
  - `components/`: Reusable UI components (`WorkflowInitView`, `WorkflowDevView`, `WorkflowStepContent`).
  - `hooks/`: Custom hooks like `useWorkflowActions` for logic encapsulation.

### Backend (`src`)

- **Service-Oriented**:
  - `WorkflowActionService`: Handles business logic for Git operations (Create Branch, Commit, Transition).
  - `GitService`: Wraps `simple-git` for low-level Git commands.
  - `WorkflowStateManager`: Manages the persistence of workflow context (`.vscode/workflow-context.json`).
- **Controller**: `WebviewController` handles message passing between the Webview and the Extension Host.

---

## Requirements

- Node.js ≥ 18
- npm ≥ 9
- VS Code ≥ 1.84

---

## Installation & Build

1. **Install Dependencies**

   ```bash
   cd extensions/mcp-visualizer
   npm install
   ```

2. **Lint & Format**
   - Run `npm run lint` for ESLint checks.
   - Run `npm run format` for Prettier formatting.

3. **Develop & Debug**
   - Run `npm run watch` to compile the backend.
   - Run `npm run watch:webview` (or `cd webview-ui && npm run dev`) to build the frontend.
   - Press `F5` to start the Extension Development Host.

4. **Package**
   - Install `vsce`: `npm install -g @vscode/vsce`.
   - Build and package:
     ```bash
     npm run compile
     npm run package
     ```

---

## Usage

1. Open a workspace containing MCP features in VS Code.
2. Open the **MCP Visualizer** view in the sidebar.
3. Click any document item to read the README.
4. Switch to the **Workflow** tab:
   - Follow the step-by-step guide to manage your development lifecycle.
   - Use the provided buttons to create branches, commit code, and push changes.

---

## Directory Structure

```
extensions/mcp-visualizer
├── webview-ui/                # React Frontend
│   ├── src/
│   │   ├── modules/
│   │   │   └── workflow/      # Workflow Module (Frontend)
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── WorkflowRenderer.tsx
│   │   └── App.tsx
├── src/                       # Extension Backend
│   ├── modules/
│   │   └── workflow/          # Workflow Module (Backend)
│   │       ├── services/      # Logic Layer (e.g., WorkflowActionService)
│   │       └── WebviewController.ts
│   ├── services/              # Shared Services (Git, etc.)
│   └── extension.ts           # Entry Point
├── package.json
└── README.md
```

---

## Contributing

Pull requests are welcome! Please ensure you run `npm run lint` and `npm run compile` before submitting.
