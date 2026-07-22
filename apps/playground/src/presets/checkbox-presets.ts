import type { CCheckboxPreset } from '@/types'

export const checkboxUpper: CCheckboxPreset = {
    base: {
        label: ['text-uppercase'],
    },
    checked: {
        label: ['text-green'],
    },
    focused: {
        icon: ['text-red'],
    },
}
