import { expect, test } from '@playwright/test'

test.describe('playground smoke', () => {
    test('renders the app shell without runtime errors', async ({ page }) => {
        const consoleErrors: string[] = []
        const pageErrors: string[] = []

        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text())
        })
        page.on('pageerror', err => pageErrors.push(err.message))

        await page.goto('/')

        // Toolbar MODE button and the demo cards are the top-level proof of a mounted app.
        await expect(page.getByRole('button', { name: 'MODE' })).toBeVisible()
        await expect(
            page.getByRole('heading', { name: 'Simple card example' }).first(),
        ).toBeVisible()

        // Playground boots with the "light" theme (see apps/playground/src/plugin.ts).
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

        expect(pageErrors, `uncaught page errors:\n${pageErrors.join('\n')}`).toEqual([])
        expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([])
    })
})
