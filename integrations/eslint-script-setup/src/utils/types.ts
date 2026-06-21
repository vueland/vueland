import type { Rule } from 'eslint'

export type RuleContext = Rule.RuleContext

export type NodeCategory =
  | 'import'
  | 'type'
  | 'macros'
  | 'composable'
  | 'reactive'
  | 'variable'
  | 'computed'
  | 'function'
  | 'watchEffect'
  | 'watch'
  | 'lifecycle'
  | 'unknown'

export const CATEGORY_ORDER: NodeCategory[] = [
    'import',
    'type',
    'macros',
    'composable',
    'reactive',
    'variable',
    'computed',
    'function',
    'watchEffect',
    'watch',
    'lifecycle',
]

export const MACRO_APIS = new Set([
    'defineProps',
    'defineEmits',
    'defineExpose',
    'defineOptions',
    'defineSlots',
    'withDefaults',
])

export const REACTIVE_APIS = new Set([
    'ref',
    'shallowRef',
    'reactive',
    'shallowReactive',
    'readonly',
    'shallowReadonly',
])

export const COMPUTED_APIS = new Set(['computed'])

// Эффекты без явного источника — идут перед watch
export const WATCH_EFFECT_APIS = new Set(['watchEffect', 'watchPostEffect', 'watchSyncEffect'])

// Явные вотчеры с источником
export const WATCH_APIS = new Set(['watch'])

export const LIFECYCLE_APIS = new Set([
    'onBeforeMount',
    'onMounted',
    'onBeforeUpdate',
    'onUpdated',
    'onBeforeUnmount',
    'onUnmounted',
    'onErrorCaptured',
    'onRenderTracked',
    'onRenderTriggered',
    'onActivated',
    'onDeactivated',
    'onServerPrefetch',
])
