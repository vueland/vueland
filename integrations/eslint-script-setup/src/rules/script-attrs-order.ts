import type { Rule } from 'eslint'
import type { AST } from 'vue-eslint-parser'

const DEFAULT_ORDER = ['setup', 'lang', 'generic']

// generic парсится vue-eslint-parser как директива: имя лежит в key.name.name
function getAttrName(attr: AST.VAttribute | AST.VDirective): string {
    const keyName = attr.key.name

    return typeof keyName === 'string' ? keyName : keyName.name
}

export const scriptAttrsOrder: Rule.RuleModule = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
            description: 'Enforce consistent attribute order on the <script> tag',
            recommended: true,
            url: 'https://vueland.github.io/vueland/en/plugins/eslint-script-setup/rules#script-attrs-order',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    order: { type: 'array', items: { type: 'string' } },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            wrongAttrsOrder: '"{{current}}" should come before "{{before}}" on the <script> tag.',
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename?.()

        if (!filename.endsWith('.vue')) {
            return {}
        }

        const sourceCode = context.sourceCode
        const documentFragment = sourceCode.parserServices?.getDocumentFragment?.() as AST.VDocumentFragment | undefined

        if (!documentFragment) {
            return {}
        }

        const order: string[] = context.options[0]?.order ?? DEFAULT_ORDER

        const getOrderIndex = (name: string) => {
            const index = order.indexOf(name)

            // неперечисленные атрибуты идут после указанных, сохраняя свой порядок
            return index === -1 ? order.length : index
        }

        return {
            Program() {
                const src = sourceCode.getText()

                const scriptTags = documentFragment.children
                    .filter((node): node is AST.VElement => node.type === 'VElement' && node.name === 'script')
                    .map((node) => node.startTag)

                for (const startTag of scriptTags) {
                    const attrs = startTag.attributes

                    if (attrs.length < 2) {
                        continue
                    }

                    const sorted = [...attrs].sort((a, b) => {
                        const idxA = getOrderIndex(getAttrName(a))
                        const idxB = getOrderIndex(getAttrName(b))

                        return idxA !== idxB ? idxA - idxB : attrs.indexOf(a) - attrs.indexOf(b)
                    })

                    const mismatch = attrs.findIndex((attr, idx) => attr !== sorted[idx])

                    if (mismatch === -1) {
                        continue
                    }

                    context.report({
                        loc: sorted[mismatch].loc,
                        messageId: 'wrongAttrsOrder',
                        data: {
                            current: getAttrName(sorted[mismatch]),
                            before: getAttrName(attrs[mismatch]),
                        },
                        fix(fixer) {
                            const text = sorted
                                .map((attr) => src.slice(attr.range[0], attr.range[1]))
                                .join(' ')

                            return fixer.replaceTextRange(
                                [attrs[0].range[0], attrs[attrs.length - 1].range[1]],
                                text,
                            )
                        },
                    })
                }
            },
        }
    },
}
