<script setup lang="ts" generic="T">
    import {
        computed,
        shallowRef,
        unref
    } from 'vue'

    import { CField } from '@/components/CField'
    import { CInput } from '@/components/CInput'
    import { CMenu } from '@/components/CMenu'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { useNormalizedItems } from '@/composables/use-normalized-items'
    import { useSelectedChips } from '@/composables/use-selected-chips'
    import { IconAliases } from '@/enums'

    import type { CSelectProps, CSelectSlots } from './types'

    defineOptions({ name: 'CSelect' })

    const props = defineProps<CSelectProps<T>>()

    defineSlots<CSelectSlots<T>>()

    const model = defineModel<T | T[]>({
        get: () => props.modelValue,
        set: val => val
    })

    const inputRef = shallowRef()

    const menuRef = shallowRef()

    const menuListRef = shallowRef()

    const normalizedItems = useNormalizedItems(props)

    const {
        chips: selectedItems,
        hasValue,
        select
    } = useSelectedChips(props)

    const { onKeydown } = useKeyboard({
        Tab: () => {
            unref(inputRef).blur()
            unref(menuRef).close()
        },
        ArrowDown: () => unref(menuListRef)?.navigateDown(),
        ArrowUp: () => unref(menuListRef)?.navigateUp(),
    }, { prevent: ['ArrowDown', 'ArrowUp'] })

    const ariaControls = computed(() => unref(menuListRef)?.listId)

    const descendant = computed(() => unref(menuListRef)?.descendant)

    function onBlur() {
        unref(inputRef).blur()
    }

    function onClear() {
        model.value = props.multiple ? [] : undefined
    }

    function onFocus() {
        unref(inputRef).focus()
    }
</script>

<template>
    <c-input
        v-bind="$attrs"
        ref="inputRef"
        :model-value="model"
        validate-on="blur"
        role="combobox"
        :aria-controls="ariaControls"
        :aria-activedescendant="descendant"
    >
        <template #field="field">
            <c-menu
                :id="`${field.uid}-menu`"
                ref="menuRef"
                align="bottom"
                open-on-focus
                close-on-click-outside
                :close-on-content-click="!multiple"
                :offset-y="2"
                strategy="reverse"
                @close="onBlur"
            >
                <template #activator="{on, activator}">
                    <div
                        class="c-select"
                        v-bind="activator"
                    >
                        <slot
                            name="field"
                            v-bind="field"
                        >
                            <c-field
                                :id="field.uid"
                                v-bind="field.attrs"
                                :focused="field.focused"
                                model-value=""
                                class="c-select__field"
                                :label="field.label"
                                :clearable="field.clearable"
                                :filled="hasValue"
                                :error="field.hasError"
                                no-input
                                v-on="on"
                                @focus="onFocus"
                                @clear="onClear"
                                @keydown="onKeydown"
                            >
                                <template #before>
                                    <slot
                                        name="selects"
                                        :items="selectedItems"
                                    >
                                        <div
                                            v-for="(it, i) in selectedItems"
                                            :key="it"
                                            class="c-selected__item"
                                        >
                                            {{ `${it}` + (i + 1 !== selectedItems.length ? ',' : '') }}
                                        </div>
                                    </slot>
                                </template>
                                <template #append>
                                    <c-icon
                                        :name="IconAliases.DROPDOWN"
                                        size="20"
                                    />
                                </template>
                            </c-field>
                        </slot>
                    </div>
                </template>
                <template #default>
                    <slot
                        name="menu"
                        :on-select="select"
                        :items="normalizedItems"
                    >
                        <c-list
                            ref="menuListRef"
                            v-model="model"
                            role="listbox"
                            selectable
                            :multiple
                            :mandatory
                        >
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
    </c-input>
</template>
