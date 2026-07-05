<script setup lang="ts" generic="T">
    import {
        nextTick,
        shallowRef,
        unref,
        watch,
    } from 'vue'

    import type { CAutocompleteEmits } from '@/components'
    import { CMenu } from '@/components/CMenu'
    import { useSelectedChips, useToggle } from '@/composables'
    import { useAutocomplete } from '@/composables/use-autocomplete'
    import { useId } from '@/composables/use-id'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { IconAliases } from '@/enums'

    import type { CAutocompleteProps, CAutocompleteSlots } from './types'

    defineOptions({ name: 'CAutocomplete' })

    const props = defineProps<CAutocompleteProps<T>>()

    const emit = defineEmits<CAutocompleteEmits<T>>()

    defineSlots<CAutocompleteSlots<T>>()

    const model = defineModel<T | T[] | undefined | null>()

    const inputRef = shallowRef()
    const menuListRef = shallowRef()

    const [menu, toggleMenu] = useToggle(false)
    const listId = useId(undefined, { prefix: 'c-autocomplete-list' })

    const {
        chips,
        hasValue,
        textValue,
        closable,
        select,
        unselect
    } = useSelectedChips(props)

    const { inputValue, searchItems } = useAutocomplete(props)

    function clear() {
        model.value = props.multiple ? [] : undefined
        inputValue.value = ''
    }

    function onFocus() {
        menu.value = true
    }

    function onClose() {
        unref(inputRef).blur()
    }

    function onListKeyboardSelect(e: KeyboardEvent) {
        unref(menuListRef).onKeydown(e)

        if (props.multiple) {
            unref(inputRef).blur()
            nextTick(() => unref(inputRef).focus())
        } else {
            inputValue.value = ''
        }
    }

    function resetListFocus() {
        unref(menuListRef)?.blur()
    }

    function navigateListDown() {
        unref(menuListRef)?.navigateDown()
    }

    function navigateListUp() {
        unref(menuListRef)?.navigateUp()
    }

    const { onKeydown } = useKeyboard({
        Backspace: () => {
            if (!unref(inputValue)) {
                const data = unref(model) as T[]

                model.value = props.multiple
                    ? data.slice(0, -1)
                    : undefined

                resetListFocus()
            }
        },
        Tab: () => {
            unref(inputRef).blur()
            toggleMenu()
        },
        Escape: () => {
            toggleMenu()
            unref(inputRef).blur()
        },
        ArrowDown: navigateListDown,
        ArrowUp: navigateListUp,
    }, { prevent: ['ArrowDown', 'ArrowUp', 'Enter'] })

    const { onKeydown: onListKeydown } = useKeyboard({
        Enter: onListKeyboardSelect,
        Space: onListKeyboardSelect
    })

    watch(inputValue, (value) => {
        emit('update:search', value)
    })

</script>

<template>
    <c-text-field
        ref="inputRef"
        v-model="inputValue"
        :validation-value="model"
        :dirty="hasValue"
        v-bind="$attrs"
        :value="textValue"
        role="combobox"
        :aria-controls="listId"
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
            <slot
                name="chips"
                :items="chips"
            >
                <c-chip
                    v-for="(it, i) in chips"
                    :key="it"
                    :closable
                    class="c-autocomplete__chip"
                    color="info"
                    @close="unselect(i)"
                >
                    {{ it }}
                </c-chip>
            </slot>
        </template>
        <template #menu="{id}">
            <c-menu
                :id
                v-model="menu"
                align="bottom"
                activator="parent"
                open-on-focus
                close-on-click-outside
                :close-on-content-click="!multiple"
                :offset-y="2"
                strategy="reverse"
                :preset="options?.menuPreset"
                @close="onClose"
            >
                <template #default>
                    <slot
                        name="menu"
                        :on-select="select"
                        :items="searchItems"
                    >
                        <c-list
                            :id="listId"
                            ref="menuListRef"
                            v-model="model"
                            tabindex="-1"
                            variant="listbox"
                            class="c-autocomplete__listbox"
                            :multiple
                            :mandatory
                            @keydown="onListKeydown"
                        >
                            <c-list-item v-if="!searchItems.length">
                                <c-list-item-title>
                                    {{ options?.noItemsMessage ?? 'No items' }}
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
