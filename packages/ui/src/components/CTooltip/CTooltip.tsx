import { computed, defineComponent, useAttrs } from 'vue'

import { CMenu, type CMenuSlots, makeCMenuProps } from '../CMenu'

export const CTooltip = defineComponent({
    name: 'CTooltip',
    inheritAttrs: false,
    props: makeCMenuProps(),
    setup(props, { slots }) {
        const attrs = useAttrs()
        const width = computed<string | number>(() => (props.width as number | undefined) ?? 'auto')

        return () => (
            <CMenu {...props} {...attrs} width={width.value}>
                {{
                    activator: ({ on, activator }: any) =>
                        (slots as unknown as CMenuSlots).activator?.({
                            on,
                            activator, 
                        }),
                    default: () => <div class="c-tooltip">{slots.default?.()}</div>,
                }}
            </CMenu>
        )
    },
})

export type CTooltipProps = InstanceType<typeof CTooltip>['$props']
