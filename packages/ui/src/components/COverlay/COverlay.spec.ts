import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import { COverlay } from '../index'

const register = vi.fn()
const unregister = vi.fn()

vi.mock('../../composables', () => ({
    useOverlayStack: () => ({
        register,
        unregister,
    }),
}))

describe('COverlay', () => {
    beforeEach(() => {
        register.mockReset()
        unregister.mockReset()
        register.mockReturnValue(2400)

        document.body.innerHTML = ''
    })

    it('при modelValue=false сразу вызывает unregister из-за immediate watch', () => {
        mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', 'content'),
            },
            attachTo: document.body,
        })

        expect(register).not.toHaveBeenCalled()
        expect(unregister).toHaveBeenCalledTimes(1)
    })

    it('при modelValue=true вызывает register на маунте', () => {
        mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', 'content'),
            },
            attachTo: document.body,
        })

        expect(register).toHaveBeenCalledTimes(1)
        expect(unregister).not.toHaveBeenCalled()
    })

    it('пробрасывает zIndex в слот после register', async () => {
        mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: ({ zIndex }: { zIndex?: number }) => h('div', String(zIndex)),
            },
            attachTo: document.body,
        })

        await nextTick()

        expect(document.body.textContent).toContain('2400')
    })

    it('по умолчанию телепортит в body', async () => {
        mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', { class: 'overlay-content' }, 'teleported'),
            },
            attachTo: document.body,
        })

        await nextTick()

        expect(document.body.querySelector('.overlay-content')).not.toBeNull()
        expect(document.body.textContent).toContain('teleported')
    })

    it('телепортит в кастомный target через prop to', async () => {
        const target = document.createElement('div')
        target.id = 'overlay-target'
        document.body.appendChild(target)

        mount(COverlay, {
            props: {
                to: '#overlay-target',
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', { class: 'overlay-content' }, 'custom target'),
            },
            attachTo: document.body,
        })

        await nextTick()

        expect(target.querySelector('.overlay-content')).not.toBeNull()
        expect(target.textContent).toContain('custom target')
    })

    it('при переключении modelValue с false на true вызывает register', async () => {
        const wrapper = mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', 'content'),
            },
            attachTo: document.body,
        })

        expect(unregister).toHaveBeenCalledTimes(1)
        expect(register).not.toHaveBeenCalled()

        await wrapper.setProps({ modelValue: true })

        expect(register).toHaveBeenCalledTimes(1)
    })

    it('при переключении modelValue с true на false вызывает unregister', async () => {
        const wrapper = mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', 'content'),
            },
            attachTo: document.body,
        })

        expect(register).toHaveBeenCalledTimes(1)
        expect(unregister).not.toHaveBeenCalled()

        await wrapper.setProps({ modelValue: false })

        expect(unregister).toHaveBeenCalledTimes(1)
    })

    it('при unmount вызывает unregister, если overlay был открыт', () => {
        const wrapper = mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', 'content'),
            },
            attachTo: document.body,
        })

        expect(register).toHaveBeenCalledTimes(1)
        expect(unregister).not.toHaveBeenCalled()

        wrapper.unmount()

        expect(unregister).toHaveBeenCalledTimes(1)
    })

    it('при unmount не вызывает дополнительный unregister, если overlay закрыт', () => {
        const wrapper = mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: () => h('div', 'content'),
            },
            attachTo: document.body,
        })

        expect(unregister).toHaveBeenCalledTimes(1)

        wrapper.unmount()

        expect(unregister).toHaveBeenCalledTimes(1)
    })

    it('корректно работает с реальным v-model через host-компонент', async () => {
        const Host = defineComponent({
            components: { COverlay },
            setup() {
                const model = ref(false)
                return { model }
            },
            render() {
                return h(COverlay, {
                    modelValue: this.model,
                    'onUpdate:modelValue': (val: boolean) => {
                        this.model = val
                    },
                }, {
                    default: ({ zIndex }: { zIndex?: number }) => h('div', { class: 'content' }, String(zIndex)),
                })
            },
        })

        const wrapper = mount(Host, {
            attachTo: document.body,
        })

        expect(unregister).toHaveBeenCalledTimes(1)
        expect(register).not.toHaveBeenCalled()

        wrapper.vm.model = true
        await nextTick()

        expect(register).toHaveBeenCalledTimes(1)
        expect(document.body.querySelector('.content')?.textContent).toBe('2400')

        wrapper.vm.model = false
        await nextTick()

        expect(unregister).toHaveBeenCalledTimes(2)
    })
})
