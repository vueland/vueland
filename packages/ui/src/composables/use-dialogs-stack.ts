import {
 computed, type ComputedRef, defineAsyncComponent, inject, type ShallowRef, shallowRef 
} from 'vue'

import { $DIALOGS_STACK_API_KEY } from '../constants'
import { isDef } from '../helpers'

export type DialogStackItem = {
    id: number
    component: any
    props?: Record<string, any>
}

export interface DialogsStackApi {
    stack: ShallowRef<DialogStackItem[]>
    current: ComputedRef<DialogStackItem | undefined>
    openDialog: (options: { component: () => Promise<any>, props?: Record<string, any> }) => Promise<number>
    closeDialog: (id?: number) => void
    closeAll: () => void
}

let counter = 0

export function createDialogsStack(): DialogsStackApi {
    const stack = shallowRef<DialogStackItem[]>([])

    const current = computed(() => stack.value[stack.value.length - 1])

    const openDialog = async (options: { component: () => Promise<any>, props?: Record<string, any> }) => {
        const id = ++counter

        stack.value = [
            ...stack.value,
            {
                id,
                component: defineAsyncComponent(options.component),
                props: options.props,
            },
        ]

        return id
    }

    const closeDialog = (id?: number) => {
        if (!isDef(id)) {
            stack.value = stack.value.slice(0, -1)
            return
        }

        stack.value = stack.value.filter(item => item.id !== id)
    }

    const closeAll = () => {
        stack.value = []
    }

    return {
        stack,
        current,
        openDialog,
        closeDialog,
        closeAll,
    }
}

export function useDialogsStack(): DialogsStackApi {
    return inject($DIALOGS_STACK_API_KEY)!
}
