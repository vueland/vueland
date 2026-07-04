type AnyNode = { type: string; [key: string]: unknown }

// Служебные ссылки и type-only узлы: типы стираются при компиляции
// и runtime-зависимостей по порядку объявлений не создают
const SKIP_KEYS = new Set([
    'parent',
    'loc',
    'range',
    'typeAnnotation',
    'typeParameters',
    'typeArguments',
    'returnType',
])

// Тела функций ленивые: ссылки внутри выполняются только при вызове,
// поэтому зависимостей по порядку объявлений не создают
const LAZY_FUNCTION_TYPES = new Set([
    'ArrowFunctionExpression',
    'FunctionExpression',
    'FunctionDeclaration',
])

function isNode(value: unknown): value is AnyNode {
    return !!value && typeof value === 'object' && 'type' in (value as object)
}

function collectIdentifiers(node: AnyNode, ids: Set<string>, visited = new Set<AnyNode>()): void {
    if (!isNode(node) || visited.has(node)) {
        return
    }

    visited.add(node)

    if (node.type === 'Identifier') {
        ids.add(node.name as string)
        return
    }

    if (LAZY_FUNCTION_TYPES.has(node.type)) {
        return
    }

    // obj.prop: prop — не ссылка (если доступ не computed)
    if (node.type === 'MemberExpression' && !node.computed) {
        collectIdentifiers(node.object as AnyNode, ids, visited)
        return
    }

    // { key: value }: key — не ссылка (если ключ не computed);
    // то же для членов класса — имя метода/поля не ссылка
    if (
        (node.type === 'Property' || node.type === 'MethodDefinition' || node.type === 'PropertyDefinition')
        && !node.computed
    ) {
        collectIdentifiers(node.value as AnyNode, ids, visited)
        return
    }

    // Обходим все дочерние узлы: белый список типов пропускал бы обёртки
    // вроде TSAsExpression, и зависимость терялась — сортировка ломала код
    for (const [key, child] of Object.entries(node)) {
        if (SKIP_KEYS.has(key)) {
            continue
        }

        if (Array.isArray(child)) {
            for (const item of child) {
                if (isNode(item)) {
                    collectIdentifiers(item, ids, visited)
                }
            }
        } else if (isNode(child)) {
            collectIdentifiers(child, ids, visited)
        }
    }
}

// Собирает имена, объявляемые паттерном: Identifier, деструктуринг, дефолты, rest
function collectPatternNames(pattern: AnyNode | undefined | null, names: Set<string>): void {
    if (!pattern) {
        return
    }

    switch (pattern.type) {
        case 'Identifier':
            names.add(pattern.name as string)
            break
        case 'ObjectPattern':
            for (const prop of pattern.properties as AnyNode[]) {
                collectPatternNames((prop.value ?? prop.argument) as AnyNode, names)
            }
            break
        case 'ArrayPattern':
            for (const element of pattern.elements as (AnyNode | null)[]) {
                collectPatternNames(element, names)
            }
            break
        case 'AssignmentPattern':
            collectPatternNames(pattern.left as AnyNode, names)
            break
        case 'RestElement':
            collectPatternNames(pattern.argument as AnyNode, names)
            break
    }
}

function getDeclaredNames(node: AnyNode): Set<string> {
    const names = new Set<string>()

    if (node.type === 'VariableDeclaration') {
        for (const decl of node.declarations as AnyNode[]) {
            collectPatternNames(decl.id as AnyNode, names)
        }
    }

    if ((node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') && node.id) {
        names.add((node.id as AnyNode).name as string)
    }

    if (node.type === 'TSTypeAliasDeclaration' || node.type === 'TSInterfaceDeclaration') {
        const name = (node.id as AnyNode)?.name as string | undefined

        if (name) {
            names.add(name)
        }
    }

    if (node.type === 'ExportNamedDeclaration') {
        const decl = node.declaration as AnyNode | undefined

        if (decl?.type === 'TSTypeAliasDeclaration' || decl?.type === 'TSInterfaceDeclaration') {
            const name = (decl.id as AnyNode)?.name as string | undefined

            if (name) {
                names.add(name)
            }
        }
    }

    return names
}

export interface NodeEntry {
    node: AnyNode
    index: number
    declaredNames: Set<string>
    usedNames: Set<string>
}

export function buildEntries(nodes: AnyNode[]): NodeEntry[] {
    return nodes.map((node, index) => {
        const declaredNames = getDeclaredNames(node)
        const usedNames = new Set<string>()

        if (node.type === 'VariableDeclaration') {
            for (const decl of node.declarations as AnyNode[]) {
                // id обходим тоже: дефолты деструктуринга и computed-ключи —
                // немедленные ссылки; собственные имена вычитаем ниже
                collectIdentifiers(decl.id as AnyNode, usedNames)

                if (decl.init) {
                    collectIdentifiers(decl.init as AnyNode, usedNames)
                }
            }
        } else if (node.type === 'ExpressionStatement') {
            collectIdentifiers(node.expression as AnyNode, usedNames)
        } else if (node.type === 'ClassDeclaration') {
            // extends, computed-ключи и инициализаторы полей — потенциально
            // немедленные ссылки; тела методов walker пропускает как ленивые.
            // Инициализаторы instance-полей на деле ленивые — собираем и их
            // тоже: перестраховка даёт depConflict вместо ломаного фикса
            collectIdentifiers(node, usedNames)
        }
        // тела FunctionDeclaration не собираем: ссылки внутри функции ленивые
        // и выполняются только при вызове — порядок объявлений для них не важен

        for (const name of declaredNames) {
            usedNames.delete(name)
        }

        return { node, index, declaredNames, usedNames }
    })
}

export function detectOrderConflicts(
    entries: NodeEntry[],
    sortedIndices: number[],
): Array<{ from: number; to: number; name: string }> {
    const nameToOriginalIndex = new Map<string, number>()
    entries.forEach((e, i) => {
        for (const name of e.declaredNames) {
            nameToOriginalIndex.set(name, i)
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
