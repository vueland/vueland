import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import { computed, h } from 'vue'

import {
    CDatePicker,
    type DatePickerSlotApi,
    dateToFormatString,
} from '@/components/CDatePicker'
import CDatePickerDates from '@/components/CDatePicker/CDatePickerDates.vue'
import CDatePickerMonths from '@/components/CDatePicker/CDatePickerMonths.vue'
import CDatePickerYears from '@/components/CDatePicker/CDatePickerYears.vue'
import {
    formatDate,
    isValidDateValue,
    parseDate,
    parseDateString,
} from '@/components/CDatePicker/helpers'
import { resolveLocale } from '@/components/CDatePicker/locales'
import type { KeyboardTarget } from '@/components/CKeyboardProvider/types'
import {
    $KEYBOARD_API_KEY,
    $PRESET_KEY,
    $VUELAND_UI_KEY,
} from '@/constants'
import type { CDatePickerPreset, CInputPreset } from '@/types'

// Июль 2026: 1-е — среда, 31 день; воскресенья: 5, 12, 19, 26.
const YEAR = 2026
const JULY = 6

const WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const EN = resolveLocale('en')

function mountDates(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
    return mount(CDatePickerDates, {
        props: {
            year: YEAR,
            month: JULY,
            locale: WEEK,
            ...props,
        },
        ...options,
    })
}

const dateCells = (wrapper: ReturnType<typeof mountDates>) =>
    wrapper.findAll('.c-date-picker-dates__cell:not(.c-date-picker-dates__cell--empty)')

const dateCell = (wrapper: ReturnType<typeof mountDates>, text: string) =>
    dateCells(wrapper).find((cell) => cell.text() === text)!

describe('CDatePicker utils', () => {
    it('parseDate разбирает дату на части', () => {
        const parsed = parseDate(new Date(2026, 6, 14))

        expect(parsed).toEqual({
            year: 2026,
            month: 6,
            date: 14,
            day: 2,
            mls: new Date(2026, 6, 14).getTime(),
        })
    })

    it('parseDate разбирает YYYY-MM-DD как локальную календарную дату', () => {
        const parsed = parseDate('2026-07-15')

        expect(parsed).toMatchObject({
            year: 2026,
            month: 6,
            date: 15,
        })
        expect(parsed.mls).toBe(new Date(2026, 6, 15).getTime())
    })

    it('isValidDateValue пропускает в parseDate только валидные внешние значения', () => {
        expect(isValidDateValue('not-a-date')).toBe(false)
        expect(isValidDateValue('2026-02-31')).toBe(false)
        expect(isValidDateValue(new Date(Number.NaN))).toBe(false)
        expect(isValidDateValue(new Date(2026, 6, 14))).toBe(true)
    })

    it('formatDate поддерживает числовые и словесные токены', () => {
        const date = new Date(2026, 6, 5)

        expect(formatDate(date, 'dd.MM.yyyy', EN)).toBe('05.07.2026')
        expect(formatDate(date, 'yyyy-MM-dd', EN)).toBe('2026-07-05')
        expect(formatDate(date, 'd.M.yy', EN)).toBe('5.7.26')
        expect(formatDate(date, 'MMMM d', EN)).toBe('July 5')
        expect(formatDate(date, 'MMM d, D', EN)).toBe('Jul 5, Sun')
    })

    it('dateToFormatString: пустое значение — пустая строка', () => {
        expect(dateToFormatString(null, 'dd.MM.yyyy', 'en')).toBe('')
        expect(dateToFormatString(undefined, 'dd.MM.yyyy', 'en')).toBe('')
    })

    it('dateToFormatString: неизвестный язык падает на en', () => {
        expect(dateToFormatString(new Date(2026, 6, 5), 'MMM d', 'xx')).toBe('Jul 5')
    })

    it('dateToFormatString: невалидная дата — пустая строка', () => {
        expect(dateToFormatString('not-a-date', 'dd.MM.yyyy', 'en')).toBe('')
        expect(dateToFormatString('2026-02-31', 'dd.MM.yyyy', 'en')).toBe('')
    })

    it('dateToFormatString принимает переопределение словаря', () => {
        const months = Array.from({ length: 12 }, (_, i) => `M${i + 1}`)

        expect(dateToFormatString(new Date(2026, 6, 5), 'MMMM d', { months })).toBe('M7 5')
    })

    it('parseDateString: строгий разбор по маске, частичный и несуществующий ввод — null', () => {
        expect(parseDateString('15.07.2026', 'dd.MM.yyyy')).toEqual(new Date(2026, 6, 15))
        expect(parseDateString('2026-07-15', 'yyyy-MM-dd')).toEqual(new Date(2026, 6, 15))
        expect(parseDateString('5.7.26', 'd.M.yy')).toEqual(new Date(2026, 6, 5))

        expect(parseDateString('1', 'dd.MM.yyyy')).toBeNull()
        expect(parseDateString('15.07', 'dd.MM.yyyy')).toBeNull()
        expect(parseDateString('07.15.2026', 'dd.MM.yyyy')).toBeNull()
        expect(parseDateString('31.02.2026', 'dd.MM.yyyy')).toBeNull()
        expect(parseDateString('abc', 'dd.MM.yyyy')).toBeNull()
    })

    it('resolveLocale строит словарь через Intl с фолбэком на en', () => {
        expect(EN.monthsAbbr[6]).toBe('Jul')
        expect(EN.week).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
        expect(resolveLocale('de').months[0]).toBe('Januar')
        expect(resolveLocale('xx')).toEqual(EN)
    })
})

describe('CDatePickerDates', () => {
    it('строит сетку месяца со смещением до первого дня', () => {
        const wrapper = mountDates()

        expect(wrapper.findAll('.c-date-picker-dates__cell')).toHaveLength(34)
        expect(wrapper.findAll('.c-date-picker-dates__cell--empty')).toHaveLength(3)
        expect(dateCells(wrapper)[0].text()).toBe('1')
        expect(dateCells(wrapper)[30].text()).toBe('31')
    })

    it('mondayFirst сдвигает и неделю, и смещение сетки', () => {
        const wrapper = mountDates({ mondayFirst: true })

        expect(wrapper.findAll('.c-date-picker-dates__cell--empty')).toHaveLength(2)

        const labels = wrapper.findAll('.c-date-picker-dates__day').map((d) => d.text())
        expect(labels).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'])
    })

    it('клик по дате эмитит update:modelValue', async () => {
        const wrapper = mountDates()

        await dateCell(wrapper, '15').trigger('click')

        const [payload] = wrapper.emitted('update:modelValue')![0]
        expect(payload).toMatchObject({
            year: YEAR,
            month: JULY,
            date: 15,
        })
    })

    it('отмечает выбранную дату и сегодняшний день', () => {
        const today = new Date()

        const wrapper = mount(CDatePickerDates, {
            props: {
                year: today.getFullYear(),
                month: today.getMonth(),
                modelValue: parseDate(new Date(today.getFullYear(), today.getMonth(), 1)),
            },
        })

        expect(dateCell(wrapper, '1').classes()).toContain('c-date-picker-dates__cell--selected')
        expect(dateCell(wrapper, `${today.getDate()}`).classes())
            .toContain(today.getDate() === 1
                ? 'c-date-picker-dates__cell--selected'
                : 'c-date-picker-dates__cell--today')
    })

    it('onNext/onPrev перекатывают месяц через границу года', () => {
        const december = mountDates({ month: 11 })
        december.vm.onNext()
        expect(december.emitted('update:month')![0][0]).toEqual({
            month: 0,
            year: YEAR + 1,
        })

        const january = mountDates({ month: 0 })
        january.vm.onPrev()
        expect(january.emitted('update:month')![0][0]).toEqual({
            month: 11,
            year: YEAR - 1,
        })

        const june = mountDates({ month: 5 })
        june.vm.onNext()
        expect(june.emitted('update:month')![0][0]).toEqual({
            month: 6,
            year: YEAR,
        })
    })

    describe('disabledDates', () => {
        const disabled = (wrapper: ReturnType<typeof mountDates>, text: string) =>
            dateCell(wrapper, text).classes().includes('c-date-picker-dates__cell--disabled')

        it('to: всё до даты включительно', () => {
            const wrapper = mountDates({ disabledDates: { to: new Date(YEAR, JULY, 10) } })

            expect(disabled(wrapper, '1')).toBe(true)
            expect(disabled(wrapper, '10')).toBe(true)
            expect(disabled(wrapper, '11')).toBe(false)
        })

        it('from: всё после даты включительно', () => {
            const wrapper = mountDates({ disabledDates: { from: new Date(YEAR, JULY, 20) } })

            expect(disabled(wrapper, '19')).toBe(false)
            expect(disabled(wrapper, '20')).toBe(true)
            expect(disabled(wrapper, '31')).toBe(true)
        })

        it('from + to: замкнутый диапазон', () => {
            const wrapper = mountDates({
                disabledDates: {
                    from: new Date(YEAR, JULY, 10),
                    to: new Date(YEAR, JULY, 20),
                },
            })

            expect(disabled(wrapper, '9')).toBe(false)
            expect(disabled(wrapper, '10')).toBe(true)
            expect(disabled(wrapper, '20')).toBe(true)
            expect(disabled(wrapper, '21')).toBe(false)
        })

        it('daysOfMonth: числа месяца', () => {
            const wrapper = mountDates({ disabledDates: { daysOfMonth: [7, 8] } })

            expect(disabled(wrapper, '7')).toBe(true)
            expect(disabled(wrapper, '8')).toBe(true)
            expect(disabled(wrapper, '9')).toBe(false)
        })

        it('days: дни недели', () => {
            const wrapper = mountDates({ disabledDates: { days: [0] } })

            for (const sunday of ['5', '12', '19', '26']) {
                expect(disabled(wrapper, sunday)).toBe(true)
            }
            expect(disabled(wrapper, '6')).toBe(false)
        })

        it('dates: конкретные даты', () => {
            const wrapper = mountDates({ disabledDates: { dates: ['not-a-date', new Date(YEAR, JULY, 15)] } })

            expect(disabled(wrapper, '15')).toBe(true)
            expect(disabled(wrapper, '14')).toBe(false)
        })

        it('ranges: список диапазонов', () => {
            const wrapper = mountDates({
                disabledDates: {
                    ranges: [
                        {
                            from: 'not-a-date',
                            to: new Date(YEAR, JULY, 1),
                        },
                        {
                            from: new Date(YEAR, JULY, 2),
                            to: new Date(YEAR, JULY, 4),
                        },
                    ],
                },
            })

            expect(disabled(wrapper, '2')).toBe(true)
            expect(disabled(wrapper, '4')).toBe(true)
            expect(disabled(wrapper, '5')).toBe(false)
        })

        it('custom: произвольный предикат', () => {
            const wrapper = mountDates({
                disabledDates: { custom: (d: { date: number | null }) => d.date === 21 },
            })

            expect(disabled(wrapper, '21')).toBe(true)
            expect(disabled(wrapper, '22')).toBe(false)
        })

        it('minDate/maxDate ограничивают месяц с обеих сторон', () => {
            const wrapper = mountDates({
                minDate: parseDate(new Date(YEAR, JULY, 5)),
                maxDate: parseDate(new Date(YEAR, JULY, 25)),
            })

            expect(disabled(wrapper, '4')).toBe(true)
            expect(disabled(wrapper, '5')).toBe(false)
            expect(disabled(wrapper, '25')).toBe(false)
            expect(disabled(wrapper, '26')).toBe(true)
        })

        it('клик по задизейбленной дате не эмитит', async () => {
            const wrapper = mountDates({ disabledDates: { to: new Date(YEAR, JULY, 10) } })

            await dateCell(wrapper, '5').trigger('click')

            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })
    })

    it('highlightedDates подсвечивают ячейки', () => {
        const wrapper = mountDates({ highlightedDates: ['not-a-date', new Date(YEAR, JULY, 18)] })

        expect(dateCell(wrapper, '18').classes()).toContain('c-date-picker-dates__cell--highlighted')
        expect(dateCell(wrapper, '17').classes()).not.toContain('c-date-picker-dates__cell--highlighted')
    })

    it('слот date подменяет содержимое ячейки', () => {
        const wrapper = mount(CDatePickerDates, {
            props: {
                year: YEAR,
                month: JULY,
            },
            slots: { date: (props: { date: number | null }) => h('span', `d${props.date}`) },
        })

        expect(wrapper.text()).toContain('d15')
    })

    it('слот week получает локализованную строку дней недели', () => {
        const wrapper = mountDates({}, {
            slots: {
                week: (props: any) => h('div', { class: 'week-probe' }, props.days.map((d: any) => d.label).join('|')),
            },
        } as any)

        expect(wrapper.find('.week-probe').text()).toBe('Su|Mo|Tu|We|Th|Fr|Sa')
    })

    it('слот dates получает enriched dates и рабочий onSelect', async () => {
        const wrapper = mountDates({}, {
            slots: {
                dates: (props: any) => h('button', {
                    class: 'dates-probe',
                    onClick: () => props.onSelect(parseDate(new Date(YEAR, JULY, 22))),
                }, `${props.dates.length}:${props.dates[3].dateObj.date}`),
            },
        } as any)

        expect(wrapper.find('.dates-probe').text()).toBe('34:1')

        await wrapper.find('.dates-probe').trigger('click')
        expect(wrapper.emitted('update:modelValue')![0][0]).toMatchObject({ date: 22 })
    })
})

describe('CDatePickerMonths', () => {
    function mountMonths(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
        return mount(CDatePickerMonths, {
            props: {
                month: 4,
                year: YEAR,
                value: parseDate(new Date(YEAR, 4, 15)),
                locale: EN.monthsAbbr,
                ...props,
            },
            ...options,
        })
    }

    const monthCells = (wrapper: ReturnType<typeof mountMonths>) =>
        wrapper.findAll('.c-date-picker-months__cell')

    it('рендерит 12 месяцев с выбранным', () => {
        const wrapper = mountMonths()

        expect(monthCells(wrapper)).toHaveLength(12)
        expect(monthCells(wrapper)[4].classes()).toContain('c-date-picker-months__cell--selected')
        expect(monthCells(wrapper)[4].text()).toBe('May')
    })

    it('клик эмитит update:month', async () => {
        const wrapper = mountMonths()

        await monthCells(wrapper)[2].trigger('click')

        expect(wrapper.emitted('update:month')![0]).toEqual([2])
    })

    it('minDate/maxDate дизейблят месяцы, клик по ним не эмитит', async () => {
        const wrapper = mountMonths({
            minDate: parseDate(new Date(YEAR, 3, 1)),
            maxDate: parseDate(new Date(YEAR, 8, 1)),
        })

        expect(monthCells(wrapper)[2].classes()).toContain('c-date-picker-months__cell--disabled')
        expect(monthCells(wrapper)[3].classes()).not.toContain('c-date-picker-months__cell--disabled')
        expect(monthCells(wrapper)[8].classes()).not.toContain('c-date-picker-months__cell--disabled')
        expect(monthCells(wrapper)[9].classes()).toContain('c-date-picker-months__cell--disabled')

        await monthCells(wrapper)[2].trigger('click')
        expect(wrapper.emitted('update:month')).toBeUndefined()
    })

    it('год за пределами minDate дизейблит все месяцы', () => {
        const wrapper = mountMonths({
            year: YEAR - 1,
            minDate: parseDate(new Date(YEAR, 0, 1)),
        })

        for (const cell of monthCells(wrapper)) {
            expect(cell.classes()).toContain('c-date-picker-months__cell--disabled')
        }
    })

    it('onNext/onPrev листают год', () => {
        const wrapper = mountMonths()

        wrapper.vm.onNext()
        wrapper.vm.onPrev()

        expect(wrapper.emitted('update:year')).toEqual([[YEAR + 1], [YEAR - 1]])
    })

    it('слот month получает enriched month и рабочий onSelect', async () => {
        const wrapper = mountMonths({}, {
            slots: {
                month: (props: any) => h('button', {
                    class: 'month-probe',
                    onClick: props.onSelect,
                }, `${props.month}:${props.label}:${props.isSelected}`),
            },
        } as any)

        expect(wrapper.findAll('.month-probe')[4].text()).toBe('4:May:true')

        await wrapper.findAll('.month-probe')[2].trigger('click')
        expect(wrapper.emitted('update:month')![0]).toEqual([2])
    })

    it('слот months получает полный список месяцев', () => {
        let months!: any[]

        const wrapper = mountMonths({}, {
            slots: {
                months: (props: any) => {
                    months = props.months
                    return h('div', { class: 'months-probe' }, props.months.length)
                },
            },
        } as any)

        expect(wrapper.find('.months-probe').text()).toBe('12')
        expect(months[4]).toMatchObject({ month: 4, label: 'May', isSelected: true })
    })
})

describe('CDatePickerYears', () => {
    function mountYears(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
        return mount(CDatePickerYears, {
            props: {
                year: YEAR,
                value: parseDate(new Date(YEAR, JULY, 14)),
                ...props,
            },
            ...options,
        })
    }

    const yearCells = (wrapper: ReturnType<typeof mountYears>) =>
        wrapper.findAll('.c-date-picker-years__cell')

    const yearCell = (wrapper: ReturnType<typeof mountYears>, year: number) =>
        yearCells(wrapper).find((cell) => cell.text() === `${year}`)!

    it('показывает страницу из 20 лет с выбранным годом', () => {
        const wrapper = mountYears()

        expect(yearCells(wrapper)).toHaveLength(20)
        expect(yearCell(wrapper, YEAR).classes()).toContain('c-date-picker-years__cell--selected')
    })

    it('клик по году эмитит update:year', async () => {
        const wrapper = mountYears()
        const target = Number(yearCells(wrapper)[1].text())

        await yearCells(wrapper)[1].trigger('click')

        expect(wrapper.emitted('update:year')![0]).toEqual([target])
    })

    it('minYear/maxYear задают границы навигации по годам', async () => {
        const first = Number(yearCells(mountYears())[0].text())
        const wrapper = mountYears({
            minYear: first + 2,
            maxYear: first + 10,
        })

        expect(Number(yearCells(wrapper)[0].text())).toBe(first + 2)
        expect(Number(yearCells(wrapper).at(-1)!.text())).toBe(first + 10)
        expect(yearCells(wrapper)).toHaveLength(9)

        await yearCell(wrapper, first + 2).trigger('click')
        expect(wrapper.emitted('update:year')![0]).toEqual([first + 2])
    })

    it('onNext листает страницу на 20 лет вперёд', async () => {
        const wrapper = mountYears()
        const first = Number(yearCells(wrapper)[0].text())

        wrapper.vm.onNext()
        await wrapper.vm.$nextTick()

        expect(Number(yearCells(wrapper)[0].text())).toBe(first + 20)
    })

    it('смена года переводит на его страницу', async () => {
        const wrapper = mountYears()
        const first = Number(yearCells(wrapper)[0].text())

        await wrapper.setProps({ year: first + 25 })

        expect(Number(yearCells(wrapper)[0].text())).toBe(first + 20)
    })

    it('дефолтный диапазон расширяется до выбранного года', () => {
        const wrapper = mountYears({
            year: 1800,
            value: parseDate(new Date(1800, 0, 1)),
        })

        expect(yearCell(wrapper, 1800).classes()).toContain('c-date-picker-years__cell--selected')
    })

    it('minYear/maxYear задают границы списка годов', async () => {
        const wrapper = mountYears({
            year: 1805,
            minYear: 1800,
            maxYear: 1825,
        })

        expect(Number(yearCells(wrapper)[0].text())).toBe(1800)
        wrapper.vm.onNext()
        await wrapper.vm.$nextTick()
        expect(Number(yearCells(wrapper).at(-1)!.text())).toBe(1825)
    })

    it('слот year получает enriched year и рабочий onSelect', async () => {
        const wrapper = mountYears({}, {
            slots: {
                year: (props: any) => h('button', {
                    class: 'year-probe',
                    onClick: props.onSelect,
                }, `${props.year}:${props.isSelected}`),
            },
        } as any)

        const selected = wrapper.findAll('.year-probe').find((cell) => cell.text() === `${YEAR}:true`)!
        expect(selected.exists()).toBe(true)

        await selected.trigger('click')
        expect(wrapper.emitted('update:year')![0]).toEqual([YEAR])
    })

    it('слот years получает текущую страницу годов', () => {
        let years!: any[]

        const wrapper = mountYears({}, {
            slots: {
                years: (props: any) => {
                    years = props.years
                    return h('div', { class: 'years-probe' }, props.years.length)
                },
            },
        } as any)

        expect(wrapper.find('.years-probe').text()).toBe('20')
        expect(years.some((item) => item.year === YEAR && item.isSelected)).toBe(true)
    })
})

describe('CDatePicker', () => {
    function mountPicker(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
        return mount(CDatePicker, {
            props: {
                modelValue: new Date(YEAR, JULY, 14),
                ...props,
            },
            ...options,
        })
    }

    it('показывает выбранную дату в дисплее и хедере', () => {
        const wrapper = mountPicker()

        expect(wrapper.find('.c-date-picker__display-year').text()).toBe('2026')
        expect(wrapper.find('.c-date-picker__display-date').text()).toBe('Jul 14, Tue')
        expect(wrapper.find('.c-date-picker__header-display').text()).toBe('Jul 2026')
    })

    it('невалидный modelValue безопасно падает на сегодня', () => {
        const today = new Date()
        const wrapper = mountPicker({ modelValue: 'not-a-date' })

        expect(wrapper.find('.c-date-picker__display-year').text()).toBe(`${today.getFullYear()}`)
        expect(wrapper.find('.c-date-picker__display-date').text())
            .toBe(`${EN.monthsAbbr[today.getMonth()]} ${today.getDate()}, ${EN.week[today.getDay()]}`)
    })

    it('пустой modelValue не выделяет сегодня как выбранную дату', () => {
        const wrapper = mountPicker({ modelValue: null })

        expect(wrapper.find('.c-date-picker-dates__cell--selected').exists()).toBe(false)
    })

    it('клик по дате эмитит update:modelValue', async () => {
        const wrapper = mountPicker()

        await dateCell(wrapper as any, '20').trigger('click')

        const value = wrapper.emitted('update:modelValue')![0][0] as Date
        expect(value).toBeInstanceOf(Date)
        expect([value.getFullYear(), value.getMonth(), value.getDate()]).toEqual([YEAR, JULY, 20])
    })

    it('клик по хедеру переключает вьюхи: dates → months → years → months', async () => {
        const wrapper = mountPicker()
        const header = wrapper.find('.c-date-picker__header-display')

        await header.trigger('click')
        expect(wrapper.find('.c-date-picker-months').exists()).toBe(true)
        expect(header.text()).toBe('Jul')

        await header.trigger('click')
        expect(wrapper.find('.c-date-picker-years').exists()).toBe(true)
        expect(header.text()).toBe('2026')

        await header.trigger('click')
        expect(wrapper.find('.c-date-picker-months').exists()).toBe(true)
    })

    it('выбор года и месяца возвращает к датам', async () => {
        const wrapper = mountPicker()
        const header = wrapper.find('.c-date-picker__header-display')

        await header.trigger('click')
        await header.trigger('click')

        await wrapper.findAll('.c-date-picker-years__cell')[1].trigger('click')
        expect(wrapper.find('.c-date-picker-months').exists()).toBe(true)

        await wrapper.findAll('.c-date-picker-months__cell')[2].trigger('click')
        expect(wrapper.find('.c-date-picker-dates').exists()).toBe(true)
        expect(wrapper.find('.c-date-picker__header-display').text()).toContain('Mar')
    })

    it('minDate/maxDate задают границы years-вьюхи', async () => {
        const wrapper = mountPicker({
            modelValue: new Date(1805, 6, 14),
            minDate: new Date(1800, 0, 1),
            maxDate: new Date(1825, 11, 31),
        })
        const header = wrapper.find('.c-date-picker__header-display')

        await header.trigger('click')
        await header.trigger('click')

        expect(Number(wrapper.findAll('.c-date-picker-years__cell')[0].text())).toBe(1800)
    })

    it('строка в пропе locale — языковой тег для Intl', () => {
        const wrapper = mountPicker({ locale: 'ru' })

        expect(wrapper.find('.c-date-picker__header-display').text())
            .toBe(`${resolveLocale('ru').monthsAbbr[6]} 2026`)
    })

    it('проп locale точечно перекрывает Intl-словарь', () => {
        const monthsAbbr = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

        const wrapper = mountPicker({ locale: { monthsAbbr } })

        expect(wrapper.find('.c-date-picker__header-display').text()).toBe('Июл 2026')
        // Неделя не переопределена — остаётся из Intl-словаря en
        expect(wrapper.find('.c-date-picker-dates__day').text()).toBe('Sun')
    })

    it('слот footer получает slotApi и живые методы', async () => {
        let api!: DatePickerSlotApi

        const wrapper = mountPicker({}, {
            slots: {
                footer: (props: DatePickerSlotApi) => {
                    api = props
                    return h('div', { class: 'probe' }, props.value)
                },
            },
        })

        expect(wrapper.find('.probe').text()).toBe('Jul 2026')
        expect(api.view).toBe('dates')
        expect(api.selected).toMatchObject({
            year: YEAR,
            month: JULY,
            date: 14,
        })
        expect(api.preset).toMatchObject({ root: [] })

        api.onTable()
        await wrapper.vm.$nextTick()
        expect(api.view).toBe('months')

        api.onToday()
        await wrapper.vm.$nextTick()
        expect(api.view).toBe('dates')
    })

    it('слоты before-header и before-body получают slotApi', () => {
        let beforeHeaderApi!: DatePickerSlotApi
        let beforeBodyApi!: DatePickerSlotApi

        const wrapper = mountPicker({}, {
            slots: {
                'before-header': (props: DatePickerSlotApi) => {
                    beforeHeaderApi = props
                    return h('div', { class: 'before-header-probe' }, props.value)
                },
                'before-body': (props: DatePickerSlotApi) => {
                    beforeBodyApi = props
                    return h('div', { class: 'before-body-probe' }, props.selected?.date)
                },
            },
        })

        expect(wrapper.find('.before-header-probe').text()).toBe('Jul 2026')
        expect(wrapper.find('.before-body-probe').text()).toBe('14')
        expect(beforeHeaderApi.view).toBe('dates')
        expect(beforeBodyApi.selected).toMatchObject({ date: 14 })
    })

    it('форвардит слоты week/date на dates-вьюху', () => {
        const wrapper = mountPicker({}, {
            slots: {
                week: (props: any) => h('div', { class: 'picker-week-probe' }, props.days[0].label),
                date: (props: any) => h('span', { class: 'picker-date-probe' }, `d${props.date}:${props.isSelected}`),
            },
        })

        expect(wrapper.find('.picker-week-probe').text()).toBe('Sun')
        expect(wrapper.findAll('.picker-date-probe').some((cell) => cell.text() === 'd14:true')).toBe(true)
    })

    it('форвардит слот dates и позволяет выбрать дату через onSelect', async () => {
        const wrapper = mountPicker({}, {
            slots: {
                dates: (props: any) => h('button', {
                    class: 'picker-dates-probe',
                    onClick: () => props.onSelect(parseDate(new Date(YEAR, JULY, 23))),
                }, props.dates.length),
            },
        })

        expect(wrapper.find('.picker-dates-probe').text()).toBe('34')

        await wrapper.find('.picker-dates-probe').trigger('click')
        const value = wrapper.emitted('update:modelValue')![0][0] as Date
        expect([value.getFullYear(), value.getMonth(), value.getDate()]).toEqual([YEAR, JULY, 23])
    })

    it('форвардит слоты month/months на months-вьюху', async () => {
        let months!: any[]
        const wrapper = mountPicker({}, {
            slots: {
                month: (props: any) => h('button', {
                    class: 'picker-month-probe',
                    onClick: props.onSelect,
                    'data-month': props.month,
                }, `${props.label}:${props.isSelected}`),
                months: (props: any) => {
                    months = props.months
                    return h('div', { class: 'picker-months-probe' }, props.months.length)
                },
            },
        })

        await wrapper.find('.c-date-picker__header-display').trigger('click')

        expect(wrapper.find('.picker-months-probe').text()).toBe('12')
        expect(months[6]).toMatchObject({ month: 6, isSelected: true })
    })

    it('форвардит слот month без months-слота и сохраняет onSelect', async () => {
        const wrapper = mountPicker({}, {
            slots: {
                month: (props: any) => h('button', {
                    class: 'picker-month-probe',
                    onClick: props.onSelect,
                    'data-month': props.month,
                }, `${props.label}:${props.isSelected}`),
            },
        })

        await wrapper.find('.c-date-picker__header-display').trigger('click')
        await wrapper.find('.picker-month-probe[data-month="2"]').trigger('click')

        expect(wrapper.find('.c-date-picker-dates').exists()).toBe(true)
        expect(wrapper.find('.c-date-picker__header-display').text()).toBe('Mar 2026')
    })

    it('форвардит слоты year/years на years-вьюху', async () => {
        let years!: any[]
        const wrapper = mountPicker({}, {
            slots: {
                year: (props: any) => h('button', {
                    class: 'picker-year-probe',
                    onClick: props.onSelect,
                    'data-year': props.year,
                }, `${props.year}:${props.isSelected}`),
                years: (props: any) => {
                    years = props.years
                    return h('div', { class: 'picker-years-probe' }, props.years.length)
                },
            },
        })

        await wrapper.find('.c-date-picker__header-display').trigger('click')
        await wrapper.find('.c-date-picker__header-display').trigger('click')

        expect(wrapper.find('.picker-years-probe').text()).toBe('20')
        expect(years.some((item) => item.year === YEAR && item.isSelected)).toBe(true)
    })

    it('форвардит слот year без years-слота и сохраняет onSelect', async () => {
        const wrapper = mountPicker({}, {
            slots: {
                year: (props: any) => h('button', {
                    class: 'picker-year-probe',
                    onClick: props.onSelect,
                    'data-year': props.year,
                }, `${props.year}:${props.isSelected}`),
            },
        })

        await wrapper.find('.c-date-picker__header-display').trigger('click')
        await wrapper.find('.c-date-picker__header-display').trigger('click')
        await wrapper.find(`.picker-year-probe[data-year="${YEAR + 1}"]`).trigger('click')

        expect(wrapper.find('.c-date-picker-months').exists()).toBe(true)
        expect(wrapper.find('.c-date-picker__header-display').text()).toBe('Jul')
    })

    it('disablePrev/disableNext сравнивают месяц с учётом года', () => {
        let minApi!: DatePickerSlotApi
        let maxApi!: DatePickerSlotApi

        mountPicker({
            minDate: new Date(YEAR + 1, 0, 1),
        }, {
            slots: {
                footer: (props: DatePickerSlotApi) => {
                    minApi = props
                    return h('div')
                },
            },
        })

        mountPicker({
            modelValue: new Date(YEAR + 2, 0, 1),
            maxDate: new Date(YEAR + 1, 11, 31),
        }, {
            slots: {
                footer: (props: DatePickerSlotApi) => {
                    maxApi = props
                    return h('div')
                },
            },
        })

        expect(minApi.disablePrev).toBe(true)
        expect(maxApi.disableNext).toBe(true)
    })

    describe('пресеты', () => {
        const pickerPreset: CDatePickerPreset = {
            base: {
                root: ['preset-root'],
                display: ['preset-display'],
                header: ['preset-header'],
                cell: ['preset-cell'],
            },
            years: { cell: ['preset-cell-years'] },
        }

        it('standalone: проп preset резолвится из реестра, состояния — по вьюхе', async () => {
            const wrapper = mountPicker({ preset: 'datePicker.soft' }, {
                global: {
                    provide: { [$VUELAND_UI_KEY as symbol]: { presets: { datePicker: { soft: pickerPreset } } } },
                },
            })

            expect(wrapper.find('.c-date-picker').classes()).toContain('preset-root')
            expect(wrapper.find('.c-date-picker__display').classes()).toContain('preset-display')
            expect(wrapper.find('.c-date-picker__header').classes()).toContain('preset-header')
            expect(dateCell(wrapper as any, '15').classes()).toContain('preset-cell')

            const header = wrapper.find('.c-date-picker__header-display')
            await header.trigger('click')
            await header.trigger('click')

            const yearCell = wrapper.find('.c-date-picker-years__cell')
            expect(yearCell.classes()).toContain('preset-cell-years')
            expect(yearCell.classes()).not.toContain('preset-cell')
        })

        it('nested: пресет доезжает из base-снимка контекста хоста', () => {
            const inputPreset: CInputPreset = { base: { datePicker: pickerPreset } }

            const wrapper = mountPicker({}, {
                global: {
                    provide: { [$PRESET_KEY as symbol]: computed(() => inputPreset) },
                },
            })

            expect(wrapper.find('.c-date-picker').classes()).toContain('preset-root')
            expect(dateCell(wrapper as any, '15').classes()).toContain('preset-cell')
        })

        it('slotApi отдаёт те же зоны, что применяет рендер', () => {
            let api!: DatePickerSlotApi

            mountPicker({ preset: 'datePicker.soft' }, {
                global: {
                    provide: { [$VUELAND_UI_KEY as symbol]: { presets: { datePicker: { soft: pickerPreset } } } },
                },
                slots: {
                    footer: (props: DatePickerSlotApi) => {
                        api = props
                        return h('div')
                    },
                },
            })

            expect(api.preset.root).toEqual(['preset-root'])
            expect(api.preset.cell).toEqual(['preset-cell'])
        })
    })

    describe('клавиатурная навигация', () => {
        const key = (wrapper: ReturnType<typeof mountPicker>, k: string) =>
            wrapper.find('.c-date-picker').trigger('keydown', { key: k })

        const focusedDate = (wrapper: ReturnType<typeof mountPicker>) =>
            wrapper.find('.c-date-picker-dates__cell--focused')

        it('первая стрелка ставит курсор на выбранную дату, следующие двигают', async () => {
            const wrapper = mountPicker()

            await key(wrapper, 'ArrowRight')
            expect(focusedDate(wrapper).text()).toBe('14')

            await key(wrapper, 'ArrowRight')
            expect(focusedDate(wrapper).text()).toBe('15')

            await key(wrapper, 'ArrowDown')
            expect(focusedDate(wrapper).text()).toBe('22')

            await key(wrapper, 'ArrowLeft')
            expect(focusedDate(wrapper).text()).toBe('21')

            await key(wrapper, 'ArrowUp')
            expect(focusedDate(wrapper).text()).toBe('14')
        })

        it('Home/End — начало и конец месяца', async () => {
            const wrapper = mountPicker()

            await key(wrapper, 'Home')
            expect(focusedDate(wrapper).text()).toBe('1')

            await key(wrapper, 'End')
            expect(focusedDate(wrapper).text()).toBe('31')
        })

        it('курсор через границу месяца перелистывает таблицу', async () => {
            const wrapper = mountPicker({ modelValue: new Date(YEAR, JULY, 31) })

            await key(wrapper, 'ArrowRight')
            await key(wrapper, 'ArrowRight')

            expect(wrapper.find('.c-date-picker__header-display').text()).toBe('Aug 2026')
            expect(focusedDate(wrapper).text()).toBe('1')
        })

        it('Enter выбирает дату под курсором', async () => {
            const wrapper = mountPicker()

            await key(wrapper, 'ArrowRight')
            await key(wrapper, 'ArrowRight')
            await key(wrapper, 'Enter')

            const value = wrapper.emitted('update:modelValue')![0][0] as Date
            expect([value.getMonth(), value.getDate()]).toEqual([JULY, 15])
        })

        it('Enter на задизейбленной дате не выбирает', async () => {
            const wrapper = mountPicker({ disabledDates: { daysOfMonth: [15] } })

            await key(wrapper, 'ArrowRight')
            await key(wrapper, 'ArrowRight')
            await key(wrapper, 'Enter')

            expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        })

        it('months-вьюха: стрелки ходят по сетке 3xN, Enter выбирает месяц', async () => {
            const wrapper = mountPicker()

            await wrapper.find('.c-date-picker__header-display').trigger('click')

            await key(wrapper, 'ArrowRight')
            expect(wrapper.find('.c-date-picker-months__cell--focused').text()).toBe('Jul')

            await key(wrapper, 'ArrowDown')
            expect(wrapper.find('.c-date-picker-months__cell--focused').text()).toBe('Oct')

            await key(wrapper, 'Enter')
            expect(wrapper.find('.c-date-picker-dates').exists()).toBe(true)
            expect(wrapper.find('.c-date-picker__header-display').text()).toBe('Oct 2026')
        })

        it('years-вьюха: курсор ходит по сетке 4xN, Enter выбирает год', async () => {
            const wrapper = mountPicker()
            const header = wrapper.find('.c-date-picker__header-display')

            await header.trigger('click')
            await header.trigger('click')

            await key(wrapper, 'ArrowRight')
            expect(wrapper.find('.c-date-picker-years__cell--focused').text()).toBe(`${YEAR}`)

            await key(wrapper, 'ArrowDown')
            expect(wrapper.find('.c-date-picker-years__cell--focused').text()).toBe(`${YEAR + 4}`)

            await key(wrapper, 'Enter')
            expect(wrapper.find('.c-date-picker-months').exists()).toBe(true)
        })

        it('standalone корень фокусируемый, в клавиатурном контуре — нет', async () => {
            expect(mountPicker().find('.c-date-picker').attributes('tabindex')).toBe('0')

            const registered: KeyboardTarget[] = []
            const keyboardApi = {
                register: (t: KeyboardTarget) => registered.push(t),
                unregister: () => {},
                forward: (e: KeyboardEvent) => registered[0]?.onKeydown(e),
                blur: () => {},
            }

            const wrapper = mountPicker({}, {
                global: { provide: { [$KEYBOARD_API_KEY as symbol]: keyboardApi } },
            })

            expect(wrapper.find('.c-date-picker').attributes('tabindex')).toBe('-1')
            expect(registered).toHaveLength(1)

            keyboardApi.forward(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
            await wrapper.vm.$nextTick()

            expect(focusedDate(wrapper).text()).toBe('14')
        })

        it('ячейки несут grid-роли и aria-атрибуты', () => {
            const wrapper = mountPicker({ disabledDates: { daysOfMonth: [15] } })

            expect(wrapper.find('.c-date-picker-dates').attributes('role')).toBe('grid')
            expect(wrapper.find('.c-date-picker-dates__week').attributes('role')).toBe('row')
            expect(wrapper.find('.c-date-picker-dates__day').attributes('role')).toBe('columnheader')

            const selected = dateCell(wrapper as any, '14')
            expect(selected.attributes('role')).toBe('gridcell')
            expect(selected.attributes('aria-selected')).toBe('true')

            const disabled = dateCell(wrapper as any, '15')
            expect(disabled.attributes('aria-disabled')).toBe('true')
        })

        it('хедер имеет доступные кнопки управления', () => {
            const wrapper = mountPicker()

            expect(wrapper.find('.c-date-picker__header-btn[aria-label="Previous period"]').exists()).toBe(true)
            expect(wrapper.find('.c-date-picker__header-display').element.tagName).toBe('BUTTON')
            expect(wrapper.find('.c-date-picker__header-display').attributes('aria-label')).toBe('Change calendar view')
            expect(wrapper.find('.c-date-picker__header-btn[aria-label="Next period"]').exists()).toBe(true)
        })
    })

})
