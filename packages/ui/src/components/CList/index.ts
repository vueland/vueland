import { createFunctionalComponent } from '../../utils'

export { default as CList } from './CList.vue'
export { default as CListItem } from './CListItem.vue'

export const CListItemIcon = createFunctionalComponent('c-list-item-icon')
export const CListItemTitle = createFunctionalComponent('c-list-item-title')
export * from './types'
