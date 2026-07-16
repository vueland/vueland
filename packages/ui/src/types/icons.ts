import type { Component } from 'vue'

export type IconMode = 'lib' | 'sprite' | 'component' | 'raw' | string

export interface UseIconOptions {
    name?: string | number
    source?: IconMode
    component?: Component | null
    body?: string
    path?: string
    viewBox?: string
    spritePrefix?: string
    spritePath?: string
}

/** `body` — готовая разметка (v-html), `path` — голый d осевой линии или глифа. */
export interface SvgIconData {
    body?: string
    path?: string
    viewBox?: string
    size?: number
}

export interface FontIconData {
    className: string
    text?: string
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
