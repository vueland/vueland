import { isDef, unique } from '@/helpers'

export type IdOptions = {
    prefix?: string
    postfix?: string
}

export function useId(id?: string | number, { prefix, postfix }: IdOptions = {}) {
    if (isDef(id)) return `${id}`

    id = unique(6)

    return prefix ? `${prefix}-${id}` : postfix ? `${id}-${postfix}` : `${id}`
}
