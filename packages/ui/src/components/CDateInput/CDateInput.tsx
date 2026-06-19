import {
    computed,
    defineComponent,
    ref,
    type SlotsType,
    useModel,
} from 'vue'

import { IconAliases } from '../../enums'
import { emitsFactory, propsFactory } from '../../utils'
import {
    CDatePicker,
    type DatePickerDate,
    type DatePickerEnrichedDate,
    type DatePickerSlotApi,
    datePickerValueToString,
    type DatePickerWeekDay,
    type DisabledDates,
    makeCDatePickerProps,
} from '../CDatePicker'
import { CField } from '../CField'
import { CIcon } from '../CIcon'
import { CInput, type CInputFieldSlotProps, makeCInputProps } from '../CInput'
import { CMenu } from '../CMenu'

export const makeCDateInputProps = propsFactory({
    ...makeCInputProps(),
    ...makeCDatePickerProps(),
    typeable: Boolean,
    placeholder: String,
})

type CDateInputSlots = SlotsType<{
    prepend: void
    append: void
    date: DatePickerDate & { isSelected: boolean;
        isToday: boolean }
    week: { days: DatePickerWeekDay[] }
    dates: { dates: DatePickerEnrichedDate[];
        onSelect: (d: DatePickerDate) => void }
    'before-header': DatePickerSlotApi
    header: DatePickerSlotApi
    'before-body': DatePickerSlotApi
    body: DatePickerSlotApi
    footer: DatePickerSlotApi
}>

export const CDateInput = defineComponent({
    name: 'CDateInput',
    inheritAttrs: false,
    props: makeCDateInputProps(),
    emits: emitsFactory<{
        'update:modelValue': [Date | null]
        focus: []
        blur: []
    }>({
        'update:modelValue': () => true,
        focus: () => true,
        blur: () => true,
    }),
    slots: Object as CDateInputSlots,
    setup(props, {
        emit,
        slots,
        attrs,
    }) {
        const model = useModel(props, 'modelValue') as any
        const menuOpen = ref(false)
        const fieldRef = ref()
        const inputRef = ref()

        const displayValue = computed(() =>
            datePickerValueToString(model.value, props.format ?? 'dd.MM.yyyy', props.lang ?? 'en'),
        )

        function onDateSelect(value: Date | null) {
            model.value = value
            emit('update:modelValue', value)
            menuOpen.value = false
        }

        function onFieldClear() {
            model.value = null
            emit('update:modelValue', null)
        }

        function onTypeInput(val: string) {
            if (!props.typeable) return

            const parsed = new Date(val)

            if (!isNaN(parsed.getTime())) {
                model.value = parsed
                emit('update:modelValue', parsed)
            }
        }

        return () => (
            <CInput
                ref={inputRef}
                modelValue={model.value}
                {...attrs}
                kind="input"
                label={props.label}
                details={props.details}
                noDetails={props.noDetails}
                clearable={props.clearable}
                disabled={props.disabled}
                readonly={props.readonly}
                rules={props.rules}
                validateOn={props.validateOn}
                preset={props.preset}
                onFocus={() => emit('focus')}
                onBlur={() => emit('blur')}
            >
                {{
                    field: (field: CInputFieldSlotProps) => (
                        <CMenu
                            modelValue={menuOpen.value}
                            onUpdate:modelValue={(v: boolean) => { menuOpen.value = v }}
                            bottom
                            offsetY={2}
                            width={320}
                            closeOnClickOutside
                            closeOnContentClick={false}
                            strategy="reverse"
                        >
                            {{
                                activator: ({ activator }) => (
                                    <div class="c-date-input" {...activator}>
                                        <CField
                                            ref={fieldRef}
                                            id={field.uid}
                                            modelValue={displayValue.value}
                                            onUpdate:modelValue={onTypeInput}
                                            label={field.label}
                                            preset={field.preset}
                                            focused={field.focused}
                                            error={field.hasError}
                                            clearable={field.clearable}
                                            readonly={!props.typeable}
                                            noInput
                                            disabled={props.disabled}
                                            {...field.attrs}
                                            onFocus={() => {
                                                field.focus()
                                                if (!props.typeable) menuOpen.value = true
                                            }}
                                            onBlur={field.blur}
                                            onClear={onFieldClear}
                                        >
                                            {{
                                                prepend: () => slots.prepend?.() ?? (
                                                    <span style="cursor:pointer" onClick={() => { menuOpen.value = !menuOpen.value }}>
                                                        <CIcon name={IconAliases.CALENDAR} size={18} />
                                                    </span>
                                                ),
                                                ...(slots.append && { append: () => slots.append!() }),
                                            }}
                                        </CField>
                                    </div>
                                ),

                                default: () => (
                                    <CDatePicker
                                        modelValue={model.value}
                                        lang={props.lang}
                                        format={props.format}
                                        mondayFirst={props.mondayFirst}
                                        disabledDates={props.disabledDates as DisabledDates | undefined}
                                        minDate={props.minDate}
                                        maxDate={props.maxDate}
                                        highlightedDates={props.highlightedDates}
                                        onUpdate:modelValue={onDateSelect}
                                        onSelected={onDateSelect}
                                    >
                                        {{
                                            ...(slots.date && { date: slots.date }),
                                            ...(slots.week && { week: slots.week }),
                                            ...(slots.dates && { dates: slots.dates }),
                                            ...(slots['before-header'] && { 'before-header': slots['before-header'] }),
                                            ...(slots.header && { header: slots.header }),
                                            ...(slots['before-body'] && { 'before-body': slots['before-body'] }),
                                            ...(slots.body && { body: slots.body }),
                                            ...(slots.footer && { footer: slots.footer }),
                                        }}
                                    </CDatePicker>
                                ),
                            }}
                        </CMenu>
                    ),
                }}
            </CInput>
        )
    },
})

export type CDateInputProps = InstanceType<typeof CDateInput>['$props']
