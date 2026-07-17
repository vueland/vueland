import { expect, test } from '@playwright/test'

test.describe('theme toggle', () => {
    test('MODE button flips data-theme between light and dark', async ({ page }) => {
        await page.goto('/')

        const html = page.locator('html')
        const mode = page.getByRole('button', { name: 'MODE' })

        // Initial theme is "light" (apps/playground/src/plugin.ts -> theme: 'light').
        await expect(html).toHaveAttribute('data-theme', 'light')

        // applyTheme('dark') sets document.documentElement.dataset.theme (packages/ui/src/library.ts).
        await mode.click()
        await expect(html).toHaveAttribute('data-theme', 'dark')

        await mode.click()
        await expect(html).toHaveAttribute('data-theme', 'light')
    })
})
