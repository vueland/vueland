export function throttle<T extends(...args: any[]) => any>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let lastArgs: Parameters<T> | null = null

    return (...args: Parameters<T>) => {
        lastArgs = args

        if (!timeoutId) {
            func(args)
            lastArgs = null

            timeoutId = setTimeout(() => {
                timeoutId = null
                if (lastArgs) {
                    func(lastArgs)
                }
            }, delay)
        }
    }
}
