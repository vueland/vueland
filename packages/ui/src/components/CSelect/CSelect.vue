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
        set: (val) => val,
    })

    const cTextFieldRef = shallowRef()
    const cListRef = shallowRef()
    const menu = shallowRef(false)

    const activeDescendant = shallowRef()

    const listId = useId(undefined, { prefix: 'c-select-list' })

    const normalizedItems = useNormalizedItems(props)

    const {
        chips: selects,
        hasValue,
        select
    } = useSelectedChips(props)

    const { onKeydown } = useKeyboard(
        {
            ArrowDown: () => unref(cListRef)?.navigateDown(),
            ArrowUp: () => unref(cListRef)?.navigateUp(),
            Tab: () => {
                unref(cTextFieldRef).blur()
                menu.value = false
            },
            Escape: () => {
                menu.value = false
                unref(cTextFieldRef).blur()
            }
        },
        { prevent: ['ArrowDown', 'ArrowUp', 'Enter'] },
    )

    function onBlur() {
        clearActiveDescendant()
        unref(cTextFieldRef).blur()
    }

    function onFocus() {
        menu.value = true
    }

    function onClear() {
        model.value = props.multiple ? [] : undefined
    }

    function onCloseChip(value: T) {
        const { valueKey, titleKey } = props
        const key = valueKey ?? titleKey

        model.value = props.multiple ? (model.value as T[]).filter(it => {
            if(key) {
                return it[key as string] !== value
            }

            return it !== value
        }) : undefined
    }

    function setActiveDescendant(id: string) {
        activeDescendant.value = id
    }

    function clearActiveDescendant() {
        activeDescendant.value = undefined
    }
</script>

<template>
    <c-text-field
        ref="cTextFieldRef"
        class="c-select"
        role="combobox"
        inputmode="none"
        :aria-controls="listId"
        :aria-activedescendant="activeDescendant"
        :dirty="hasValue"
        v-bind="$attrs"
        :value="selects.join(', ')"
        @beforeinput.prevent
        @paste.prevent
        @drop.prevent
        @keydown="onKeydown"
        @clear="onClear"
        @focus="onFocus"
    >
        <template #before>
            <slot
                name="selects"
                :items="selects"
            >
                <template v-if="selects.length">
                    <div
                        v-if="!chips"
                        class="c-select__items"
                    >
                        {{ selects.join(', ') }}
                    </div>
                    <div
                        v-else
                        class="c-select__chips"
                    >
                        <c-chip
                            v-for="it in selects"
                            :key="it"
                            :value="it"
                            color="info"
                            closable
                            @close="onCloseChip"
                        >
                            {{ it }}
                        </c-chip>
                    </div>
                </template>
            </slot>
        </template>
        <template #append>
            <c-icon
                :name="IconAliases.DROPDOWN"
                size="20"
            />
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
                strategy="reverse"
                @close="onBlur"
            >
                <template #default>
                    <slot
                        name="menu"
                        :on-select="select"
                        :items="normalizedItems"
                    >
                        <c-list
                            :id="listId"
                            ref="cListRef"
                            v-model="model"
                            variant="listbox"
                            class="c-select__listbox"
                            item-key="name"
                            aria-live="polite"
                            :multiple
                            :mandatory
                        >
                            <c-list-item
                                v-for="item of normalizedItems"
                                :key="item.key"
                                :value="item.value ?? item.raw"
                                @active="setActiveDescendant"
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
    </c-text-field>
</template>
