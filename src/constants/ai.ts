export const CLAUDE_MODEL = 'claude-haiku-4-5-20251001'
export const CODEX_MODEL = 'gpt-6-sol'
export const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages'
export const CLAUDE_TIMEOUT_MS = 15000
export const CODEX_TIMEOUT_MS = 90000
export const MAX_AI_RESPONSE_BYTES = 1024 * 1024
export const AI_USER_MINUTE_LIMIT = 5
export const AI_USER_DAY_LIMIT = 30
export const AI_APP_DAY_LIMIT = 100

export const CODEX_DISABLED_FEATURES = [
  'shell_tool', 'unified_exec', 'apps', 'plugins', 'remote_plugin', 'hooks',
  'memories', 'multi_agent', 'browser_use', 'computer_use', 'image_generation',
  'in_app_browser', 'in_app_local_automation', 'workspace_dependencies',
  'skill_search', 'skill_mcp_dependency_install', 'view_image', 'goals',
  'code_mode', 'code_mode_host',
] as const
