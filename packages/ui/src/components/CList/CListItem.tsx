import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    shallowRef,
    unref,
} from 'vue'

import { useList } from '../../composables/use-list'
import { isDef } from '../../helpers'

export const CListItem = defineComponent({
    name: 'CListItem',
    props: { value: null },
    setup(props, { slots }) {
        const list = useList()
        const tabindex = shallowRef(-1)

        const isInActiveList = computed(
            () => unref(list?.role) === 'listbox' || unref(list?.role) === 'menu',
        )

        const isSelected = computed(() =>
            isDef(props.value) ? list?.isActive?.(props.value) : false,
        )

        const classes = computed(() => ({
            'c-list-item--active': unref(isSelected),
            'c-list-item--focused': unref(tabindex) > -1,
        }))

        const itemAttrs = computed(() => ({
            ...(unref(tabindex) > -1 ? { tabindex: 0 } : {}),
            ...(isInActiveList.value ? { role: 'option' } : {}),
            'aria-selected': unref(isSelected),
        }))

        function onClick() {
            const handler = unref(isSelected) ? list?.unselect : list?.select
            handler?.(props.value!)
        }

        function focus() {
            tabindex.value = 0
        }
        function blur() {
            tabindex.value = -1
        }

        const handlers = {
            focus,
            blur, 
        }

        onMounted(() => {
            if (unref(isInActiveList)) list?.register(handlers)
        })
        onBeforeUnmount(() => {
            if (unref(isInActiveList)) list?.unregister(handlers)
        })

        return () => (
            <li class={['c-list-item', classes.value]} {...unref(itemAttrs)} onClick={onClick}>
                {slots.default?.() ?? props.value}
            </li>
        )
    },
})

export type CListItemProps = InstanceType<typeof CListItem>['$props']
