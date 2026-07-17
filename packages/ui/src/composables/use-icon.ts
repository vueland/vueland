import {
    type Component,
    computed,
    type ComputedRef,
} from 'vue'

import { ALIASES } from '@/constants/icons'
import type {
    IconResolverResult,
    SvgIconData,
    UseIconOptions,
} from '@/types'

import { useCore } from './use-core'

// Типы иконок живут в '@/types'; реэкспорт сохраняет прежние точки импорта.
export type {
    ComponentIconData,
    FontIconData,
    IconMode,
    IconResolver,
    IconResolverResult,
    SpriteIconData,
    SvgIconData,
    UseIconOptions,
} from '@/types'

export interface ResolvedIcon {
    kind: 'svg' | 'component' | 'sprite' | 'font'
    component: Component | null
    body: string
    path: string
    viewBox: string
    href: string
    text: string
    className: string
    size?: number
    found: boolean
}

const DEFAULT_VIEW_BOX = '0 0 16 16'

const emptyIcon = (viewBox = DEFAULT_VIEW_BOX): ResolvedIcon => ({
    kind: 'svg',
    component: null,
    body: '',
    path: '',
    viewBox,
    href: '',
    text: '',
    className: '',
    found: false,
})

function normalizeIcon(icon: IconResolverResult, fallbackViewBox = DEFAULT_VIEW_BOX): ResolvedIcon {
    if (!icon) {
        return emptyIcon(fallbackViewBox)
    }

    if (icon.kind === 'component') {
        return {
            kind: 'component',
            component: icon.component,
            body: '',
            path: '',
            viewBox: fallbackViewBox,
            href: '',
            text: '',
            className: '',
            found: true,
        }
    }

    if (icon.kind === 'font') {
        return {
            kind: 'font',
            component: null,
            body: '',
            path: '',
            viewBox: fallbackViewBox,
            href: '',
            text: icon.text ?? '',
            className: icon.className,
            found: true,
        }
    }

    if (icon.kind === 'sprite') {
        return {
            kind: 'sprite',
            component: null,
            body: '',
            path: '',
            viewBox: icon.viewBox || fallbackViewBox,
            href: icon.href,
            text: '',
            className: '',
            found: true,
        }
    }

    return {
        kind: 'svg',
        component: null,
        body: icon.body ?? '',
        path: icon.path ?? '',
        viewBox: icon.viewBox || fallbackViewBox,
        href: '',
        text: '',
        className: '',
        size: icon.size,
        found: true,
    }
}

export function useIcon(props: UseIconOptions): ComputedRef<ResolvedIcon> {
    const { icons } = useCore() ?? {}

    return computed(() => {
        const fallbackViewBox = props.viewBox || DEFAULT_VIEW_BOX

        if (props.component) {
            return normalizeIcon(
                {
                    kind: 'component',
                    component: props.component,
                },
                fallbackViewBox,
            )
        }

        if (props.body) {
            return normalizeIcon(
                {
                    kind: 'svg',
                    body: props.body,
                    path: props.path,
                    viewBox: props.viewBox,
                },
                fallbackViewBox,
            )
        }

        if (props.path) {
            return normalizeIcon(
                {
                    kind: 'svg',
                    path: props.path,
                    viewBox: props.viewBox,
                },
                fallbackViewBox,
            )
        }

        if (props.source === 'sprite') {
            const symbolId = `${props.spritePrefix ?? ''}${props.name ?? ''}`

            const href = props.spritePath ? `${props.spritePath}#${symbolId}` : `#${symbolId}`

            return normalizeIcon(
                {
                    kind: 'sprite',
                    href,
                    viewBox: props.viewBox,
                },
                fallbackViewBox,
            )
        }

        if (!props.name) {
            return emptyIcon(fallbackViewBox)
        }

        if (props.source && icons?.sets?.[props.source]) {
            const resolver = icons.sets[props.source]

            if (resolver) {
                return normalizeIcon(resolver(props.name, props), fallbackViewBox)
            }
        }

        const builtInAliases = ALIASES as Record<string, SvgIconData | undefined>
        const icon = icons?.aliases?.[props.name] ?? builtInAliases[String(props.name)]

        return normalizeIcon(
            icon
                ? {
                    kind: 'svg',
                    body: icon.body,
                    path: icon.path,
                    viewBox: icon.viewBox,
                    size: icon.size,
                }
                : null,
            fallbackViewBox,
        )
    })
}
