import type { IconResolver } from '@/types'

type IconDefinition = {
    icon: [
        width: number,
        height: number,
        ligatures: unknown[],
        unicode: string,
        svgPathData: string | string[],
    ]
}

type FontAwesomeIconMap = Record<string, IconDefinition>

export interface FontAwesomeResolverOptions {
    icons: FontAwesomeIconMap
    defaultPrefix?: string
}

function normalizeName(name: string | number, defaultPrefix: string): string {
    if (`${name}`.includes(':')) {
        return `${name}`.trim()
    }

    return `${defaultPrefix}:${`${name}`.trim()}`
}

function iconToSvg(data: IconDefinition) {
    const [width, height, , , pathData] = data.icon

    const body = Array.isArray(pathData)
        ? pathData.map((d) => `<path fill="currentColor" d="${d}" />`).join('')
        : `<path fill="currentColor" d="${pathData}" />`

    return {
        kind: 'svg' as const,
        body,
        viewBox: `0 0 ${width} ${height}`,
    }
}

export function createFontAwesomeResolver(options: FontAwesomeResolverOptions): IconResolver {
    const defaultPrefix = options.defaultPrefix ?? 'solid'

    return (name) => {
        const key = normalizeName(name, defaultPrefix)

        const icon = options.icons[key] ?? options.icons[`${name}`]

        if (!icon) {
            return null
        }

        return iconToSvg(icon)
    }
}
