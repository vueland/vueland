<script setup lang="ts" generic="T">
    import { computed } from 'vue'

    import { IconAliases } from '@/enums'
    import { toColorClass } from '@/utils'

    const props = defineProps<{
        closable?: boolean
        /** Палитровый токен ('red-lighten-2') или сырой цвет ('#fa5a5a', rgb(...), var(...)) */
        color?: string
        value?: T
    }>()

    defineEmits<{
        (e: 'close', value?: T): void
    }>()

    // bg-* утилиты красят и рамку (border-color идёт в комплекте)
    const classes = computed(() => toColorClass('bg', props.color))
</script>

<template>
    <div
        class="c-chip"
        :class="classes"
    >
        <div class="c-chip__content">
            <slot></slot>
        </div>
        <div
            v-if="closable"
            class="c-chip__close"
        >
            <c-icon
                size="22"
                :name="IconAliases.CLOSE"
                @click="$emit('close', value)"
            />
        </div>
    </div>
</template>
