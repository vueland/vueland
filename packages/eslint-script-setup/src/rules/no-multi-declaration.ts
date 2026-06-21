import type { Rule } from 'eslint'

export const noMultiDeclaration: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow multiple declarators in a single const/let statement in script setup',
            recommended: true,
        },
        schema: [],
        messages: {
            noMulti: 'Declare each variable separately. Multiple declarators make script setup ordering impossible.',
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename?.()
        if (!filename.endsWith('.vue')) return {}

        return {
            VariableDeclaration(node) {
                if (node.declarations.length > 1) {
                    context.report({ node, messageId: 'noMulti' })
                }
            },
        }
    },
}
