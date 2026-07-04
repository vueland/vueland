import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'

import { $VUELAND_UI_KEY } from '../../../constants'
import { CProgressCircular } from '../../index'

describe('CProgressCircular', () => {
    it('рендерит underlay и overlay в обычном режиме', () => {
        const wrapper = mount(CProgressCircular, { props: { value: 40 } })

        expect(wrapper.find('.c-progress-circular__underlay').exists()).toBe(true)
        expect(wrapper.find('.c-progress-circular__overlay').exists()).toBe(true)
    })

    it('indeterminate: скрывает underlay и ставит модификатор', () => {
        const wrapper = mount(CProgressCircular, { props: { indeterminate: true } })

        expect(wrapper.classes()).toContain('c-progress-circular--indeterminate')
        expect(wrapper.find('.c-progress-circular__underlay').exists()).toBe(false)
        expect(wrapper.attributes('aria-valuenow')).toBeUndefined()
    })

    it('обрезает value до диапазона 0–100', () => {
        const above = mount(CProgressCircular, { props: { value: 150 } })
        const below = mount(CProgressCircular, { props: { value: -5 } })

        expect(above.attributes('aria-valuenow')).toBe('100')
        expect(above.find('.c-progress-circular__overlay').attributes('stroke-dashoffset')).toBe('0px')
        expect(below.attributes('aria-valuenow')).toBe('0')
    })

    it('size задаёт размеры корня', () => {
        const wrapper = mount(CProgressCircular, { props: { size: 64 } })

        expect(wrapper.attributes('style')).toContain('width: 64px')
        expect(wrapper.attributes('style')).toContain('height: 64px')
    })

    it('нечисловой value схлопывается в 0, а не в NaN', () => {
        const wrapper = mount(CProgressCircular, { props: { value: 'abc' } })

        expect(wrapper.attributes('aria-valuenow')).toBe('0')
        expect(wrapper.find('.c-progress-circular__overlay').attributes('stroke-dashoffset')).not.toContain('NaN')
    })

    it('width >= size не ломает viewBox делением на ноль', () => {
        const wrapper = mount(CProgressCircular, {
            props: {
                size: 8,
                width: 20,
            },
        })

        const viewBox = wrapper.find('svg').attributes('viewbox') ?? wrapper.find('svg').attributes('viewBox')

        expect(viewBox).not.toContain('Infinity')
        expect(viewBox).not.toContain('NaN')
    })

    it('нечисловые size и width откатываются к дефолтам', () => {
        const wrapper = mount(CProgressCircular, {
            props: {
                size: 'abc',
                width: 'xyz',
            },
        })

        expect(wrapper.attributes('style')).toContain('width: 32px')
        expect(wrapper.find('svg').attributes('viewBox')).not.toContain('NaN')
    })

    it('color ставит цветовой модификатор, по умолчанию primary', () => {
        const primary = mount(CProgressCircular)
        const error = mount(CProgressCircular, { props: { color: 'error' } })

        expect(primary.classes()).toContain('c-progress-circular--primary')
        expect(error.classes()).toContain('c-progress-circular--error')
    })

    it('передаёт нормализованный value в слот', () => {
        const wrapper = mount(CProgressCircular, {
            props: { value: 120 },
            slots: {
                default: ({ value }: { value: number }) => `${value}%`,
            },
        })

        expect(wrapper.find('.c-progress-circular__info').text()).toBe('100%')
    })

    it('rotate поворачивает svg', () => {
        const wrapper = mount(CProgressCircular, { props: { rotate: 90 } })

        expect(wrapper.find('svg').attributes('style')).toContain('rotate(90deg)')
    })

    it('пресет раскладывает классы по всем зонам, включая SVG-круги', () => {
        const wrapper = mount(CProgressCircular, {
            props: {
                preset: 'spinner',
                value: 50,
            },
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            spinner: {
                                base: {
                                    root: ['elevation-2'],
                                    underlay: ['text-grey'],
                                    overlay: ['text-indigo'],
                                    info: ['text-grey'],
                                },
                                complete: { info: ['text-green'] },
                            },
                        },
                    },
                },
            },
        })

        expect(wrapper.classes()).toContain('elevation-2')
        expect(wrapper.find('.c-progress-circular__underlay').classes()).toContain('text-grey')
        expect(wrapper.find('.c-progress-circular__overlay').classes()).toContain('text-indigo')
        expect(wrapper.find('.c-progress-circular__info').classes()).toContain('text-grey')
    })

    it('пресет: состояние complete подменяет зону info', () => {
        const wrapper = mount(CProgressCircular, {
            props: {
                preset: 'spinner',
                value: 100,
            },
            global: {
                provide: {
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            spinner: {
                                base: { info: ['text-grey'] },
                                complete: { info: ['text-green'] },
                            },
                        },
                    },
                },
            },
        })

        expect(wrapper.find('.c-progress-circular__info').classes()).toContain('text-green')
    })
})
