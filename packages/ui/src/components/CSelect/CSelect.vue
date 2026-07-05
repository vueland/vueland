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

    const model = defineModel<T | T[] | undefined | null>()

    const cTextFieldRef = shallowRef()
    const cListRef = shallowRef()
    const menu = shallowRef(false)

    const listId = useId(undefined, { prefix: 'c-select-list' })
    const normalizedItems = useNormalizedItems(props)

    const {
        chips: selects,
        hasValue,
        closable,
        textValue,
        select,
        unselect
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
            '*': (e) => unref(cListRef)?.onKeydown(e)
        }, { prevent: ['ArrowDown', 'ArrowUp'] })

    function onBlur() {
        unref(cTextFieldRef).blur()
        menu.value = false
    }

    function onFocus() {
        menu.value = true
    }

    function onClear() {
        model.value = props.multiple ? [] : undefined
    }
</script>

<template>
    <c-text-field
        ref="cTextFieldRef"
        :model-value="textValue"
        :validation-value="model"
        class="c-select"
        role="combobox"
        inputmode="none"
        :aria-controls="listId"
        :dirty="hasValue"
        v-bind="$attrs"
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
                        {{ textValue }}
                    </div>
                    <div
                        v-else
                        class="c-select__chips"
                    >
                        <c-chip
                            v-for="(it, i) in selects"
                            :key="i"
                            :closable
                            color="info"
                            @close="unselect(i)"
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
                            :item-key="titleKey"
                            aria-live="polite"
                            :multiple
                            :mandatory="mandatory || !multiple"
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
    </c-text-field>
</template>
