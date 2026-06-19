import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { BREAKPOINTS } from '../../constants'
import { CCol } from '../index'

describe('CCol', () => {
    it('рендерится как div', () => {
        const wrapper = mount(CCol)

        expect(wrapper.element.tagName).toBe('DIV')
    })

    it('всегда имеет базовый класс c-col', () => {
        const wrapper = mount(CCol)

        expect(wrapper.classes()).toContain('c-col')
    })

    it('рендерит slot content', () => {
        const wrapper = mount(CCol, {
            slots: {
                default: 'Hello CCol',
            },
        })

        expect(wrapper.text()).toContain('Hello CCol')
    })

    it('добавляет класс для props.cols', () => {
        const wrapper = mount(CCol, {
            props: {
                cols: 6,
            },
        })

        expect(wrapper.classes()).toContain('c-col')
        expect(wrapper.classes()).toContain('c-col-6')
    })

    it('добавляет класс для props.order', () => {
        const wrapper = mount(CCol, {
            props: {
                order: 3,
            },
        })

        expect(wrapper.classes()).toContain('order-3')
    })

    it('добавляет класс для props.offset', () => {
        const wrapper = mount(CCol, {
            props: {
                offset: 2,
            },
        })

        expect(wrapper.classes()).toContain('offset-2')
    })

    it('не добавляет классы cols/order/offset если значения null', () => {
        const wrapper = mount(CCol)

        expect(wrapper.classes()).toEqual(['c-col'])
    })

    it('корректно обновляет классы при изменении props', async () => {
        const wrapper = mount(CCol, {
            props: {
                cols: 4,
                order: 1,
                offset: 2,
            },
        })

        expect(wrapper.classes()).toContain('c-col-4')
        expect(wrapper.classes()).toContain('order-1')
        expect(wrapper.classes()).toContain('offset-2')

        await wrapper.setProps({
            cols: 8,
            order: 5,
            offset: 1,
        })

        expect(wrapper.classes()).toContain('c-col-8')
        expect(wrapper.classes()).not.toContain('c-col-4')

        expect(wrapper.classes()).toContain('order-5')
        expect(wrapper.classes()).not.toContain('order-1')

        expect(wrapper.classes()).toContain('offset-1')
        expect(wrapper.classes()).not.toContain('offset-2')
    })

    describe('breakpoint props', () => {
        for (const bp of BREAKPOINTS) {
            it(`добавляет класс "${bp}-<value>" для props["${bp}"]`, () => {
                const wrapper = mount(CCol, {
                    props: {
                        [bp]: 6,
                    },
                })

                expect(wrapper.classes()).toContain(`${bp}-6`)
            })

            it(`добавляет класс "${bp}:order-<value>" для props["order-${bp}"]`, () => {
                const wrapper = mount(CCol, {
                    props: {
                        [`order-${bp}`]: 2,
                    },
                })

                expect(wrapper.classes()).toContain(`${bp}:order-2`)
            })

            it(`добавляет класс "${bp}:offset-<value>" для props["offset-${bp}"]`, () => {
                const wrapper = mount(CCol, {
                    props: {
                        [`offset-${bp}`]: 3,
                    },
                })

                expect(wrapper.classes()).toContain(`${bp}:offset-3`)
            })

            it(`не добавляет breakpoint-классы для "${bp}", если значения null`, () => {
                const wrapper = mount(CCol, {
                    props: {
                        [bp]: null,
                        [`order-${bp}`]: null,
                        [`offset-${bp}`]: null,
                    },
                })

                expect(wrapper.classes()).not.toContain(`${bp}-null`)
                expect(wrapper.classes()).not.toContain(`${bp}:order-null`)
                expect(wrapper.classes()).not.toContain(`${bp}:offset-null`)
            })
        }
    })

    it('может одновременно собирать несколько классов', () => {
        const firstBp = BREAKPOINTS[0]
        const secondBp = BREAKPOINTS[1]

        const wrapper = mount(CCol, {
            props: {
                cols: 12,
                order: 1,
                offset: 2,
                [firstBp]: 6,
                [`order-${firstBp}`]: 3,
                [`offset-${secondBp}`]: 4,
            },
        })

        expect(wrapper.classes()).toContain('c-col')
        expect(wrapper.classes()).toContain('c-col-12')
        expect(wrapper.classes()).toContain('order-1')
        expect(wrapper.classes()).toContain('offset-2')
        expect(wrapper.classes()).toContain(`${firstBp}-6`)
        expect(wrapper.classes()).toContain(`${firstBp}:order-3`)
        expect(wrapper.classes()).toContain(`${secondBp}:offset-4`)
    })
})
