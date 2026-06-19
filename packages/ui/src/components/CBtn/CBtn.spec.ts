import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { CBtn } from '../index'

describe('CBtn', () => {
    it('маунтит дефолтный компонент', () => {
        const wrapper = mount(CBtn, { slots: { default: 'Hello' } })

        expect(wrapper.text()).toContain('Hello')
        expect(wrapper.classes()).toContain('c-btn--flat')
    })

    it('устанавливает props.variant = "outlined"', () => {
        const wrapper = mount(CBtn, {
            props: { variant: 'outlined' },
            slots: { default: 'Hello' }
        })

        expect(wrapper.text()).toContain('Hello')
        expect(wrapper.classes()).toContain('c-btn--outlined')
    })

    it('устанавливает props.block', () => {
        const wrapper = mount(CBtn, {
            props: { block: true },
        })

        expect(wrapper.classes()).toContain('c-btn--block')
    })

    it('устанавливает атрибут disabled', () => {
        const wrapper = mount(CBtn, {
            props: { disabled: true },
        })

        expect(wrapper.element.attributes.disabled).toBeTruthy()
    })
})
