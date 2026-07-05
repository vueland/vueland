import { type AllowedAttrs, useAttrs } from 'vue'

export const allowedAttrs: AllowedAttrs = {
    style: {},
    class: {},
}

export function excludeProps(props: Record<string, any>) {
    const attrs = useAttrs()

    return Object.keys(attrs).reduce((acc, key) => {
        if (!(key in props)) {
            acc[key] = attrs[key]
        }

        return acc
    }, {})
}
