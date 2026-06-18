const BASE_Z_INDEX = 2000
const stack: number[] = []

export function useOverlayStack() {
    let zIndex = -1

    const register = () => {
        const last = stack[stack.length - 1]

        zIndex = last !== undefined ? last + 1 : BASE_Z_INDEX

        stack.push(zIndex)

        return zIndex
    }

    const unregister = () => {
        const i = stack.indexOf(zIndex)

        if (i > -1) {
            stack.splice(i, 1)
        }
    }

    return {
        register,
        unregister,
    }
}
