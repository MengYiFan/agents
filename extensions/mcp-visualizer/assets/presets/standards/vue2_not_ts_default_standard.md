# Vue2 项目代码规范（默认模板）

## 目录结构
- `src/components`：通用组件，采用 PascalCase 命名。
- `src/views`：页面级组件，保持目录与路由结构一致。
- `src/services`：接口请求与业务封装，按领域拆分子目录。

## 代码风格
- JavaScript 使用 ESLint 规则集 `eslint-config-airbnb-base`，结合 `prettier` 做格式化。
- 强制使用 `===` 与 `!==`，禁止隐式类型转换。
- Vue 单文件组件模板顺序：`<template>` → `<script>` → `<style scoped>`。
- 组件 props 必须声明类型与默认值，必要时补充注释说明。

## CSS / SCSS
- 推荐使用 `BEM` 命名，避免深层选择器。
- 全局变量、混入统一放置于 `src/styles`，使用 `@use` 或 `@import` 管理。

## Git 提交
- 提交信息遵循 `type(scope): subject` 格式，例如 `feat(user): 支持批量导入`。
- 功能开发以 `feature/` 前缀创建分支，缺陷修复以 `bugfix/` 前缀命名。

> 如需覆盖此模板，可在工作区设置 `mcpVisualizer.instructions.projectStandardMap` 指定自定义内容。
