# Code Guidelines MCP Usage Guide

The `code-guidelines-mcp` agent automates the creation of a `.rules` document that captures project-specific code standards. It is designed to infer the tech stack from `package.json` so that Nuxt 2, Vue 2, MidwayJS, and Egg.js projects receive tailored recommendations. This guide explains how to run the agent, customize the generated document, and interpret its output.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Mastra development server in another terminal:
   ```bash
   npm run dev
   ```

> **Note:** The offline environment used for this repository does not bundle external dependencies such as `mastra` and `@types/node`. Commands that require them will fail until you install the packages locally.

## Generating or Updating `.rules`

Invoke the `code-guidelines-mcp` agent with the `injectCodeRulesDocument` tool. The following JSON-RPC payload instructs the agent to overwrite an existing `.rules` file after it infers the stack from `package.json`:

```json
{
  "agent": "code-guidelines-mcp",
  "input": "请更新当前项目的代码规范说明文档，允许覆盖旧版本。",
  "tool": {
    "name": "injectCodeRulesDocument",
    "arguments": {
      "overwrite": true
    }
  }
}
```

### Output Fields

- `path` – Absolute path to the `.rules` file created or updated.
- `overwritten` – Indicates whether the file replaced an existing version.
- `detectedTechnologies` – Array of frameworks/libraries discovered in `package.json`.

If no supported dependencies are detected, the agent falls back to a default guideline set that marks each section as “默认推荐”.

## Custom Content

Provide a `customContent` string in the tool arguments to bypass auto-detection and write your own `.rules` body:

```json
{
  "tool": {
    "name": "injectCodeRulesDocument",
    "arguments": {
      "customContent": "# Team Guidelines\n..."
    }
  }
}
```

When `customContent` is supplied, `detectedTechnologies` is omitted because the agent does not read `package.json`.

## Tips

- Commit the generated `.rules` file so teammates share the same standards.
- Re-run the agent after adding new dependencies to ensure the guidance reflects the latest stack.
- Pass `overwrite: false` (default) to keep the existing file intact when you only want detection metadata.
