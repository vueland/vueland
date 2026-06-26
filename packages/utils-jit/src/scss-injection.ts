// Контракт с SCSS-исходниками @vueland/ui: между этими маркерами плагин
// подставляет `@use 'maps/grids' with (...)` с брейкпоинтами из конфига и тем
// самым конфигурирует грид-модуль ДО загрузки партиалов с адаптивными стилями.
// Контракт строковый (одинаковый литерал в SCSS и здесь) — не зависит ни от
// кавычек, ни от текста импортов. Без плагина блок остаётся инертным
// комментарием, и SCSS берёт дефолтные брейкпоинты из maps/grids.
const BREAKPOINTS_MARKER_START = '// ##vueland:breakpoints:start'
const BREAKPOINTS_MARKER_END = '// ##vueland:breakpoints:end'

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Regex строится из тех же констант — маркер задан ровно в одном месте.
const BREAKPOINTS_REGION_RE = new RegExp(
    `${escapeRegExp(BREAKPOINTS_MARKER_START)}[\\s\\S]*?${escapeRegExp(BREAKPOINTS_MARKER_END)}`,
)

// Идемпотентно: каждый прогон целиком переписывает содержимое блока. Дешёвая
// проверка `includes` отсекает все файлы без маркера (additionalData зовётся
// для каждого scss).
function injectGridBreakpoints(source: string, bpMap: string): string {
    if (!source.includes(BREAKPOINTS_MARKER_START)) {
        return source
    }

    return source.replace(
        BREAKPOINTS_REGION_RE,
        () =>
            `${BREAKPOINTS_MARKER_START}\n`
            + `@use 'maps/grids' with ($grid-breakpoints: ${bpMap});\n`
            + BREAKPOINTS_MARKER_END,
    )
}

function buildScssBreakpointsMap(bps: Record<string, number>): string {
    const entries = Object.entries(bps)
        .map(([key, value]) => `'${key}': ${value === 0 ? '0' : `${value}px`}`)
        .join(', ')

    return `(${entries})`
}

export function createScssBreakpointInjector(
    breakpoints: Record<string, number>,
): (source: string) => string {
    const scssMap = buildScssBreakpointsMap(breakpoints)

    return (source) => injectGridBreakpoints(source, scssMap)
}
