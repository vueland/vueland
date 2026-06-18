import type { Component } from 'vue'

export type IconMode = 'lib' | 'sprite' | 'component' | 'raw' | string

export interface UseIconOptions {
    name?: string | number
    source?: IconMode

    component?: Component | null

    body?: string
    viewBox?: string

    spritePrefix?: string
    spritePath?: string
}

export type IconResolverResult =
    | {
        kind: 'svg'
        body: string
        viewBox?: string
    }
    | {
        kind: 'font'
        className: string
        text?: string
    }
    | {
        kind: 'component'
        component: Component
    }
    | {
        kind: 'sprite'
        href: string
        viewBox?: string
    }
    | null
    | undefined

export type IconResolver = (name: string | number, options: UseIconOptions) => IconResolverResult
