# Mastra Agents 项目

此仓库是在离线环境中脚手架生成的 Mastra 项目示例，包含示例代理与配置文件，便于在恢复依赖后快速开始开发。

## 快速开始

1. 安装依赖（需要访问 npm registry）：
   ```bash
   npm install
   ```
2. 启动 Mastra 开发服务器：
   ```bash
   npm run dev
   ```
3. 构建项目：
   ```bash
   npm run build
   ```
4. 运行编译后的产物：
   ```bash
   npm start
   ```

## 项目结构

- `mastra.config.ts` —— Mastra 运行时配置。
- `src/agents` —— 示例代理定义，包括读取 Markdown 提示词文件的提示库代理。
- `src/index.ts` —— 将代理注册到 Mastra 的入口文件。
- `prompts` —— 被提示库代理读取的 Markdown 提示词定义。

> **注意：** 使用 `npx mastra@latest init` 初始化项目需要联网下载 CLI。本环境无法执行该命令，因此仓库手动还原了默认的项目结构。

## 开发与调试

1. **安装依赖**：在能够访问网络时执行 `npm install`，将 TypeScript 与 Mastra 所需的依赖下载到本地。
2. **编写时进行类型检查**：运行 `npx tsc --noEmit` 进行一次性检查，或使用 `npx tsc --watch` 持续监听文件变更，从而在运行代理之前先发现 TypeScript 错误。
3. **启动 Mastra 开发服务器**：通过 `npm run dev` 启动 `mastra dev`。当你修改 `src/` 下的文件时，服务器会自动热重载，并在依赖安装完成后提供 Mastra UI 或 HTTP 接口以调用代理。
4. **运行编译产物**：先执行 `npm run build`，再运行 `npm start`，以启动 `dist/` 目录中的编译输出。这与生产环境的运行方式一致。
5. **使用 Node.js 调试**：完成构建后，通过 `node --inspect-brk dist/index.js` 以调试模式启动应用，随后在你喜欢的调试工具（如 Chrome DevTools、VS Code 等）中附加调试器，逐步排查代理逻辑。
6. **添加日志**：在代理处理器（例如 `src/agents/*.ts`）中插入 `console.log`，记录执行过程。无论使用 `npm run dev` 还是 `npm start`，终端都会显示这些日志。

## 在 VS Code 中使用代理

1. **打开工作区**：启动 VS Code，选择「文件 → 打开文件夹…」，加载此仓库以便编辑器识别 TypeScript 源码与相关配置。
2. **安装常用扩展**：VS Code 自带的 TypeScript 功能已能满足基本需求，但建议额外启用「ESLint」与「Prettier - Code formatter」等扩展，以便在编写代理时及时发现格式或语法问题。
3. **使用集成终端运行命令**：通过「终端 → 新建终端」执行 `npm install`、`npm run dev` 或 `npx tsc --watch` 等命令，将运行输出与代码标签页放在同一界面。
4. **创建调试配置**：打开「运行和调试」面板，新增 `launch.json` 并填入类似的 Node.js 配置：
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Mastra Dev Server",
     "runtimeExecutable": "npm",
     "runtimeArgs": ["run", "dev"],
     "console": "integratedTerminal"
   }
   ```
   通过该配置启动后，VS Code 会在调试器下运行 `npm run dev`，你可以直接在 `src/` 目录中设置断点。
5. **附加到编译产物**：调试编译后的输出时，先在终端执行 `node --inspect dist/index.js`，再在 VS Code 中使用「Node.js: Attach」模板连接到默认的调试端口（`9229`）。
