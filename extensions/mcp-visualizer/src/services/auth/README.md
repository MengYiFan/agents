# Authorization Services

Utilities in this directory expose the authorization status of external platforms
(Lark, Google Drive, Figma, etc.) so the webview can render proper indicators.

The status lookup currently relies on the `mcpVisualizer.authorizations` workspace
configuration. Each provider id maps to a boolean flag indicating whether the
team already holds the integration credentials.
