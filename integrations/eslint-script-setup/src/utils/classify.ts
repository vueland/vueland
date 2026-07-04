import { MACRO_APIS } from '@/utils/types'

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

// Имя, объявляемое нодой: const x = ..., function x() {}, class X {}
function getDeclaredName(node: AnyNode): string | null {
    if (node.type === 'VariableDeclaration') {
        const id = (node.declarations as AnyNode[])[0]?.id as AnyNode | undefined
        return id?.type === 'Identifier' ? (id.name as string) : null
    }

    if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
        const id = node.id as AnyNode | undefined
        return id?.type === 'Identifier' ? (id.name as string) : null
    }

    return null
}

export interface CustomCategory {
    name: string
    namePattern?: RegExp
    calleePattern?: RegExp
}

export interface ClassifyConfig {
    reactiveApis: Set<string>
    computedApis: Set<string>
    watchEffectApis: Set<string>
    watchApis: Set<string>
    lifecycleApis: Set<string>
    composablePattern: RegExp
    customCategories: CustomCategory[]
}

export interface ClassifiedNode {
    // NodeCategory либо имя кастомной категории
    category: string
    // Имя вызова (defineProps, onMounted, ...) — нужно для подпорядков
    // внутри категорий macros и lifecycle
    callName: string | null
}

// Кастомные категории проверяются до встроенной классификации,
// чтобы пользователь мог перехватить любую runtime-декларацию
function matchCustomCategory(
    node: AnyNode,
    callName: string | null,
    customCategories: CustomCategory[],
): string | null {
    if (!customCategories.length) return null

    const declaredName = getDeclaredName(node)

    for (const custom of customCategories) {
        if (custom.namePattern && declaredName && custom.namePattern.test(declaredName)) {
            return custom.name
        }

        if (custom.calleePattern && callName && custom.calleePattern.test(callName)) {
            return custom.name
        }
    }

    return null
}

export function classifyNode(node: AnyNode, config: ClassifyConfig): ClassifiedNode {
    if (node.type === 'ImportDeclaration') {
        return { category: 'import', callName: null }
    }

    if (
        node.type === 'TSTypeAliasDeclaration'
        || node.type === 'TSInterfaceDeclaration'
        || node.type === 'TSEnumDeclaration'
    ) {
        return { category: 'type', callName: null }
    }

    if (node.type === 'ExportNamedDeclaration') {
        const decl = node.declaration as AnyNode | undefined
        if (
            decl?.type === 'TSTypeAliasDeclaration'
            || decl?.type === 'TSInterfaceDeclaration'
            || decl?.type === 'TSEnumDeclaration'
        ) {
            return { category: 'type', callName: null }
        }
    }

    const callName = node.type === 'ExpressionStatement'
        ? getCallName(node.expression as AnyNode)
        : getInitCallName(node)

    const customName = matchCustomCategory(node, callName, config.customCategories)

    if (customName) {
        return { category: customName, callName }
    }

    if (node.type === 'ClassDeclaration') {
        return { category: 'class', callName: null }
    }

    // Не входит в MACRO_APIS: собственная категория, по умолчанию в конце
    if (callName === 'defineExpose') {
        return { category: 'defineExpose', callName }
    }

    if (callName === 'provide') {
        return { category: 'provide', callName }
    }

    if (callName === 'inject') {
        return { category: 'inject', callName }
    }

    if (node.type === 'ExpressionStatement') {
        if (callName) {
            if (MACRO_APIS.has(callName)) return { category: 'macros', callName }
            if (config.watchEffectApis.has(callName)) return { category: 'watchEffect', callName }
            if (config.watchApis.has(callName)) return { category: 'watch', callName }
            if (config.lifecycleApis.has(callName)) return { category: 'lifecycle', callName }
        }

        return { category: 'unknown', callName }
    }

    if (node.type === 'FunctionDeclaration') {
        return { category: 'function', callName: null }
    }

    if (node.type === 'VariableDeclaration') {
        if (!callName) {
            const init = (node.declarations as AnyNode[])[0]?.init as AnyNode | undefined

            if (init?.type === 'ArrowFunctionExpression' || init?.type === 'FunctionExpression') {
                return { category: 'function', callName: null }
            }

            return { category: 'variable', callName: null }
        }

        if (MACRO_APIS.has(callName)) {
            return { category: 'macros', callName }
        }

        if (config.reactiveApis.has(callName)) {
            return { category: 'reactive', callName }
        }

        if (config.computedApis.has(callName)) {
            return { category: 'computed', callName }
        }

        if (config.watchEffectApis.has(callName)) {
            return { category: 'watchEffect', callName }
        }

        if (config.watchApis.has(callName)) {
            return { category: 'watch', callName }
        }

        if (config.lifecycleApis.has(callName)) {
            return { category: 'lifecycle', callName }
        }

        if (config.composablePattern.test(callName)) {
            return { category: 'composable', callName }
        }

        return { category: 'variable', callName }
    }

    return { category: 'unknown', callName }
}
