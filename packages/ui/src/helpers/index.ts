export * from './preset'

export const toCamelCase = (...args: string[]): string =>
    args.reduce((res, s, i) => {
        if (i === 0) res += s
        else res += s[0].toUpperCase() + s.slice(1)
        return res
    }, '')

export const isDef = (val: any) => (val ?? null) !== null
export const isNotEmpty = (val: any) => isDef(val) && !!`${val}`.trim()

export const unique = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}
