import type { Rule } from 'eslint'

export type RuleContext = Rule.RuleContext

export type NodeCategory =
  | 'import'
  | 'type'
  | 'macros'
  | 'class'
  | 'composable'
  | 'inject'
  | 'reactive'
  | 'variable'
  | 'computed'
  | 'function'
  | 'watchEffect'
  | 'watch'
  | 'provide'
  | 'lifecycle'
  | 'defineExpose'
  | 'unknown'

export const CATEGORY_ORDER: NodeCategory[] = [
    'import',
    'type',
    'macros',
    'class',
    'composable',
    'inject',
    'reactive',
    'variable',
    'computed',
    'function',
    'watchEffect',
    'watch',
    'provide',
    'lifecycle',
    'defineExpose',
]

export const MACRO_APIS = new Set([
    'defineProps',
    'defineEmits',
    'defineOptions',
    'defineSlots',
    'defineModel',
    'withDefaults',
])

// Макросы, которые можно перечислять в order по отдельности вместо общей
// категории macros; withDefaults(defineProps(...)) считается defineProps
export const DEFINE_MACROS = new Set([
    'defineProps',
    'defineEmits',
    'defineSlots',
    'defineModel',
    'defineOptions',
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

// Порядок соответствует моменту срабатывания хуков в жизненном цикле —
// используется как дефолт опции lifecycleOrder
export const LIFECYCLE_ORDER = [
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
]

export const LIFECYCLE_APIS = new Set(LIFECYCLE_ORDER)
