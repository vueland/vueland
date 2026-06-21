import { MACRO_APIS, type NodeCategory  } from './types'

type AnyNode = { type: string; [key: string]: unknown }

function getCallName(node: AnyNode): string | null {
    if (node.type !== 'CallExpression') return null
    const callee = node.callee as AnyNode
    if (callee.type === 'Identifier') return callee.name as string
    if (callee.type === 'MemberExpression') {
        const prop = callee.property as AnyNode
        if (prop.type === 'Identifier') return prop.name as string
    }
    return null
}

function getInitCallName(decl: AnyNode): string | null {
    if (decl.type !== 'VariableDeclaration') return null
    const init = (decl.declarations as AnyNode[])[0]?.init as AnyNode | undefined
    if (!init) return null
    return getCallName(init)
}

export interface ClassifyConfig {
  reactiveApis: Set<string>
  computedApis: Set<string>
  watchEffectApis: Set<string>
  watchApis: Set<string>
  lifecycleApis: Set<string>
  composablePattern: RegExp
}

export function classifyNode(node: AnyNode, config: ClassifyConfig): NodeCategory {
    if (node.type === 'ImportDeclaration') {
        return 'import'
    }

    if (
        node.type === 'TSTypeAliasDeclaration'
        || node.type === 'TSInterfaceDeclaration'
        || node.type === 'TSEnumDeclaration'
    ) {
        return 'type'
    }

    if (node.type === 'ExpressionStatement') {
        const expr = node.expression as AnyNode
        const name = getCallName(expr)

        if (name) {
            if (MACRO_APIS.has(name)) return 'macros'
            if (config.watchEffectApis.has(name)) return 'watchEffect'
            if (config.watchApis.has(name)) return 'watch'
            if (config.lifecycleApis.has(name)) return 'lifecycle'
        }

        return 'unknown'
    }


    if (node.type === 'FunctionDeclaration') return 'function'

    if (node.type === 'VariableDeclaration') {
        const callName = getInitCallName(node)

        if (!callName) {
            const init = (node.declarations as AnyNode[])[0]?.init as AnyNode | undefined

            if (init?.type === 'ArrowFunctionExpression' || init?.type === 'FunctionExpression') {
                return 'function'
            }

            return 'variable'
        }

        if (MACRO_APIS.has(callName)) {
            return 'macros'
        }

        if (config.reactiveApis.has(callName)) {
            return 'reactive'
        }

        if (config.computedApis.has(callName)) {
            return 'computed'
        }

        if (config.watchEffectApis.has(callName)) {
            return 'watchEffect'
        }

        if (config.watchApis.has(callName)) {
            return 'watch'
        }

        if (config.lifecycleApis.has(callName)) {
            return 'lifecycle'
        }

        if (config.composablePattern.test(callName)) {
            return 'composable'
        }

        return 'variable'
    }

    return 'unknown'
}
