import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import { h } from 'vue'

import { CIcon } from '@/components'
import { ICONS } from '@/constants/icons'
import { IconAliases, IconName } from '@/enums'

describe('CIcon', () => {
    it('рендерит svg-контейнер с default slot без name/body', () => {
        const wrapper = mount(CIcon, {
            props: {
                viewBox: '0 0 24 24',
                size: '100%',
                class: 'custom-icon',
            },
            slots: {
                default: () => h('path', {
                    class: 'custom-path',
                    d: 'M0 0H24',
                }),
            },
        })

        const svg = wrapper.find('svg.custom-icon')

        expect(wrapper.find('.c-icon').classes()).not.toContain('c-icon--empty')
        expect(svg.exists()).toBe(true)
        expect(svg.attributes('viewBox')).toBe('0 0 24 24')
        expect(svg.find('.custom-path').attributes('d')).toBe('M0 0H24')
    })

    it('отдаёт resolved icon path в default slot', () => {
        const wrapper = mount(CIcon, {
            props: {
                name: IconAliases.CHECKBOX_CHECK_MARK,
            },
            slots: {
                default: ({ icon }) => h('path', {
                    class: 'custom-path',
                    d: icon.path,
                }),
            },
        })

        expect(wrapper.find('.custom-path').attributes('d'))
            .toBe(ICONS[IconName.CHECKBOX_CHECK_MARK].path)
    })

    it('явный size главнее размера из реестра', () => {
        // У CHECKBOX_ON (CHECKED_BOX) в реестре size: 28.
        const wrapper = mount(CIcon, {
            props: {
                name: IconAliases.CHECKBOX_ON,
                size: 18,
            },
        })

        expect(wrapper.find('.c-icon').attributes('style')).toContain('width: 18px')
    })

    it('без явного size берёт размер из реестра', () => {
        const wrapper = mount(CIcon, {
            props: { name: IconAliases.CHECKBOX_ON },
        })

        expect(wrapper.find('.c-icon').attributes('style')).toContain('width: 28px')
    })
})
