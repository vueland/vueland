import type { CMenuProps, CMenuSlots } from '@/components/CMenu'

import CTooltipImpl from './CTooltip.vue'

type CTooltipComponent = new () => {
    $props: CMenuProps
    $slots: CMenuSlots
}

export const CTooltip = CTooltipImpl as unknown as CTooltipComponent
