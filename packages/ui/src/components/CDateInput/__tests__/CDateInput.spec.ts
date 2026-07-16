import { mount } from '@vue/test-utils'
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

import { parseDate, resolveLocale } from '@/components/CDatePicker'
import { CInput } from '@/components/CInput'
import { $APP_API_KEY, $VUELAND_UI_KEY } from '@/constants'
import { wait } from '@/helpers'

import { CDateInput } from '../index'

// 15 июля 2026 — среда
const VALUE = new Date(2026, 6, 15)

const global = {
    provide: {
        [$APP_API_KEY as symbol]: {
            getScrollTop: () => 0,
            getScrollLeft: () => 0,
        },
    },
}

let mounted: ReturnType<typeof mount>[] = []

// CDateInput монтируется внутри хост-компонента с настоящим v-model:
// модель проверяем снаружи, как это делает пользователь библиотеки
function mountDateInput(
    props: Record<string, unknown> = {},
    slots?: Record<string, unknown>,
    options: Record<string, any> = {},
) {
    const {
        modelValue,
        ...rest
    } = props
    const model = shallowRef<unknown>(modelValue)
    const {
        global: customGlobal,
        ...mountOptions
    } = options
    const mergedGlobal = {
        ...global,
        ...(customGlobal ?? {}),
        provide: {
            ...global.provide,
            ...(customGlobal?.provide ?? {}),
        },
    }

    const wrapper = mount(defineComponent({
        setup() {
            return () => h(CDateInput as any, {
                ...rest,
                modelValue: model.value,
                'onUpdate:modelValue': (v: unknown) => {
                    model.value = v
                },
            }, slots)
        },
    }), {
        attachTo: document.body,
        ...mountOptions,
        global: mergedGlobal,
    })

    mounted.push(wrapper)

    return {
        wrapper,
        model,
    }
}

const input = (wrapper: ReturnType<typeof mount>) =>
    wrapper.get('.c-field-input')

async function openMenu(wrapper: ReturnType<typeof mount>) {
    await input(wrapper).trigger('focus')
    await wait()
    await nextTick()
}

const menuVisible = () => document.querySelector('.c-menu--visible')

const pickerCell = (text: string) =>
    Array.from(document.querySelectorAll<HTMLElement>('.c-date-picker-dates__cell'))
        .find((cell) => cell.textContent?.trim() === text)

const key = async (wrapper: ReturnType<typeof mount>, k: string) => {
    await input(wrapper).trigger('keydown', { key: k })
    await wait()
    await nextTick()
}

describe('CDateInput', () => {
    afterEach(() => {
        mounted.forEach((w) => w.unmount())
        mounted = []
        document.body.innerHTML = ''
    })

    it('отображает модель по формату', async () => {
        const { wrapper } = mountDateInput({ modelValue: VALUE })
        expect((input(wrapper).element as HTMLInputElement).value).toBe('15.07.2026')

        const custom = mountDateInput({
            modelValue: VALUE,
            format: 'yyyy-MM-dd',
        })
        expect((input(custom.wrapper).element as HTMLInputElement).value).toBe('2026-07-15')
    })

    it('фокус открывает меню с пикером', async () => {
        const { wrapper } = mountDateInput({ modelValue: VALUE })

        expect(menuVisible()).toBeNull()
        await openMenu(wrapper)
        expect(menuVisible()).not.toBeNull()
        expect(document.querySelector('.c-date-picker')).not.toBeNull()
    })

    it('клик по дате пишет её в модель', async () => {
        const { wrapper, model } = mountDateInput({ modelValue: VALUE })

        await openMenu(wrapper)
        pickerCell('20')!.click()
        await nextTick()

        expect(model.value).toBeInstanceOf(Date)
        expect((model.value as Date).getDate()).toBe(20)
        expect((input(wrapper).element as HTMLInputElement).value).toBe('20.07.2026')
    })

    it('клавиатура: ArrowDown открывает, стрелки ходят, Enter выбирает, Escape закрывает', async () => {
        const { wrapper, model } = mountDateInput({ modelValue: VALUE })

        await openMenu(wrapper)
        await key(wrapper, 'Escape')
        expect(menuVisible()).toBeNull()

        await key(wrapper, 'ArrowDown')
        expect(menuVisible()).not.toBeNull()

        await key(wrapper, 'ArrowRight')
        await key(wrapper, 'ArrowRight')
        await key(wrapper, 'Enter')

        expect((model.value as Date).getDate()).toBe(16)
        expect(menuVisible()).toBeNull()
    })

    it('правила валидации получают Date, а не строку', () => {
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            rules: [() => ({
                valid: true,
                message: '',
            })],
        })

        expect(wrapper.getComponent(CInput as any).props('validationValue')).toBe(VALUE)
    })

    it('locale доезжает до пикера и поля', async () => {
        const ru = resolveLocale('ru')
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            locale: 'ru',
            format: 'MMMM d',
        })

        expect((input(wrapper).element as HTMLInputElement).value).toBe(`${ru.months[6]} 15`)

        await openMenu(wrapper)
        expect(document.querySelector('.c-date-picker__header-display')?.textContent?.trim())
            .toBe(`${ru.monthsAbbr[6]} 2026`)
    })

    it('mondayFirst доезжает до пикера', async () => {
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            mondayFirst: true,
        })

        await openMenu(wrapper)

        expect(document.querySelector('.c-date-picker-dates__day')?.textContent?.trim()).toBe('Mon')
    })

    it('disabledDates, highlightedDates, minDate и maxDate доезжают до пикера', async () => {
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            disabledDates: { daysOfMonth: [16] },
            highlightedDates: [new Date(2026, 6, 18)],
            minDate: new Date(2026, 6, 10),
            maxDate: new Date(2026, 6, 20),
        })

        await openMenu(wrapper)

        expect(pickerCell('9')?.classList.contains('c-date-picker-dates__cell--disabled')).toBe(true)
        expect(pickerCell('16')?.classList.contains('c-date-picker-dates__cell--disabled')).toBe(true)
        expect(pickerCell('18')?.classList.contains('c-date-picker-dates__cell--highlighted')).toBe(true)
        expect(pickerCell('21')?.classList.contains('c-date-picker-dates__cell--disabled')).toBe(true)
    })

    it('clearable очищает модель в null', async () => {
        const { wrapper, model } = mountDateInput({
            modelValue: VALUE,
            clearable: true,
        })

        await openMenu(wrapper)
        await wrapper.get('.c-field__clear').trigger('click')

        expect(model.value).toBeNull()
        expect((input(wrapper).element as HTMLInputElement).value).toBe('')
    })

    it('disabled и readonly не открывают меню фокусом и клавиатурой', async () => {
        const disabled = mountDateInput({
            modelValue: VALUE,
            disabled: true,
        })

        await openMenu(disabled.wrapper)
        await key(disabled.wrapper, 'ArrowDown')
        expect(menuVisible()).toBeNull()

        disabled.wrapper.unmount()
        document.body.innerHTML = ''

        const readonly = mountDateInput({
            modelValue: VALUE,
            readonly: true,
        })

        await openMenu(readonly.wrapper)
        await key(readonly.wrapper, 'ArrowDown')
        expect(menuVisible()).toBeNull()
    })

    it('наследует field-пропсы и слоты CInput/CTextField', () => {
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            label: 'Shipping date',
            details: 'Next 30 days',
            readonly: true,
        }, {
            prepend: () => h('span', { class: 'prepend-probe' }, 'P'),
            append: () => h('span', { class: 'append-probe' }, 'A'),
            details: (props: any) => h('span', { class: 'details-probe' }, props.details),
        })

        expect(wrapper.find('.c-input').classes()).toContain('c-input--readonly')
        expect(wrapper.find('.c-field__label').text()).toBe('Shipping date')
        expect(wrapper.find('.prepend-probe').text()).toBe('P')
        expect(wrapper.find('.append-probe').text()).toBe('A')
        expect(wrapper.find('.details-probe').text()).toBe('Next 30 days')
    })

    it('details слот получает validation state от CInput', async () => {
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            rules: [() => ({
                valid: false,
                message: 'Blocked date',
            })],
        }, {
            details: (props: any) => h(
                'span',
                { class: props.hasError ? 'details-error' : 'details-ok' },
                props.errorMessage,
            ),
        })

        await (wrapper.getComponent(CInput as any).vm as any).validate()
        await wait()

        expect(wrapper.find('.details-error').text()).toBe('Blocked date')
    })

    it('preset CInput отдаёт стили полю и вложенному пикеру', async () => {
        const { wrapper } = mountDateInput({
            modelValue: VALUE,
            preset: 'input.calendar',
        }, undefined, {
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            input: {
                                calendar: {
                                    base: {
                                        root: ['preset-input-root'],
                                        field: { base: { root: ['preset-field-root'] } },
                                        datePicker: { base: { root: ['preset-picker-root'] } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        expect(wrapper.find('.c-input').classes()).toContain('preset-input-root')
        expect(wrapper.find('.c-field').classes()).toContain('preset-field-root')

        await openMenu(wrapper)
        expect(document.querySelector('.c-date-picker')?.classList.contains('preset-picker-root')).toBe(true)
    })

    it('слоты пикера форвардятся', async () => {
        const { wrapper } = mountDateInput({ modelValue: VALUE }, {
            week: (props: any) => h('div', { class: 'week-probe' }, props.days[0].label),
            date: (props: any) => h('span', { class: 'date-probe' }, `d${props.date}:${props.isSelected}`),
            'before-header': (props: any) => h('div', { class: 'before-header-probe' }, props.value),
            'before-body': (props: any) => h('div', { class: 'before-body-probe' }, props.selected?.date),
            footer: () => h('div', { class: 'footer-probe' }),
        })

        await openMenu(wrapper)

        expect(document.querySelector('.week-probe')?.textContent).toBe('Sun')
        expect(Array.from(document.querySelectorAll('.date-probe'))
            .some((cell) => cell.textContent === 'd15:true')).toBe(true)
        expect(document.querySelector('.before-header-probe')?.textContent).toBe('Jul 2026')
        expect(document.querySelector('.before-body-probe')?.textContent).toBe('15')
        expect(document.querySelector('.footer-probe')).not.toBeNull()
    })

    it('слот dates форвардится и может выбрать дату через onSelect', async () => {
        const { wrapper, model } = mountDateInput({ modelValue: VALUE }, {
            dates: (props: any) => h('button', {
                class: 'dates-probe',
                onClick: () => props.onSelect(parseDate(new Date(2026, 6, 24))),
            }, `${props.dates.length}:${props.dates.find((item: any) => item.isSelected)?.dateObj?.date}`),
        })

        await openMenu(wrapper)

        expect(document.querySelector('.dates-probe')?.textContent).toBe('34:15')
        const probe = document.querySelector('.dates-probe') as HTMLButtonElement

        probe.click()
        await nextTick()

        expect(model.value).toEqual(new Date(2026, 6, 24))
        expect(menuVisible()).toBeNull()
    })

    describe('typeable', () => {
        it('фокус открывает меню, Escape закрывает', async () => {
            const { wrapper } = mountDateInput({
                modelValue: VALUE,
                typeable: true,
            })

            await openMenu(wrapper)
            expect(menuVisible()).not.toBeNull()

            await key(wrapper, 'Escape')
            expect(menuVisible()).toBeNull()
        })

        it('сетка пикера следует за набранной датой', async () => {
            const { wrapper } = mountDateInput({ typeable: true })

            await openMenu(wrapper)
            await input(wrapper).setValue('15.08.2026')
            await nextTick()

            expect(document.querySelector('.c-date-picker__header-display')?.textContent?.trim())
                .toBe('Aug 2026')
        })

        it('коммитит только полную дату по маске', async () => {
            const { wrapper, model } = mountDateInput({ typeable: true })

            await input(wrapper).setValue('1')
            expect(model.value).toBeUndefined()

            await input(wrapper).setValue('07.20.2026')
            expect(model.value).toBeUndefined()

            await input(wrapper).setValue('20.07.2026')
            expect(model.value).toEqual(new Date(2026, 6, 20))
        })

        it('уважает формат', async () => {
            const { wrapper, model } = mountDateInput({
                typeable: true,
                format: 'yyyy-MM-dd',
            })

            await input(wrapper).setValue('2026-07-20')
            expect(model.value).toEqual(new Date(2026, 6, 20))
        })

        it('не пускает запрещённую дату', async () => {
            const { wrapper, model } = mountDateInput({
                typeable: true,
                disabledDates: { to: new Date(2026, 6, 18) },
            })

            await input(wrapper).setValue('15.07.2026')
            expect(model.value).toBeUndefined()

            await input(wrapper).setValue('25.07.2026')
            expect(model.value).toEqual(new Date(2026, 6, 25))
        })

        it('уважает minDate и maxDate при ручном вводе', async () => {
            const { wrapper, model } = mountDateInput({
                typeable: true,
                minDate: new Date(2026, 6, 10),
                maxDate: new Date(2026, 6, 20),
            })

            await input(wrapper).setValue('09.07.2026')
            expect(model.value).toBeUndefined()

            await input(wrapper).setValue('21.07.2026')
            expect(model.value).toBeUndefined()

            await input(wrapper).setValue('15.07.2026')
            expect(model.value).toEqual(new Date(2026, 6, 15))
        })

        it('readonly и disabled не коммитят ручной ввод', async () => {
            const readonly = mountDateInput({
                typeable: true,
                readonly: true,
            })

            await input(readonly.wrapper).setValue('15.07.2026')
            expect(readonly.model.value).toBeUndefined()

            const disabled = mountDateInput({
                typeable: true,
                disabled: true,
            })

            await input(disabled.wrapper).setValue('15.07.2026')
            expect(disabled.model.value).toBeUndefined()
        })
    })
})
