import { type Component, computed, type ComputedRef } from 'vue'

import { useCore } from './use-core'

export type IconMode = 'sprite' | 'component' | 'raw' | 'fa' | 'md'

export interface UseIconOptions {
    name?: string | number
    source?: IconMode
    component?: Component | null
    body?: string
    viewBox?: string
    spritePrefix?: string
    spritePath?: string
}

export interface SvgIconData {
    body: string
    viewBox?: string
    size?: number
}

export interface FontIconData {
    text: string
    className: string
}

export interface ComponentIconData {
    component: Component
}

export interface SpriteIconData {
    href: string
    viewBox?: string
}

export type IconResolverResult =
    | ({ kind: 'svg' } & SvgIconData)
    | ({ kind: 'font' } & FontIconData)
    | ({ kind: 'component' } & ComponentIconData)
    | ({ kind: 'sprite' } & SpriteIconData)
    | null
    | undefined

export type IconResolver = (name: string | number, options: UseIconOptions) => IconResolverResult

export interface ResolvedIcon {
    kind: 'svg' | 'component' | 'sprite' | 'font'
    component: Component | null
    body: string
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
            viewBox: fallbackViewBox,
            href: '',
            text: icon.text,
            className: icon.className,
            found: true,
        }
    }

    if (icon.kind === 'sprite') {
        return {
            kind: 'sprite',
            component: null,
            body: '',
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
        body: icon.body,
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

        const icon = icons?.aliases?.[props.name]

        return normalizeIcon(
            icon
                ? {
                    kind: 'svg',
                    body: icon.body,
                    viewBox: icon.viewBox,
                    size: icon.size,
                }
                : null,
            fallbackViewBox,
        )
    })
}
