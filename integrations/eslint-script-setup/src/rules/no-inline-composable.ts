import type { Rule } from 'eslint'
import type { CallExpression, Node } from 'estree'

function isComposableCall(node: Node): boolean {
    if (node.type !== 'CallExpression') return false
    const callee = (node as CallExpression).callee
    return callee.type === 'Identifier' && /^use[A-Z]/.test(callee.name)
}

export const noInlineComposable: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow composable calls passed directly as arguments to other functions',
            recommended: true,
        },
        schema: [],
        messages: {
            noInline: 'Assign composable "{{name}}" to a variable before use.',
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename?.()
        if (!filename.endsWith('.vue')) return {}

        return {
            CallExpression(node) {
                for (const arg of node.arguments) {
                    if (isComposableCall(arg as Node)) {
                        const callee = (arg as CallExpression).callee
                        const name = callee.type === 'Identifier' ? callee.name : 'composable'
                        context.report({ node: arg as unknown as Rule.Node, messageId: 'noInline', data: { name } })
                    }
                }
            },
        }
    },
}
