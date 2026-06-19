import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject, nextTick, ref } from 'vue'

import { $LIST_API_KEY } from '../../../constants'
import { CList } from '../../index'

type ListApi<T> = {
    model: { value: T | T[] | null }
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

        const wrapper = mount(CList<number>, {
            slots: {
                default: () => h(CProbe),
            },
        })

        const probe = wrapper.findComponent(CProbe)

        expect((probe.vm as any).api).toBeTruthy()
        expect(typeof (probe.vm as any).api.select).toBe('function')
        expect(typeof (probe.vm as any).api.unselect).toBe('function')
        expect(typeof (probe.vm as any).api.isActive).toBe('function')
        expect((probe.vm as any).api.model.value).toBe(null)
    })

    it('пробрасывает class из attrs', () => {
        const wrapper = mount(CList, {
            attrs: {
                class: 'custom-list another-class',
            },
        })

        expect(wrapper.classes()).toContain('c-list')
        expect(wrapper.classes()).toContain('custom-list')
        expect(wrapper.classes()).toContain('another-class')
    })

    it('добавляет класс readonly', () => {
        const wrapper = mount(CList, {
            props: {
                readonly: true,
            },
        })

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
