import { test, expect } from '@playwright/test';

test.describe('Cart and order review', () => {
  test('Adding one product updates header cart summary', async ({ page }) => {
    // 1. Open the app in a fresh context and add one Brocolli - 1 Kg unit.
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    await page.locator('div.product:has-text("Brocolli - 1 Kg") button').click();

    // 2. Open the cart dropdown.
    await page.locator('a[href="#"] img[alt="Cart"]').click();

    await expect(page.getByRole('row', { name: /Items\s*:\s*1/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price\s*:\s*120/ })).toBeVisible();
    await expect(page.locator('body')).toContainText('Brocolli - 1 Kg');
    await expect(page.getByRole('link', { name: '×' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'PROCEED TO CHECKOUT' })).toBeVisible();
  });
});
