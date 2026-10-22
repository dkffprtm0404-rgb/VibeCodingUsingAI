import { existsSync, readdirSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export function getCodexCommand(): { command: string; args: string[] } {
  const explicit = process.env.MYSHOP_CODEX_EXECUTABLE
  if (explicit) {
    if (/\.(cmd|bat)$/i.test(explicit)) throw new Error('CODEX_NATIVE_EXECUTABLE_REQUIRED')
    return /\.[cm]?js$/i.test(explicit)
      ? { command: process.execPath, args: [explicit] }
      : { command: explicit, args: [] }
  }

  if (process.platform === 'win32') {
    // 데스크톱 앱이 설치한 CLI도 찾는다. 사용자명과 버전 경로는 고정하지 않는다.
    const local = process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local')
    const binaries = join(local, 'OpenAI', 'Codex', 'bin')
    try {
      const candidates = readdirSync(binaries)
        .map((version) => join(binaries, version, 'codex.exe'))
        .filter((file) => existsSync(file))
        .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
      if (candidates[0]) return { command: candidates[0], args: [] }
    } catch {
      // 데스크톱 앱이 없으면 npm 설치 경로 또는 PATH를 사용한다.
    }
    const roaming = process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming')
    const npmCli = join(roaming, 'npm', 'node_modules', '@openai', 'codex', 'bin', 'codex.js')
    if (existsSync(npmCli)) return { command: process.execPath, args: [npmCli] }
  }
  return { command: 'codex', args: [] }
}
