import { mount } from '@vue/test-utils'
import {
    afterEach,
    describe,
    expect,
    it,
} from 'vitest'
import { nextTick } from 'vue'

import { $APP_API_KEY } from '@/constants'
import { wait } from '@/helpers'

import {
    CAutocomplete,
    CChip,
    CIcon,
    CList,
    CListItem,
    CListItemTitle,
} from '../../index'

const global = {
    components: {
        CChip,
        CIcon,
        CList,
        CListItem,
        CListItemTitle,
    },
    provide: {
        [$APP_API_KEY as symbol]: {
            getScrollTop: () => 0,
            getScrollLeft: () => 0,
        },
    },
}

async function openMenu(wrapper: ReturnType<typeof mount>) {
    await wrapper.get('.c-field-input').trigger('focus')
    await wait()
    await nextTick()
}

describe('CAutocomplete', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })

    it('связывает aria-controls с внешним id списка', async () => {
        const wrapper = mount(CAutocomplete<string>, {
            attachTo: document.body,
            props: {
                items: ['first', 'second'],
                modelValue: '',
            },
            global,
        })

        const field = wrapper.get('.c-field-input')
        const listId = field.attributes('aria-controls')

        expect(listId).toMatch(/^c-autocomplete-list-.+$/)

        await openMenu(wrapper)

        const list = document.getElementById(listId!)

        expect(list).toBeTruthy()
        expect(list?.classList.contains('c-list')).toBe(true)
    })
})
