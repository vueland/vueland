<script setup lang="ts" generic="T">
    import { shallowRef, unref } from 'vue'

    import { CMenu } from '@/components/CMenu'
    import { CTextField } from '@/components/CTextField'
    import { useId } from '@/composables/use-id'
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
    const activeDescendant = shallowRef<string>()

    const listId = useId(undefined, { prefix: 'c-select-list' })
    const normalizedItems = useNormalizedItems(props)

    const {chips: selectedItems,select} = useSelectedChips(props)

    const { onKeydown } = useKeyboard({
        Tab: () => {
            unref(inputRef).blur()
            unref(menuRef).close()
        },
        ArrowDown: () => unref(menuListRef)?.navigateDown(),
        ArrowUp: () => unref(menuListRef)?.navigateUp(),
    }, { prevent: ['ArrowDown', 'ArrowUp'] })

    function onBlur() {
        unref(inputRef).blur()
    }

    // function onClear() {
    //     model.value = props.multiple ? [] : undefined
    // }
    //
    // function onFocus() {
    //     unref(inputRef).focus()
    // }

    function setActiveDescendant(id: string) {
        activeDescendant.value = id
    }

    function clearActiveDescendant(id: string) {
        if (activeDescendant.value === id) {
            activeDescendant.value = undefined
        }
    }
</script>

<template>
    <c-menu
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
                <c-text-field
                    v-model="model"
                    no-input
                    v-bind="$attrs"
                    v-on="on"
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
            </div>
        </template>
        <template #default>
            <slot
                name="menu"
                :on-select="select"
                :items="normalizedItems"
            >
                <c-list
                    :id="listId"
                    ref="menuListRef"
                    v-model="model"
                    variant="listbox"
                    class="c-select__listbox"
                    :multiple
                    :mandatory
                >
                    <c-list-item
                        v-for="item of normalizedItems"
                        :key="item.key"
                        :value="item.value ?? item.raw"
                        @active="setActiveDescendant"
                        @inactive="clearActiveDescendant"
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
