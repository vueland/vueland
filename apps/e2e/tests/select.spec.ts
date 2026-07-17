import { expect, test } from '@playwright/test'

test.describe('c-select interaction', () => {
    test('opens the user select, picks an option, renders a chip', async ({ page }) => {
        await page.goto('/')

        // First demo card's "Select user" field. Click the field wrapper (the inner
        // input has role="combobox" but is covered by .c-field__core).
        const field = page.locator('.c-select').first()
        await field.click()

        // Options render as list items inside the select's listbox (CSelect.vue).
        const listbox = page.locator('.c-select__listbox')
        await expect(listbox).toBeVisible()

        const option = listbox.getByText('Alex', { exact: true })
        await expect(option).toBeVisible()
        await option.click()

        // multiple + chips: the picked item shows as a chip (title-key="name").
        // The 4 demo cards share one v-model, so the chip appears in each — assert the first.
        await expect(page.locator('.c-chip').filter({ hasText: 'Alex' }).first()).toBeVisible()
    })
})
