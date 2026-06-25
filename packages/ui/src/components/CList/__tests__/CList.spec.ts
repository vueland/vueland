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

import { CList, CListItem } from '@/components/CList'
import { $LIST_API_KEY } from '@/constants'

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

    it('пробрасывает обычные attrs на root список', () => {
        const wrapper = mount(CList, { attrs: { id: 'external-list' } })

        expect(wrapper.attributes('id')).toBe('external-list')
    })

    it('добавляет класс readonly', () => {
        const wrapper = mount(CList, { props: { readonly: true } })

        expect(wrapper.classes()).toContain('c-list--readonly')
    })

    it('добавляет класс disabled', () => {
        const wrapper = mount(CList, { props: { disabled: true } })

        expect(wrapper.classes()).toContain('c-list--disabled')
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

    it('multiple режим без mandatory: unselect удаляет последний item', async () => {
        const model = ref<number[]>([1])

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
                                onClick: () => slotProps.unselect(1),
                            }, 'unselect'),
                    })
            },
        })

        const wrapper = mount(Host)

        await wrapper.find('.unselect-btn').trigger('click')
        await nextTick()

        expect(model.value).toEqual([])
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

    it('disabled=true: select не изменяет modelValue', async () => {
        const model = ref<number | null>(null)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        disabled: true,
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

    it('disabled=true: unselect не изменяет modelValue', async () => {
        const model = ref<number | null>(5)

        const Host = defineComponent({
            setup() {
                return () =>
                    h(CList<number>, {
                        disabled: true,
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

    describe('item-key', () => {
        it('itemKey как строка: isActive сопоставляет объекты по полю, а не по ссылке', async () => {
            const model = ref<{ id: number; label: string }>({ id: 1, label: 'a' })
            let latestIsActive: ((item: { id: number; label: string }) => boolean) | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<{ id: number; label: string }>, {
                            itemKey: 'id',
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

            expect(latestIsActive?.({ id: 1, label: 'другой объект' })).toBe(true)
            expect(latestIsActive?.({ id: 2, label: 'a' })).toBe(false)
        })

        it('itemKey как строка: unselect удаляет элемент по ключу в multiple режиме', async () => {
            const model = ref([{ id: 1 }, { id: 2 }, { id: 3 }])

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<{ id: number }>, {
                            multiple: true,
                            itemKey: 'id',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: (slotProps: any) =>
                                h('button', {
                                    class: 'unselect-btn',
                                    onClick: () => slotProps.unselect({ id: 2 }),
                                }, 'unselect'),
                        })
                },
            })

            const wrapper = mount(Host)

            await wrapper.find('.unselect-btn').trigger('click')
            await nextTick()

            expect(model.value).toEqual([{ id: 1 }, { id: 3 }])
        })

        it('itemKey как строка: select не добавляет дубликат по ключу', async () => {
            const model = ref([{ id: 1 }])

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<{ id: number }>, {
                            multiple: true,
                            itemKey: 'id',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: (slotProps: any) =>
                                h('button', {
                                    class: 'select-btn',
                                    onClick: () => slotProps.select({ id: 1 }),
                                }, 'select'),
                        })
                },
            })

            const wrapper = mount(Host)

            await wrapper.find('.select-btn').trigger('click')
            await nextTick()

            expect(model.value).toEqual([{ id: 1 }])
        })

        it('itemKey как функция: сопоставляет значения по результату функции', async () => {
            const model = ref<{ code: string }>({ code: 'AB' })
            let latestIsActive: ((item: { code: string }) => boolean) | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<{ code: string }>, {
                            itemKey: (item: { code: string }) => item.code.toLowerCase(),
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

            expect(latestIsActive?.({ code: 'ab' })).toBe(true)
            expect(latestIsActive?.({ code: 'cd' })).toBe(false)
        })
    })

    describe('variant', () => {
        it('по умолчанию variant=list не устанавливает явный role', () => {
            const wrapper = mount(CList)
            expect(wrapper.attributes('role')).toBeUndefined()
        })

        it('variant=list явно не устанавливает role', () => {
            const wrapper = mount(CList, { props: { variant: 'list' } })
            expect(wrapper.attributes('role')).toBeUndefined()
        })

        it('variant=listbox устанавливает role="listbox"', () => {
            const wrapper = mount(CList, { props: { variant: 'listbox' } })
            expect(wrapper.attributes('role')).toBe('listbox')
        })

        it('variant=menu устанавливает role="menu"', () => {
            const wrapper = mount(CList, { props: { variant: 'menu' } })
            expect(wrapper.attributes('role')).toBe('menu')
        })

        it('disabled listbox устанавливает aria-disabled="true"', () => {
            const wrapper = mount(CList, {
                props: {
                    disabled: true,
                    variant: 'listbox',
                },
            })

            expect(wrapper.attributes('aria-disabled')).toBe('true')
        })

        it('disabled variant=list не устанавливает aria-disabled', () => {
            const wrapper = mount(CList, { props: { disabled: true } })

            expect(wrapper.attributes('aria-disabled')).toBeUndefined()
        })
    })

    describe('aria-multiselectable', () => {
        it('multiple=true в listbox устанавливает aria-multiselectable="true"', () => {
            const wrapper = mount(CList, {
                props: {
                    multiple: true,
                    variant: 'listbox',
                },
            })

            expect(wrapper.attributes('aria-multiselectable')).toBe('true')
        })

        it('без multiple в listbox не устанавливает aria-multiselectable', () => {
            const wrapper = mount(CList, { props: { variant: 'listbox' } })
            expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
        })

        it('variant=list не устанавливает aria-multiselectable', () => {
            const wrapper = mount(CList, { props: { multiple: true } })
            expect(wrapper.attributes('aria-multiselectable')).toBeUndefined()
        })

        it('variant=menu не устанавливает aria-multiselectable', () => {
            const wrapper = mount(CList, {
                props: {
                    multiple: true,
                    variant: 'menu',
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
                    variant: 'listbox',
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
            expect(items[0].attributes('id')).toMatch(/^c-list-item-.+$/)
            expect(items[0].attributes('tabindex')).toBe('-1')
            expect(items[0].attributes('aria-selected')).toBe('false')
            expect(items[1].attributes('role')).toBe('option')
            expect(items[1].attributes('id')).toMatch(/^c-list-item-.+$/)
            expect(items[1].attributes('id')).not.toBe(items[0].attributes('id'))
            expect(items[1].attributes('aria-selected')).toBe('true')
        })

        it('в menu item получает menuitem без aria-selected', async () => {
            const wrapper = mount(CList<string>, {
                props: {
                    modelValue: 'action',
                    variant: 'menu',
                },
                slots: {
                    default: () => h(CListItem, { value: 'action' }, () => 'action'),
                },
            })

            await nextTick()

            const item = wrapper.find('.c-list-item')

            expect(item.attributes('role')).toBe('menuitem')
            expect(item.attributes('id')).toMatch(/^c-list-item-.+$/)
            expect(item.attributes('tabindex')).toBe('-1')
            expect(item.attributes('aria-selected')).toBeUndefined()
        })

        it('вне CList item не получает aria-контракт списка и не падает по click', async () => {
            const wrapper = mount(CListItem, {
                props: { value: 'outside' },
            })

            const item = wrapper.find('.c-list-item')

            expect(item.attributes('role')).toBeUndefined()
            expect(item.attributes('id')).toBeUndefined()

            await item.trigger('click')
        })

        it('внутри variant=list item остаётся обычным li', async () => {
            const model = ref<string | null>(null)
            let activeId: string | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => h(CListItem, {
                                value: 'first',
                                onActive: (id: string) => {
                                    activeId = id
                                },
                            }, () => 'first'),
                        })
                },
            })

            const wrapper = mount(Host)
            const item = wrapper.find('.c-list-item')

            expect(item.attributes('role')).toBeUndefined()
            expect(item.attributes('id')).toBeUndefined()
            expect(item.attributes('tabindex')).toBeUndefined()

            await item.trigger('mouseenter')
            await item.trigger('click')
            await nextTick()

            expect(activeId).toBeUndefined()
            expect(model.value).toBe(null)
        })

        it('в disabled listbox item сохраняет aria-контракт, но не становится интерактивным', async () => {
            let activeId: string | undefined

            const wrapper = mount(CList<string>, {
                props: {
                    disabled: true,
                    modelValue: 'first',
                    variant: 'listbox',
                },
                slots: {
                    default: () => h(CListItem, {
                        value: 'first',
                        onActive: (id: string) => {
                            activeId = id
                        },
                    }, () => 'first'),
                },
            })

            await nextTick()

            const item = wrapper.find('.c-list-item')

            expect(item.attributes('role')).toBe('option')
            expect(item.attributes('id')).toMatch(/^c-list-item-.+$/)
            expect(item.attributes('tabindex')).toBeUndefined()
            expect(item.attributes('aria-selected')).toBe('true')

            await item.trigger('mouseenter')
            await nextTick()

            expect(activeId).toBeUndefined()
        })

        it('disabled item получает aria-disabled и не становится интерактивным', async () => {
            const model = ref<string | null>(null)
            let activeId: string | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => h(CListItem, {
                                disabled: true,
                                value: 'first',
                                onActive: (id: string) => {
                                    activeId = id
                                },
                            }, () => 'first'),
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()

            const item = wrapper.find('.c-list-item')

            expect(item.classes()).toContain('c-list-item--disabled')
            expect(item.attributes('role')).toBe('option')
            expect(item.attributes('aria-disabled')).toBe('true')
            expect(item.attributes('tabindex')).toBeUndefined()

            await item.trigger('mouseenter')
            await item.trigger('click')
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(activeId).toBeUndefined()
            expect(model.value).toBe(null)
        })

        it('hover не активирует элемент: active/inactive не эмитятся', async () => {
            let activeId: string | undefined
            let inactiveId: string | undefined

            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
                slots: {
                    default: () => h(CListItem, {
                        value: 'first',
                        onActive: (id: string) => {
                            activeId = id
                        },
                        onInactive: (id: string) => {
                            inactiveId = id
                        },
                    }, () => 'first'),
                },
            })

            await nextTick()

            const item = wrapper.find('.c-list-item')

            await item.trigger('mouseenter')
            await item.trigger('mouseleave')
            await nextTick()

            expect(activeId).toBeUndefined()
            expect(inactiveId).toBeUndefined()
        })

        it('item отдаёт active id при клавиатурной навигации списка', async () => {
            let activeId: string | undefined

            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
                slots: {
                    default: () => [
                        h(CListItem, {
                            value: 'first',
                            onActive: (id: string) => {
                                activeId = id
                            },
                        }, () => 'first'),
                        h(CListItem, { value: 'second' }, () => 'second'),
                    ],
                },
            })

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await nextTick()

            const firstItemId = wrapper.findAll('.c-list-item')[0].attributes('id')

            expect(activeId).toBe(firstItemId)
        })

        it('ArrowUp без активного элемента входит в список с конца', async () => {
            let activeId: string | undefined

            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
                slots: {
                    default: () => [
                        h(CListItem, { value: 'first' }, () => 'first'),
                        h(CListItem, { value: 'second' }, () => 'second'),
                        h(CListItem, {
                            value: 'third',
                            onActive: (id: string) => {
                                activeId = id
                            },
                        }, () => 'third'),
                    ],
                },
            })

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowUp' })
            await nextTick()

            const lastItemId = wrapper.findAll('.c-list-item')[2].attributes('id')

            expect(activeId).toBe(lastItemId)
        })

        it('снимает класс --focused при потере фокуса элементом', async () => {
            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
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

            const firstItem = wrapper.findAll('.c-list-item')[0]

            expect(firstItem.classes()).toContain('c-list-item--focused')

            await firstItem.trigger('blur')
            await nextTick()

            expect(firstItem.classes()).not.toContain('c-list-item--focused')
        })

        it('наведение мышью не сбрасывает клавиатурный фокус', async () => {
            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
                slots: {
                    default: () => [
                        h(CListItem, { value: 'first' }, () => 'first'),
                        h(CListItem, { value: 'second' }, () => 'second'),
                    ],
                },
            })

            await nextTick()
            // клавиатурой ставим фокус на первый элемент
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await nextTick()

            const [firstItem, secondItem] = wrapper.findAll('.c-list-item')

            expect(firstItem.classes()).toContain('c-list-item--focused')

            // наводим мышь на второй — фокус на первом должен сохраниться
            await secondItem.trigger('mouseenter')
            await nextTick()

            expect(firstItem.classes()).toContain('c-list-item--focused')
            expect(secondItem.classes()).not.toContain('c-list-item--focused')

            // и навигация продолжается с первого, а не с наведённого
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await nextTick()

            expect(firstItem.classes()).not.toContain('c-list-item--focused')
            expect(secondItem.classes()).toContain('c-list-item--focused')
        })

        it('клавиатурная навигация пропускает disabled items', async () => {
            const model = ref<string | null>(null)
            let activeId: string | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => [
                                h(CListItem, {
                                    disabled: true,
                                    value: 'first',
                                }, () => 'first'),
                                h(CListItem, {
                                    value: 'second',
                                    onActive: (id: string) => {
                                        activeId = id
                                    },
                                }, () => 'second'),
                            ],
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            const enabledItem = wrapper.findAll('.c-list-item')[1]

            expect(activeId).toBe(enabledItem.attributes('id'))
            expect(model.value).toBe('second')
        })

        it('Home/End переводят active item к началу и концу списка', async () => {
            const activeIds: string[] = []

            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
                slots: {
                    default: () => [
                        h(CListItem, {
                            value: 'first',
                            onActive: (id: string) => {
                                activeIds.push(id)
                            },
                        }, () => 'first'),
                        h(CListItem, { value: 'second' }, () => 'second'),
                        h(CListItem, {
                            value: 'third',
                            onActive: (id: string) => {
                                activeIds.push(id)
                            },
                        }, () => 'third'),
                    ],
                },
            })

            await nextTick()
            await wrapper.trigger('keydown', { key: 'End' })
            await nextTick()

            const items = wrapper.findAll('.c-list-item')

            expect(activeIds.at(-1)).toBe(items[2].attributes('id'))

            await wrapper.trigger('keydown', { key: 'Home' })
            await nextTick()

            expect(activeIds.at(-1)).toBe(items[0].attributes('id'))
        })

        it('Enter/Space переключают текущий active item в listbox', async () => {
            const model = ref<string | null>(null)

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => [
                                h(CListItem, { value: 'first' }, () => 'first'),
                                h(CListItem, { value: 'second' }, () => 'second'),
                            ],
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(model.value).toBe('first')

            await wrapper.trigger('keydown', { key: ' ' })
            await nextTick()

            expect(model.value).toBe(null)
        })

        it('typeahead фокусирует первый подходящий enabled item', async () => {
            let activeId: string | undefined

            const wrapper = mount(CList<string>, {
                props: { variant: 'listbox' },
                slots: {
                    default: () => [
                        h(CListItem, {
                            disabled: true,
                            value: 'apple',
                        }, () => 'Apple'),
                        h(CListItem, {
                            value: 'apricot',
                            onActive: (id: string) => {
                                activeId = id
                            },
                        }, () => 'Apricot'),
                        h(CListItem, { value: 'banana' }, () => 'Banana'),
                    ],
                },
            })

            await nextTick()
            await wrapper.trigger('keydown', { key: 'a' })
            await nextTick()

            const apricotItem = wrapper.findAll('.c-list-item')[1]

            expect(activeId).toBe(apricotItem.attributes('id'))
        })

        it('Enter активирует menu item через click без выбора значения', async () => {
            const model = ref<string | null>(null)
            let clicks = 0

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            variant: 'menu',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => h(CListItem, {
                                value: 'action',
                                onClick: () => {
                                    clicks += 1
                                },
                            }, () => 'action'),
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(clicks).toBe(1)
            expect(model.value).toBe(null)
        })

        it('disabled listbox не реагирует на click и клавиатуру', async () => {
            const model = ref<string | null>(null)
            let activeId: string | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            disabled: true,
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => h(CListItem, {
                                value: 'first',
                                onActive: (id: string) => {
                                    activeId = id
                                },
                            }, () => 'first'),
                        })
                },
            })

            const wrapper = mount(Host)
            const item = wrapper.find('.c-list-item')

            await nextTick()
            await item.trigger('click')
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(activeId).toBeUndefined()
            expect(model.value).toBe(null)
        })

        it('disabled listbox реактивно включает и выключает интерактивность', async () => {
            const disabled = ref(true)
            const model = ref<string | null>(null)
            let activeId: string | undefined

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            disabled: disabled.value,
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => h(CListItem, {
                                value: 'first',
                                onActive: (id: string) => {
                                    activeId = id
                                },
                            }, () => 'first'),
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()

            let item = wrapper.find('.c-list-item')

            expect(wrapper.classes()).toContain('c-list--disabled')
            expect(wrapper.attributes('aria-disabled')).toBe('true')
            expect(wrapper.attributes('tabindex')).toBeUndefined()
            expect(item.attributes('tabindex')).toBeUndefined()

            await item.trigger('mouseenter')
            await item.trigger('click')
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(activeId).toBeUndefined()
            expect(model.value).toBe(null)

            disabled.value = false
            await nextTick()

            item = wrapper.find('.c-list-item')
            const itemId = item.attributes('id')

            expect(wrapper.classes()).not.toContain('c-list--disabled')
            expect(wrapper.attributes('aria-disabled')).toBeUndefined()
            expect(wrapper.attributes('tabindex')).toBe('0')
            expect(item.attributes('tabindex')).toBe('-1')

            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(activeId).toBe(itemId)
            expect(model.value).toBe('first')

            activeId = undefined
            model.value = null
            await nextTick()

            await item.trigger('click')
            await nextTick()

            expect(model.value).toBe('first')

            activeId = undefined
            model.value = null
            disabled.value = true
            await nextTick()

            item = wrapper.find('.c-list-item')

            expect(wrapper.classes()).toContain('c-list--disabled')
            expect(wrapper.attributes('aria-disabled')).toBe('true')
            expect(wrapper.attributes('tabindex')).toBeUndefined()
            expect(item.attributes('tabindex')).toBeUndefined()

            await item.trigger('mouseenter')
            await item.trigger('click')
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: 'Enter' })
            await nextTick()

            expect(activeId).toBeUndefined()
            expect(model.value).toBe(null)
        })

        it('multiple listbox: Ctrl+A выбирает только enabled items', async () => {
            const model = ref<string[]>([])

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            multiple: true,
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => [
                                h(CListItem, {
                                    disabled: true,
                                    value: 'first',
                                }, () => 'first'),
                                h(CListItem, { value: 'second' }, () => 'second'),
                                h(CListItem, { value: 'third' }, () => 'third'),
                            ],
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()
            await wrapper.trigger('keydown', {
                ctrlKey: true,
                key: 'a',
            })
            await nextTick()

            expect(model.value).toEqual(['second', 'third'])
        })

        it('multiple listbox: Shift+Arrow расширяет выбор по enabled диапазону', async () => {
            const model = ref<string[]>([])

            const Host = defineComponent({
                setup() {
                    return () =>
                        h(CList<string>, {
                            multiple: true,
                            variant: 'listbox',
                            modelValue: model.value,
                            'onUpdate:modelValue': (v: any) => {
                                model.value = v
                            },
                        }, {
                            default: () => [
                                h(CListItem, { value: 'first' }, () => 'first'),
                                h(CListItem, {
                                    disabled: true,
                                    value: 'second',
                                }, () => 'second'),
                                h(CListItem, { value: 'third' }, () => 'third'),
                            ],
                        })
                },
            })

            const wrapper = mount(Host)

            await nextTick()
            await wrapper.trigger('keydown', { key: 'ArrowDown' })
            await wrapper.trigger('keydown', { key: ' ' })
            await wrapper.trigger('keydown', {
                key: 'ArrowDown',
                shiftKey: true,
            })
            await nextTick()

            expect(model.value).toEqual(['first', 'third'])
        })
    })

    describe('tabindex', () => {
        it('variant=list не устанавливает tabindex', () => {
            const wrapper = mount(CList)
            expect(wrapper.attributes('tabindex')).toBeUndefined()
        })

        it('variant=listbox устанавливает tabindex="0" (доступен с клавиатуры)', () => {
            const wrapper = mount(CList, { props: { variant: 'listbox' } })
            expect(wrapper.attributes('tabindex')).toBe('0')
        })

        it('variant=menu устанавливает tabindex="0" (доступен с клавиатуры)', () => {
            const wrapper = mount(CList, { props: { variant: 'menu' } })
            expect(wrapper.attributes('tabindex')).toBe('0')
        })

        it('кастомный tabindex через attrs перекрывает вычисленный', () => {
            const wrapper = mount(CList, {
                props: { variant: 'listbox' },
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
