# context7：Vue 2.x 项目协作提示

- **技术栈**：Vue 2.x + Vuex + Vue Router。
- **代码组织**：
  - 页面组件位于 `src/views`，业务组件位于 `src/components`。
  - 使用 `@` 指向 `src` 目录，避免相对路径过长。
- **状态管理**：
  - Vuex 模块化，命名空间需开启 `namespaced: true`。
  - mutation 与 action 使用 `SNAKE_CASE`，统一管理常量。
- **构建约定**：
  - webpack 配置位于 `build/`，通过 `npm run build --report` 查看打包分析。
  - 环境变量使用 `.env.*` 文件，严格区分测试、预发、生产。
- **测试建议**：
  - 单元测试使用 `@vue/test-utils`，覆盖关键组件行为。
  - E2E 测试推荐 `cypress`，保证核心流程回归。
