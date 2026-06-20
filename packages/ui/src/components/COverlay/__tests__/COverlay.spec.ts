import { mount } from '@vue/test-utils'
import {
    beforeEach,
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

import { clearOverlayStack } from '../../../composables/use-overlay-stack'
import { COverlay } from '../../index'

describe('COverlay', () => {
    beforeEach(() => {
        clearOverlayStack()
        document.body.innerHTML = ''
    })

    it('при modelValue=false не передаёт zIndex в слот', async () => {
        let slotZIndex: number | undefined

        mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: ({ zIndex }: { zIndex?: number }) => {
                    slotZIndex = zIndex
                    return h('div', 'content')
                },
            },
            attachTo: document.body,
        })

        await nextTick()

        expect(slotZIndex).toBeUndefined()
    })

    it('при modelValue=true передаёт zIndex >= 2000 в слот', async () => {
        let slotZIndex: number | undefined

        mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: ({ zIndex }: { zIndex?: number }) => {
                    slotZIndex = zIndex
                    return h('div', String(zIndex))
                },
            },
            attachTo: document.body,
        })

        await nextTick()

        expect(slotZIndex).toBeGreaterThanOrEqual(2000)
    })

    it('пробрасывает zIndex в слот после register', async () => {
        mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: { default: ({ zIndex }: { zIndex?: number }) => h('div', String(zIndex)) },
            attachTo: document.body,
        })

        await nextTick()

        const text = document.body.textContent ?? ''
        const value = parseInt(text, 10)
        expect(value).toBeGreaterThanOrEqual(2000)
    })

    it('по умолчанию телепортит в body', async () => {
        mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: { default: () => h('div', { class: 'overlay-content' }, 'teleported') },
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
            slots: { default: () => h('div', { class: 'overlay-content' }, 'custom target') },
            attachTo: document.body,
        })

        await nextTick()

        expect(target.querySelector('.overlay-content')).not.toBeNull()
        expect(target.textContent).toContain('custom target')
    })

    it('при переключении modelValue с false на true получает zIndex', async () => {
        let slotZIndex: number | undefined

        const wrapper = mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: ({ zIndex }: { zIndex?: number }) => {
                    slotZIndex = zIndex
                    return h('div', 'content')
                },
            },
            attachTo: document.body,
        })

        await nextTick()
        expect(slotZIndex).toBeUndefined()

        await wrapper.setProps({ modelValue: true })
        await nextTick()

        expect(slotZIndex).toBeGreaterThanOrEqual(2000)
    })

    it('при переключении modelValue с true на false теряет zIndex', async () => {
        let slotZIndex: number | undefined

        const wrapper = mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: {
                default: ({ zIndex }: { zIndex?: number }) => {
                    slotZIndex = zIndex
                    return h('div', 'content')
                },
            },
            attachTo: document.body,
        })

        await nextTick()
        expect(slotZIndex).toBeGreaterThanOrEqual(2000)

        await wrapper.setProps({ modelValue: false })
        await nextTick()

        expect(slotZIndex).toBeUndefined()
    })

    it('при unmount не бросает исключений, если overlay был открыт', async () => {
        const wrapper = mount(COverlay, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': () => {},
            },
            slots: { default: () => h('div', 'content') },
            attachTo: document.body,
        })

        await nextTick()

        expect(() => wrapper.unmount()).not.toThrow()
    })

    it('при unmount не бросает исключений, если overlay закрыт', async () => {
        const wrapper = mount(COverlay, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': () => {},
            },
            slots: { default: () => h('div', 'content') },
            attachTo: document.body,
        })

        await nextTick()

        expect(() => wrapper.unmount()).not.toThrow()
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
                }, { default: ({ zIndex }: { zIndex?: number }) => h('div', { class: 'content' }, String(zIndex)) })
            },
        })

        const wrapper = mount(Host, { attachTo: document.body })

        await nextTick()
        expect(document.body.querySelector('.content')?.textContent).toBe('undefined')

        wrapper.vm.model = true
        await nextTick()

        const text = document.body.querySelector('.content')?.textContent ?? ''
        expect(parseInt(text, 10)).toBeGreaterThanOrEqual(2000)

        wrapper.vm.model = false
        await nextTick()

        expect(document.body.querySelector('.content')?.textContent).toBe('undefined')
    })
})
