import { mount, type VueWrapper } from '@vue/test-utils'
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
    ref,
    shallowRef,
} from 'vue'

import { $APP_API_KEY, $VUELAND_UI_KEY } from '@/constants'
import { wait } from '@/helpers'

import {
    CAutocomplete,
    CChip,
    CIcon,
    CList,
    CListItem,
    CListItemTitle,
    CTextField,
} from '../../index'

const global = {
    components: {
        CChip,
        CIcon,
        CList,
        CListItem,
        CListItemTitle,
        CTextField,
    },
    provide: {
        [$APP_API_KEY as symbol]: {
            getScrollTop: () => 0,
            getScrollLeft: () => 0,
        },
    },
}

const wrappers: VueWrapper[] = []

// CAutocomplete монтируется внутри хост-компонента с настоящим v-model:
// модель проверяем снаружи, как это делает пользователь библиотеки.
function mountAutocomplete(props: Record<string, unknown> = {}, slots?: Record<string, unknown>) {
    const {
        modelValue,
        ...rest
    } = props
    const model = shallowRef<unknown>(modelValue)

    const wrapper = mount(defineComponent({
        setup() {
            return () => h(CAutocomplete as any, {
                items: [],
                ...rest,
                modelValue: model.value,
                'onUpdate:modelValue': (v: unknown) => {
                    model.value = v
                },
            }, slots)
        },
    }), {
        attachTo: document.body,
        global,
    })

    wrappers.push(wrapper)

    return {
        wrapper,
        model,
    }
}

async function openMenu(wrapper: ReturnType<typeof mount>) {
    await wrapper.get('.c-field-input').trigger('focus')
    await wait()
    await nextTick()
}

async function typeSearch(wrapper: ReturnType<typeof mount>, value: string) {
    const input = wrapper.get('.c-field-input')

    ;(input.element as HTMLInputElement).value = value
    await input.trigger('input')
    await nextTick()
}

async function keydown(element: Element, key: string) {
    element.dispatchEvent(new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
    }))

    await nextTick()
}

const options = () => Array.from(document.body.querySelectorAll<HTMLElement>('.c-list-item'))

describe('CAutocomplete', () => {
    afterEach(() => {
        wrappers.forEach(wrapper => wrapper.unmount())
        wrappers.length = 0
        document.body.innerHTML = ''
    })

    it('a11y: aria-controls из CTextField указывает на id меню, aria-expanded отражает состояние', async () => {
        const { wrapper } = mountAutocomplete({ items: ['first', 'second'] })

        const field = wrapper.get('.c-field-input')

        expect(field.attributes('aria-haspopup')).toBe('listbox')
        expect(field.attributes('aria-expanded')).toBe('false')

        const menuId = field.attributes('aria-controls')

        expect(menuId).toBeTruthy()

        await openMenu(wrapper)

        expect(field.attributes('aria-expanded')).toBe('true')

        const menu = document.getElementById(menuId!)

        expect(menu).toBeTruthy()
        expect(menu?.querySelectorAll('.c-list-item')).toHaveLength(2)
    })

    it('фокус открывает меню со списком опций', async () => {
        const { wrapper } = mountAutocomplete({ items: ['first', 'second'] })

        await openMenu(wrapper)

        expect(document.querySelector('.c-menu--visible')).toBeTruthy()
        expect(options().map(it => it.textContent?.trim())).toEqual(['first', 'second'])
    })

    it('ввод фильтрует опции по началу строки и эмитит update:search', async () => {
        const searches: string[] = []
        const { wrapper } = mountAutocomplete({
            items: ['first', 'second'],
            'onUpdate:search': (v: string) => searches.push(v),
        })

        await openMenu(wrapper)
        await typeSearch(wrapper, 'se')

        expect(options().map(it => it.textContent?.trim())).toEqual(['second'])
        expect(searches).toEqual(['se'])
    })

    it('single: клик по опции пишет значение в v-model и очищает строку поиска', async () => {
        const { wrapper, model } = mountAutocomplete({ items: ['first', 'second'] })

        await openMenu(wrapper)
        await typeSearch(wrapper, 'se')

        options()[0].click()
        await wait()
        await nextTick()

        expect(model.value).toBe('second')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('')

        // фильтр не залипает: повторное открытие показывает все опции
        await openMenu(wrapper)

        expect(options().map(it => it.textContent?.trim())).toEqual(['first', 'second'])
    })

    it('Escape закрывает меню и сбрасывает строку поиска', async () => {
        const { wrapper } = mountAutocomplete({ items: ['first', 'second'] })

        await openMenu(wrapper)
        await typeSearch(wrapper, 'se')

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Escape' })
        await nextTick()
        await wait()
        await nextTick()

        expect(document.querySelector('.c-menu--visible')).toBeNull()
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('')
    })

    it('Tab закрывает меню', async () => {
        const { wrapper } = mountAutocomplete({ items: ['first', 'second'] })

        await openMenu(wrapper)
        expect(document.querySelector('.c-menu--visible')).toBeTruthy()

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Tab' })
        await nextTick()
        await wait()
        await nextTick()

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('multiple: Backspace при пустом поле удаляет последнее значение', async () => {
        const { wrapper, model } = mountAutocomplete({
            items: ['a', 'b', 'c'],
            multiple: true,
            modelValue: ['a', 'b'],
        })

        await openMenu(wrapper)
        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Backspace' })
        await nextTick()

        expect(model.value).toEqual(['a'])
    })

    it('multiple: Backspace без начального значения не падает', async () => {
        const { wrapper, model } = mountAutocomplete({
            items: ['a', 'b'],
            multiple: true,
        })

        await openMenu(wrapper)
        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Backspace' })
        await nextTick()

        expect(model.value).toEqual([])
    })

    it('readonly: фокус не открывает меню', async () => {
        const { wrapper } = mountAutocomplete({ items: ['a', 'b'], readonly: true })

        await openMenu(wrapper)

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('readonly: Backspace не удаляет выбранные значения', async () => {
        const { wrapper, model } = mountAutocomplete({
            items: ['a', 'b'],
            multiple: true,
            readonly: true,
            modelValue: ['a', 'b'],
        })

        await wrapper.get('.c-field-input').trigger('focus')
        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Backspace' })
        await nextTick()

        expect(model.value).toEqual(['a', 'b'])
    })

    it('single: повторный клик по выбранному пункту сохраняет выбор', async () => {
        const { wrapper, model } = mountAutocomplete({ items: ['a', 'b'], modelValue: 'a' })

        await openMenu(wrapper)
        options()[0].click()
        await wait()
        await nextTick()

        expect(model.value).toBe('a')
    })

    it('clear очищает модель и строку поиска', async () => {
        const { wrapper, model } = mountAutocomplete({
            items: ['a', 'b'],
            modelValue: 'a',
            clearable: true,
        })

        await typeSearch(wrapper, 'b')
        await wrapper.getComponent({ name: 'CField' }).vm.$emit('clear')
        await nextTick()

        expect(model.value).toBeUndefined()
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('')
    })

    it('chips: текст чипа без запятой на конце', () => {
        const { wrapper } = mountAutocomplete({
            items: ['first', 'second', 'third'],
            modelValue: ['first', 'second'],
            multiple: true,
            chips: true,
        })

        const chips = wrapper.findAll('.c-chip__content')

        expect(chips.map(chip => chip.text())).toEqual(['first', 'second'])
    })

    it('после удаления выбранного элемента Backspace стрелки снова двигают фокус по списку', async () => {
        const model = ref<string[]>([])

        const wrapper = mount(defineComponent({
            setup() {
                return () => h(CAutocomplete<string>, {
                    items: ['first', 'second', 'third'],
                    modelValue: model.value,
                    multiple: true,
                    chips: true,
                    'onUpdate:modelValue': (value: string[]) => {
                        model.value = value
                    },
                })
            },
        }), {
            attachTo: document.body,
            global,
        })
        wrappers.push(wrapper)

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(options()[0].classList.contains('c-list-item--focused')).toBe(true)

        await keydown(options()[0], 'Enter')
        await wait()
        await nextTick()

        expect(model.value).toEqual(['first'])

        await input.trigger('keydown', { key: 'Backspace' })
        await nextTick()

        expect(model.value).toEqual([])

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(options()[0].classList.contains('c-list-item--focused')).toBe(true)

        await keydown(options()[0], 'ArrowDown')
        await nextTick()

        expect(options()[1].classList.contains('c-list-item--focused')).toBe(true)
    })

    it('после изменения поиска клавиатурная навигация идёт по видимому порядку', async () => {
        const { wrapper } = mountAutocomplete({
            items: ['first', 'second', 'third'],
            multiple: true,
            modelValue: [],
        })

        await openMenu(wrapper)
        await typeSearch(wrapper, 'se')

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(options()[0].classList.contains('c-list-item--focused')).toBe(true)

        await keydown(options()[0], 'Enter')
        await wait()
        await nextTick()

        // фильтр снят — виден полный список, активным остался second
        await typeSearch(wrapper, '')

        expect(options().map(it => it.textContent?.trim())).toEqual(['first', 'second', 'third'])

        // ArrowDown от second должен уводить на third (вниз), а не прыгать вверх
        await input.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(options()[2].classList.contains('c-list-item--focused')).toBe(true)
    })

    it('выбор последнего пункта через фильтр не ломает навигацию после сброса поиска', async () => {
        const { wrapper, model } = mountAutocomplete({
            items: ['first', 'second', 'third'],
            multiple: true,
            modelValue: [],
        })

        await openMenu(wrapper)
        await typeSearch(wrapper, 'th')

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        await keydown(options()[0], 'Enter')
        await wait()
        await nextTick()

        expect(model.value).toEqual(['third'])

        // фильтр снят — third снова последний в полном списке
        await typeSearch(wrapper, '')

        // вниз некуда: фокус не должен прыгать в начало списка
        await input.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(options()[0].classList.contains('c-list-item--focused')).toBe(false)

        // вверх от third — на second, по видимому порядку
        await input.trigger('keydown', { key: 'ArrowUp' })
        await nextTick()

        expect(options()[1].classList.contains('c-list-item--focused')).toBe(true)
    })

    it('после клика в поле ArrowDown снова входит в список с начала', async () => {
        const { wrapper } = mountAutocomplete({ items: ['first', 'second'] })

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'ArrowDown' })
        await keydown(options()[0], 'ArrowDown')

        expect(options()[1].classList.contains('c-list-item--focused')).toBe(true)

        await input.trigger('mousedown')
        await input.trigger('keydown', { key: 'ArrowDown' })
        await nextTick()

        expect(options()[0].classList.contains('c-list-item--focused')).toBe(true)
    })

    it('preset: зона menu из пресета комбобокса применяется к выпадашке', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(CAutocomplete<string>, {
                    items: ['a', 'b'],
                    preset: 'combo',
                })
            },
        }), {
            attachTo: document.body,
            global: {
                ...global,
                provide: {
                    ...global.provide,
                    [$VUELAND_UI_KEY as symbol]: {
                        presets: {
                            combo: {
                                base: {
                                    root: ['text-red'],
                                    menu: { base: { root: ['bg-indigo'] } },
                                    list: {
                                        base: {
                                            root: ['pa-2'],
                                            option: ['radius-6'],
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
        wrappers.push(wrapper)

        await openMenu(wrapper)

        const menu = document.querySelector('.c-menu')

        expect(menu?.classList.contains('bg-indigo')).toBe(true)
        // root верхнего уровня — зона .c-input, на меню попадать не должна
        expect(menu?.classList.contains('text-red')).toBe(false)
        expect(document.querySelector('.c-list')?.classList.contains('pa-2')).toBe(true)
        expect(options()[0].classList.contains('radius-6')).toBe(true)
    })

    describe('слоты', () => {
        it('prepend: рендерит контент перед полем', () => {
            const { wrapper } = mountAutocomplete({ items: ['a'] }, {
                prepend: () => h('span', { class: 'custom-prepend' }, 'prep'),
            })

            expect(wrapper.get('.custom-prepend').text()).toBe('prep')
        })

        it('append: по умолчанию рендерит иконку дропдауна', () => {
            const { wrapper } = mountAutocomplete({ items: ['a'] })

            expect(wrapper.find('.c-field__append .c-icon').exists()).toBe(true)
        })

        it('append: переопределяет иконку дропдауна', () => {
            const { wrapper } = mountAutocomplete({ items: ['a'] }, {
                append: () => h('span', { class: 'custom-append' }, 'app'),
            })

            expect(wrapper.get('.custom-append').text()).toBe('app')
            expect(wrapper.find('.c-field__append .c-icon').exists()).toBe(false)
        })

        it('chips: получает выбранные значения и заменяет дефолтный рендер', () => {
            const { wrapper } = mountAutocomplete({
                items: ['a', 'b'],
                multiple: true,
                modelValue: ['a', 'b'],
                chips: true,
            }, {
                chips: ({ items }: { items: string[] }) =>
                    items.map(item => h('i', { class: 'custom-chip' }, item)),
            })

            expect(wrapper.findAll('.custom-chip').map(chip => chip.text())).toEqual(['a', 'b'])
            expect(wrapper.find('.c-chip').exists()).toBe(false)
        })

        it('details: по умолчанию показывает текст details', () => {
            const { wrapper } = mountAutocomplete({ items: ['a'], details: 'hint text' })

            expect(wrapper.text()).toContain('hint text')
        })

        it('details: слот получает details и заменяет дефолтный рендер', () => {
            const { wrapper } = mountAutocomplete({ items: ['a'], details: 'hint text' }, {
                details: ({ details }: { details?: string }) =>
                    h('em', { class: 'custom-details' }, details),
            })

            expect(wrapper.get('.custom-details').text()).toBe('hint text')
        })

        it('no-items-message: дефолтный текст при пустых items', async () => {
            const { wrapper } = mountAutocomplete({ items: [] })

            await openMenu(wrapper)

            expect(options()[0].textContent?.trim()).toBe('No items')
        })

        it('no-items-message: options.noItemsMessage меняет текст', async () => {
            const { wrapper } = mountAutocomplete({
                items: [],
                options: { noItemsMessage: 'Пусто' },
            })

            await openMenu(wrapper)

            expect(options()[0].textContent?.trim()).toBe('Пусто')
        })

        it('no-items-message: слот заменяет текст', async () => {
            const { wrapper } = mountAutocomplete({ items: [] }, {
                'no-items-message': () => 'Ничего не нашлось',
            })

            await openMenu(wrapper)

            expect(options()[0].textContent?.trim()).toBe('Ничего не нашлось')
        })

        it('menu: получает нормализованные items и onSelect', async () => {
            let slotProps: any

            const { wrapper, model } = mountAutocomplete({ items: ['a', 'b'] }, {
                menu: (props: any) => {
                    slotProps = props

                    return h('div', { class: 'custom-menu' })
                },
            })

            await openMenu(wrapper)

            expect(document.body.querySelector('.custom-menu')).toBeTruthy()
            expect(slotProps.items.map((it: any) => it.title)).toEqual(['a', 'b'])
            expect(slotProps.items[0]).toMatchObject({ raw: 'a', value: 'a' })

            slotProps.onSelect('b')
            await nextTick()

            expect(model.value).toBe('b')
        })

        it('menu: кастомное меню на CList управляется с клавиатуры без обвязки', async () => {
            const { wrapper, model } = mountAutocomplete({ items: ['first', 'second'] }, {
                menu: ({ items, onSelect }: any) => h(CList as any, { variant: 'listbox' }, () =>
                    items.map((item: any) => h(CListItem as any, {
                        key: item.key,
                        value: item.raw,
                        onClick: () => onSelect(item.raw),
                    }, () => h(CListItemTitle as any, () => item.title)))),
            })

            await openMenu(wrapper)
            await typeSearch(wrapper, 'se')

            const input = wrapper.get('.c-field-input')

            await input.trigger('keydown', { key: 'ArrowDown' })
            await nextTick()

            expect(options()[0].classList.contains('c-list-item--focused')).toBe(true)

            await keydown(options()[0], 'Enter')
            await wait()
            await nextTick()

            expect(model.value).toBe('second')

            // эффекты владельца доехали до кастомного списка: поиск очищен
            expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('')
        })

        it('menu: onSelect работает как toggle при multiple', async () => {
            let slotProps: any

            const { wrapper, model } = mountAutocomplete({
                items: ['a', 'b'],
                multiple: true,
                modelValue: ['a'],
            }, {
                menu: (props: any) => {
                    slotProps = props

                    return h('div')
                },
            })

            await openMenu(wrapper)

            slotProps.onSelect('a')
            await nextTick()

            expect(model.value).toEqual([])

            slotProps.onSelect('b')
            await nextTick()

            expect(model.value).toEqual(['b'])
        })
    })
})
