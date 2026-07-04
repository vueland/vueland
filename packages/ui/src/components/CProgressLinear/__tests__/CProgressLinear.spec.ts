import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'

import { $VUELAND_UI_KEY } from '../../../constants'
import { CProgressLinear } from '../../index'

describe('CProgressLinear', () => {
    it('ширина бара соответствует value', () => {
        const wrapper = mount(CProgressLinear, { props: { value: 40 } })

        expect(wrapper.find('.c-progress-linear__bar').attributes('style')).toContain('width: 40%')
    })

    it('обрезает value до диапазона 0–100', () => {
        const wrapper = mount(CProgressLinear, { props: { value: 150 } })

        expect(wrapper.find('.c-progress-linear__bar').attributes('style')).toContain('width: 100%')
        expect(wrapper.attributes('aria-valuenow')).toBe('100')
    })

    it('нечисловые value и height схлопываются в дефолты, а не в NaN', () => {
        const wrapper = mount(CProgressLinear, {
            props: {
                value: 'abc',
                height: 'xyz',
            },
        })

        expect(wrapper.attributes('aria-valuenow')).toBe('0')
        expect(wrapper.find('.c-progress-linear__bar').attributes('style')).toContain('width: 0%')
        expect(wrapper.attributes('style')).toContain('height: 4px')
    })

    it('buffer рендерится только при заданном bufferValue', () => {
        const withBuffer = mount(CProgressLinear, { props: { value: 20, bufferValue: 60 } })
        const withoutBuffer = mount(CProgressLinear, { props: { value: 20 } })

        expect(withBuffer.find('.c-progress-linear__buffer').attributes('style')).toContain('width: 60%')
        expect(withoutBuffer.find('.c-progress-linear__buffer').exists()).toBe(false)
    })

    it('indeterminate: два бара с анимацией вместо обычного', () => {
        const wrapper = mount(CProgressLinear, { props: { indeterminate: true } })

        expect(wrapper.find('.c-progress-linear__indeterminate').exists()).toBe(true)
        expect(wrapper.find('.c-progress-linear__bar--long').exists()).toBe(true)
        expect(wrapper.find('.c-progress-linear__bar--short').exists()).toBe(true)
        expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    })

    it('height задаёт высоту корня', () => {
        const wrapper = mount(CProgressLinear, { props: { height: 8 } })

        expect(wrapper.attributes('style')).toContain('height: 8px')
    })

    it('color вешает bg-утилиту на бар и буфер: палитра и сырой цвет', () => {
        const plain = mount(CProgressLinear)
        const palette = mount(CProgressLinear, { props: { color: 'red-lighten-2', bufferValue: 50 } })
        const arbitrary = mount(CProgressLinear, { props: { color: '#fa5a5a' } })

        expect(plain.find('.c-progress-linear__bar').classes()).toEqual(['c-progress-linear__bar'])
        expect(palette.find('.c-progress-linear__bar').classes()).toContain('bg-red-lighten-2')
        expect(palette.find('.c-progress-linear__buffer').classes()).toContain('bg-red-lighten-2')
        expect(arbitrary.find('.c-progress-linear__bar').classes()).toContain('bg-[#fa5a5a]')
    })

    it('пресет раскладывает классы по зонам, включая оба indeterminate-бара', () => {
        const wrapper = mount(CProgressLinear, {
            props: {
                preset: 'loader',
                indeterminate: true,
            },
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            loader: {
                                base: { root: ['rounded'], bar: ['bg-indigo'] },
                            },
                        },
                    },
                },
            },
        })

        expect(wrapper.classes()).toContain('rounded')

        const bars = wrapper.findAll('.c-progress-linear__bar')

        expect(bars).toHaveLength(2)
        bars.forEach((bar) => expect(bar.classes()).toContain('bg-indigo'))
    })
})
