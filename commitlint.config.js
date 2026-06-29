export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // фича
                'fix',      // баг-фикс
                'refactor', // рефакторинг без новой функциональности
                'chore',    // тулинг, зависимости, конфиги
                'docs',     // документация
                'test',     // тесты
                'style',    // форматирование, без логики
                'perf',     // оптимизация производительности
                'ci',       // CI/CD
                'revert',   // откат коммита
            ],
        ],
        'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
    },
}
