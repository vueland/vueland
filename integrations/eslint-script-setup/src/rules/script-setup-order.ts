import type { Rule } from 'eslint'

import { type ClassifyConfig, classifyNode } from '@/utils/classify'
import { buildEntries, detectOrderConflicts } from '@/utils/deps-graph'
import {
    CATEGORY_ORDER,
    COMPUTED_APIS,
    LIFECYCLE_APIS,
    type NodeCategory,
    REACTIVE_APIS,
    WATCH_APIS,
    WATCH_EFFECT_APIS,
} from '@/utils/types'

type AnyNode = { type: string; [key: string]: unknown }

function getNodeText(sourceCode: Rule.RuleContext['sourceCode'], node: AnyNode): string {
    return sourceCode.getText(node as unknown as Parameters<typeof sourceCode.getText>[0])
}

function getNodeWithComments(sourceCode: Rule.RuleContext['sourceCode'], node: AnyNode): string {
    const comments = sourceCode.getCommentsBefore(node as unknown as Parameters<typeof sourceCode.getCommentsBefore>[0])

    if (!comments.length) {
        return getNodeText(sourceCode, node)
    }

    // каждая строка после комментария получает отступ ноды,
    // иначе нода после переноса уезжает к левому краю
    const indent = getNodeIndent(sourceCode, node)
    const commentText = comments
        .map((c) => (c.type === 'Line' ? `//${c.value}` : `/*${c.value}*/`))
        .join('\n' + indent)

    return commentText + '\n' + indent + getNodeText(sourceCode, node)
}

function getNodeIndent(sourceCode: Rule.RuleContext['sourceCode'], node: AnyNode): string {
    const src = sourceCode.getText()
    const start = (node as unknown as { range: [number, number] }).range[0]
    const lastNewline = src.lastIndexOf('\n', start - 1)
    const indent = src.slice(lastNewline + 1, start)
    return /^\s+$/.test(indent) ? indent : ''
}

function getNodeStartWithComments(sourceCode: Rule.RuleContext['sourceCode'], node: AnyNode): number {
    const comments = sourceCode.getCommentsBefore(node as unknown as Parameters<typeof sourceCode.getCommentsBefore>[0])
    return comments.length
        ? comments[0].range![0]
        : (node as unknown as { range: [number, number] }).range[0]
}

// Склеивает отсортированные ноды: пары, оставшиеся соседями из исходника,
// сохраняют оригинальный разделитель, между переехавшими — пустая строка
function buildSortedText(
    sourceCode: Rule.RuleContext['sourceCode'],
    body: AnyNode[],
    indices: number[],
    getText: (idx: number) => string,
): string {
    const src = sourceCode.getText()

    return indices.map((idx, pos) => {
        const text = getText(idx)

        if (pos === 0) {
            return getNodeIndent(sourceCode, body[idx]) + text
        }

        const prevIdx = indices[pos - 1]

        if (idx === prevIdx + 1) {
            const prevEnd = (body[prevIdx] as unknown as { range: [number, number] }).range[1]

            return src.slice(prevEnd, getNodeStartWithComments(sourceCode, body[idx])) + text
        }

        return '\n\n' + getNodeIndent(sourceCode, body[idx]) + text
    }).join('')
}

function getOrderIndex(order: NodeCategory[], category: NodeCategory): number | null {
    if (category === 'unknown') {
        return null
    }

    const index = order.indexOf(category)

    return index === -1 ? order.length : index
}

function getSortedIndices(categories: NodeCategory[], order: NodeCategory[]): number[] {
    const sortableIndices = categories
        .map((category, index) => ({ category, index }))
        .filter(({ category }) => getOrderIndex(order, category) !== null)
        .map(({ index }) => index)

    const sortedSortableIndices = [...sortableIndices].sort((a, b) => {
        const idxA = getOrderIndex(order, categories[a])!
        const idxB = getOrderIndex(order, categories[b])!

        return idxA !== idxB ? idxA - idxB : a - b
    })

    let sortedIndex = 0

    return categories.map((category, index) => {
        if (getOrderIndex(order, category) === null) {
            return index
        }

        return sortedSortableIndices[sortedIndex++]
    })
}

// Конвертирует const foo = () => {} / const foo = function() {} → function foo() {}
// Возвращает null если нода не подходит для конвертации
function convertArrowToFunctionDecl(
    sourceCode: Rule.RuleContext['sourceCode'],
    node: AnyNode,
): string | null {
    if (node.type !== 'VariableDeclaration') return null
    const declarator = (node.declarations as AnyNode[])[0]
    if (!declarator) return null

    const id = declarator.id as AnyNode
    if (id.type !== 'Identifier') return null
    const name = id.name as string

    const init = declarator.init as AnyNode | undefined
    if (!init) return null
    if (init.type !== 'ArrowFunctionExpression' && init.type !== 'FunctionExpression') return null

    const typeParameters = init.typeParameters as AnyNode | undefined
    const typeParamsText = typeParameters ? getNodeText(sourceCode, typeParameters) : ''

    const params = (init.params as AnyNode[]).map((p) => getNodeText(sourceCode, p)).join(', ')

    const returnType = init.returnType as AnyNode | undefined
    const returnTypeText = returnType ? ' ' + getNodeText(sourceCode, returnType) : ''

    const body = init.body as AnyNode
    let bodyText: string
    if (body.type === 'BlockStatement') {
        bodyText = getNodeText(sourceCode, body)
    } else {
        // Concise arrow: () => expr → { return expr }
        bodyText = `{ return ${getNodeText(sourceCode, body)} }`
    }

    return `function ${name}${typeParamsText}(${params})${returnTypeText} ${bodyText}`
}

export const scriptSetupOrder: Rule.RuleModule = {
    meta: {
        type: 'layout',
        fixable: 'code',
        docs: {
            description: 'Enforce consistent ordering of Vue 3 script setup blocks',
            recommended: true,
            url: 'https://vueland.github.io/vueland/en/plugins/eslint-script-setup/rules#script-setup-order',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    order: { type: 'array', items: { type: 'string' } },
                    composablePattern: { type: 'string' },
                    reactiveApis: { type: 'array', items: { type: 'string' } },
                    computedApis: { type: 'array', items: { type: 'string' } },
                    watchEffectApis: { type: 'array', items: { type: 'string' } },
                    watchApis: { type: 'array', items: { type: 'string' } },
                    lifecycleApis: { type: 'array', items: { type: 'string' } },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            wrongOrder: '"{{current}}" should come before "{{before}}".',
            depConflict: 'Cannot auto-sort: "{{name}}" would be used before its declaration after reordering. Move it manually or wrap the usage in computed().',
            depConflictFixed: '"{{name}}" converted to function declaration and code re-sorted.',
        },
    },
    create(context) {
        const filename = context.filename ?? context.getFilename?.()

        if (!filename.endsWith('.vue')) {
            return {}
        }

        const options = context.options[0] ?? {}
        const customOrder: NodeCategory[] = options.order ?? CATEGORY_ORDER

        const config: ClassifyConfig = {
            composablePattern: options.composablePattern ? new RegExp(options.composablePattern) : /^use[A-Z]/,
            reactiveApis: new Set([...REACTIVE_APIS, ...(options.reactiveApis ?? [])]),
            computedApis: new Set([...COMPUTED_APIS, ...(options.computedApis ?? [])]),
            watchEffectApis: new Set([...WATCH_EFFECT_APIS, ...(options.watchEffectApis ?? [])]),
            watchApis: new Set([...WATCH_APIS, ...(options.watchApis ?? [])]),
            lifecycleApis: new Set([...LIFECYCLE_APIS, ...(options.lifecycleApis ?? [])]),
        }

        return {
            Program(program) {
                const sourceCode = context.sourceCode
                const body = program.body as AnyNode[]

                if (!body.length) {
                    return
                }

                const categories = body.map((node) => classifyNode(node, config))

                // находим первый нарушающий порядок узел
                let lastOrderIndex = -1
                let lastSeenCategory: NodeCategory = customOrder[0]
                let violatingNode: AnyNode | null = null
                let violatingCategory: NodeCategory = customOrder[0]
                let violationBeforeCategory: NodeCategory = customOrder[0]

                for (let i = 0; i < body.length; i++) {
                    const cat = categories[i] as NodeCategory
                    const orderIdx = getOrderIndex(customOrder, cat)

                    if (orderIdx === null) {
                        continue
                    }

                    if (orderIdx < lastOrderIndex) {
                        violatingNode = body[i]
                        violatingCategory = cat
                        violationBeforeCategory = lastSeenCategory
                        break
                    }

                    lastOrderIndex = orderIdx
                    lastSeenCategory = cat
                }

                if (!violatingNode) return

                // build sorted order
                const sortedIndices = getSortedIndices(categories, customOrder)

                const entries = buildEntries(body)
                const conflicts = detectOrderConflicts(entries, sortedIndices)

                if (conflicts.length) {
                    // Индексы нод-деклараций которые вызывают конфликт (правая сторона — то что нужно объявить раньше)
                    const conflictingDeclIndices = new Set(conflicts.map((c) => sortedIndices[c.to]))

                    // Проверяем можно ли все конфликтные декларации конвертировать в function declaration
                    const allConvertible = [...conflictingDeclIndices].every(
                        (idx) => convertArrowToFunctionDecl(sourceCode, body[idx]) !== null,
                    )

                    const src = sourceCode.getText()
                    const first = body[0]
                    const last = body[body.length - 1]
                    const firstNodeStart = (first as unknown as { range: [number, number] }).range[0]
                    const newlineBefore = src.lastIndexOf('\n', firstNodeStart - 1)
                    const rangeStart = newlineBefore + 1
                    const rangeEnd = (last as unknown as { range: [number, number] }).range[1]

                    const firstConflict = conflicts[0]
                    const reportNode = body[sortedIndices[firstConflict.from]] as unknown as Rule.Node

                    if (allConvertible) {
                        context.report({
                            node: reportNode,
                            messageId: 'depConflictFixed',
                            data: { name: firstConflict.name },
                            fix(fixer) {
                                // Для конфликтных нод — конвертируем в function declaration,
                                // остальные берём как есть. Затем сортируем с новыми категориями.
                                const convertedTexts = body.map((node, idx) => {
                                    if (conflictingDeclIndices.has(idx)) {
                                        return convertArrowToFunctionDecl(sourceCode, node)!
                                    }
                                    return getNodeWithComments(sourceCode, node).trimStart()
                                })

                                // Пересчитываем категории после конвертации
                                const newCategories: NodeCategory[] = categories.map((cat, idx) =>
                                    conflictingDeclIndices.has(idx) ? 'function' : cat,
                                )

                                // Пересортируем с новыми категориями
                                const newSortedIndices = getSortedIndices(newCategories, customOrder)

                                const sortedText = buildSortedText(
                                    sourceCode,
                                    body,
                                    newSortedIndices,
                                    (idx) => convertedTexts[idx],
                                )

                                return fixer.replaceTextRange([rangeStart, rangeEnd], sortedText)
                            },
                        })
                    } else {
                        // Есть конфликты которые нельзя автоматически исправить
                        for (const conflict of conflicts) {
                            context.report({
                                node: body[sortedIndices[conflict.from]] as unknown as Rule.Node,
                                messageId: 'depConflict',
                                data: { name: conflict.name },
                            })
                        }
                    }
                    return
                }

                context.report({
                    node: violatingNode as unknown as Rule.Node,
                    messageId: 'wrongOrder',
                    data: {
                        current: violatingCategory,
                        before: violationBeforeCategory,
                    },
                    fix(fixer) {
                        const src = sourceCode.getText()
                        const first = body[0]
                        const last = body[body.length - 1]
                        const firstNodeStart = (first as unknown as { range: [number, number] }).range[0]
                        const newlineBefore = src.lastIndexOf('\n', firstNodeStart - 1)
                        const rangeStart = newlineBefore + 1
                        const rangeEnd = (last as unknown as { range: [number, number] }).range[1]

                        const sortedText = buildSortedText(
                            sourceCode,
                            body,
                            sortedIndices,
                            (idx) => getNodeWithComments(sourceCode, body[idx]).trimStart(),
                        )

                        return fixer.replaceTextRange([rangeStart, rangeEnd], sortedText)
                    },
                })
            },
        }
    },
}
