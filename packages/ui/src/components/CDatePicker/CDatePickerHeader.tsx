import { defineComponent } from 'vue'

import { IconAliases } from '../../enums'
import { CBtn } from '../CBtn'
import { CIcon } from '../CIcon'

export const CDatePickerHeader = defineComponent({
    name: 'CDatePickerHeader',
    props: {
        prevDisabled: Boolean,
        nextDisabled: Boolean,
    },
    emits: {
        next: () => true,
        prev: () => true,
        table: () => true,
    },
    setup(props, { emit, slots }) {
        return () => (
            <div class="c-date-picker__header">
                <div class="c-date-picker__header-nav">
                    <CBtn
                        class={['c-date-picker__header-btn', props.prevDisabled && 'c-date-picker__header-btn--disabled']}
                        disabled={props.prevDisabled}
                        onClick={() => emit('prev')}
                    >
                        <CIcon name={IconAliases.CHEVRON_LEFT} size={20} />
                    </CBtn>

                    <div class="c-date-picker__header-display" onClick={() => emit('table')}>
                        {slots.default?.()}
                    </div>

                    <CBtn
                        class={['c-date-picker__header-btn', props.nextDisabled && 'c-date-picker__header-btn--disabled']}
                        disabled={props.nextDisabled}
                        onClick={() => emit('next')}
                    >
                        <CIcon name={IconAliases.CHEVRON_RIGHT} size={20} />
                    </CBtn>
                </div>

                {slots.actions?.()}
            </div>
        )
    },
})
