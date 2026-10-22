import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileFunction } from 'node:vm'
import ts from 'typescript'

const projectRoot = fileURLToPath(new URL('../../', import.meta.url))

// Compile project TypeScript in memory; external packages use Node's real loader.
export function createTypeScriptLoader() {
  const cache = new Map()

  function load(relativePath) {
    const filename = resolve(projectRoot, relativePath)
    if (cache.has(filename)) return cache.get(filename).exports

    const loadedModule = { exports: {} }
    cache.set(filename, loadedModule)
    const nativeRequire = createRequire(filename)
    const requireModule = (specifier) => specifier.startsWith('@/')
      ? load(`src/${specifier.slice(2)}.ts`)
      : nativeRequire(specifier)
    const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
      fileName: filename,
      compilerOptions: {
        target: ts.ScriptTarget.ES2017,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    })

    compileFunction(outputText, ['require', 'module', 'exports'], { filename })(
      requireModule, loadedModule, loadedModule.exports
    )
    return loadedModule.exports
  }

  return load
}
