<script setup lang="ts" generic="T">
    import {
        nextTick,
        shallowRef,
        unref,
        useAttrs,
        watch,
    } from 'vue'

    import { CKeyboardProvider } from '@/components/CKeyboardProvider'
    import {
        CList,
        CListItem,
        CListItemTitle
    } from '@/components/CList'
    import { CMenu } from '@/components/CMenu'
    import { CTextField } from '@/components/CTextField'
    import { useSelectedChips } from '@/composables'
    import { useAutocomplete } from '@/composables/use-autocomplete'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { IconAliases } from '@/enums'
    import { isDef } from '@/helpers'

    import {
        type CAutocompleteEmits,
        type CAutocompleteProps,
        type CAutocompleteSlots
    } from './types'

    defineOptions({ name: 'CAutocomplete' })

    const props = defineProps<CAutocompleteProps<T>>()
    const emit = defineEmits<CAutocompleteEmits<T>>()
    defineSlots<CAutocompleteSlots<T>>()

    const model = defineModel<T | T[] | undefined | null>()

    const inputRef = shallowRef()
    const keyboardRef = shallowRef()
    const menu = shallowRef(false)

    const attrs = useAttrs()

    const isReadonly = () => isDef(attrs.readonly) && attrs.readonly !== false

    const {
        hasValue,
        select,
        genChips
    } = useSelectedChips(props)

    const { inputValue, searchItems } = useAutocomplete(props)

    function clear() {
        model.value = props.multiple ? [] : undefined
        inputValue.value = ''
    }

    function onFocus() {
        if (isReadonly()) {
            return
        }

        menu.value = true
    }

    function onClose() {
        unref(inputRef).blur()
    }

    // Выбор с клавиатуры делает сам список (Enter/Space → активация пункта);
    // здесь — только эффекты автокомплита. Провайдер вешает их на тот список,
    // который фактически отрендерен.
    function onSelect() {
        if (props.multiple) {
            unref(inputRef).blur()
            nextTick(() => unref(inputRef).focus())
        } else {
            inputValue.value = ''
        }
    }

    const { onKeydown: onListKeydown } = useKeyboard({
        Enter: onSelect,
        Space: onSelect,
    })

    function resetListFocus() {
        unref(keyboardRef)?.blur()
    }

    const { onKeydown } = useKeyboard({
        Backspace: () => {
            if (isReadonly() || unref(inputValue)) {
                return
            }

            const data = (unref(model) as T[] | undefined) ?? []

            model.value = props.multiple
                ? data.slice(0, -1)
                : undefined

            resetListFocus()
        },
        Tab: () => {
            unref(inputRef).blur()
            menu.value = false
        },
        Escape: () => {
            unref(inputRef).blur()
            menu.value = false
        },
        ArrowDown: (e) => unref(keyboardRef)?.forward(e),
        ArrowUp: (e) => unref(keyboardRef)?.forward(e),
    }, { prevent: ['ArrowDown', 'ArrowUp', 'Enter'] })

    const CChipsBox = () => unref(hasValue) ? genChips() : null

    watch(inputValue, (value) => {
        emit('update:search', value)
    })

    // Закрытие меню любым путём (выбор мышью, Escape, Tab, клик вне)
    // сбрасывает строку поиска, чтобы фильтр не залипал к следующему открытию.
    watch(menu, (value) => {
        if (!value) {
            inputValue.value = ''
        }
    })
</script>

<template>
    <c-text-field
        ref="inputRef"
        v-model="inputValue"
        :validation-value="model"
        :dirty="hasValue"
        v-bind="$attrs"
        role="combobox"
        class="c-autocomplete"
        @mousedown="resetListFocus"
        @focus="onFocus"
        @keydown="onKeydown"
        @clear="clear"
    >
        <template
            v-if="$slots.prepend"
            #prepend
        >
            <slot name="prepend"></slot>
        </template>
        <template #append>
            <slot name="append">
                <c-icon
                    :name="IconAliases.DROPDOWN"
                    size="24"
                />
            </slot>
        </template>
        <template #before>
            <c-chips-box />
        </template>
        <template #menu="{id}">
            <c-menu
                :id
                v-model="menu"
                align="bottom"
                activator="parent"
                close-on-click-outside
                :close-on-content-click="!multiple"
                :offset-y="2"
                strategy="reverse"
                max-height="300"
                @close="onClose"
            >
                <template #default>
                    <c-keyboard-provider
                        ref="keyboardRef"
                        v-slot="keyboard"
                        @keydown="onListKeydown"
                    >
                        <slot
                            name="menu"
                            :on-select="select"
                            :items="searchItems"
                            v-bind="keyboard"
                        >
                            <c-list
                                v-model="model"
                                tabindex="-1"
                                variant="listbox"
                                class="c-autocomplete__listbox"
                                :multiple
                                :mandatory="mandatory || !multiple"
                            >
                                <c-list-item v-if="!searchItems.length">
                                    <c-list-item-title>
                                        <slot name="no-items-message">
                                            {{ options?.noItemsMessage ?? 'No items' }}
                                        </slot>
                                    </c-list-item-title>
                                </c-list-item>
                                <c-list-item
                                    v-for="item of searchItems"
                                    :key="item.key"
                                    :value="item.value ?? item.raw"
                                >
                                    <c-list-item-title>
                                        {{ item.title }}
                                    </c-list-item-title>
                                </c-list-item>
                            </c-list>
                        </slot>
                    </c-keyboard-provider>
                </template>
            </c-menu>
        </template>
        <template #details="{errorMessage, details}">
            <slot
                name="details"
                :error-message
                :details
            >
                <span :key="errorMessage || details">
                    {{ errorMessage || details }}
                </span>
            </slot>
        </template>
    </c-text-field>
</template>
