import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import {
    computed,
    defineComponent,
    h,
    reactive,
    shallowRef,
} from 'vue'

import type { PresetProps } from '@/composables/use-presets'
import { $PRESET_KEY, $VUELAND_UI_KEY } from '@/constants'

import { useMenuPresets } from '../use-menu-presets'

function mountUseMenuPresets({
    props: initialProps,
    opened = false,
    presets = {},
    injected,
}: {
    props?: Partial<PresetProps>
    opened?: boolean
    presets?: Record<string, any>
    injected?: Record<string, any>
} = {}) {
    let result!: ReturnType<typeof useMenuPresets>

    const props = reactive({
        preset: undefined,
        ...initialProps,
    }) as PresetProps

    const openedRef = shallowRef(opened)

    const provide: Record<symbol, unknown> = {
        [$VUELAND_UI_KEY as symbol]: { presets },
    }

    if (injected !== undefined) {
        provide[$PRESET_KEY as symbol] = computed(() => injected)
    }

    const wrapper = mount(
        defineComponent({
            setup() {
                result = useMenuPresets({
                    props,
                    opened: openedRef,
                })

                return () => h('div')
            },
        }),
        { global: { provide } },
    )

    return {
        wrapper,
        props,
        opened: openedRef,
        result,
    }
}

// Набор CMenu: зона root, состояния opened/closed. Один и тот же формат
// работает и через собственный проп, и вложенным в пресет комбобокса.
const menuSet = {
    base: { root: ['base-root'] },
    opened: { root: ['opened-root'] },
    closed: { root: ['closed-root'] },
}

// Набор комбобокса (CInputPreset): вложенный пресет меню подставлен по значению.
// root верхнего уровня — зона .c-input, меню её брать не должно.
const inputSet = {
    base: {
        root: ['input-root'],
        field: ['base-field'],
        menu: menuSet,
    },
    focused: { field: ['focused-field'] },
}

describe('useMenuPresets', () => {
    it('возвращает пустой список, если preset не передан и контекста нет', () => {
        const { result } = mountUseMenuPresets()

        expect(result.value).toEqual([])
    })

    it('резолвит зону root из собственного preset по состоянию', () => {
        const { result, opened } = mountUseMenuPresets({
            props: { preset: 'myMenu' },
            presets: { myMenu: menuSet },
        })

        expect(result.value).toEqual(['closed-root'])

        opened.value = true

        expect(result.value).toEqual(['opened-root'])
    })

    it('без описанных состояний берёт root из base', () => {
        const { result } = mountUseMenuPresets({
            props: { preset: 'plain' },
            presets: { plain: { base: { root: ['only-base'] } } },
            opened: true,
        })

        expect(result.value).toEqual(['only-base'])
    })

    it('из контекста комбобокса читает вложенный пресет меню с его состояниями', () => {
        const { result, opened } = mountUseMenuPresets({
            injected: inputSet,
        })

        expect(result.value).toEqual(['closed-root'])

        opened.value = true

        expect(result.value).toEqual(['opened-root'])
    })

    it('собственный preset перекрывает контекст', () => {
        const { result } = mountUseMenuPresets({
            props: { preset: 'myMenu' },
            presets: { myMenu: { base: { root: ['own-root'] } } },
            injected: inputSet,
            opened: true,
        })

        expect(result.value).toEqual(['own-root'])
    })
})
