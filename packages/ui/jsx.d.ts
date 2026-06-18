import type { CSSProperties } from 'vue'

declare module 'vue' {
    interface ComponentCustomProps {
        id?: string
        class?: any
        style?: string | CSSProperties | Array<string | CSSProperties>
        [key: `data-${string}`]: any
        [key: `aria-${string}`]: any
        [key: `on${string}`]: any
    }
}

export {}
