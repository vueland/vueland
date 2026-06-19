import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, inject, nextTick, ref } from 'vue'

import { $FORM_API_KEY } from '../../constants'
import { CForm } from '../index'

type FormAPI = {
    add: (fn: () => boolean) => void
    remove: (fn: () => boolean) => void
}

const RegisteringField = defineComponent({
    name: 'RegisteringField',
    props: {
        validateFn: {
            type: Function,
            required: true,
        },
    },
    setup(props) {
        const formApi = inject<FormAPI | undefined>($FORM_API_KEY)
        const validate = props.validateFn as () => boolean

        formApi?.add(validate)

        return () => h('div', { class: 'registering-field' })
    },
    beforeUnmount() {
        const formApi = inject<FormAPI | undefined>($FORM_API_KEY)
        formApi?.remove(this.validateFn as () => boolean)
    },
})

describe('CForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('рендерит корневой form с классом c-form', () => {
        const wrapper = mount(CForm)

        expect(wrapper.element.tagName).toBe('FORM')
        expect(wrapper.classes()).toContain('c-form')
    })

    it('рендерит содержимое default slot', () => {
        const wrapper = mount(CForm, {
            slots: {
                default: '<div class="inside">content</div>',
            },
        })

        expect(wrapper.find('.inside').exists()).toBe(true)
        expect(wrapper.text()).toContain('content')
    })

    it('передает validate в default slot', async () => {
        const slotValidateSpy = vi.fn()

        mount(CForm, {
            slots: {
                default: ({ validate }: { validate: () => Promise<boolean> }) => {
                    slotValidateSpy(validate)

                    return h('button', {
                        class: 'from-slot',
                        onClick: () => validate(),
                    }, 'run')
                },
            },
        })

        expect(slotValidateSpy).toHaveBeenCalledTimes(1)
        expect(typeof slotValidateSpy.mock.calls[0]?.[0]).toBe('function')
    })

    it('expose.validate доступен через ref', async () => {
        const wrapper = mount(CForm)

        expect(typeof (wrapper.vm as any).validate).toBe('function')

        const result = await (wrapper.vm as any).validate()

        expect(result).toBe(true)
    })

    it('validate возвращает true если валидаторов нет', async () => {
        const wrapper = mount(CForm)

        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
    })

    it('регистрирует валидатор дочернего компонента и вызывает его при validate', async () => {
        const validateMock = vi.fn(() => true)

        const wrapper = mount(CForm, {
            slots: {
                default: () => h(RegisteringField, { validateFn: validateMock }),
            },
        })

        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
        expect(validateMock).toHaveBeenCalledTimes(1)
    })

    it('возвращает false если хотя бы один валидатор вернул false', async () => {
        const first = vi.fn(() => true)
        const second = vi.fn(() => false)

        const wrapper = mount(CForm, {
            slots: {
                default: () => [
                    h(RegisteringField, { validateFn: first }),
                    h(RegisteringField, { validateFn: second }),
                ],
            },
        })

        await expect((wrapper.vm as any).validate()).resolves.toBe(false)
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
    })

    it('валидирует все поля сразу', async () => {
        const first = vi.fn(() => true)
        const second = vi.fn(() => false)
        const third = vi.fn(() => true)

        const wrapper = mount(CForm, {
            slots: {
                default: () => [
                    h(RegisteringField, { validateFn: first }),
                    h(RegisteringField, { validateFn: second }),
                    h(RegisteringField, { validateFn: third }),
                ],
            },
        })

        await expect((wrapper.vm as any).validate()).resolves.toBe(false)

        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
        expect(third).toHaveBeenCalled()
    })

    it('вызывает все валидаторы если все они возвращают true', async () => {
        const first = vi.fn(() => true)
        const second = vi.fn(() => true)
        const third = vi.fn(() => true)

        const wrapper = mount(CForm, {
            slots: {
                default: () => [
                    h(RegisteringField, { validateFn: first }),
                    h(RegisteringField, { validateFn: second }),
                    h(RegisteringField, { validateFn: third }),
                ],
            },
        })

        await expect((wrapper.vm as any).validate()).resolves.toBe(true)

        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
        expect(third).toHaveBeenCalledTimes(1)
    })

    it('удаляет валидатор при размонтировании поля', async () => {
        const validateMock = vi.fn(() => true)
        const show = ref(true)

        const Host = defineComponent({
            components: { CForm, RegisteringField },
            setup() {
                return { show, validateMock }
            },
            template: `
                <CForm ref="formRef">
                    <RegisteringField
                        v-if="show"
                        :validate-fn="validateMock"
                    />
                </CForm>
            `,
        })

        const wrapper = mount(Host)
        const form = wrapper.findComponent(CForm)

        await expect((form.vm as any).validate()).resolves.toBe(true)
        expect(validateMock).toHaveBeenCalledTimes(1)

        show.value = false
        await nextTick()

        validateMock.mockClear()

        await expect((form.vm as any).validate()).resolves.toBe(true)
        expect(validateMock).not.toHaveBeenCalled()
    })

    it('корректно работает с динамическим добавлением поля после маунта', async () => {
        const validateMock = vi.fn(() => true)
        const show = ref(false)

        const Host = defineComponent({
            components: { CForm, RegisteringField },
            setup() {
                return { show, validateMock }
            },
            template: `
                <CForm ref="formRef">
                    <RegisteringField
                        v-if="show"
                        :validate-fn="validateMock"
                    />
                </CForm>
            `,
        })

        const wrapper = mount(Host)
        const form = wrapper.findComponent(CForm)

        await expect((form.vm as any).validate()).resolves.toBe(true)
        expect(validateMock).not.toHaveBeenCalled()

        show.value = true
        await nextTick()

        await expect((form.vm as any).validate()).resolves.toBe(true)
        expect(validateMock).toHaveBeenCalledTimes(1)
    })

    it('slot validate использует те же зарегистрированные валидаторы, что и expose.validate', async () => {
        const validateMock = vi.fn(() => true)
        const slotButtonClick = vi.fn()

        const wrapper = mount(CForm, {
            slots: {
                default: ({ validate }: { validate: () => Promise<boolean> }) => [
                    h(RegisteringField, { validateFn: validateMock }),
                    h('button', {
                        class: 'slot-btn',
                        onClick: async () => {
                            slotButtonClick(await validate())
                        },
                    }, 'validate'),
                ],
            },
        })

        await wrapper.find('.slot-btn').trigger('click')

        expect(validateMock).toHaveBeenCalledTimes(1)
        expect(slotButtonClick).toHaveBeenCalledWith(true)
    })

    it('предотвращает нативный submit формы', async () => {
        const wrapper = mount(CForm, {
            attachTo: document.body,
            slots: {
                default: '<buttonPresets type="submit" class="submit-btn">Submit</buttonPresets>',
            },
        })

        const form = wrapper.find('form')
        const event = new Event('submit', { bubbles: true, cancelable: true })
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

        form.element.dispatchEvent(event)
        await nextTick()

        expect(preventDefaultSpy).toHaveBeenCalled()
        expect(event.defaultPrevented).toBe(true)

        wrapper.unmount()
    })

    it('не ломается если дочерний компонент находится вне контекста регистрации', async () => {
        const PlainChild = defineComponent({
            name: 'PlainChild',
            setup() {
                return () => h('div', { class: 'plain-child' }, 'plain')
            },
        })

        const wrapper = mount(CForm, {
            slots: {
                default: () => h(PlainChild),
            },
        })

        expect(wrapper.find('.plain-child').exists()).toBe(true)
        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
    })

    it('поддерживает несколько последовательных вызовов validate', async () => {
        const validateMock = vi.fn(() => true)

        const wrapper = mount(CForm, {
            slots: {
                default: () => h(RegisteringField, { validateFn: validateMock }),
            },
        })

        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
        await expect((wrapper.vm as any).validate()).resolves.toBe(true)

        expect(validateMock).toHaveBeenCalledTimes(3)
    })

    it('сохраняет порядок вызова валидаторов', async () => {
        const calls: string[] = []

        const first = vi.fn(() => {
            calls.push('first')
            return true
        })

        const second = vi.fn(() => {
            calls.push('second')
            return true
        })

        const third = vi.fn(() => {
            calls.push('third')
            return true
        })

        const wrapper = mount(CForm, {
            slots: {
                default: () => [
                    h(RegisteringField, { validateFn: first }),
                    h(RegisteringField, { validateFn: second }),
                    h(RegisteringField, { validateFn: third }),
                ],
            },
        })

        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
        expect(calls).toEqual(['first', 'second', 'third'])
    })

    it('корректно удаляет только конкретный валидатор при размонтировании одного из нескольких полей', async () => {
        const first = vi.fn(() => true)
        const second = vi.fn(() => true)
        const third = vi.fn(() => true)

        const showSecond = ref(true)

        const Host = defineComponent({
            components: { CForm, RegisteringField },
            setup() {
                return { first, second, third, showSecond }
            },
            template: `
                <CForm ref="formRef">
                    <RegisteringField :validate-fn="first" />
                    <RegisteringField
                        v-if="showSecond"
                        :validate-fn="second"
                    />
                    <RegisteringField :validate-fn="third" />
                </CForm>
            `,
        })

        const wrapper = mount(Host)
        const form = wrapper.findComponent(CForm)

        await expect((form.vm as any).validate()).resolves.toBe(true)
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
        expect(third).toHaveBeenCalledTimes(1)

        first.mockClear()
        second.mockClear()
        third.mockClear()

        showSecond.value = false
        await nextTick()

        await expect((form.vm as any).validate()).resolves.toBe(true)

        expect(first).toHaveBeenCalledTimes(1)
        expect(second).not.toHaveBeenCalled()
        expect(third).toHaveBeenCalledTimes(1)
    })
})
