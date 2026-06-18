import { computed, defineComponent } from 'vue'

export const CToolbar = defineComponent({
    name: 'CToolbar',
    props: {fixed: Boolean,},
    setup(props, { slots }) {
        const classes = computed(() => ({'c-toolbar--fixed': props.fixed,}))

        return () => (
            <div class={['c-toolbar', classes.value]}>
                {slots.default?.()}
            </div>
        )
    },
})
