<script setup lang="ts">
    import { computed, shallowRef } from 'vue'

    import { isDef } from '@/helpers'

    defineOptions({ name: 'CDatePickerYears' })

    const props = defineProps<{
        year: number
        minYear?: number
        maxYear?: number
    }>()

    const emit = defineEmits<{
        'update:year': [year: number]
    }>()

    defineSlots<{
        years?(props: { years: EnrichedYear[] }): any
        year?(props: EnrichedYear): any
    }>()

    export type EnrichedYear = {
        year: number
        disabled: boolean
        isSelected: boolean
        isCurrent: boolean
        onSelect: () => void
    }

    const CELLS_IN_ROW = 4
    const ON_TABLE = 20
    const LIMIT = 100
    const CURRENT_YEAR = new Date().getFullYear()

    const allPages: number[][] = []
    const fromYear = CURRENT_YEAR - LIMIT
    let page: number[] = []

    for (let i = 0; i <= LIMIT * 2; i++) {
        page.push(fromYear + i)
        if (page.length === ON_TABLE) {
            allPages.push(page)
            page = []
        }
    }
    if (page.length) allPages.push(page)

    const pageIndex = shallowRef(allPages.findIndex((p) => p.includes(props.year)) ?? 0)
    const transitionName = shallowRef('c-date-slide-left')

    const enrichedYears = computed<EnrichedYear[]>(() =>
        (allPages[pageIndex.value] ?? []).map((y) => {
            const disabled = (isDef(props.minYear) && y < props.minYear!) || (isDef(props.maxYear) && y > props.maxYear!)
            return {
                year: y,
                disabled,
                isSelected: y === props.year,
                isCurrent: y === CURRENT_YEAR,
                onSelect: () => { if (!disabled) emit('update:year', y) },
            }
        }),
    )

    const rows = computed(() => {
        const result: EnrichedYear[][] = []
        for (let i = 0; i < enrichedYears.value.length; i += CELLS_IN_ROW) {
            result.push(enrichedYears.value.slice(i, i + CELLS_IN_ROW))
        }
        return result
    })

    defineExpose({
        onNext() {
            if (pageIndex.value < allPages.length - 1) {
                transitionName.value = 'c-date-slide-left'
                pageIndex.value++
            }
        },
        onPrev() {
            if (pageIndex.value > 0) {
                transitionName.value = 'c-date-slide-right'
                pageIndex.value--
            }
        },
    })
</script>

<template>
    <div class="c-date-picker-years">
        <slot
            v-if="$slots.years"
            name="years"
            :years="enrichedYears"
        ></slot>
        <transition
            v-else
            :name="transitionName"
            mode="out-in"
        >
            <div
                :key="pageIndex"
                class="c-date-picker-years__grid"
            >
                <div
                    v-for="(row, ri) in rows"
                    :key="ri"
                    class="c-date-picker-years__row"
                >
                    <template
                        v-for="item in row"
                        :key="item.year"
                    >
                        <slot
                            v-if="$slots.year"
                            name="year"
                            v-bind="item"
                        ></slot>
                        <div
                            v-else
                            :class="[
                                'c-date-picker-years__cell',
                                item.isSelected && 'c-date-picker-years__cell--selected',
                                item.isCurrent && 'c-date-picker-years__cell--current',
                                item.disabled && 'c-date-picker-years__cell--disabled',
                            ]"
                            @click="item.onSelect"
                        >
                            {{ item.year }}
                        </div>
                    </template>
                </div>
            </div>
        </transition>
    </div>
</template>
