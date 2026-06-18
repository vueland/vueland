import { ReactiveEffect, shallowRef } from 'vue'

/**
 * @description - кастомный эффект, для кейсов где понадобится
 * стопать и перезапускать один и тот же эффект.
 */
export const useEffect = <T = any>(
    fn: () => any,
    scheduler?: (newVal?: any, oldVal?: any) => any,
) => {
    let oldVal: any
    const state = shallowRef()

    const effect = new ReactiveEffect(() => {
        state.value = fn()
        return state.value
    })

    oldVal = effect.run()

    if (scheduler) {
        effect.scheduler = () => {
            effect.run()
            scheduler(state.value, oldVal)
            oldVal = state.value
        }
    }

    return {
        run: () => effect.run(),
        stop: () => effect.stop(),
        get value(): T {
            return state.value
        },
        get __v_isRef() {
            return true
        },
    }
}
