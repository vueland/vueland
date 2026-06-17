import { defineComponent } from 'vue'

import { useDialogsStack } from '../../composables'
import { COverlay } from '../COverlay'

export const CDialogsStack = defineComponent({
    setup() {
        const { current } = useDialogsStack()

        return () => (
            <COverlay modelValue={true}>
                {{
                    default: () => current.value
                        ? <current.value.component {...current.value.props} />
                        : null,
                }}
            </COverlay>
        )
    },
})
