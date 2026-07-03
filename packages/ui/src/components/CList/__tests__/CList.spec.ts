import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import {
    defineComponent,
    h,
    inject,
    nextTick,
    ref,
} from 'vue'

import {
    CList,
    CListItem,
    type ListAPI,
} from '@/components/CList'
import { $LIST_API_KEY } from '@/constants'

type ItemDef = {
    value?: unknown
    disabled?: boolean
    text?: string
    onClick?: () => void
    onActive?: (id: string) => void
    onInactive?: (id: string) => void
}

// Монтирует CList с набором CListItem'ов и двусторонним v-model.
function mountList(props: Record<string, unknown> = {}, defs: ItemDef[] = []) {
    const model = ref<unknown>(props.modelValue ?? null)

    const wrapper = mount(defineComponent({
        setup() {
            return () => h(CList, {
                ...props,
                'modelValue': model.value,
                'onUpdate:modelValue': (v: unknown) => {
                    model.value = v
                },
            }, {
                default: () => defs.map((def, i) => h(CListItem, {
                    key: i,
                    value: def.value,
                    disabled: def.disabled,
                    onClick: def.onClick,
                    onActive: def.onActive,
                    onInactive: def.onInactive,
                }, () => def.text ?? String(def.value))),
            })
        },
    }))

    return { wrapper, model }
}

// Значения → определения элементов.
const items = (...values: unknown[]): ItemDef[] => values.map(value => ({ value }))

const listItems = (wrapper: ReturnType<typeof mountList>['wrapper']) => wrapper.findAll('.c-list-item')

const keydown = (wrapper: ReturnType<typeof mountList>['wrapper'], key: string) =>
    wrapper.find('.c-list').trigger('keydown', { key })

describe('CList', () => {
    describe('provide / slot контракт', () => {
        it('провайдит ListAPI по ключу $LIST_API_KEY', () => {
            let api: Partial<ListAPI<number>> = {}

            const Probe = defineComponent({
                setup() {
                    api = inject<ListAPI<number>>($LIST_API_KEY, {} as ListAPI<number>)
                    return () => h('div')
                },
            })

            mount(CList, { slots: { default: () => h(Probe) } })

            for (const key of ['role', 'registerItem', 'unregisterItem', 'blur', 'select', 'unselect', 'toggle', 'isSelected'] as const) {
                expect(key in api).toBe(true)
            }
        })

        it('slot получает тот же объект ListAPI, что и inject', async () => {
            let slotApi: Partial<ListAPI<number>> | undefined
            let injectedApi: Partial<ListAPI<number>> | undefined

            const Probe = defineComponent({
                setup() {
                    injectedApi = inject<ListAPI<number>>($LIST_API_KEY, {} as ListAPI<number>)
                    return () => h('div', { class: 'probe' })
                },
            })

            const wrapper = mount(CList<number>, {
                slots: {
                    default: (api: ListAPI<number>) => {
                        slotApi = api
                        return h(Probe)
                    },
                },
            })

            await nextTick()

            expect(wrapper.find('.probe').exists()).toBe(true)
            expect(slotApi?.select).toBe(injectedApi?.select)
            expect(slotApi?.toggle).toBe(injectedApi?.toggle)
            expect(slotApi?.isActive).toBe(injectedApi?.isActive)
        })
    })

    describe('attrs и классы', () => {
        it('пробрасывает class из attrs', () => {
            const wrapper = mount(CList, { attrs: { class: 'custom another' } })

            expect(wrapper.classes()).toContain('c-list')
            expect(wrapper.classes()).toContain('custom')
            expect(wrapper.classes()).toContain('another')
        })

        it('пробрасывает обычные attrs на root', () => {
            const wrapper = mount(CList, { attrs: { id: 'external-list' } })

            expect(wrapper.attributes('id')).toBe('external-list')
        })

        it('добавляет класс readonly / disabled / default', () => {
            expect(mount(CList, { props: { readonly: true } }).classes()).toContain('c-list--readonly')
            expect(mount(CList, { props: { disabled: true } }).classes()).toContain('c-list--disabled')
            expect(mount(CList).classes()).toContain('c-list--default')
        })
    })

    describe('single выбор', () => {
        it('клик по элементу выбирает значение', async () => {
            const { wrapper, model } = mountList({ variant: 'listbox' }, items('a', 'b'))

            await listItems(wrapper)[1].trigger('click')
            await nextTick()

            expect(model.value).toBe('b')
            expect(listItems(wrapper)[1].attributes('aria-selected')).toBe('true')
            expect(listItems(wrapper)[0].attributes('aria-selected')).toBe('false')
        })

        it('повторный клик по выбранному снимает выбор (toggle)', async () => {
            const { wrapper, model } = mountList({ variant: 'listbox', modelValue: 'a' }, items('a', 'b'))

            await listItems(wrapper)[0].trigger('click')
            await nextTick()

            expect(model.value).toBe(null)
        })

        it('mandatory: клик по выбранному не снимает выбор', async () => {
            const {
                wrapper,
                model,
            } = mountList({ variant: 'listbox', mandatory: true, modelValue: 'a' }, items('a', 'b'))

            await listItems(wrapper)[0].trigger('click')
            await nextTick()

            expect(model.value).toBe('a')
        })

        it('isActive помечает только выбранный элемент', async () => {
            const { wrapper } = mountList({ variant: 'listbox', modelValue: 'b' }, items('a', 'b', 'c'))

            await nextTick()

            const selected = listItems(wrapper).map(i => i.attributes('aria-selected'))

            expect(selected).toEqual(['false', 'true', 'false'])
        })
    })

    describe('multiple выбор', () => {
        it('клики добавляют значения в массив по порядку', async () => {
            const {
                wrapper,
                model,
            } = mountList({ variant: 'listbox', multiple: true, modelValue: [] }, items('a', 'b', 'c'))

            await listItems(wrapper)[0].trigger('click')
            await listItems(wrapper)[2].trigger('click')
            await nextTick()

            expect(model.value).toEqual(['a', 'c'])
        })

        it('клик по выбранному удаляет его из массива', async () => {
            const {
                wrapper,
                model,
            } = mountList({ variant: 'listbox', multiple: true, modelValue: ['a', 'b'] }, items('a', 'b'))

            await listItems(wrapper)[0].trigger('click')
            await nextTick()

            expect(model.value).toEqual(['b'])
        })

        it('select не добавляет дубликат', async () => {
            const model = ref<string[]>(['a'])
            let api!: ListAPI<string>

            const Probe = defineComponent({
                setup() {
                    api = inject<ListAPI<string>>($LIST_API_KEY)!
                    return () => h('div')
                },
            })

            mount(defineComponent({
                setup() {
                    return () => h(CList, {
                        'variant': 'listbox',
                        'multiple': true,
                        'modelValue': model.value,
                        'onUpdate:modelValue': (v: unknown) => {
                            model.value = v as string[]
                        },
                    }, { default: () => h(Probe) })
                },
            }))

            api.select('a')
            await nextTick()

            expect(model.value).toEqual(['a'])
        })

        it('mandatory: нельзя удалить последний, но можно не последний', async () => {
            const last = mountList({ variant: 'listbox', multiple: true, mandatory: true, modelValue: ['a'] }, items('a'))
            await listItems(last.wrapper)[0].trigger('click')
            await nextTick()
            expect(last.model.value).toEqual(['a'])

            const notLast = mountList({ variant: 'listbox', multiple: true, mandatory: true, modelValue: ['a', 'b'] }, items('a', 'b'))
            await listItems(notLast.wrapper)[0].trigger('click')
            await nextTick()
            expect(notLast.model.value).toEqual(['b'])
        })

        it('multiple работает и в variant=menu (Enter тоглит выбор)', async () => {
            const {
                wrapper,
                model,
            } = mountList({ variant: 'menu', multiple: true, modelValue: [] }, items('a', 'b'))

            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await nextTick()

            expect(model.value).toEqual(['a', 'b'])
        })
    })

    describe('readonly / disabled', () => {
        it('readonly: клик и клавиатура не меняют выбор', async () => {
            const {
                wrapper,
                model,
            } = mountList({ variant: 'listbox', readonly: true, modelValue: null }, items('a', 'b'))

            await listItems(wrapper)[0].trigger('click')
            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await nextTick()

            expect(model.value).toBe(null)
        })

        it('disabled список: клик и клавиатура не меняют выбор', async () => {
            const {
                wrapper,
                model,
            } = mountList({ variant: 'listbox', disabled: true, modelValue: null }, items('a', 'b'))

            await listItems(wrapper)[0].trigger('click')
            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await nextTick()

            expect(model.value).toBe(null)
        })
    })

    describe('item-key', () => {
        it('строковый ключ: сопоставляет объекты по полю, а не по ссылке', async () => {
            const { wrapper } = mountList(
                { variant: 'listbox', itemKey: 'id', modelValue: { id: 1, label: 'x' } },
                [{ value: { id: 1, label: 'другой' } }, { value: { id: 2 } }],
            )

            await nextTick()

            expect(listItems(wrapper)[0].attributes('aria-selected')).toBe('true')
            expect(listItems(wrapper)[1].attributes('aria-selected')).toBe('false')
        })

        it('строковый ключ: unselect удаляет по ключу в multiple', async () => {
            const { wrapper, model } = mountList(
                { variant: 'listbox', multiple: true, itemKey: 'id', modelValue: [{ id: 1 }, { id: 2 }] },
                [{ value: { id: 1 } }, { value: { id: 2 } }],
            )

            await listItems(wrapper)[0].trigger('click')
            await nextTick()

            expect(model.value).toEqual([{ id: 2 }])
        })

        it('строковый ключ: select не добавляет дубликат по ключу', async () => {
            const { wrapper, model } = mountList(
                { variant: 'listbox', multiple: true, itemKey: 'id', modelValue: [{ id: 1 }] },
                [{ value: { id: 1 } }],
            )

            await listItems(wrapper)[0].trigger('click')
            await nextTick()

            // клик по уже выбранному снимает (toggle), дубликата не появляется
            expect(model.value).toEqual([])
        })

        it('функциональный ключ: сопоставляет по результату функции', async () => {
            const { wrapper } = mountList(
                { variant: 'listbox', itemKey: (item: { code: string }) => item.code.toLowerCase(), modelValue: { code: 'AB' } },
                [{ value: { code: 'ab' } }, { value: { code: 'cd' } }],
            )

            await nextTick()

            expect(listItems(wrapper)[0].attributes('aria-selected')).toBe('true')
            expect(listItems(wrapper)[1].attributes('aria-selected')).toBe('false')
        })

        it('по умолчанию сравнивает по ссылке через toRaw', async () => {
            const same = { id: 1 }
            const { wrapper } = mountList(
                { variant: 'listbox', modelValue: same },
                [{ value: same }, { value: { id: 1 } }],
            )

            await nextTick()

            expect(listItems(wrapper)[0].attributes('aria-selected')).toBe('true')
            expect(listItems(wrapper)[1].attributes('aria-selected')).toBe('false')
        })
    })

    describe('variant и aria', () => {
        it('list (по умолчанию) не задаёт role', () => {
            expect(mount(CList).attributes('role')).toBeUndefined()
        })

        it('listbox → role="listbox", menu → role="menu"', () => {
            expect(mount(CList, { props: { variant: 'listbox' } }).attributes('role')).toBe('listbox')
            expect(mount(CList, { props: { variant: 'menu' } }).attributes('role')).toBe('menu')
        })

        it('disabled listbox → aria-disabled="true", list — без него', () => {
            expect(mount(CList, { props: { disabled: true, variant: 'listbox' } }).attributes('aria-disabled')).toBe('true')
            expect(mount(CList, { props: { disabled: true } }).attributes('aria-disabled')).toBeUndefined()
        })

        it('aria-multiselectable только для listbox + multiple', () => {
            expect(mount(CList, { props: { multiple: true, variant: 'listbox' } }).attributes('aria-multiselectable')).toBe('true')
            expect(mount(CList, { props: { variant: 'listbox' } }).attributes('aria-multiselectable')).toBeUndefined()
            expect(mount(CList, { props: { multiple: true, variant: 'menu' } }).attributes('aria-multiselectable')).toBeUndefined()
        })
    })

    describe('tabindex', () => {
        it('list → нет tabindex, listbox/menu → 0', () => {
            expect(mount(CList).attributes('tabindex')).toBeUndefined()
            expect(mount(CList, { props: { variant: 'listbox' } }).attributes('tabindex')).toBe('0')
            expect(mount(CList, { props: { variant: 'menu' } }).attributes('tabindex')).toBe('0')
        })

        it('кастомный tabindex через attrs перекрывает вычисленный', () => {
            expect(mount(CList, { props: { variant: 'listbox' }, attrs: { tabindex: 0 } }).attributes('tabindex')).toBe('0')
        })
    })

    describe('aria элемента', () => {
        it('в listbox элемент — option с id, tabindex=-1 и aria-selected', async () => {
            const { wrapper } = mountList({ variant: 'listbox', modelValue: 'second' }, items('first', 'second'))

            await nextTick()

            const [first, second] = listItems(wrapper)

            expect(first.attributes('role')).toBe('option')
            expect(first.attributes('id')).toMatch(/^c-list-item-/)
            expect(first.attributes('tabindex')).toBe('-1')
            expect(first.attributes('aria-selected')).toBe('false')
            expect(second.attributes('aria-selected')).toBe('true')
            expect(second.attributes('id')).not.toBe(first.attributes('id'))
        })

        it('в menu элемент — menuitem без aria-selected', async () => {
            const { wrapper } = mountList({ variant: 'menu' }, items('action'))

            await nextTick()

            const item = listItems(wrapper)[0]

            expect(item.attributes('role')).toBe('menuitem')
            expect(item.attributes('aria-selected')).toBeUndefined()
        })

        it('вне CList элемент не получает контракт списка и не падает по клику', async () => {
            const wrapper = mount(CListItem, { props: { value: 'x' } })
            const item = wrapper.find('.c-list-item')

            expect(item.attributes('role')).toBeUndefined()
            expect(item.attributes('id')).toBeUndefined()

            await item.trigger('click')
        })

        it('в variant=list элемент остаётся обычным li и не выбирается', async () => {
            const { wrapper, model } = mountList({}, items('first'))
            const item = listItems(wrapper)[0]

            expect(item.attributes('role')).toBeUndefined()
            expect(item.attributes('tabindex')).toBeUndefined()

            await item.trigger('click')
            await nextTick()

            expect(model.value).toBe(null)
        })

        it('disabled элемент получает aria-disabled и не интерактивен', async () => {
            const { wrapper, model } = mountList({ variant: 'listbox' }, [{ value: 'a', disabled: true }])
            const item = listItems(wrapper)[0]

            expect(item.classes()).toContain('c-list-item--disabled')
            expect(item.attributes('aria-disabled')).toBe('true')
            expect(item.attributes('tabindex')).toBeUndefined()

            await item.trigger('click')
            await nextTick()

            expect(model.value).toBe(null)
        })
    })

    describe('клавиатурная навигация', () => {
        it('ArrowDown двигает активный элемент и вешает --focused + эмитит active', async () => {
            let activeId: string | undefined
            const { wrapper } = mountList({ variant: 'listbox' }, [
                { value: 'a', onActive: id => (activeId = id) },
                { value: 'b' },
            ])

            await keydown(wrapper, 'ArrowDown')
            await nextTick()

            const first = listItems(wrapper)[0]

            expect(first.classes()).toContain('c-list-item--focused')
            expect(activeId).toBe(first.attributes('id'))
        })

        it('ArrowUp без активного входит в список с конца', async () => {
            let activeId: string | undefined
            const { wrapper } = mountList({ variant: 'listbox' }, [
                { value: 'a' },
                { value: 'b' },
                { value: 'c', onActive: id => (activeId = id) },
            ])

            await keydown(wrapper, 'ArrowUp')
            await nextTick()

            expect(activeId).toBe(listItems(wrapper)[2].attributes('id'))
        })

        it('навигация пропускает disabled элементы', async () => {
            const { wrapper, model } = mountList({ variant: 'listbox' }, [
                { value: 'a', disabled: true },
                { value: 'b' },
            ])

            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await nextTick()

            expect(listItems(wrapper)[1].classes()).toContain('c-list-item--focused')
            expect(model.value).toBe('b')
        })

        it('Home / End переводят активный к первому / последнему enabled', async () => {
            const { wrapper } = mountList({ variant: 'listbox' }, items('a', 'b', 'c'))

            await keydown(wrapper, 'End')
            await nextTick()
            expect(listItems(wrapper)[2].classes()).toContain('c-list-item--focused')

            await keydown(wrapper, 'Home')
            await nextTick()
            expect(listItems(wrapper)[0].classes()).toContain('c-list-item--focused')
        })

        it('Enter / Space переключают текущий активный элемент', async () => {
            const { wrapper, model } = mountList({ variant: 'listbox', modelValue: null }, items('a', 'b'))

            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await nextTick()
            expect(model.value).toBe('a')

            await keydown(wrapper, ' ')
            await nextTick()
            expect(model.value).toBe(null)
        })

        it('снимает --focused при нативном blur элемента', async () => {
            const { wrapper } = mountList({ variant: 'listbox' }, items('a', 'b'))

            await keydown(wrapper, 'ArrowDown')
            await nextTick()

            const first = listItems(wrapper)[0]
            expect(first.classes()).toContain('c-list-item--focused')

            await first.trigger('blur')
            await nextTick()
            expect(first.classes()).not.toContain('c-list-item--focused')
        })

        it('после нативного blur ArrowDown продолжает от активного индекса', async () => {
            const { wrapper } = mountList({ variant: 'listbox' }, items('a', 'b'))

            await keydown(wrapper, 'ArrowDown')
            await nextTick()

            const first = listItems(wrapper)[0]

            await first.trigger('blur')
            await keydown(wrapper, 'ArrowDown')
            await nextTick()

            expect(listItems(wrapper)[1].classes()).toContain('c-list-item--focused')
        })

        it('hover не активирует элемент: active/inactive не эмитятся', async () => {
            let active: string | undefined
            let inactive: string | undefined
            const { wrapper } = mountList({ variant: 'listbox' }, [
                { value: 'a', onActive: id => (active = id), onInactive: id => (inactive = id) },
            ])

            await listItems(wrapper)[0].trigger('mouseenter')
            await listItems(wrapper)[0].trigger('mouseleave')
            await nextTick()

            expect(active).toBeUndefined()
            expect(inactive).toBeUndefined()
        })

        it('typeahead фокусирует первый подходящий enabled элемент', async () => {
            let activeId: string | undefined
            const { wrapper } = mountList({ variant: 'listbox' }, [
                { value: 'apple', text: 'Apple', disabled: true },
                { value: 'apricot', text: 'Apricot', onActive: id => (activeId = id) },
                { value: 'banana', text: 'Banana' },
            ])

            await keydown(wrapper, 'a')
            await nextTick()

            expect(activeId).toBe(listItems(wrapper)[1].attributes('id'))
        })

        it('Enter входит в клик элемента: срабатывает и выбор, и пользовательский @click', async () => {
            let clicks = 0
            const { wrapper, model } = mountList({ variant: 'menu' }, [
                { value: 'a', onClick: () => (clicks += 1) },
                { value: 'b' },
            ])

            await keydown(wrapper, 'ArrowDown')
            await keydown(wrapper, 'Enter')
            await nextTick()

            expect(clicks).toBe(1)
            expect(model.value).toBe('a')
        })
    })
})
