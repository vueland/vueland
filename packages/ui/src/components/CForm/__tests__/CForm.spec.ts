import { mount } from '@vue/test-utils'
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import {
    defineComponent,
    h,
    inject,
    nextTick,
    ref,
} from 'vue'

import { CForm } from '@/components'
import { $FORM_API_KEY } from '@/constants'

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

    it('рендерит корневой form с классом c-form и novalidate', () => {
        const wrapper = mount(CForm)

        expect(wrapper.element.tagName).toBe('FORM')
        expect(wrapper.classes()).toContain('c-form')
        expect(wrapper.attributes('novalidate')).toBeDefined()
    })

    it('выставляет aria-label при передаче label prop', () => {
        const wrapper = mount(CForm, { props: { label: 'Форма регистрации' } })

        expect(wrapper.attributes('aria-label')).toBe('Форма регистрации')
    })

    it('не выставляет aria-label без label prop', () => {
        const wrapper = mount(CForm)

        expect(wrapper.attributes('aria-label')).toBeUndefined()
    })

    it('рендерит содержимое default slot', () => {
        const wrapper = mount(CForm, { slots: { default: '<div class="inside">content</div>' } })

        expect(wrapper.find('.inside').exists()).toBe(true)
        expect(wrapper.text()).toContain('content')
    })

    it('передает validate в default slot', async () => {
        const slotValidateSpy = vi.fn()

        mount(CForm, {
            slots: {
                default: ({ validate }: any) => {
                    slotValidateSpy(validate)

                    return h(
                        'button',
                        {
                            class: 'from-slot',
                            onClick: () => validate(),
                        },
                        'run',
                    )
                },
            },
        })

        expect(slotValidateSpy).toHaveBeenCalledTimes(1)
        expect(typeof slotValidateSpy.mock.calls[0]?.[0]).toBe('function')
    })

    it('передает reset в default slot', () => {
        let slotReset: unknown

        mount(CForm, {
            slots: {
                default: ({ validate, reset }: any) => {
                    void validate
                    slotReset = reset
                    return h('div')
                },
            },
        })

        expect(typeof slotReset).toBe('function')
    })

    it('slot reset вызывает зарегистрированные reset-функции', async () => {
        const resetMock = vi.fn()

        const ResetField = defineComponent({
            name: 'ResetField',
            setup() {
                const formApi = inject<any>($FORM_API_KEY)
                formApi?.addReset(resetMock)
                return () => h('div')
            },
        })

        let slotReset: (() => void) | undefined

        mount(CForm, {
            slots: {
                default: ({ validate, reset }: any) => {
                    void validate
                    slotReset = reset
                    return h(ResetField)
                },
            },
        })

        slotReset!()
        await nextTick()

        expect(resetMock).toHaveBeenCalledTimes(1)
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

        const wrapper = mount(CForm, { slots: { default: () => h(RegisteringField, { validateFn: validateMock }) } })

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
            components: {
                CForm,
                RegisteringField,
            },
            setup() {
                return {
                    show,
                    validateMock,
                }
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
        const formRef = () => (wrapper.vm.$refs.formRef as any)

        await expect(formRef().validate()).resolves.toBe(true)
        expect(validateMock).toHaveBeenCalledTimes(1)

        show.value = false
        await nextTick()

        validateMock.mockClear()

        await expect(formRef().validate()).resolves.toBe(true)
        expect(validateMock).not.toHaveBeenCalled()
    })

    it('корректно работает с динамическим добавлением поля после маунта', async () => {
        const validateMock = vi.fn(() => true)
        const show = ref(false)

        const Host = defineComponent({
            components: {
                CForm,
                RegisteringField,
            },
            setup() {
                return {
                    show,
                    validateMock,
                }
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
        const formRef = () => (wrapper.vm.$refs.formRef as any)

        await expect(formRef().validate()).resolves.toBe(true)
        expect(validateMock).not.toHaveBeenCalled()

        show.value = true
        await nextTick()

        await expect(formRef().validate()).resolves.toBe(true)
        expect(validateMock).toHaveBeenCalledTimes(1)
    })

    it('slot validate использует те же зарегистрированные валидаторы, что и expose.validate', async () => {
        const validateMock = vi.fn(() => true)
        const slotButtonClick = vi.fn()

        const wrapper = mount(CForm, {
            slots: {
                default: ({ validate }: any) => [
                    h(RegisteringField, { validateFn: validateMock }),
                    h(
                        'button',
                        {
                            class: 'slot-btn',
                            onClick: async () => {
                                slotButtonClick(await validate())
                            },
                        },
                        'validate',
                    ),
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
            slots: { default: '<button type="submit" class="submit-btn">Submit</button>' },
        })

        const form = wrapper.find('form')
        const event = new Event('submit', {
            bubbles: true,
            cancelable: true,
        })
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

        const wrapper = mount(CForm, { slots: { default: () => h(PlainChild) } })

        expect(wrapper.find('.plain-child').exists()).toBe(true)
        await expect((wrapper.vm as any).validate()).resolves.toBe(true)
    })

    it('поддерживает несколько последовательных вызовов validate', async () => {
        const validateMock = vi.fn(() => true)

        const wrapper = mount(CForm, { slots: { default: () => h(RegisteringField, { validateFn: validateMock }) } })

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

    it('expose.reset вызывает все зарегистрированные reset-функции', async () => {
        const resetFirst = vi.fn()
        const resetSecond = vi.fn()

        const ResetField = defineComponent({
            name: 'ResetField',
            props: { resetFn: { type: Function, required: true } },
            setup(props) {
                const formApi = inject<any>($FORM_API_KEY)
                formApi?.addReset(props.resetFn)
                return () => h('div')
            },
            beforeUnmount() {
                const formApi = inject<any>($FORM_API_KEY)
                formApi?.removeReset(this.resetFn)
            },
        })

        const wrapper = mount(CForm, {
            slots: {
                default: () => [
                    h(ResetField, { resetFn: resetFirst }),
                    h(ResetField, { resetFn: resetSecond }),
                ],
            },
        })

        ;(wrapper.vm as any).reset()

        expect(resetFirst).toHaveBeenCalledTimes(1)
        expect(resetSecond).toHaveBeenCalledTimes(1)
    })

    it('expose.reset не вызывает reset размонтированного поля', async () => {
        const resetFn = vi.fn()
        const show = ref(true)

        const ResetField = defineComponent({
            name: 'ResetField',
            setup() {
                const formApi = inject<any>($FORM_API_KEY)
                formApi?.addReset(resetFn)
                return () => h('div')
            },
            beforeUnmount() {
                const formApi = inject<any>($FORM_API_KEY)
                formApi?.removeReset(resetFn)
            },
        })

        const Host = defineComponent({
            components: { CForm, ResetField },
            setup() { return { show } },
            template: '<CForm ref="formRef"><ResetField v-if="show" /></CForm>',
        })

        const wrapper = mount(Host)

        show.value = false
        await nextTick()

        ;(wrapper.vm.$refs.formRef as any).reset()

        expect(resetFn).not.toHaveBeenCalled()
    })

    it('эмитит submit при отправке формы', async () => {
        const wrapper = mount(CForm, { attachTo: document.body })

        wrapper.find('form').element.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
        await nextTick()

        expect(wrapper.emitted('submit')).toHaveLength(1)
        expect(wrapper.emitted('submit')![0][0]).toBeInstanceOf(Event)

        wrapper.unmount()
    })

    it('корректно удаляет только конкретный валидатор при размонтировании одного из нескольких полей', async () => {
        const first = vi.fn(() => true)
        const second = vi.fn(() => true)
        const third = vi.fn(() => true)

        const showSecond = ref(true)

        const Host = defineComponent({
            components: {
                CForm,
                RegisteringField,
            },
            setup() {
                return {
                    first,
                    second,
                    third,
                    showSecond,
                }
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
        const formRef = () => (wrapper.vm.$refs.formRef as any)

        await expect(formRef().validate()).resolves.toBe(true)
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
        expect(third).toHaveBeenCalledTimes(1)

        first.mockClear()
        second.mockClear()
        third.mockClear()

        showSecond.value = false
        await nextTick()

        await expect(formRef().validate()).resolves.toBe(true)

        expect(first).toHaveBeenCalledTimes(1)
        expect(second).not.toHaveBeenCalled()
        expect(third).toHaveBeenCalledTimes(1)
    })

    describe('async валидаторы', () => {
        it('validate ждёт async валидаторы и возвращает true', async () => {
            const asyncValid = vi.fn(async () => true)

            const wrapper = mount(CForm, {
                slots: { default: () => h(RegisteringField, { validateFn: asyncValid }) },
            })

            await expect((wrapper.vm as any).validate()).resolves.toBe(true)
            expect(asyncValid).toHaveBeenCalledTimes(1)
        })

        it('validate возвращает false если async валидатор отклонил', async () => {
            const asyncInvalid = vi.fn(async () => false)

            const wrapper = mount(CForm, {
                slots: { default: () => h(RegisteringField, { validateFn: asyncInvalid }) },
            })

            await expect((wrapper.vm as any).validate()).resolves.toBe(false)
        })

        it('validate запускает sync и async валидаторы параллельно', async () => {
            const order: string[] = []

            const syncFn = vi.fn(() => {
                order.push('sync')
                return true
            })
            const asyncFn = vi.fn(async () => {
                order.push('async')
                return true
            })

            const wrapper = mount(CForm, {
                slots: {
                    default: () => [
                        h(RegisteringField, { validateFn: syncFn }),
                        h(RegisteringField, { validateFn: asyncFn }),
                    ],
                },
            })

            await expect((wrapper.vm as any).validate()).resolves.toBe(true)
            expect(order).toEqual(['sync', 'async'])
        })

        it('validate возвращает false если один из нескольких async валидаторов не прошёл', async () => {
            const first = vi.fn(async () => true)
            const second = vi.fn(async () => false)
            const third = vi.fn(async () => true)

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
            expect(third).toHaveBeenCalledTimes(1)
        })
    })
})
