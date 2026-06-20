export {}

declare module 'vue' {
    export interface GlobalComponents {
        CApp: typeof import('./CApp').CApp
        CAutocomplete: typeof import('./CAutocomplete').CAutocomplete
        CBtn: typeof import('./CBtn').CBtn
        CCard: typeof import('./CCard').CCard
        CCardHeader: typeof import('./CCard').CCardHeader
        CCardBody: typeof import('./CCard').CCardBody
        CCardFooter: typeof import('./CCard').CCardFooter
        CCheckbox: typeof import('./CCheckbox').CCheckbox
        CChip: typeof import('./CChip').CChip
        CDialog: typeof import('./CDialog').CDialog
        CDialogsStack: typeof import('./CDialog').CDialogsStack
        CDatePicker: typeof import('./CDatePicker').CDatePicker
        CDateInput: typeof import('./CDateInput').CDateInput
        COverlay: typeof import('./COverlay').COverlay
        CField: typeof import('./CField').CField
        CForm: typeof import('./CForm').CForm
        CRow: typeof import('./CGrid').CRow
        CCol: typeof import('./CGrid').CCol
        CSpacer: typeof import('./CGrid').CSpacer
        CIcon: typeof import('./CIcon').CIcon
        CInput: typeof import('./CInput').CInput
        CItems: typeof import('./CItems').CItems
        CLabel: typeof import('./CLabel').CLabel
        CList: typeof import('./CList').CList
        CListItem: typeof import('./CList').CListItem
        CListItemTitle: typeof import('./CList').CListItemTitle
        CListItemIcon: typeof import('./CList').CListItemIcon
        CMain: typeof import('./CMain').CMain
        CMenu: typeof import('./CMenu').CMenu
        CRadio: typeof import('./CRadio').CRadio
        CSelect: typeof import('./CSelect').CSelect
        CSelectControl: typeof import('./CSelectControl').CSelectControl
        CTextField: typeof import('./CTextField').CTextField
        CToolbar: typeof import('./CToolbar').CToolbar
        CToolbarLogo: typeof import('./CToolbar').CToolbarLogo
        CToolbarItems: typeof import('./CToolbar').CToolbarItems
        CTooltip: typeof import('./CTooltip').CTooltip
        CScrim: typeof import('./CScrim').CScrim
    }
}
