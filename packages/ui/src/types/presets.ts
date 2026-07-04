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
export type StatePresets<Zone extends string, State extends string> =
    Partial<Record<'base' | State, ZonePreset<Zone>>>

// ---------------------------------------------------------------------------
// Input / Field (один общий набор, читают CInput и CField)
// ---------------------------------------------------------------------------

/** Визуальные зоны инпута, маппятся 1:1 на отрисованный DOM. */
export type CInputZone =
    | 'root'
    | 'field'
    | 'input'
    | 'label'
    | 'details'
    | 'prepend'
    | 'append'

/** Визуальные состояния инпута (взаимоисключающие в моменте). */
export type CInputState = 'focused' | 'filled' | 'error' | 'disabled' | 'readonly'

/** Один плоский «снимок» инпута/поля. */
export type CFieldPreset = ZonePreset<CInputZone>

/** Набор пресета инпута по состояниям — то, что кладут в реестр. */
export type CInputPreset = StatePresets<CInputZone, CInputState>

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

/** `loader` — спиннер, который рендерится в состоянии loading. */
export type CButtonZone = 'root' | 'label' | 'loader'

/** Взаимоисключающие в моменте; приоритет: disabled > loading > active > focused. */
export type CButtonState = 'disabled' | 'loading' | 'active' | 'focused'

export type CButtonPreset = StatePresets<CButtonZone, CButtonState>

// ---------------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------------

export type CMenuZone = 'root'
export type CMenuState = 'opened' | 'closed'

export type CMenuPreset = StatePresets<CMenuZone, CMenuState>

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
