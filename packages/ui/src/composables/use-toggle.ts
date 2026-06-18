import { type ShallowRef, shallowRef } from 'vue'

export function useToggle(value: boolean = false): [ShallowRef<boolean>, () => void] {
    const state = shallowRef(value)

    const toggle = () => {
        state.value = !state.value
    }

    return [state, toggle]
}
