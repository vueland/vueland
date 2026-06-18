import { defineComponent } from 'vue'

import { IconAliases } from '../../enums'
import { CIcon } from '../CIcon'

export const CDatePickerHeader = defineComponent({
    name: 'CDatePickerHeader',
    emits: {
        next: () => true,
        prev: () => true,
        table: () => true,
    },
    setup(_, { emit, slots }) {
        return () => (
            <div class="c-date-picker__header">
                <button class="c-date-picker__header-btn" onClick={() => emit('prev')}>
                    <CIcon name={IconAliases.CHEVRON_LEFT} size={20} />
                </button>

                <div class="c-date-picker__header-display" onClick={() => emit('table')}>
                    {slots.default?.()}
                </div>

                <button class="c-date-picker__header-btn" onClick={() => emit('next')}>
                    <CIcon name={IconAliases.CHEVRON_RIGHT} size={20} />
                </button>
            </div>
        )
    },
})
