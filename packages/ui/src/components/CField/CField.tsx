import {
    computed,
    defineComponent,
    onMounted,
    type PropType,
    shallowRef,
    Transition,
    unref,
    useAttrs,
    useModel,
    type VNode,
} from 'vue'

import { useFieldPresets } from '../../composables/use-field-presets'
import { IconAliases } from '../../enums'
import { propsFactory } from '../../utils'
import { CIcon } from '../CIcon'
import { CLabel } from '../CLabel'

export type CFieldSlots = {
    prepend?(): VNode
    append?(): VNode
    before?(): VNode | VNode[]
    after?(): VNode | VNode[]
    clear?(): VNode
}

const makeCFieldProps = propsFactory({
    tag: String as PropType<'input' | 'textarea'>,
    id: String,
    label: String,
    filled: Boolean,
    preset: String,
    focused: Boolean,
    clearable: Boolean,
    error: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    noInput: Boolean,
    modelValue: [String, Number] as PropType<string | number | undefined | null>,
    onKeydown: Function as PropType<(e: KeyboardEvent) => void>,
})

export const CField = defineComponent({
    name: 'CField',
    inheritAttrs: false,
    props: makeCFieldProps(),
    emits: ['focus', 'blur', 'clear', 'update:modelValue'],
    setup(props, { emit, slots }) {
        const attrs = useAttrs()
        const value = useModel(props, 'modelValue')
        const inputRef = shallowRef<HTMLElement>()

        const hasValue = computed(() => props.filled || !!unref(value))

        const presets = useFieldPresets({
            slots,
            props,
            hasValue,
        })

        const clearable = computed(() => props.clearable && props.focused && unref(hasValue))

        const classes = computed(() => [
            {
                'c-field--focused': props.focused,
                'c-field--filled': unref(hasValue),
                'c-field--has-prepend': !!slots.prepend,
                'c-field--disabled': props.disabled,
                'c-field--readonly': props.readonly,
                'c-field--error': props.error,
                'c-field--default': !props.focused && !props.error && !props.disabled,
            },
            ...unref(presets).root,
        ])

        function focus() {
            if (props.disabled) return
            emit('focus')
        }

        function blur() {
            emit('blur')
        }

        function clear() {
            emit('clear')
        }

        function onMousedown(e: MouseEvent) {
            e.preventDefault()
            if (document.activeElement !== unref(inputRef)) {
                unref(inputRef)?.focus()
            }
        }

        onMounted(() => {
            if (props.focused) unref(inputRef)?.focus()
        })

        return () => {
            const Tag = props.tag ?? 'input'

            return (
                <div class={['c-field', ...unref(classes)]} onMousedown={onMousedown}>
                    <div aria-hidden="true" class="c-field__outline">
                        <div class="c-field__outline-start" />
                        <div class="c-field__outline-notch">
                            <span class={unref(presets).label}>{props.label}</span>
                        </div>
                        <div class="c-field__outline-end" />
                    </div>

                    {slots.prepend && (
                        <div class="c-field__prepend">
                            {slots.prepend()}
                        </div>
                    )}

                    <div class="c-field__core">
                        <CLabel
                            id={`${props.id}-label`}
                            for={props.id}
                            tag="label"
                            class={['c-field-label', unref(presets).label]}
                        >
                            {props.label}
                        </CLabel>

                        {slots.before?.()}

                        <Tag
                            {...attrs}
                            id={props.id}
                            ref={inputRef}
                            value={unref(value)}
                            disabled={props.disabled}
                            readonly={props.readonly || props.noInput}
                            class={['c-field-input', unref(presets).input]}
                            onInput={(e: InputEvent) => {
                                value.value = (e.target as HTMLInputElement).value
                            }}
                            onBlur={blur}
                            onFocus={focus}

                            onKeydown={props.onKeydown}
                        />

                        {slots.after?.()}
                    </div>

                    <Transition name="fade">
                        {unref(clearable) && (
                            <div class="c-field__clear" onClick={clear}>
                                {slots.clear?.() ?? <CIcon name={IconAliases.CLOSE} size={24} />}
                            </div>
                        )}
                    </Transition>

                    {slots.append && (
                        <div class="c-field__append">
                            {slots.append()}
                        </div>
                    )}
                </div>
            )
        }
    },
})

export type CFieldProps = InstanceType<typeof CField>['$props']
