import type { Component, VNode } from 'vue'

import type { IconMode, ResolvedIcon } from '@/composables/use-icon'

export type CIconProps = {
    name?: string | number
    source?: IconMode
    component?: Component | null
    body?: string
    path?: string
    viewBox?: string
    size?: string | number
    width?: string | number
    height?: string | number
    tag?: string
    spritePrefix?: string
    spritePath?: string
}

export type CIconSlots = {
    default?(props: { icon: ResolvedIcon }): VNode | VNode[]
}
