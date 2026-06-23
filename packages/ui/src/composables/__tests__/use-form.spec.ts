import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import { defineComponent, h } from 'vue'

import { useForm } from '@/composables'
import { $FORM_API_KEY } from '@/constants'


function mountUseForm(formApi?: unknown) {
    let result: ReturnType<typeof useForm>

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useForm()

                return () => h('div')
            },
        }),
        {
            global: {
                provide:
                    formApi === undefined
                        ? {}
                        : { [$FORM_API_KEY as symbol]: formApi },
            },
        },
    )

    return {
        wrapper,
        result: result!,
    }
}

describe('useForm', () => {
    it('возвращает null, если form api не предоставлен', () => {
        const { result } = mountUseForm()

        expect(result).toBeNull()
    })

    it('возвращает предоставленный form api', () => {
        const formApi = {
            add: vi.fn(),
            remove: vi.fn(),
            validate: vi.fn(),
            reset: vi.fn(),
        }

        const { result } = mountUseForm(formApi)

        expect(result).toBe(formApi)
    })
})
