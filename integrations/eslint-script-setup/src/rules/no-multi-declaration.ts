import type { Rule } from 'eslint'

export const noMultiDeclaration: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow multiple declarators in a single const/let statement in script setup',
            recommended: true,
            url: 'https://vueland.github.io/vueland/en/plugins/eslint-script-setup/rules#no-multi-declaration',
        },
        schema: [],
        messages: {
            noMulti: 'Declare each variable separately. Multiple declarators make script setup ordering impossible.',
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename?.()
        if (!filename.endsWith('.vue')) return {}

        const FOR_PARENTS = new Set(['ForStatement', 'ForInStatement', 'ForOfStatement'])

        return {
            VariableDeclaration(node) {
                // объявления в заголовке цикла (for (let i = 0, len = ...)) идиоматичны
                if (node.parent && FOR_PARENTS.has(node.parent.type)) {
                    return
                }

                if (node.declarations.length > 1) {
                    context.report({ node, messageId: 'noMulti' })
                }
            },
        }
    },
}
