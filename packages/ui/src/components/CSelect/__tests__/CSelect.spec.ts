import { mount } from '@vue/test-utils'
import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import {
    defineComponent,
    h,
    nextTick,
    shallowRef,
} from 'vue'

import { $APP_API_KEY, $VUELAND_UI_KEY } from '@/constants'
import { wait } from '@/helpers'

import {
    CChip,
    CIcon,
    CList,
    CListItem,
    CListItemTitle,
    CSelect,
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

let mounted: ReturnType<typeof mount>[] = []

// CSelect монтируется внутри хост-компонента с настоящим v-model:
// модель проверяем снаружи, как это делает пользователь библиотеки.
// shallowRef — чтобы объектные значения сохраняли ссылку (deep ref их проксирует).
function mountSelect(props: Record<string, unknown> = {}, slots?: Record<string, unknown>) {
    const {
        modelValue,
        ...rest
    } = props
    const model = shallowRef<unknown>(modelValue)

    const wrapper = mount(defineComponent({
        setup() {
            return () => h(CSelect as any, {
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

    mounted.push(wrapper)

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

const options = () => Array.from(document.querySelectorAll<HTMLElement>('.c-list-item'))

describe('CSelect', () => {
    afterEach(() => {
        mounted.forEach(w => w.unmount())
        mounted = []
        document.body.innerHTML = ''
    })

    it('a11y: aria-controls из CTextField указывает на id меню, aria-expanded отражает состояние', async () => {
        const { wrapper } = mountSelect({ items: ['first', 'second'], modelValue: '' })

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

    it('single: клик по опции пишет значение во внешний v-model', async () => {
        const { wrapper, model } = mountSelect({ items: ['first', 'second'] })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()

        expect(model.value).toBe('second')
    })

    it('multiple: клики накапливают значения во внешнем v-model и рендерят чипы', async () => {
        const { wrapper, model } = mountSelect({
            items: ['a', 'b', 'c'],
            multiple: true,
            chips: true,
            modelValue: [],
        })

        await openMenu(wrapper)
        options()[0].click()
        await nextTick()
        options()[2].click()
        await nextTick()

        expect(model.value).toEqual(['a', 'c'])
        expect(document.querySelectorAll('.c-chip')).toHaveLength(2)
    })

    it('закрытие чипа удаляет элемент по индексу из внешнего v-model', async () => {
        const { wrapper, model } = mountSelect({
            items: ['a', 'b', 'c'],
            multiple: true,
            chips: true,
            modelValue: ['a', 'b', 'c'],
        })

        await nextTick()

        const chips = wrapper.findAllComponents(CChip)

        expect(chips).toHaveLength(3)

        ;(chips[1] as any).vm.$emit('close')
        await nextTick()

        expect(model.value).toEqual(['a', 'c'])
    })

    it('клавиатура: ArrowDown + Enter выбирает первый элемент', async () => {
        const { wrapper, model } = mountSelect({ items: ['a', 'b'] })

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'ArrowDown' })
        await input.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(model.value).toBe('a')
    })

    it('клавиатура: typeahead фокусирует опцию, Enter её выбирает', async () => {
        const { wrapper, model } = mountSelect({ items: ['Alex', 'Vitaly'] })

        await openMenu(wrapper)

        const input = wrapper.get('.c-field-input')

        await input.trigger('keydown', { key: 'v' })
        await input.trigger('keydown', { key: 'Enter' })
        await nextTick()

        expect(model.value).toBe('Vitaly')
    })

    it('Escape закрывает меню', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b'] })

        await openMenu(wrapper)
        expect(document.querySelector('.c-menu--visible')).toBeTruthy()

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Escape' })
        await nextTick()
        await wait()
        await nextTick()

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('Tab закрывает меню', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b'] })

        await openMenu(wrapper)
        expect(document.querySelector('.c-menu--visible')).toBeTruthy()

        await wrapper.get('.c-field-input').trigger('keydown', { key: 'Tab' })
        await nextTick()
        await wait()
        await nextTick()

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('readonly: фокус не открывает меню', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b'], readonly: true })

        await openMenu(wrapper)

        expect(document.querySelector('.c-menu--visible')).toBeNull()
    })

    it('clear очищает внешний v-model (single)', async () => {
        const { wrapper, model } = mountSelect({ items: ['a', 'b'], modelValue: 'a', clearable: true })

        await wrapper.getComponent({ name: 'CField' }).vm.$emit('clear')
        await nextTick()

        expect(model.value).toBe(undefined)
    })

    it('clear сбрасывает внешний v-model в пустой массив (multiple)', async () => {
        const { wrapper, model } = mountSelect({
            items: ['a', 'b'],
            multiple: true,
            modelValue: ['a', 'b'],
            clearable: true,
        })

        await wrapper.getComponent({ name: 'CField' }).vm.$emit('clear')
        await nextTick()

        expect(model.value).toEqual([])
    })

    it('mandatory single: клик по выбранному не снимает выбор', async () => {
        const { wrapper, model } = mountSelect({ items: ['a', 'b'], modelValue: 'a', mandatory: true })

        await openMenu(wrapper)
        options()[0].click()
        await nextTick()

        expect(model.value).toBe('a')
    })

    it('single: повторный клик по выбранному сохраняет выбор', async () => {
        const { wrapper, model } = mountSelect({ items: ['a', 'b'], modelValue: 'a' })

        await openMenu(wrapper)
        options()[0].click()
        await nextTick()

        expect(model.value).toBe('a')
    })

    it('объектные items с titleKey: выбор кладёт объект, поле показывает title', async () => {
        const users = [{ name: 'Alex' }, { name: 'Vitaly' }]
        const { wrapper, model } = mountSelect({ items: users, titleKey: 'name' })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()

        expect(model.value).toEqual({ name: 'Vitaly' })
        expect(wrapper.get('.c-field__core').text()).toBe('Vitaly')
    })

    it('valueKey: в модель кладётся value, а поле показывает title', async () => {
        const users = [{ id: 1, name: 'Alex' }, { id: 2, name: 'Vitaly' }]
        const { wrapper, model } = mountSelect({ items: users, titleKey: 'name', valueKey: 'id' })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()

        expect(model.value).toBe(2)
        expect(wrapper.get('.c-field__core').text()).toBe('Vitaly')
    })

    it('показывает выбранные значения в поле (multiple, без chips)', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b', 'c'], multiple: true, modelValue: ['a', 'c'] })

        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('a,c')
    })

    it('нативный input показывает строку выбранных значений', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b', 'c'], multiple: true, modelValue: ['a', 'c'] })

        await nextTick()

        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('a, c')
    })

    it('single: начальное modelValue отображается в поле и нативном input', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b'], modelValue: 'a' })

        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('a')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('a')
    })

    it('single: выбор опции обновляет нативный input', async () => {
        const { wrapper } = mountSelect({ items: ['first', 'second'] })

        await openMenu(wrapper)
        options()[1].click()
        await nextTick()
        await nextTick()

        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('second')
    })

    it('single: начальная модель со значением из valueKey отображает title', async () => {
        const users = [{ id: 1, name: 'Alex' }, { id: 2, name: 'Vitaly' }]
        const { wrapper } = mountSelect({
            items: users,
            titleKey: 'name',
            valueKey: 'id',
            modelValue: 2,
        })

        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('Vitaly')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('Vitaly')
    })

    it('single: внешняя смена v-model обновляет отображение, сброс очищает поле', async () => {
        const { wrapper, model } = mountSelect({ items: ['a', 'b'], modelValue: 'a' })

        model.value = 'b'
        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('b')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('b')

        model.value = undefined
        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('')
    })

    it('multiple: внешняя смена v-model обновляет отображение', async () => {
        const { wrapper, model } = mountSelect({
            items: ['a', 'b', 'c'],
            multiple: true,
            modelValue: ['a'],
        })

        model.value = ['a', 'c']
        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('a,c')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('a, c')

        model.value = []
        await nextTick()

        expect(wrapper.get('.c-field__core').text()).toBe('')
        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('')
    })

    it('single: modelValue вне items отображается как есть', async () => {
        const { wrapper } = mountSelect({ items: ['a', 'b'], modelValue: 'z' })

        await nextTick()

        expect((wrapper.get('.c-field-input').element as HTMLInputElement).value).toBe('z')
    })

    it('single + chips: закрытие чипа очищает внешний v-model', async () => {
        const { wrapper, model } = mountSelect({
            items: ['a', 'b'],
            modelValue: 'a',
            chips: true,
        })

        await nextTick()

        const chips = wrapper.findAllComponents(CChip)

        expect(chips).toHaveLength(1)

        ;(chips[0] as any).vm.$emit('close')
        await nextTick()

        expect(model.value).toBe(undefined)
    })

    it('preset: зона menu из пресета комбобокса применяется к выпадашке', async () => {
        const wrapper = mount(defineComponent({
            setup() {
                return () => h(CSelect as any, {
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
        mounted.push(wrapper)

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
            const { wrapper } = mountSelect({ items: ['a'] }, {
                prepend: () => h('span', { class: 'custom-prepend' }, 'prep'),
            })

            expect(wrapper.get('.custom-prepend').text()).toBe('prep')
        })

        it('append: по умолчанию рендерит иконку дропдауна', () => {
            const { wrapper } = mountSelect({ items: ['a'] })

            expect(wrapper.find('.c-field__append .c-icon').exists()).toBe(true)
        })

        it('append: переопределяет иконку дропдауна', () => {
            const { wrapper } = mountSelect({ items: ['a'] }, {
                append: () => h('span', { class: 'custom-append' }, 'app'),
            })

            expect(wrapper.get('.custom-append').text()).toBe('app')
            expect(wrapper.find('.c-field__append .c-icon').exists()).toBe(false)
        })

        it('chips: получает выбранные значения и заменяет дефолтный рендер', () => {
            const { wrapper } = mountSelect({
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

        it('details: слот получает details и заменяет дефолтный рендер', () => {
            const { wrapper } = mountSelect({ items: ['a'], details: 'hint text' }, {
                details: ({ details }: { details?: string }) =>
                    h('em', { class: 'custom-details' }, details),
            })

            expect(wrapper.get('.custom-details').text()).toBe('hint text')
        })

        it('no-items-message: дефолтный текст при пустых items', async () => {
            const { wrapper } = mountSelect({ items: [] })

            await openMenu(wrapper)

            expect(options()[0].textContent?.trim()).toBe('No items')
        })

        it('no-items-message: options.noItemsMessage меняет текст', async () => {
            const { wrapper } = mountSelect({
                items: [],
                options: { noItemsMessage: 'Пусто' },
            })

            await openMenu(wrapper)

            expect(options()[0].textContent?.trim()).toBe('Пусто')
        })

        it('no-items-message: слот заменяет текст', async () => {
            const { wrapper } = mountSelect({ items: [] }, {
                'no-items-message': () => 'Ничего не нашлось',
            })

            await openMenu(wrapper)

            expect(options()[0].textContent?.trim()).toBe('Ничего не нашлось')
        })

        it('menu: получает нормализованные items и onSelect', async () => {
            let slotProps: any

            const { wrapper, model } = mountSelect({ items: ['a', 'b'] }, {
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

        it('menu: onSelect работает как toggle при multiple', async () => {
            let slotProps: any

            const { wrapper, model } = mountSelect({
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

    describe('валидация', () => {
        it('rules получают значение модели, а не отображаемую строку', async () => {
            const rule = vi.fn((value?: number) => ({
                valid: !!value,
                message: 'Required',
            }))

            const users = [{ id: 1, name: 'Alex' }, { id: 2, name: 'Vitaly' }]
            const { wrapper } = mountSelect({
                items: users,
                titleKey: 'name',
                valueKey: 'id',
                rules: [rule],
            })

            await openMenu(wrapper)
            options()[1].click()
            await nextTick()
            await wait()

            expect(rule).toHaveBeenLastCalledWith(2)
            expect(wrapper.classes()).not.toContain('c-input--has-error')
        })

        it('multiple: rules получают массив модели, снятие последнего пункта даёт ошибку', async () => {
            const rule = vi.fn((value: string[]) => ({
                valid: value.length > 0,
                message: 'Required',
            }))

            const { wrapper } = mountSelect({
                items: ['a', 'b'],
                multiple: true,
                modelValue: [],
                rules: [rule],
            })

            await openMenu(wrapper)
            options()[0].click()
            await nextTick()
            await wait()

            expect(rule).toHaveBeenLastCalledWith(['a'])
            expect(wrapper.classes()).not.toContain('c-input--has-error')

            options()[0].click()
            await nextTick()
            await wait()

            expect(rule).toHaveBeenLastCalledWith([])
            expect(wrapper.classes()).toContain('c-input--has-error')
        })

        it('clear запускает валидацию и показывает ошибку', async () => {
            const { wrapper } = mountSelect({
                items: ['a', 'b'],
                modelValue: 'a',
                clearable: true,
                rules: [(value?: string) => ({
                    valid: !!value,
                    message: 'Required',
                })],
            })

            await wrapper.getComponent({ name: 'CField' }).vm.$emit('clear')
            await nextTick()
            await wait()

            expect(wrapper.classes()).toContain('c-input--has-error')
        })
    })
})
