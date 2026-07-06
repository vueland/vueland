import { mount } from '@vue/test-utils'
import {
    describe,
    expect,
    it,
} from 'vitest'
import {
    defineComponent,
    h,
    nextTick,
    ref,
} from 'vue'

import {
    CList,
    CListItem,
    CListItemTitle,
} from '../../index'

// Реестр пунктов обязан следовать DOM-порядку, а не хронологии монтирования:
// при keyed-диффе v-for новые узлы монтируются вокруг выживших в порядке,
// который диктует доступность якорей, а не позиция в списке.
function mountList(initial: string[]) {
    const items = ref(initial)

    const wrapper = mount(defineComponent({
        setup() {
            return () => h(CList as any, { variant: 'listbox', modelValue: [], multiple: true }, {
                default: () => items.value.map(it =>
                    h(CListItem as any, { key: it, value: it }, {
                        default: () => h(CListItemTitle as any, () => it),
                    })),
            })
        },
    }), { attachTo: document.body })

    const list = wrapper.findComponent({ name: 'CList' })

    const focusedText = () => wrapper
        .findAll('.c-list-item')
        .filter(w => w.classes('c-list-item--focused'))
        .map(w => w.text())

    return {
        wrapper,
        list,
        items,
        focusedText,
    }
}

describe('порядок реестра при пере-рендере v-for', () => {
    it('выжил средний пункт: навигация идёт по видимому порядку в обе стороны', async () => {
        const {
            wrapper,
            list,
            items,
            focusedText,
        } = mountList(['second'])

        ;(list.vm as any).navigateDown()
        await nextTick()
        expect(focusedText()).toEqual(['second'])

        // фильтр снят: first/third добавляются вокруг second
        items.value = ['first', 'second', 'third']
        await nextTick()

        ;(list.vm as any).navigateDown()
        await nextTick()
        expect(focusedText(), 'down от second').toEqual(['third'])

        ;(list.vm as any).navigateDown()
        await nextTick()
        expect(focusedText(), 'down от third — конец, остаёмся').toEqual(['third'])

        ;(list.vm as any).navigateUp()
        await nextTick()
        expect(focusedText(), 'up от third').toEqual(['second'])

        ;(list.vm as any).navigateUp()
        await nextTick()
        expect(focusedText(), 'up от second').toEqual(['first'])

        wrapper.unmount()
    })

    it('выжил последний пункт: ArrowDown не прыгает в начало списка', async () => {
        const {
            wrapper,
            list,
            items,
            focusedText,
        } = mountList(['third'])

        ;(list.vm as any).navigateDown()
        await nextTick()
        expect(focusedText()).toEqual(['third'])

        items.value = ['first', 'second', 'third']
        await nextTick()

        // third — конец видимого списка: вниз некуда, фокус не двигается
        ;(list.vm as any).navigateDown()
        await nextTick()
        expect(focusedText(), 'down от third — конец, остаёмся').toEqual(['third'])

        ;(list.vm as any).navigateUp()
        await nextTick()
        expect(focusedText(), 'up от third').toEqual(['second'])

        wrapper.unmount()
    })
})
