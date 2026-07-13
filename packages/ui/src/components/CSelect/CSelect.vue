<script setup lang="ts" generic="T">
    import { shallowRef, unref } from 'vue'

    import { CKeyboardProvider } from '@/components/CKeyboardProvider'
    import { CMenu } from '@/components/CMenu'
    import { CTextField } from '@/components/CTextField'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { useNormalizedItems } from '@/composables/use-normalized-items'
    import { useSelectedChips } from '@/composables/use-selected-chips'
    import { IconAliases } from '@/enums'

    import type { CSelectProps, CSelectSlots } from './types'

    defineOptions({ name: 'CSelect' })

    const props = defineProps<CSelectProps<T>>()

    defineSlots<CSelectSlots<T>>()

    const model = defineModel<T | T[] | undefined | null>()

    const cTextFieldRef = shallowRef()
    const keyboardRef = shallowRef()
    const menu = shallowRef(false)

    const normalizedItems = useNormalizedItems(props)

    const {
        hasValue,
        textValue,
        select,
        genChips
    } = useSelectedChips(props)

    const { onKeydown } = useKeyboard(
        {
            Tab: () => {
                unref(cTextFieldRef).blur()
                menu.value = false
            },
            Escape: () => {
                menu.value = false
                unref(cTextFieldRef).blur()
            },
            '*': (e) => unref(keyboardRef)?.forward(e)
        }, { prevent: ['ArrowDown', 'ArrowUp'] })

    function onClose() {
        unref(cTextFieldRef).blur()
        menu.value = false
    }

    function onFocus() {
        if (unref(cTextFieldRef).isReadonly()) {
            return
        }

        menu.value = true
    }

    function onClear() {
        model.value = props.multiple ? [] : undefined
    }

    const CChipsBox = () => unref(hasValue) ? genChips() : null
</script>

<template>
    <c-text-field
        ref="cTextFieldRef"
        :model-value="textValue"
        :validation-value="model"
        class="c-select"
        role="combobox"
        inputmode="none"
        :dirty="hasValue"
        v-bind="$attrs"
        @beforeinput.prevent
        @paste.prevent
        @drop.prevent
        @keydown="onKeydown"
        @clear="onClear"
        @focus="onFocus"
    >
        <template
            v-if="$slots.prepend"
            #prepend
        >
            <slot name="prepend" />
        </template>
        <template #before>
            <c-chips-box />
        </template>
        <template #append>
            <slot name="append">
                <c-icon
                    :name="IconAliases.DROPDOWN"
                    size="20"
                />
            </slot>
        </template>
        <template #details="{ errorMessage, details }">
            <slot
                name="details"
                :error-message
                :details
            >
                <span class="c-select__details">
                    {{ errorMessage || details }}
                </span>
            </slot>
        </template>
        <template #menu="{ id }">
            <c-menu
                :id
                v-model="menu"
                align="bottom"
                activator="parent"
                :close-on-content-click="!multiple"
                close-on-click-outside
                :offset-y="2"
                max-height="300"
                strategy="reverse"
                @close="onClose"
            >
                <template #default>
                    <c-keyboard-provider
                        ref="keyboardRef"
                        v-slot="keyboard"
                    >
                        <slot
                            name="menu"
                            :on-select="select"
                            :items="normalizedItems"
                            v-bind="keyboard"
                        >
                            <c-list
                                v-model="model"
                                variant="listbox"
                                class="c-select__listbox"
                                :item-key="titleKey"
                                aria-live="polite"
                                :multiple
                                :mandatory="mandatory || !multiple"
                            >
                                <c-list-item v-if="!normalizedItems.length">
                                    <c-list-item-title>
                                        <slot name="no-items-message">
                                            {{ options?.noItemsMessage ?? 'No items' }}
                                        </slot>
                                    </c-list-item-title>
                                </c-list-item>
                                <c-list-item
                                    v-for="item of normalizedItems"
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
    </c-text-field>
</template>
