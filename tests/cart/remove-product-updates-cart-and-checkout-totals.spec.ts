import { test, expect } from '@playwright/test';

test.describe('Cart and order review', () => {
  test('Removing a product updates cart and checkout totals', async ({ page }) => {
    // 1. Add Brocolli and Cauliflower and open the cart dropdown.
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    await page.locator('div.product:has-text("Brocolli - 1 Kg") button').click();
    await page.locator('div.product:has-text("Cauliflower - 1 Kg") button').click();
    await page.locator('a[href="#"] img[alt="Cart"]').click();
    const cartRows = page.getByRole('listitem');
    await expect(cartRows.filter({ hasText: 'Brocolli - 1 Kg' })).toBeVisible();
    await expect(cartRows.filter({ hasText: 'Cauliflower - 1 Kg' })).toBeVisible();
    await expect(page.getByRole('row', { name: /Items\s*:\s*2/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price\s*:\s*180/ })).toBeVisible();

    // 2. Remove Cauliflower using its × control.
    await cartRows.filter({ hasText: 'Cauliflower - 1 Kg' }).getByRole('link').click();
    await expect(cartRows.filter({ hasText: 'Cauliflower - 1 Kg' })).toHaveCount(0);
    await expect(cartRows.filter({ hasText: 'Brocolli - 1 Kg' })).toBeVisible();
    await expect(page.getByRole('row', { name: /Items\s*:\s*1/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price\s*:\s*120/ })).toBeVisible();

    // 3. Proceed to cart review.
    await page.locator('button:has-text("PROCEED TO CHECKOUT")').click();
    await expect(page.getByRole('row', { name: 'Brocolli - 1 Kg 1 120 120' })).toBeVisible();
    await expect(page.getByRole('row', { name: /Cauliflower/ })).toHaveCount(0);
    await expect(page.locator('body')).toContainText(/No\. of Items\s*:\s*1 Total Amount\s*:\s*120/);
  });
});
