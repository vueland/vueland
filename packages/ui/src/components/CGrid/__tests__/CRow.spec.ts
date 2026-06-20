import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'

import { BREAKPOINTS } from '../../../constants'
import { CRow } from '../CRow'

describe('CRow', () => {
    it('рендерится как div с классом c-row', () => {
        const wrapper = mount(CRow)
        expect(wrapper.element.tagName).toBe('DIV')
        expect(wrapper.classes()).toContain('c-row')
    })

    it('рендерит slot content', () => {
        const wrapper = mount(CRow, { slots: { default: 'content' } })
        expect(wrapper.text()).toContain('content')
    })

    it('no-gutter добавляет класс no-gutter', () => {
        const wrapper = mount(CRow, { props: { noGutter: true } })
        expect(wrapper.classes()).toContain('no-gutter')
    })

    describe('align prop', () => {
        it('align="center" → items-center', () => {
            const wrapper = mount(CRow, { props: { align: 'center' } })
            expect(wrapper.classes()).toContain('items-center')
            expect(wrapper.classes()).not.toContain('align-center')
        })

        it('align="start" → items-start', () => {
            const wrapper = mount(CRow, { props: { align: 'start' } })
            expect(wrapper.classes()).toContain('items-start')
        })

        it('align="end" → items-end', () => {
            const wrapper = mount(CRow, { props: { align: 'end' } })
            expect(wrapper.classes()).toContain('items-end')
        })

        it('align="baseline" → items-baseline', () => {
            const wrapper = mount(CRow, { props: { align: 'baseline' } })
            expect(wrapper.classes()).toContain('items-baseline')
        })

        it('align="stretch" → items-stretch', () => {
            const wrapper = mount(CRow, { props: { align: 'stretch' } })
            expect(wrapper.classes()).toContain('items-stretch')
        })
    })

    describe('justify prop', () => {
        it('justify="center" → justify-center', () => {
            const wrapper = mount(CRow, { props: { justify: 'center' } })
            expect(wrapper.classes()).toContain('justify-center')
        })

        it('justify="space-between" → justify-space-between', () => {
            const wrapper = mount(CRow, { props: { justify: 'space-between' } })
            expect(wrapper.classes()).toContain('justify-space-between')
        })
    })

    describe('alignContent prop', () => {
        it('alignContent="stretch" → content-stretch', () => {
            const wrapper = mount(CRow, { props: { alignContent: 'stretch' } })
            expect(wrapper.classes()).toContain('content-stretch')
            expect(wrapper.classes()).not.toContain('align-content-stretch')
        })

        it('alignContent="space-between" → content-space-between', () => {
            const wrapper = mount(CRow, { props: { alignContent: 'space-between' } })
            expect(wrapper.classes()).toContain('content-space-between')
        })
    })

    describe('breakpoint props', () => {
        for (const bp of BREAKPOINTS) {
            it(`align-${bp}="center" → ${bp}:items-center`, () => {
                const wrapper = mount(CRow, { props: { [`align-${bp}`]: 'center' } })
                expect(wrapper.classes()).toContain(`${bp}:items-center`)
                expect(wrapper.classes()).not.toContain(`${bp}:align-center`)
            })

            it(`justify-${bp}="end" → ${bp}:justify-end`, () => {
                const wrapper = mount(CRow, { props: { [`justify-${bp}`]: 'end' } })
                expect(wrapper.classes()).toContain(`${bp}:justify-end`)
            })

            it(`align-content-${bp}="stretch" → ${bp}:content-stretch`, () => {
                const wrapper = mount(CRow, { props: { [`align-content-${bp}`]: 'stretch' } })
                expect(wrapper.classes()).toContain(`${bp}:content-stretch`)
                expect(wrapper.classes()).not.toContain(`${bp}:align-content-stretch`)
            })
        }
    })

    it('не добавляет классы если пропы не переданы', () => {
        const wrapper = mount(CRow)
        expect(wrapper.classes()).toEqual(['c-row'])
    })
})
