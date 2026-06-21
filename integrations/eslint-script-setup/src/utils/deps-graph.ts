type AnyNode = { type: string; [key: string]: unknown }

// AST node keys that contain child nodes (avoids circular parent/scope refs)
const CHILD_KEYS: Partial<Record<string, string[]>> = {
    Program: ['body'],
    ExpressionStatement: ['expression'],
    CallExpression: ['callee', 'arguments'],
    MemberExpression: ['object', 'property'],
    Identifier: [],
    Literal: [],
    VariableDeclaration: ['declarations'],
    VariableDeclarator: ['id', 'init'],
    ArrowFunctionExpression: ['params', 'body'],
    FunctionExpression: ['params', 'body'],
    FunctionDeclaration: ['params', 'body'],
    BlockStatement: ['body'],
    ReturnStatement: ['argument'],
    IfStatement: ['test', 'consequent', 'alternate'],
    BinaryExpression: ['left', 'right'],
    LogicalExpression: ['left', 'right'],
    UnaryExpression: ['argument'],
    ConditionalExpression: ['test', 'consequent', 'alternate'],
    AssignmentExpression: ['left', 'right'],
    ObjectExpression: ['properties'],
    Property: ['key', 'value'],
    ArrayExpression: ['elements'],
    TemplateLiteral: ['expressions'],
    SpreadElement: ['argument'],
    NewExpression: ['callee', 'arguments'],
    AwaitExpression: ['argument'],
    ChainExpression: ['expression'],
}

function collectIdentifiers(node: AnyNode, ids: Set<string>, visited = new Set<AnyNode>()): void {
    if (!node || typeof node !== 'object' || visited.has(node)) {
        return
    }

    visited.add(node)

    if (node.type === 'Identifier') {
        ids.add(node.name as string)
        return
    }

    const keys = CHILD_KEYS[node.type]

    if (!keys) {
        return
    }

    for (const key of keys) {
        const child = node[key]

        if (Array.isArray(child)) {
            child.forEach((c) => {
                if (c && typeof c === 'object' && 'type' in c) {
                    collectIdentifiers(c as AnyNode, ids, visited)
                } })
        } else if (child && typeof child === 'object' && 'type' in child) {
            collectIdentifiers(child as AnyNode, ids, visited)
        }
    }
}

function getDeclaredName(node: AnyNode): string | null {
    if (node.type === 'VariableDeclaration') {
        const id = (node.declarations as AnyNode[])[0]?.id as AnyNode | undefined

        if (id?.type === 'Identifier') {
            return id.name as string
        }
    }

    if (node.type === 'FunctionDeclaration' && node.id) {
        return (node.id as AnyNode).name as string
    }

    if (node.type === 'TSTypeAliasDeclaration' || node.type === 'TSInterfaceDeclaration') {
        return (node.id as AnyNode)?.name as string ?? null
    }

    return null
}

export interface NodeEntry {
  node: AnyNode
  index: number
  declaredName: string | null
  usedNames: Set<string>
}

export function buildEntries(nodes: AnyNode[]): NodeEntry[] {
    return nodes.map((node, index) => {
        const declaredName = getDeclaredName(node)
        const usedNames = new Set<string>()

        if (node.type === 'VariableDeclaration') {
            const init = (node.declarations as AnyNode[])[0]?.init as AnyNode | undefined

            if (init) {
                collectIdentifiers(init, usedNames)
            }
        } else if (node.type === 'ExpressionStatement') {
            collectIdentifiers(node.expression as AnyNode, usedNames)
        } else if (node.type === 'FunctionDeclaration' && node.body) {
            collectIdentifiers(node.body as AnyNode, usedNames)
        }

        if (declaredName) {
            usedNames.delete(declaredName)
        }

        return { node, index, declaredName, usedNames }
    })
}

export function detectOrderConflicts(
    entries: NodeEntry[],
    sortedIndices: number[],
): Array<{ from: number; to: number; name: string }> {
    const nameToOriginalIndex = new Map<string, number>()
    entries.forEach((e, i) => {
        if (e.declaredName) {
            nameToOriginalIndex.set(e.declaredName, i)
        }
    })

    const conflicts: Array<{ from: number; to: number; name: string }> = []

    sortedIndices.forEach((originalIdx, newPos) => {
        const entry = entries[originalIdx]
        for (const usedName of entry.usedNames) {
            const depOriginalIdx = nameToOriginalIndex.get(usedName)

            if (depOriginalIdx === undefined) {
                continue
            }

            // FunctionDeclaration hoistable — конфликта нет независимо от позиции
            if (entries[depOriginalIdx].node.type === 'FunctionDeclaration') {
                continue
            }

            const depNewPos = sortedIndices.indexOf(depOriginalIdx)

            if (depNewPos > newPos) {
                conflicts.push({ from: newPos, to: depNewPos, name: usedName })
            }
        }
    })

    return conflicts
}
