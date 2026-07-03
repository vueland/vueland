import { mount, type VueWrapper } from '@vue/test-utils'
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest'
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue'

import { $APP_API_KEY } from '@/constants'
import { wait } from '@/helpers'

import {
    CAutocomplete,
    CChip,
    CIcon,
    CList,
    CListItem,
    CListItemTitle,
    CTextField,
} from '../../index'

const global = {
    components: {
        CChip,
        CIcon,
        CList,
        CListItem,
        CListItemTitle,
        CTextField,
    },
    provide: {
        [$APP_API_KEY as symbol]: {
            getScrollTop: () => 0,
            getScrollLeft: () => 0,
        },
    },
}

const wrappers: VueWrapper[] = []

async function openMenu(wrapper: ReturnType<typeof mount>) {
    await wrapper.get('.c-field-input').trigger('focus')
    await wait()
    await nextTick()
}

async function keydown(element: Element, key: string) {
    element.dispatchEvent(new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
    }))

    await nextTick()
}

describe('CAutocomplete', () => {
    afterEach(() => {
        wrappers.forEach(wrapper => wrapper.unmount())
        wrappers.length = 0
        document.body.innerHTML = ''
    })

    it('связывает aria-controls с внешним id списка', async () => {
        const wrapper = mount(CAutocomplete<string>, {
            attachTo: document.body,
            props: {
                items: ['first', 'second'],
                modelValue: '',
            },
            global,
        })
        wrappers.push(wrapper)

        const field = wrapper.get('.c-field-input')
        const listId = field.attributes('aria-controls')

        expect(listId).toMatch(/^c-autocomplete-list-.+$/)

        await openMenu(wrapper)

        const list = document.getElementById(listId!)

        expect(list).toBeTruthy()
        expect(list?.classList.contains('c-list')).toBe(true)
    })

    it('после удаления выбранного элемента Backspace стрелки снова двигают фокус по списку', async () => {
        const model = ref<string[]>([])

        const wrapper = mount(defineComponent({
            setup() {
                return () => h(CAutocomplete<string>, {
                    items: ['first', 'second', 'third'],
                    modelValue: model.value,
                    multiple: true,
                    chips: true,
                    'onUpdate:modelValue': (value: string[]) => {
                        model.value = value
                    },
                })
            },
        }), {
            attachTo: document.body,
            global,
        })
        wrappers.push(wrapper)

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')
        const listItems = () => Array.from(document.body.querySelectorAll<HTMLElement>('.c-list-item'))

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(listItems()[0].classList.contains('c-list-item--focused')).toBe(true)

        await keydown(listItems()[0], 'Enter')
        await wait()
        await nextTick()

        expect(model.value).toEqual(['first'])

        await input.trigger('keydown', { key: 'Backspace' })
        await nextTick()

        expect(model.value).toEqual([])

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(listItems()[0].classList.contains('c-list-item--focused')).toBe(true)

        await keydown(listItems()[0], 'ArrowDown')
        await nextTick()

        expect(listItems()[1].classList.contains('c-list-item--focused')).toBe(true)
    })

    it('после клика в поле ArrowDown снова входит в список с начала', async () => {
        const wrapper = mount(CAutocomplete<string>, {
            attachTo: document.body,
            props: {
                items: ['first', 'second'],
                modelValue: '',
            },
            global,
        })
        wrappers.push(wrapper)

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')
        const listItems = () => Array.from(document.body.querySelectorAll<HTMLElement>('.c-list-item'))

        await input.trigger('keydown', { key: 'ArrowDown' })
        await keydown(listItems()[0], 'ArrowDown')

        expect(listItems()[1].classList.contains('c-list-item--focused')).toBe(true)

        await input.trigger('mousedown')
        await input.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(listItems()[0].classList.contains('c-list-item--focused')).toBe(true)
    })
})
