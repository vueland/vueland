import { flushPromises, mount } from '@vue/test-utils'
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
    shallowRef,
} from 'vue'

import { CCheckbox } from '@/components'
import { $VUELAND_UI_KEY } from '@/constants'

// Набор инпута с вложенным пресетом чекбокса: у каждого состояния — свои классы.
const presets = {
    input: {
        base: {
            checkbox: {
                base: {
                    root: ['base-root'],
                    icon: ['base-icon'],
                    label: ['base-label'],
                },
                checked: { root: ['checked-root'] },
                focused: { root: ['focused-root'] },
                indeterminate: { root: ['indeterminate-root'] },
                disabled: { root: ['disabled-root'] },
            },
        },
    },
}

let mounted: ReturnType<typeof mount>[] = []

// CCheckbox монтируется внутри хост-компонента с настоящим v-model:
// модель проверяем снаружи, как это делает пользователь библиотеки.
function mountCheckbox(props: Record<string, unknown> = {}, slots?: Record<string, unknown>) {
    const {
        modelValue,
        indeterminate,
        ...rest
    } = props

    const model = shallowRef<unknown>(modelValue ?? false)
    const mixed = shallowRef<boolean>(!!indeterminate)

    const wrapper = mount(defineComponent({
        setup() {
            return () => h(CCheckbox as any, {
                ...rest,
                modelValue: model.value,
                indeterminate: mixed.value,
                'onUpdate:modelValue': (v: unknown) => {
                    model.value = v
                },
                'onUpdate:indeterminate': (v: boolean) => {
                    mixed.value = v
                },
            }, slots)
        },
    }), {
        attachTo: document.body,
        global: {
            provide: { [$VUELAND_UI_KEY as symbol]: { presets } },
        },
    })

    mounted.push(wrapper)

    return {
        wrapper,
        model,
        mixed,
        input: () => wrapper.find('input[type="checkbox"]'),
        root: () => wrapper.find('.c-checkbox'),
    }
}

afterEach(() => {
    mounted.forEach(w => w.unmount())
    mounted = []
})

describe('CCheckbox', () => {
    it('рендерит нативный чекбокс с подписью без глобальной регистрации', () => {
        const { wrapper, input } = mountCheckbox({ label: 'Accept' })

        expect(input().exists()).toBe(true)
        expect(wrapper.find('.c-checkbox__label').text()).toBe('Accept')
    })

    it('связывает подпись с инпутом по id', () => {
        const { wrapper, input } = mountCheckbox({ label: 'Accept' })

        const id = input().attributes('id')
        const label = wrapper.find('.c-checkbox__label')

        expect(id).toBeTruthy()
        expect(label.attributes('for')).toBe(id)
        expect(label.attributes('id')).toBe(`${id}-label`)
        expect(input().attributes('aria-labelledby')).toBe(`${id}-label`)
    })

    it('переключает булеву модель', async () => {
        const { model, input } = mountCheckbox({ modelValue: false })

        await input().setValue(true)
        expect(model.value).toBe(true)

        await input().setValue(false)
        expect(model.value).toBe(false)
    })

    it('добавляет и убирает value из модели-массива', async () => {
        const { model, input } = mountCheckbox({
            modelValue: ['a'],
            value: 'b',
        })

        await input().setValue(true)
        expect(model.value).toEqual(['a', 'b'])

        await input().setValue(false)
        expect(model.value).toEqual(['a'])
    })

    it('отмечен, когда value уже лежит в модели-массиве', () => {
        const { input } = mountCheckbox({
            modelValue: ['a', 'b'],
            value: 'b',
        })

        expect((input().element as HTMLInputElement).checked).toBe(true)
    })

    it('не переключается в readonly и не трогает модель', async () => {
        const {
            model,
            input,
            root,
        } = mountCheckbox({
            modelValue: false,
            readonly: true,
        })

        await input().trigger('click')

        expect(model.value).toBe(false)
        expect(root().classes()).toContain('c-checkbox--readonly')
        expect(input().attributes('aria-readonly')).toBe('true')
        // readonly — не валидный атрибут нативного чекбокса.
        expect(input().attributes('readonly')).toBeUndefined()
    })

    it('не переключается в disabled', async () => {
        const {
            model,
            input,
            root,
        } = mountCheckbox({
            modelValue: false,
            disabled: true,
        })

        expect(input().attributes('disabled')).toBeDefined()
        expect(root().classes()).toContain('c-checkbox--disabled')

        await input().trigger('click')
        expect(model.value).toBe(false)
    })

    it('прокидывает фокус в CInput', async () => {
        const {
            wrapper,
            input,
            root,
        } = mountCheckbox({ label: 'Accept' })

        await input().trigger('focus')
        expect(root().classes()).toContain('c-checkbox--focused')
        expect(wrapper.find('.c-input').classes()).toContain('c-input--focused')

        await input().trigger('blur')
        expect(root().classes()).not.toContain('c-checkbox--focused')
        expect(wrapper.find('.c-input').classes()).not.toContain('c-input--focused')
    })

    it('ставит indeterminate на нативный инпут и снимает его при переключении', async () => {
        const {
            mixed,
            model,
            input,
            root,
        } = mountCheckbox({
            modelValue: false,
            indeterminate: true,
        })

        expect((input().element as HTMLInputElement).indeterminate).toBe(true)
        expect(root().classes()).toContain('c-checkbox--indeterminate')

        await input().setValue(true)
        await nextTick()

        expect(mixed.value).toBe(false)
        expect(model.value).toBe(true)
        expect((input().element as HTMLInputElement).indeterminate).toBe(false)
    })

    it('прокидывает size в иконку', () => {
        const { wrapper } = mountCheckbox({ size: 32 })

        expect(wrapper.find('.c-icon').attributes('style')).toContain('32px')
    })

    it('показывает ошибку валидации и помечает инпут', async () => {
        const { wrapper, input } = mountCheckbox({
            modelValue: false,
            label: 'Accept',
            rules: [(v: boolean) => ({
                valid: !!v,
                message: 'Required',
            })],
        })

        // Валидация по блюру — она есть только потому, что фокус доходит до CInput.
        await input().trigger('focus')
        await input().trigger('blur')
        await flushPromises()

        expect(wrapper.find('.c-input__details').text()).toBe('Required')
        expect(input().attributes('aria-invalid')).toBe('true')

        await input().setValue(true)
        await flushPromises()

        expect(wrapper.find('.c-input__details').text()).toBe('')
        expect(input().attributes('aria-invalid')).toBeUndefined()
    })

    it('не рендерит текст деталей, когда их нет', () => {
        const { wrapper } = mountCheckbox({ label: 'Accept' })

        expect(wrapper.find('.c-checkbox__details').exists()).toBe(false)
    })

    it('отдаёт слоту icon текущее состояние', () => {
        const { wrapper } = mountCheckbox({ modelValue: true }, {
            icon: ({ checked, indeterminate }: { checked: boolean, indeterminate: boolean }) =>
                h('i', { class: 'custom-icon' }, `${checked}:${indeterminate}`),
        })

        expect(wrapper.find('.custom-icon').text()).toBe('true:false')
    })

    it('рендерит дефолтный слот вместо подписи', () => {
        const { wrapper } = mountCheckbox({ label: 'Accept' }, {
            default: () => h('b', { class: 'custom-label' }, 'Terms'),
        })

        expect(wrapper.find('.custom-label').text()).toBe('Terms')
        expect(wrapper.find('.c-checkbox__label').text()).toBe('Terms')
    })

    it('обновляет дефолтный слот при смене данных', async () => {
        const text = shallowRef('Terms')

        const wrapper = mount(defineComponent({
            setup() {
                return () => h(CCheckbox as any, { modelValue: false }, {
                    default: () => h('span', { class: 'custom-label' }, text.value),
                })
            },
        }))

        mounted.push(wrapper)

        text.value = 'Policy'
        await nextTick()

        expect(wrapper.find('.custom-label').text()).toBe('Policy')
    })

    it('применяет зоны пресета и схлопывает состояния по приоритету', async () => {
        const { input, root } = mountCheckbox({
            modelValue: false,
            preset: 'input',
        })

        expect(root().classes()).toContain('base-root')
        expect(root().find('.c-checkbox__icon').classes()).toContain('base-icon')
        expect(root().find('.c-checkbox__label').classes()).toContain('base-label')

        await input().setValue(true)
        expect(root().classes()).toContain('checked-root')

        // focused приоритетнее checked.
        await input().trigger('focus')
        expect(root().classes()).toContain('focused-root')
        expect(root().classes()).not.toContain('checked-root')
    })
})
