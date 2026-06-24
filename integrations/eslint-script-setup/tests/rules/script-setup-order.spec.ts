import * as tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { scriptSetupOrder } from '../../src/rules/script-setup-order'

const tester = new RuleTester({
    languageOptions: { ecmaVersion: 2020, sourceType: 'module', parser: tsParser },
})

describe('script-setup-order', () => {
    // ─── valid ────────────────────────────────────────────────────────────────

    it('valid: правильный порядок включая макросы', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: `
                        import { ref, computed } from 'vue'
                        const props = defineProps({ count: Number })
                        defineEmits(['update'])
                        const router = useRouter()
                        const count = ref(0)
                        const double = computed(() => count.value * 2)
                        function increment() { count.value++ }
                        watchEffect(() => {})
                        watch(count, () => {})
                        onMounted(() => {})
                    `.trim(),
                },
            ],
            invalid: [],
        })
    })

    it('valid: обычная переменная между reactive и computed', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const count = ref(0)\nconst label = \'hello\'\nconst double = computed(() => count.value * 2)',
                },
            ],
            invalid: [],
        })
    })

    it('valid: watchEffect перед watch — правильный порядок', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'watchEffect(() => {})\nwatch(count, () => {})',
                },
            ],
            invalid: [],
        })
    })

    it('valid: FunctionDeclaration после composable — hoistable, нет ошибки', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const router = useRouter()\nconst count = ref(0)\nfunction helper() { return 1 }',
                },
            ],
            invalid: [],
        })
    })

    it('valid: не .vue файл — правило игнорируется', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'utils.ts',
                    code: 'onMounted(() => {})\nconst count = ref(0)',
                },
            ],
            invalid: [],
        })
    })

    it('valid: withDefaults как макрос — правильная позиция', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const props = withDefaults(defineProps(), { size: \'md\' })\nconst router = useRouter()',
                },
            ],
            invalid: [],
        })
    })

    it('valid: defineExpose может ссылаться на локальные объявления', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    code: 'const el = ref()\nfunction focus() {}\ndefineExpose({ el, focus })',
                },
            ],
            invalid: [],
        })
    })

    it('valid: кастомный order без watchEffect — категория игнорируется', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [
                {
                    filename: 'Component.vue',
                    options: [{ order: ['import', 'reactive', 'computed', 'watch', 'lifecycle'] }],
                    // watchEffect не в order → пропускается, нарушения нет
                    code: 'const count = ref(0)\nwatch(count, () => {})\nwatchEffect(() => {})\nonMounted(() => {})',
                },
            ],
            invalid: [],
        })
    })

    // ─── invalid ──────────────────────────────────────────────────────────────

    it('invalid: макросы после композаблов — autofix переставляет', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const router = useRouter()\ndefineProps({ count: Number })',
                    output: 'defineProps({ count: Number })\n\nconst router = useRouter()',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: defineModel после reactive — autofix переставляет как макрос', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const count = ref(0)\nconst model = defineModel()',
                    output: 'const model = defineModel()\n\nconst count = ref(0)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: lifecycle перед composable — autofix переставляет', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nconst router = useRouter()',
                    output: 'const router = useRouter()\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: обычная переменная после computed — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const double = computed(() => 1)\nconst label = \'hello\'',
                    output: 'const label = \'hello\'\n\nconst double = computed(() => 1)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: watchEffect после lifecycle — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nwatchEffect(() => {})',
                    output: 'watchEffect(() => {})\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: watch после lifecycle — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'onMounted(() => {})\nwatch(count, () => {})',
                    output: 'watch(count, () => {})\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: type после reactive — нарушение', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'const count = ref(0)\ntype Status = \'idle\' | \'done\'',
                    output: 'type Status = \'idle\' | \'done\'\n\nconst count = ref(0)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: FunctionDeclaration hoistable — sortируется без depConflict', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: 'function helper() { return 1 }\nconst count = ref(helper())',
                    output: 'const count = ref(helper())\n\nfunction helper() { return 1 }',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: computed зависит от другого computed — depConflict без фикса', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    // double зависит от count, после сортировки computed оба окажутся в одной
                    // категории и сохранят порядок — но reactive после function нарушение
                    // label (variable) зависит от double (computed) — после сортировки variable
                    // идёт ДО computed → depConflict
                    code: 'const double = computed(() => 1)\nconst label = double.value + \'!\'',
                    errors: [{ messageId: 'depConflict' }],
                },
            ],
        })
    })

    it('invalid: arrow composable конвертируется в function declaration', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    code: [
                        'const useCounter = () => { return { value: ref(0) } }',
                        'const count = ref(0)',
                        'const counter = useCounter()',
                    ].join('\n'),
                    output: [
                        'const counter = useCounter()',
                        '',
                        'const count = ref(0)',
                        '',
                        'function useCounter() { return { value: ref(0) } }',
                    ].join('\n'),
                    errors: [{ messageId: 'depConflictFixed' }],
                },
            ],
        })
    })

    it('invalid: кастомный composablePattern — своя функция как composable', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ composablePattern: '^inject[A-Z]' }],
                    code: 'const count = ref(0)\nconst injectTheme = injectTheme()',
                    output: 'const injectTheme = injectTheme()\n\nconst count = ref(0)',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })

    it('invalid: кастомные reactiveApis — доп. API как reactive', () => {
        tester.run('script-setup-order', scriptSetupOrder, {
            valid: [],
            invalid: [
                {
                    filename: 'Component.vue',
                    options: [{ reactiveApis: ['customRef'] }],
                    code: 'onMounted(() => {})\nconst x = customRef(() => ({ get() {}, set() {} }))',
                    output: 'const x = customRef(() => ({ get() {}, set() {} }))\n\nonMounted(() => {})',
                    errors: [{ messageId: 'wrongOrder' }],
                },
            ],
        })
    })
})
