import {
    computed,
    defineComponent,
    onMounted,
    type PropType,
    shallowRef,
    Transition,
    unref,
    useAttrs,
    useModel, type VNode,
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

        const presets = useFieldPresets({ slots: slots as any, props, attrs })
        const hasValue = computed(() => props.filled || !!unref(value))
        const showClearBtn = computed(() => props.clearable && props.focused && unref(hasValue))

        const classes = computed(() => [
            {
                'c-field--focused': props.focused,
                'c-field--filled': unref(hasValue),
                'c-field--has-prepend': !!slots.prepend,
                'c-field--default': !props.focused && !props.error,
            },
            ...unref(presets).root,
        ])

        function focus() {
            if (attrs.disabled) return
            emit('focus')
        }

        function blur() {
            emit('blur')
        }

        function clear() {
            emit('clear')
            value.value = ''
        }

        function onClick() {
            unref(inputRef)!.focus()
        }

        onMounted(() => {
            if (props.focused) unref(inputRef)?.focus()
        })

        return () => {
            const Tag = props.tag ?? 'input'

            return (
                <div class={['c-field', ...unref(classes)]} onClick={onClick}>
                    {slots.prepend && (
                        <div class={['c-field__prepend', unref(presets).prepend]}>
                            {slots.prepend()}
                        </div>
                    )}

                    <div class="c-field__core">
                        <CLabel
                            id={`${attrs.id}-label`}
                            for={attrs.id as string}
                            tag="label"
                            class="c-field-label"
                            style={unref(presets).label}
                        >
                            {props.label}
                        </CLabel>

                        {slots.before?.()}

                        <Tag
                            {...attrs}
                            ref={inputRef}
                            value={unref(value)}
                            class={['c-field-input', unref(presets).input]}
                            onInput={(e: InputEvent) => {
                                value.value = (e.target as HTMLInputElement).value
                            }}
                            onBlur={blur}
                            onFocus={focus}
                            onClick={(e: Event) => e.stopPropagation()}
                            onKeydown={props.onKeydown}
                        />

                        {slots.after?.()}
                    </div>

                    <Transition name="fade">
                        {unref(showClearBtn) && (
                            <div class="c-field__clear" onClick={clear}>
                                {slots.clear?.() ?? (
                                    <CIcon
                                        name={IconAliases.CLOSE}
                                        size={24}
                                    />
                                )}
                            </div>
                        )}
                    </Transition>

                    {slots.append && (
                        <div class={['c-field__append', unref(presets).append]}>
                            {slots.append()}
                        </div>
                    )}
                </div>
            )
        }
    },
})

export type CFieldProps = InstanceType<typeof CField>['$props']
