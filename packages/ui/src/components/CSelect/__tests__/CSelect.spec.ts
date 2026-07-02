import { mount } from '@vue/test-utils'
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest'
import { nextTick } from 'vue'

import { $APP_API_KEY } from '@/constants'
import { wait } from '@/helpers'

import {
    CChip,
    CIcon,
    CList,
    CListItem,
    CListItemTitle,
    CSelect,
} from '../../index'

const global = {
    components: {
        CChip,
        CIcon,
        CList,
        CListItem,
        CListItemTitle,
    },
    provide: {
        [$APP_API_KEY as symbol]: {
            getScrollTop: () => 0,
            getScrollLeft: () => 0,
        },
    },
}

let mounted: ReturnType<typeof mount>[] = []

// CSelect контролируемый (model читает props.modelValue), поэтому синхронизируем
// modelValue обратно в пропсы — тогда wrapper ведёт себя как с v-model.
function mountSelect(props: Record<string, unknown> = {}) {
    const wrapper: ReturnType<typeof mount> = mount(CSelect as never, {
        attachTo: document.body,
        props: {
            items: [],
            modelValue: undefined,
            ...props,
            'onUpdate:modelValue': (v: unknown) => wrapper.setProps({ modelValue: v }),
        },
        global,
    })

    mounted.push(wrapper)

    return wrapper
}

async function openMenu(wrapper: ReturnType<typeof mount>) {
    await wrapper.get('.c-field-input').trigger('focus')
    await wait()
    await nextTick()
}

const options = () => [...document.querySelectorAll<HTMLElement>('.c-list-item')]

describe('CSelect', () => {
    afterEach(() => {
        mounted.forEach(w => w.unmount())
        mounted = []
        document.body.innerHTML = ''
    })

    it('связывает aria-controls с внешним id списка', async () => {
        const wrapper = mountSelect({ items: ['first', 'second'], modelValue: '' })

        const field = wrapper.get('.c-field-input')
        const listId = field.attributes('aria-controls')

        expect(listId).toMatch(/^c-select-list-.+$/)

        await openMenu(wrapper)

        const list = document.getElementById(listId!)

        expect(list).toBeTruthy()
        expect(list?.classList.contains('c-list')).toBe(true)
    })

    it('single: клик по опции выбирает значение', async () => {
        const wrapper = mountSelect({ items: ['first', 'second'] })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()

        expect(wrapper.props('modelValue')).toBe('second')
    })

    it('multiple: клики накапливают значения и рендерят чипы', async () => {
        const wrapper = mountSelect({
            items: ['a', 'b', 'c'],
            multiple: true,
            chips: true,
            modelValue: [],
        })

        await openMenu(wrapper)
        options()[0].click()
        await nextTick()
        options()[2].click()
        await nextTick()

        expect(wrapper.props('modelValue')).toEqual(['a', 'c'])
        expect(document.querySelectorAll('.c-chip')).toHaveLength(2)
    })

    it('закрытие чипа удаляет элемент по индексу', async () => {
        const wrapper = mountSelect({
            items: ['a', 'b', 'c'],
            multiple: true,
            chips: true,
            modelValue: ['a', 'b', 'c'],
        })

        await nextTick()

        const chips = wrapper.findAllComponents(CChip)

        expect(chips).toHaveLength(3)

        chips[1].vm.$emit('close')
        await nextTick()

        expect(wrapper.props('modelValue')).toEqual(['a', 'c'])
    })

    it('клавиатура: ArrowDown + Enter выбирает первый элемент', async () => {
        const wrapper = mountSelect({ items: ['a', 'b'] })

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'ArrowDown' })
        await input.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(wrapper.props('modelValue')).toBe('a')
    })

    it('клавиатура: typeahead фокусирует опцию, Enter её выбирает', async () => {
        const wrapper = mountSelect({ items: ['Alex', 'Vitaly'] })

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'v' })
        await input.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(wrapper.props('modelValue')).toBe('Vitaly')
    })

    it('Escape закрывает меню', async () => {
        const wrapper = mountSelect({ items: ['a', 'b'] })

        await openMenu(wrapper)
        expect(document.querySelector('.c-menu--visible')).toBeTruthy()

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Escape' })
        await nextTick()
        await wait()
        await nextTick()

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('Tab закрывает меню', async () => {
        const wrapper = mountSelect({ items: ['a', 'b'] })

        await openMenu(wrapper)
        expect(document.querySelector('.c-menu--visible')).toBeTruthy()

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Tab' })
        await nextTick()
        await wait()
        await nextTick()

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('clear очищает модель', async () => {
        const wrapper = mountSelect({ items: ['a', 'b'], modelValue: 'a', clearable: true })

        await wrapper.getComponent({ name: 'CField' }).vm.$emit('clear')
        await nextTick()

        expect(wrapper.props('modelValue')).toBe(undefined)
    })

    it('mandatory single: клик по выбранному не снимает выбор', async () => {
        const wrapper = mountSelect({ items: ['a', 'b'], modelValue: 'a', mandatory: true })

        await openMenu(wrapper)
        options()[0].click()
        await nextTick()

        expect(wrapper.props('modelValue')).toBe('a')
    })

    it('single: повторный клик по выбранному сохраняет выбор', async () => {
        const wrapper = mountSelect({ items: ['a', 'b'], modelValue: 'a' })

        await openMenu(wrapper)
        options()[0].click()
        await nextTick()

        expect(wrapper.props('modelValue')).toBe('a')
    })

    it('объектные items с titleKey: выбор кладёт объект, поле показывает title', async () => {
        const users = [{ name: 'Alex' }, { name: 'Vitaly' }]
        const wrapper = mountSelect({ items: users, titleKey: 'name' })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()

        expect(wrapper.props('modelValue')).toEqual({ name: 'Vitaly' })
        expect(document.querySelector('.c-select__items')?.textContent?.trim()).toBe('Vitaly')
    })

    it('valueKey: в модель кладётся value, а поле показывает title', async () => {
        const users = [{ id: 1, name: 'Alex' }, { id: 2, name: 'Vitaly' }]
        const wrapper = mountSelect({ items: users, titleKey: 'name', valueKey: 'id' })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()

        expect(wrapper.props('modelValue')).toBe(2)
        expect(document.querySelector('.c-select__items')?.textContent?.trim()).toBe('Vitaly')
    })

    it('показывает выбранные значения в поле (multiple, без chips)', async () => {
        mountSelect({ items: ['a', 'b', 'c'], multiple: true, modelValue: ['a', 'c'] })

        await nextTick()

        expect(document.querySelector('.c-select__items')?.textContent?.trim()).toBe('a, c')
    })
})
