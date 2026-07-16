import { flushPromises, mount } from '@vue/test-utils'
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
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
    vi.restoreAllMocks()
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

    it('переключает одиночное value в скалярной модели', async () => {
        const { model, input } = mountCheckbox({
            modelValue: null,
            value: 'accepted',
        })

        await input().setValue(true)
        expect(model.value).toBe('accepted')

        await input().setValue(false)
        expect(model.value).toBeNull()
    })

    it('использует внешний id для инпута и aria-связей', () => {
        const { wrapper, input } = mountCheckbox({
            id: 'terms-checkbox',
            label: 'Terms',
            details: 'Required for signup',
        })

        expect(input().attributes('id')).toBe('terms-checkbox')
        expect(wrapper.find('.c-checkbox__label').attributes('for')).toBe('terms-checkbox')
        expect(input().attributes('aria-labelledby')).toBe('terms-checkbox-label')
        expect(input().attributes('aria-describedby')).toBe('terms-checkbox-details')
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
        expect(root().classes()).not.toContain('c-checkbox--focus-visible')
        expect(wrapper.find('.c-input').classes()).toContain('c-input--focused')

        await input().trigger('blur')
        expect(root().classes()).not.toContain('c-checkbox--focus-visible')
        expect(wrapper.find('.c-input').classes()).not.toContain('c-input--focused')
    })

    it('показывает визуальный фокус только для focus-visible', async () => {
        const originalMatches = Element.prototype.matches
        const matches = vi.spyOn(Element.prototype, 'matches')
            .mockImplementation(function(this: Element, selector) {
                if (selector === ':focus-visible') return false

                return originalMatches.call(this, selector)
            })
        const { input, root } = mountCheckbox({ label: 'Accept' })

        await input().trigger('focus')
        expect(root().classes()).not.toContain('c-checkbox--focus-visible')

        await input().trigger('blur')
        matches.mockImplementation(function(this: Element, selector) {
            if (selector === ':focus-visible') return true

            return originalMatches.call(this, selector)
        })

        await input().trigger('focus')
        expect(root().classes()).toContain('c-checkbox--focus-visible')

        await input().trigger('blur')
        expect(root().classes()).not.toContain('c-checkbox--focus-visible')
    })

    it('красит бокс через color-токен', () => {
        const { root } = mountCheckbox({ color: 'teal-lighten-1' })

        expect(root().classes()).toContain('text-teal-lighten-1')
    })

    it('красит бокс через сырой CSS color', () => {
        const { root } = mountCheckbox({ color: 'rgb(255, 90, 90)' })

        expect(root().classes()).toContain('text-[rgb(255,90,90)]')
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

    it('задаёт размер бокса через size', () => {
        const { wrapper } = mountCheckbox({ size: 32 })

        expect(wrapper.find('.c-checkbox__icon').attributes('style'))
            .toContain('--c-checkbox-size: 32px')
    })

    it('задаёт строковый размер бокса через size', () => {
        const { wrapper } = mountCheckbox({ size: '1.75rem' })

        expect(wrapper.find('.c-checkbox__icon').attributes('style'))
            .toContain('--c-checkbox-size: 1.75rem')
    })

    it('без size оставляет размер за стилями', () => {
        const { wrapper } = mountCheckbox()

        expect(wrapper.find('.c-checkbox__icon').attributes('style')).toBeUndefined()
    })

    it('рисует галочку и даш внутри одного CIcon svg-контейнера', () => {
        const { wrapper } = mountCheckbox({ modelValue: true })

        const marks = wrapper.find('svg.c-checkbox__marks')
        const check = marks.find('.c-checkbox__check')
        const indeterminate = marks.find('.c-checkbox__indet')

        expect(marks.attributes('viewBox')).toBe('0 0 24 24')
        // pathLength нормирует длину к 1 — на этом держится stroke-dashoffset.
        expect(check.attributes('pathLength')).toBe('1')
        expect(check.attributes('d')).toBe('M1.73,12.91 8.1,19.28 22.79,4.59')
        expect(indeterminate.attributes('d')).toBe('M4,14H20V10H4')
        // Бокс остаётся CSS-рамкой, через CIcon проходит только единый SVG слой marks.
        expect(wrapper.find('.c-checkbox__box').exists()).toBe(true)
        expect(wrapper.findAll('.c-icon')).toHaveLength(1)
    })

    it('берёт геометрию и viewBox меток из переопределённого алиаса', () => {
        const wrapper = mount(CCheckbox as any, {
            props: { modelValue: true },
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        icons: {
                            aliases: {
                                checkboxCheckMark: {
                                    path: 'M100,320 260,480 540,160',
                                    viewBox: '0 0 640 640',
                                },
                            },
                        },
                    },
                },
            },
        })

        mounted.push(wrapper)

        const marks = wrapper.find('svg.c-checkbox__marks')

        expect(marks.attributes('viewBox')).toBe('0 0 640 640')
        expect(marks.find('.c-checkbox__check').attributes('d'))
            .toBe('M100,320 260,480 540,160')
        // Непереопределённый даш продолжает приходить из встроенного реестра.
        expect(marks.find('.c-checkbox__indet').attributes('d')).toBe('M4,14H20V10H4')
    })

    it('не дублирует color-класс на нативном инпуте', () => {
        const { input, root } = mountCheckbox({
            color: 'teal',
            label: 'Accept',
        })

        expect(root().classes()).toContain('text-teal')
        expect(input().classes()).not.toContain('text-teal')
        // aria-passthrough при этом не пострадал.
        expect(input().attributes('aria-labelledby')).toBeTruthy()
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

    it('показывает details и связывает их с инпутом', () => {
        const { wrapper, input } = mountCheckbox({
            label: 'Accept',
            details: 'Helpful hint',
        })

        expect(wrapper.find('.c-input__details').text()).toBe('Helpful hint')
        expect(input().attributes('aria-describedby')).toBe(`${input().attributes('id')}-details`)
    })

    it('скрывает details при no-details', () => {
        const { wrapper, input } = mountCheckbox({
            label: 'Accept',
            details: 'Helpful hint',
            noDetails: true,
        })

        expect(wrapper.find('.c-input__details').exists()).toBe(false)
        expect(input().attributes('aria-describedby')).toBeUndefined()
    })

    it('не рендерит текст деталей, когда их нет', () => {
        const { wrapper } = mountCheckbox({ label: 'Accept' })

        expect(wrapper.find('.c-checkbox__details').exists()).toBe(false)
    })

    it('отдаёт слоту details внешнее состояние подсказки', () => {
        const { wrapper } = mountCheckbox({
            label: 'Accept',
            details: 'Helpful hint',
        }, {
            details: ({
                details,
                errorMessage,
                hasError,
            }: {
                details?: string
                errorMessage?: string
                hasError: boolean
            }) => h('span', { class: 'custom-details' }, `${hasError}:${errorMessage ?? ''}:${details}`),
        })

        expect(wrapper.find('.custom-details').text()).toBe('false::Helpful hint')
    })

    it('отдаёт слоту icon текущее состояние', () => {
        const { wrapper } = mountCheckbox({ modelValue: true }, {
            icon: ({ checked, indeterminate }: { checked: boolean, indeterminate: boolean }) =>
                h('i', { class: 'custom-icon' }, `${checked}:${indeterminate}`),
        })

        expect(wrapper.find('.custom-icon').text()).toBe('true:false')
    })

    it('отдаёт слоту icon indeterminate-состояние', () => {
        const { wrapper } = mountCheckbox({
            modelValue: false,
            indeterminate: true,
        }, {
            icon: ({ checked, indeterminate }: { checked: boolean, indeterminate: boolean }) =>
                h('i', { class: 'custom-icon' }, `${checked}:${indeterminate}`),
        })

        expect(wrapper.find('.custom-icon').text()).toBe('false:true')
    })

    it('рендерит дефолтный слот вместо подписи', () => {
        const { wrapper } = mountCheckbox({ label: 'Accept' }, {
            default: () => h('b', { class: 'custom-label' }, 'Terms'),
        })

        expect(wrapper.find('.custom-label').text()).toBe('Terms')
        expect(wrapper.find('.c-checkbox__label').text()).toBe('Terms')
    })

    it('отдаёт дефолтному слоту текущее состояние', () => {
        const { wrapper } = mountCheckbox({
            modelValue: true,
            indeterminate: true,
        }, {
            default: ({ checked, indeterminate }: { checked: boolean, indeterminate: boolean }) =>
                h('b', { class: 'custom-label' }, `${checked}:${indeterminate}`),
        })

        expect(wrapper.find('.custom-label').text()).toBe('true:true')
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

        const originalMatches = Element.prototype.matches
        const matches = vi.spyOn(Element.prototype, 'matches')
            .mockImplementation(function(this: Element, selector) {
                if (selector === ':focus-visible') return false

                return originalMatches.call(this, selector)
            })

        await input().trigger('focus')
        expect(root().classes()).toContain('checked-root')
        expect(root().classes()).not.toContain('focused-root')

        await input().trigger('blur')
        matches.mockImplementation(function(this: Element, selector) {
            if (selector === ':focus-visible') return true

            return originalMatches.call(this, selector)
        })

        // focus-visible приоритетнее checked.
        await input().trigger('focus')
        expect(root().classes()).toContain('focused-root')
        expect(root().classes()).not.toContain('checked-root')
    })
})
