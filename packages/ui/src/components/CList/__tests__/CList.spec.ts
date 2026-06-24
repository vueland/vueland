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

import { $LIST_API_KEY } from '../../../constants'
import { CList, CListItem } from '../../index'

type ListApi<T> = {
    select: (item: T) => void
    unselect: (item: T) => void
    isActive: (item: T) => boolean
}

describe('CList', () => {
    it('провайдит api по ключу $LIST_API_KEY', () => {
        const CProbe = defineComponent({
            name: 'CProbe',
            setup() {
                const api = inject<ListApi<number>>($LIST_API_KEY, {} as any)
                return { api }
            },
            template: '<div />',
        })

        const wrapper = mount(CList<number>, { slots: { default: () => h(CProbe) } })

        const probe = wrapper.findComponent(CProbe)

        expect((probe.vm as any).api).toBeTruthy()
        expect(typeof (probe.vm as any).api.select).toBe('function')
        expect(typeof (probe.vm as any).api.unselect).toBe('function')
        expect(typeof (probe.vm as any).api.isActive).toBe('function')
    })

    it('пробрасывает class из attrs', () => {
        const wrapper = mount(CList, { attrs: { class: 'custom-list another-class' } })

        expect(wrapper.classes()).toContain('c-list')
        expect(wrapper.classes()).toContain('custom-list')
        expect(wrapper.classes()).toContain('another-class')
    })

    it('добавляет класс readonly', () => {
        const wrapper = mount(CList, { props: { readonly: true } })

        expect(wrapper.classes()).toContain('c-list--readonly')
    })

    it('single режим: select обновляет modelValue одним значением', async () => {
        const model = ref<number | null>(null)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'select-btn',
                                onClick: () => slotProps.select(42),
                            }, 'select'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.select-btn').trigger('click')
        await nextTick()

        expect(model.value).toBe(42)
    })

    it('single режим: isActive возвращает true только для выбранного item', async () => {
        const model = ref<number | null>(2)
        let latestIsActive: ((item: number) => boolean) | undefined

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) => {
                            latestIsActive = slotProps.isActive
                            return h('div')
                        },
                    })
            },
        })

        mount(Host)
        await nextTick()

        expect(latestIsActive?.(1)).toBe(false)
        expect(latestIsActive?.(2)).toBe(true)
        expect(latestIsActive?.(3)).toBe(false)
    })

    it('single режим: unselect сбрасывает modelValue в null', async () => {
        const model = ref<number | null>(42)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'unselect-btn',
                                onClick: () => slotProps.unselect(42),
                            }, 'unselect'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.unselect-btn').trigger('click')
        await nextTick()

        expect(model.value).toBe(null)
    })

    it('single режим + mandatory=true: unselect не сбрасывает значение', async () => {
        const model = ref<number | null>(42)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        mandatory: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'unselect-btn',
                                onClick: () => slotProps.unselect(42),
                            }, 'unselect'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.unselect-btn').trigger('click')
        await nextTick()

        expect(model.value).toBe(42)
    })

    it('multiple режим: select добавляет item в массив', async () => {
        const model = ref<number[]>([])

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        multiple: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'select-btn',
                                onClick: () => slotProps.select(10),
                            }, 'select'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.select-btn').trigger('click')
        await nextTick()

        expect(model.value).toEqual([10])
    })

    it('multiple режим: select добавляет несколько значений по порядку', async () => {
        const model = ref<number[]>([])

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        multiple: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('div', [
                                h('button', {
                                    class: 'select-1',
                                    onClick: () => slotProps.select(1),
                                }, 'select-1'),
                                h('button', {
                                    class: 'select-2',
                                    onClick: () => slotProps.select(2),
                                }, 'select-2'),
                            ]),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.select-1').trigger('click')
        await wrapper.find('.select-2').trigger('click')
        await nextTick()

        expect(model.value).toEqual([1, 2])
    })

    it('multiple режим: unselect удаляет item из массива', async () => {
        const model = ref<number[]>([1, 2, 3])

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        multiple: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'unselect-btn',
                                onClick: () => slotProps.unselect(2),
                            }, 'unselect'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.unselect-btn').trigger('click')
        await nextTick()

        expect(model.value).toEqual([1, 3])
    })

    it('multiple режим: isActive корректно определяет активные элементы', async () => {
        const model = ref<number[]>([2, 4])
        let latestIsActive: ((item: number) => boolean) | undefined

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        multiple: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) => {
                            latestIsActive = slotProps.isActive
                            return h('div')
                        },
                    })
            },
        })

        mount(Host)
        await nextTick()

        expect(latestIsActive?.(1)).toBe(false)
        expect(latestIsActive?.(2)).toBe(true)
        expect(latestIsActive?.(4)).toBe(true)
    })

    it('readonly=true: select не изменяет modelValue', async () => {
        const model = ref<number | null>(null)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        readonly: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'select-btn',
                                onClick: () => slotProps.select(5),
                            }, 'select'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.select-btn').trigger('click')
        await nextTick()

        expect(model.value).toBe(null)
    })

    it('readonly=true: unselect не изменяет modelValue', async () => {
        const model = ref<number | null>(5)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        readonly: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'unselect-btn',
                                onClick: () => slotProps.unselect(5),
                            }, 'unselect'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.unselect-btn').trigger('click')
        await nextTick()

        expect(model.value).toBe(5)
    })

    it('сравнивает reactive объекты через toRaw в single режиме', async () => {
        const sameRaw = { id: 1 }
        const model = ref(sameRaw)

        let latestIsActive: ((item: { id: number }) => boolean) | undefined

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<{ id: number }>, {
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v as { id: number }
                        },
                    }, {
                        default: (slotProps: any) => {
                            latestIsActive = slotProps.isActive
                            return h('div')
                        },
                    })
            },
        })

        mount(Host)
        await nextTick()

        expect(latestIsActive?.(sameRaw)).toBe(true)
        expect(latestIsActive?.({ id: 1 })).toBe(false)
    })

    it('сравнивает reactive объекты через toRaw в multiple режиме при unselect', async () => {
        const item1 = { id: 1 }
        const item2 = { id: 2 }
        const model = ref([{ id: 999 }, item1, item2])

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<{ id: number }>, {
                        multiple: true,
                        modelValue: model.value,
                        'onUpdate:modelValue': (v: any) => {
                            model.value = v
                        },
                    }, {
                        default: (slotProps: any) =>
                            h('button', {
                                class: 'unselect-btn',
                                onClick: () => slotProps.unselect(item1),
                            }, 'unselect'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.unselect-btn').trigger('click')
        await nextTick()

        expect(model.value).toEqual([{ id: 999 }, item2])
    })

    describe('role', () => {
        it('без props role и selectable не устанавливает атрибут role', () => {
            const wrapper = mount(CList)
            expect(wrapper.attributes('role')).toBeUndefined()
        })

        it('selectable=true устанавливает role="listbox"', () => {
            const wrapper = mount(CList, { props: { selectable: true } })
            expect(wrapper.attributes('role')).toBe('listbox')
        })

        it('prop role="menu" устанавливает role="menu"', () => {
            const wrapper = mount(CList, { props: { role: 'menu' } })
            expect(wrapper.attributes('role')).toBe('menu')
        })

        it('prop role имеет приоритет над selectable', () => {
            const wrapper = mount(CList, { props: { role: 'menu', selectable: true } })
            expect(wrapper.attributes('role')).toBe('menu')
        })
    })

    describe('aria-multiselectable', () => {
        it('multiple=true в listbox устанавливает aria-multiselectable="true"', () => {
            const wrapper = mount(CList, {
                props: {
                    multiple: true,
                    selectable: true,
                },
            })

            expect(wrapper.attributes('aria-multiselectable')).toBe('true')
        })

        it('без multiple в listbox не устанавливает aria-multiselectable', () => {
            const wrapper = mount(CList, { props: { selectable: true } })
            expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
        })

        it('без role/listbox не устанавливает aria-multiselectable', () => {
            const wrapper = mount(CList, { props: { multiple: true } })
            expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
        })

        it('role="menu" не устанавливает aria-multiselectable', () => {
            const wrapper = mount(CList, {
                props: {
                    multiple: true,
                    role: 'menu',
                },
            })

            expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
        })
    })

    describe('item aria', () => {
        it('в listbox item получает option, id и aria-selected', async () => {
            const wrapper = mount(CList<string>, {
                props: {
                    modelValue: 'second',
                    selectable: true,
                },
                slots: {
                    default: () => [
                        h(CListItem, { value: 'first' }, () => 'first'),
                        h(CListItem, { value: 'second' }, () => 'second'),
                    ],
                },
            })

            await nextTick()

            const items = wrapper.findAll('.c-list-item')

            expect(items[0].attributes('role')).toBe('option')
            expect(items[0].attributes('id')).toMatch(/^c-list-.+-option-0$/)
            expect(items[0].attributes('aria-selected')).toBe('false')
            expect(items[1].attributes('role')).toBe('option')
            expect(items[1].attributes('id')).toMatch(/^c-list-.+-option-1$/)
            expect(items[1].attributes('aria-selected')).toBe('true')
        })

        it('в menu item получает menuitem без aria-selected', async () => {
            const wrapper = mount(CList<string>, {
                props: {
                    modelValue: 'action',
                    role: 'menu',
                },
                slots: {
                    default: () => h(CListItem, { value: 'action' }, () => 'action'),
                },
            })

            await nextTick()

            const item = wrapper.find('.c-list-item')

            expect(item.attributes('role')).toBe('menuitem')
            expect(item.attributes('id')).toMatch(/^c-list-.+-option-0$/)
            expect(item.attributes('aria-selected')).toBeUndefined()
        })

        it('обновляет aria-activedescendant через активный item', async () => {
            const wrapper = mount(CList<string>, {
                props: { selectable: true },
                slots: {
                    default: () => [
                        h(CListItem, { value: 'first' }, () => 'first'),
                        h(CListItem, { value: 'second' }, () => 'second'),
                    ],
                },
            })

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await nextTick()

            const firstItemId = wrapper.findAll('.c-list-item')[0].attributes('id')

            expect(wrapper.attributes('aria-activedescendant')).toBe(firstItemId)
        })
    })

    describe('tabindex', () => {
        it('без role и selectable не устанавливает tabindex', () => {
            const wrapper = mount(CList)
            expect(wrapper.attributes('tabindex')).toBeUndefined()
        })

        it('selectable=true устанавливает tabindex="-1"', () => {
            const wrapper = mount(CList, { props: { selectable: true } })
            expect(wrapper.attributes('tabindex')).toBe('-1')
        })

        it('role="listbox" устанавливает tabindex="-1"', () => {
            const wrapper = mount(CList, { props: { role: 'listbox' } })
            expect(wrapper.attributes('tabindex')).toBe('-1')
        })

        it('role="menu" устанавливает tabindex="-1"', () => {
            const wrapper = mount(CList, { props: { role: 'menu' } })
            expect(wrapper.attributes('tabindex')).toBe('-1')
        })

        it('кастомный tabindex через attrs перекрывает вычисленный', () => {
            const wrapper = mount(CList, {
                props: { selectable: true },
                attrs: { tabindex: 0 },
            })
            expect(wrapper.attributes('tabindex')).toBe('0')
        })
    })

    describe('multiple + mandatory', () => {
        it('multiple + mandatory: unselect не удаляет последний элемент', async () => {
            const model = ref<number[]>([42])

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<number>, {
                            multiple: true,
                            mandatory: true,
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: (slotProps: any) =>
                                h('button', {
                                    class: 'unselect-btn',
                                    onClick: () => slotProps.unselect(42),
                                }, 'unselect'),
                        })
                },
            })

            const wrapper = mount(Host)
            await wrapper.find('.unselect-btn').trigger('click')
            await nextTick()

            expect(model.value).toEqual([42])
        })

        it('multiple + mandatory: unselect удаляет не последний элемент', async () => {
            const model = ref<number[]>([1, 2])

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<number>, {
                            multiple: true,
                            mandatory: true,
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: (slotProps: any) =>
                                h('button', {
                                    class: 'unselect-btn',
                                    onClick: () => slotProps.unselect(1),
                                }, 'unselect'),
                        })
                },
            })

            const wrapper = mount(Host)
            await wrapper.find('.unselect-btn').trigger('click')
            await nextTick()

            expect(model.value).toEqual([2])
        })
    })

    it('slot получает select, unselect и isActive', async () => {
        let captured: Record<string, unknown> | undefined

        const wrapper = mount(CList<number>, {
            slots: {
                default: (slotProps: any) => {
                    captured = slotProps
                    return h('div', { class: 'slot-content' })
                },
            },
        })

        await nextTick()

        expect(wrapper.find('.slot-content').exists()).toBe(true)
        expect(typeof captured?.select).toBe('function')
        expect(typeof captured?.unselect).toBe('function')
        expect(typeof captured?.isActive).toBe('function')
    })
})
