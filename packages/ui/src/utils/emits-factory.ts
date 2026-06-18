export type EmitValidator<Args extends unknown[] = unknown[]> = (...args: Args) => boolean

export type EmitsOptions<T extends Record<string, unknown[]>> = {
    [K in keyof T]: EmitValidator<T[K]> | null
}

export type EmitFn<T extends Record<string, unknown[]>> = <K extends keyof T>(
    event: K,
    ...args: T[K]
) => void

export function emitsFactory<T extends Record<string, unknown[]>>(emits: EmitsOptions<T>) {
    return emits
}
