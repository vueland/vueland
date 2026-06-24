<script setup lang="ts" generic="T">
    import {
        computed,
        shallowRef,
        unref,
        watch
    } from 'vue'

    import { CField } from '@/components/CField'
    import { CInput } from '@/components/CInput'
    import { CMenu } from '@/components/CMenu'
    import { useAutocomplete } from '@/composables/use-autocomplete'
    import { useKeyboard } from '@/composables/use-keyboard'
    import { IconAliases } from '@/enums'

    import type { CAutocompleteProps, CAutocompleteSlots } from './types'

    defineOptions({ name: 'CAutocomplete' })

    const props = defineProps<CAutocompleteProps<T>>()

    const emit = defineEmits<{
        'update:search': [val: string],
    }>()

    defineSlots<CAutocompleteSlots<T>>()

    const model = defineModel<T | T[]>({
        get: () => props.modelValue,
        set: (val) => val,
    })

    const inputRef = shallowRef()

    const fieldRef = shallowRef()

    const menuRef = shallowRef()

    const menuListRef = shallowRef()

    const {
        inputValue,
        searchItems,
        chips,
        hasValue,
        select
    } = useAutocomplete(props)

    const { onKeydown } = useKeyboard({
        Backspace: () => {
            if (!unref(inputValue)) {
                const data = unref(model) as T[]

                model.value = props.multiple
                    ? data.slice(0, -1)
                    : undefined
            }
        },
        Tab: () => {
            unref(inputRef).blur()
            unref(menuRef).close()
        },
        Escape: () => {
            unref(inputRef).blur()
            unref(fieldRef).$el.blur()
        },
        ArrowDown: () => unref(menuListRef)?.navigateDown(),
        ArrowUp: () => unref(menuListRef)?.navigateUp(),
    }, { prevent: ['ArrowDown', 'ArrowUp'] })

    const ariaControls = computed(() => unref(menuListRef)?.listId)

    const descendant = computed(() => unref(menuListRef)?.descendant)

    function clear() {
        model.value = props.multiple ? [] : undefined
        inputValue.value = ''
    }

    function focus() {
        unref(inputRef).focus()
    }

    function blur() {
        unref(inputRef).blur()
    }

    watch(inputValue, () => {
        emit('update:search', unref(inputValue))
    })

</script>

<template>
    <c-input
        ref="inputRef"
        :model-value="model"
        v-bind="$attrs"
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
                :preset="options?.menuPreset"
                @close="blur"
            >
                <template #activator="{on, activator}">
                    <div
                        class="c-autocomplete"
                        v-bind="activator"
                    >
                        <slot
                            name="field"
                            v-bind="field"
                        >
                            <c-field
                                :id="field.uid"
                                ref="fieldRef"
                                v-model="inputValue"
                                v-bind="field.attrs"
                                class="c-autocomplete__field"
                                :label="field.label"
                                :clearable="field.clearable"
                                :disabled="field.disabled"
                                :focused="field.focused"
                                :readonly="field.readonly"
                                :filled="hasValue"
                                :error="field.hasError"
                                v-on="on"
                                @focus="focus"
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
                                            v-for="it in chips"
                                            :key="it"
                                            class="c-autocomplete__chip"
                                        >
                                            {{ it }}
                                        </c-chip>
                                    </slot>
                                </template>
                            </c-field>
                        </slot>
                    </div>
                </template>
                <template #default>
                    <slot
                        name="menu"
                        :on-select="select"
                        :items="searchItems"
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
    </c-input>
</template>
