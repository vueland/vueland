import type { Rule } from 'eslint'

import {
    type ClassifiedNode,
    type ClassifyConfig,
    classifyNode,
    type CustomCategory,
} from '@/utils/classify'
import { buildEntries, detectOrderConflicts } from '@/utils/deps-graph'
import {
    CATEGORY_ORDER,
    COMPUTED_APIS,
    DEFINE_MACROS,
    LIFECYCLE_APIS,
    LIFECYCLE_ORDER,
    REACTIVE_APIS,
    WATCH_APIS,
    WATCH_EFFECT_APIS,
} from '@/utils/types'

type AnyNode = { type: string; [key: string]: unknown }
type SourceCode = Rule.RuleContext['sourceCode']
type Comment = ReturnType<SourceCode['getCommentsBefore']>[number]
type SortKey = [number, number]

// Нода с этим маркером (вплотную перед или в конце строки) закрепляется
// на своём месте, остальные сортируются в свободные слоты вокруг неё
const KEEP_MARKER_RE = /^\s*eslint-script-setup:keep\s*$/

function getRange(node: AnyNode): [number, number] {
    return (node as unknown as { range: [number, number] }).range
}

function getLoc(node: AnyNode | Comment): { start: { line: number }; end: { line: number } } {
    return (node as unknown as { loc: { start: { line: number }; end: { line: number } } }).loc
}

function asEsNode(node: AnyNode): Parameters<SourceCode['getCommentsBefore']>[0] {
    return node as unknown as Parameters<SourceCode['getCommentsBefore']>[0]
}

// Комментарий в конце строки ноды — её trailing-комментарий
function getTrailingComment(sourceCode: SourceCode, node: AnyNode): Comment | null {
    const first = sourceCode.getCommentsAfter(asEsNode(node))[0]

    if (!first) return null

    return getLoc(first).start.line === getLoc(node).end.line ? first : null
}

// Комментарии перед нодой без trailing-комментария предыдущей ноды:
// комментарий на строке конца предыдущей ноды принадлежит ей
function getLeadingComments(sourceCode: SourceCode, node: AnyNode, prevNode: AnyNode | null): Comment[] {
    const comments = sourceCode.getCommentsBefore(asEsNode(node))

    if (!prevNode) return comments

    const prevEndLine = getLoc(prevNode).end.line

    return comments.filter((c) => getLoc(c).start.line > prevEndLine)
}

function getNodeEnd(sourceCode: SourceCode, node: AnyNode): number {
    const trailing = getTrailingComment(sourceCode, node)

    return trailing ? trailing.range![1] : getRange(node)[1]
}

function getNodeStartWithComments(sourceCode: SourceCode, node: AnyNode, prevNode: AnyNode | null): number {
    const leading = getLeadingComments(sourceCode, node, prevNode)

    return leading.length ? leading[0].range![0] : getRange(node)[0]
}

function getNodeIndent(sourceCode: SourceCode, node: AnyNode): string {
    const src = sourceCode.getText()
    const start = getRange(node)[0]
    const lastNewline = src.lastIndexOf('\n', start - 1)
    const indent = src.slice(lastNewline + 1, start)
    return /^\s+$/.test(indent) ? indent : ''
}

function renderComment(comment: Comment): string {
    return comment.type === 'Line' ? `//${comment.value}` : `/*${comment.value}*/`
}

// каждая строка после комментария получает отступ ноды,
// иначе нода после переноса уезжает к левому краю
function prependLeadingComments(
    sourceCode: SourceCode,
    node: AnyNode,
    prevNode: AnyNode | null,
    coreText: string,
): string {
    const leading = getLeadingComments(sourceCode, node, prevNode)

    if (!leading.length) return coreText

    const indent = getNodeIndent(sourceCode, node)

    return leading.map(renderComment).join('\n' + indent) + '\n' + indent + coreText
}

// Текст ноды с её leading-комментариями и trailing-комментарием
function getNodeTextFull(sourceCode: SourceCode, node: AnyNode, prevNode: AnyNode | null): string {
    const core = sourceCode.getText().slice(getRange(node)[0], getNodeEnd(sourceCode, node))

    return prependLeadingComments(sourceCode, node, prevNode, core)
}

function isPinned(sourceCode: SourceCode, node: AnyNode, prevNode: AnyNode | null): boolean {
    const trailing = getTrailingComment(sourceCode, node)

    if (trailing && KEEP_MARKER_RE.test(trailing.value)) return true

    const leading = getLeadingComments(sourceCode, node, prevNode)
    const last = leading[leading.length - 1]

    // маркер работает только вплотную к ноде: пустая строка разрывает связь
    return !!last
        && getLoc(node).start.line - getLoc(last).end.line <= 1
        && KEEP_MARKER_RE.test(last.value)
}

// Склеивает отсортированные ноды: пары, оставшиеся соседями из исходника,
// сохраняют оригинальный разделитель, между переехавшими — пустая строка
function buildSortedText(
    sourceCode: SourceCode,
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
            const prevEnd = getNodeEnd(sourceCode, body[prevIdx])
            const start = getNodeStartWithComments(sourceCode, body[idx], body[prevIdx])

            return src.slice(prevEnd, start) + text
        }

        return '\n\n' + getNodeIndent(sourceCode, body[idx]) + text
    }).join('')
}

function compareKeys(a: SortKey, b: SortKey): number {
    return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]
}

// null-ключи (unknown, pinned) остаются на месте,
// остальные сортируются в свободные слоты вокруг них
function getSortedIndices(keys: (SortKey | null)[]): number[] {
    const sortableIndices = keys
        .map((key, index) => ({ key, index }))
        .filter(({ key }) => key !== null)
        .map(({ index }) => index)

    const sortedSortableIndices = [...sortableIndices].sort((a, b) => {
        const diff = compareKeys(keys[a]!, keys[b]!)

        return diff !== 0 ? diff : a - b
    })

    let sortedIndex = 0

    return keys.map((key, index) => {
        if (key === null) {
            return index
        }

        return sortedSortableIndices[sortedIndex++]
    })
}

// Конвертирует const foo = () => {} / const foo = function() {} → function foo() {}
// Возвращает null если нода не подходит для конвертации
function convertArrowToFunctionDecl(
    sourceCode: SourceCode,
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

    const getText = (n: AnyNode) => sourceCode.getText(n as unknown as Parameters<SourceCode['getText']>[0])

    const typeParameters = init.typeParameters as AnyNode | undefined
    const typeParamsText = typeParameters ? getText(typeParameters) : ''

    const params = (init.params as AnyNode[]).map(getText).join(', ')

    const returnType = init.returnType as AnyNode | undefined
    const returnTypeText = returnType ? ' ' + getText(returnType) : ''

    const body = init.body as AnyNode
    let bodyText: string
    if (body.type === 'BlockStatement') {
        bodyText = getText(body)
    } else {
        // Concise arrow: () => expr → { return expr }
        bodyText = `{ return ${getText(body)} }`
    }

    return `function ${name}${typeParamsText}(${params})${returnTypeText} ${bodyText}`
}

interface RuleOptions {
    order?: string[]
    composablePattern?: string
    reactiveApis?: string[]
    computedApis?: string[]
    watchEffectApis?: string[]
    watchApis?: string[]
    lifecycleApis?: string[]
    lifecycleOrder?: string[]
    customCategories?: Array<{ name: string; namePattern?: string; calleePattern?: string }>
}

function validateOptions(options: RuleOptions, customCategories: CustomCategory[], lifecycleApis: Set<string>): void {
    const builtinNames = new Set<string>([...CATEGORY_ORDER, ...DEFINE_MACROS])

    for (const custom of customCategories) {
        if (!custom.namePattern && !custom.calleePattern) {
            throw new Error(
                `[@vueland/script-setup-order] Custom category "${custom.name}" requires "namePattern" or "calleePattern".`,
            )
        }

        if (builtinNames.has(custom.name)) {
            throw new Error(
                `[@vueland/script-setup-order] Custom category "${custom.name}" shadows a built-in category. Pick another name.`,
            )
        }

        if (!options.order?.includes(custom.name)) {
            throw new Error(
                `[@vueland/script-setup-order] Custom category "${custom.name}" must be listed in the "order" option.`,
            )
        }
    }

    if (options.order) {
        const validNames = new Set<string>([...builtinNames, ...customCategories.map((c) => c.name)])

        for (const name of options.order) {
            if (!validNames.has(name)) {
                throw new Error(
                    `[@vueland/script-setup-order] Invalid "order" entry: "${name}". Valid entries: ${[...validNames].join(', ')}.`,
                )
            }
        }
    }

    if (options.lifecycleOrder) {
        for (const hook of options.lifecycleOrder) {
            if (!lifecycleApis.has(hook)) {
                throw new Error(
                    `[@vueland/script-setup-order] Invalid "lifecycleOrder" entry: "${hook}" is not a known lifecycle API. Add it to "lifecycleApis" first.`,
                )
            }
        }
    }
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
                    lifecycleOrder: { type: 'array', items: { type: 'string' } },
                    customCategories: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: { type: 'string' },
                                namePattern: { type: 'string' },
                                calleePattern: { type: 'string' },
                            },
                            required: ['name'],
                            additionalProperties: false,
                        },
                    },
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

        const options: RuleOptions = context.options[0] ?? {}

        const customCategories: CustomCategory[] = (options.customCategories ?? []).map((custom) => ({
            name: custom.name,
            namePattern: custom.namePattern ? new RegExp(custom.namePattern) : undefined,
            calleePattern: custom.calleePattern ? new RegExp(custom.calleePattern) : undefined,
        }))

        const customOrder: string[] = options.order ?? CATEGORY_ORDER
        // пустой массив отключает сортировку хуков внутри lifecycle
        const lifecycleOrder: string[] = options.lifecycleOrder ?? LIFECYCLE_ORDER
        const lifecycleIndex = new Map(lifecycleOrder.map((name, i) => [name, i]))

        const config: ClassifyConfig = {
            composablePattern: options.composablePattern ? new RegExp(options.composablePattern) : /^use[A-Z]/,
            reactiveApis: new Set([...REACTIVE_APIS, ...(options.reactiveApis ?? [])]),
            computedApis: new Set([...COMPUTED_APIS, ...(options.computedApis ?? [])]),
            watchEffectApis: new Set([...WATCH_EFFECT_APIS, ...(options.watchEffectApis ?? [])]),
            watchApis: new Set([...WATCH_APIS, ...(options.watchApis ?? [])]),
            lifecycleApis: new Set([...LIFECYCLE_APIS, ...(options.lifecycleApis ?? [])]),
            customCategories,
        }

        validateOptions(options, customCategories, config.lifecycleApis)

        // Макрос, перечисленный в order отдельно, сортируется по своей позиции,
        // не перечисленный — по позиции общей категории macros
        function resolvePrimaryName(classified: ClassifiedNode): string {
            if (classified.category === 'macros' && classified.callName) {
                const macro = classified.callName === 'withDefaults' ? 'defineProps' : classified.callName

                if (customOrder.includes(macro)) return macro
            }

            return classified.category
        }

        function getSortKey(classified: ClassifiedNode, pinnedNode: boolean): SortKey | null {
            if (pinnedNode || classified.category === 'unknown') {
                return null
            }

            const orderIdx = customOrder.indexOf(resolvePrimaryName(classified))
            const primary = orderIdx === -1 ? customOrder.length : orderIdx

            // Подпорядок хуков действует только когда lifecycle явно перечислен
            // в order: у неперечисленных категорий общий primary, и secondary
            // сталкивал бы хуки с чужими нодами
            const secondary = classified.category === 'lifecycle' && classified.callName && orderIdx !== -1
                ? (lifecycleIndex.get(classified.callName) ?? lifecycleOrder.length)
                : 0

            return [primary, secondary]
        }

        function getLabel(classified: ClassifiedNode): string {
            if (classified.category === 'lifecycle' && classified.callName) {
                return classified.callName
            }

            return resolvePrimaryName(classified)
        }

        return {
            Program(program) {
                const sourceCode = context.sourceCode
                const body = program.body as AnyNode[]

                if (!body.length) {
                    return
                }

                const classified = body.map((node) => classifyNode(node, config))
                const pinned = body.map((node, i) => isPinned(sourceCode, node, i > 0 ? body[i - 1] : null))
                const keys = classified.map((c, i) => getSortKey(c, pinned[i]))

                // находим первый нарушающий порядок узел
                let lastKey: SortKey | null = null
                let lastLabel = ''
                let violatingNode: AnyNode | null = null
                let violatingLabel = ''
                let violationBeforeLabel = ''

                for (let i = 0; i < body.length; i++) {
                    const key = keys[i]

                    if (!key) {
                        continue
                    }

                    if (lastKey && compareKeys(key, lastKey) < 0) {
                        violatingNode = body[i]
                        violatingLabel = getLabel(classified[i])
                        violationBeforeLabel = lastLabel
                        break
                    }

                    lastKey = key
                    lastLabel = getLabel(classified[i])
                }

                if (!violatingNode) return

                // build sorted order
                const sortedIndices = getSortedIndices(keys)

                const entries = buildEntries(body)
                const conflicts = detectOrderConflicts(entries, sortedIndices)

                // Регион замены: от начала строки первого owned-комментария первой ноды
                // до trailing-комментария последней — иначе комментарии по краям
                // дублируются, когда их ноды переезжают
                const src = sourceCode.getText()
                const first = body[0]
                const last = body[body.length - 1]
                const firstStart = getNodeStartWithComments(sourceCode, first, null)
                const newlineBefore = src.lastIndexOf('\n', firstStart - 1)
                const rangeStart = newlineBefore + 1
                const rangeEnd = getNodeEnd(sourceCode, last)

                const getText = (idx: number) =>
                    getNodeTextFull(sourceCode, body[idx], idx > 0 ? body[idx - 1] : null).trimStart()

                if (conflicts.length) {
                    // Индексы нод-деклараций которые вызывают конфликт (правая сторона — то что нужно объявить раньше)
                    const conflictingDeclIndices = new Set(conflicts.map((c) => sortedIndices[c.to]))

                    // Проверяем можно ли все конфликтные декларации конвертировать в function declaration
                    const allConvertible = [...conflictingDeclIndices].every(
                        (idx) => convertArrowToFunctionDecl(sourceCode, body[idx]) !== null,
                    )

                    const firstConflict = conflicts[0]
                    const reportNode = body[sortedIndices[firstConflict.from]] as unknown as Rule.Node

                    if (allConvertible) {
                        context.report({
                            node: reportNode,
                            messageId: 'depConflictFixed',
                            data: { name: firstConflict.name },
                            fix(fixer) {
                                // Для конфликтных нод — конвертируем в function declaration,
                                // остальные берём как есть. Затем сортируем с новыми ключами.
                                const convertedTexts = body.map((node, idx) => {
                                    const prevNode = idx > 0 ? body[idx - 1] : null

                                    if (conflictingDeclIndices.has(idx)) {
                                        let core = convertArrowToFunctionDecl(sourceCode, node)!
                                        const trailing = getTrailingComment(sourceCode, node)

                                        if (trailing) {
                                            core += ' ' + renderComment(trailing)
                                        }

                                        return prependLeadingComments(sourceCode, node, prevNode, core).trimStart()
                                    }

                                    return getText(idx)
                                })

                                // Конвертированные ноды становятся function; закреплённые
                                // остаются на месте — хойстинг решает конфликт и там
                                const functionKey = getSortKey({ category: 'function', callName: null }, false)
                                const newKeys = keys.map((key, idx) =>
                                    conflictingDeclIndices.has(idx) && key !== null ? functionKey : key,
                                )

                                // Пересортируем с новыми ключами
                                const newSortedIndices = getSortedIndices(newKeys)

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
                        current: violatingLabel,
                        before: violationBeforeLabel,
                    },
                    fix(fixer) {
                        const sortedText = buildSortedText(sourceCode, body, sortedIndices, getText)

                        return fixer.replaceTextRange([rangeStart, rangeEnd], sortedText)
                    },
                })
            },
        }
    },
}
