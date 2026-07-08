// ---------------------------------------------------------------------------
// Ядро пресетов
// ---------------------------------------------------------------------------

/** Плоский пресет: карта зон → utility-классы. Внутри НЕТ состояний. */
export type ZonePreset<Zone extends string> = Partial<Record<Zone, string[]>>

/**
 * Набор пресетов по состояниям.
 *
 * Всё опционально: и `base` («спокойный» вид), и каждое состояние. Состояние
 * адресуется как `Name.[State]`; его зоны подменяют зоны `base`. Если пресета
 * на текущее состояние нет — берётся `base`; если и его нет — не применяется
 * ничего. На зону всегда один комплект классов, без склеек — поэтому
 * `!important` ничего не ломает.
 */
export type StatePresets<Zone extends string, State extends string> = Partial<
    Record<'base' | State, ZonePreset<Zone>
    >>

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

export type CMenuZone = 'root'
export type CMenuState = 'opened' | 'closed'

export type CMenuPreset = StatePresets<CMenuZone, CMenuState>

// ---------------------------------------------------------------------------
// List (один набор на CList и его дочерние компоненты)
// ---------------------------------------------------------------------------

/** `root` — .c-list, `option` — .c-list-item. */
export type CListZone = 'root' | 'option'

/** Взаимоисключающие в моменте; приоритет: disabled > readonly. */
export type CListState = 'disabled' | 'readonly'

export type CListPreset = StatePresets<CListZone, CListState>

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------

/** `root` — .c-field, `input` — .c-field-input. */
export type CFieldZone = 'root' | 'input' | 'label' | 'prepend' | 'append'

/** Взаимоисключающие в моменте; приоритет: disabled > readonly > error > focused > filled. */
export type CFieldState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

export type CFieldPreset = StatePresets<CFieldZone, CFieldState>

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

/** `root` — .c-input, `details` — строка подсказки/ошибки. */
export type CInputZone = 'root' | 'details'

/** Визуальные состояния инпута (взаимоисключающие в моменте). */
export type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

/**
 * Один плоский «снимок» инпута.
 *
 * Пресеты вложенных компонентов подставляются по значению — тот же формат,
 * что у standalone CField/CMenu/CList, поэтому компоненты получают одинаковый
 * вид пресета и через контекст, и через собственный проп `preset`. Вложенные
 * пресеты кладут в `base`: свои состояния каждый компонент резолвит сам.
 */
export type CInputSnapshot = ZonePreset<CInputZone> & {
    field?: CFieldPreset
    menu?: CMenuPreset
    list?: CListPreset
}

/** Набор пресета инпута по состояниям — то, что кладут в реестр. */
export type CInputPreset = Partial<Record<'base' | CInputState, CInputSnapshot>>

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

/** `loader` — спиннер, который рендерится в состоянии loading. */
export type CButtonZone = 'root' | 'label' | 'loader'

/** Взаимоисключающие в моменте; приоритет: disabled > loading > active > focused. */
export type CButtonState = 'disabled' | 'loading' | 'active' | 'focused'

export type CButtonPreset = StatePresets<CButtonZone, CButtonState>

// ---------------------------------------------------------------------------
// Progress (circular и linear делят состояния, зоны у каждого свои)
// ---------------------------------------------------------------------------

/**
 * Кольцо (overlay) и подложка (underlay) — SVG-круги: их цвет задаётся
 * text-* классами, stroke берёт currentColor.
 */
export type CProgressCircularZone = 'root' | 'underlay' | 'overlay' | 'info'
export type CProgressLinearZone = 'root' | 'background' | 'buffer' | 'bar'

/** indeterminate приоритетнее: у бесконечного прогресса нет завершённости. */
export type CProgressState = 'indeterminate' | 'complete'

export type CProgressCircularPreset = StatePresets<CProgressCircularZone, CProgressState>
export type CProgressLinearPreset = StatePresets<CProgressLinearZone, CProgressState>
