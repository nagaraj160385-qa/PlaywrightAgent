import { test, expect } from '@playwright/test';

test.describe('Cart and order review', () => {
  test('Proceed to checkout opens a correct cart review', async ({ page }) => {
    // 1. Add one Brocolli and one Cauliflower, open the cart dropdown, and choose PROCEED TO CHECKOUT.
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    await page.locator('div.product:has-text("Brocolli - 1 Kg") button').click();
    await page.locator('div.product:has-text("Cauliflower - 1 Kg") button').click();
    await page.locator('a[href="#"] img[alt="Cart"]').click();
    await page.locator('button:has-text("PROCEED TO CHECKOUT")').click();

    await expect(page.getByRole('row', { name: 'Cauliflower - 1 Kg 1 60' })).toBeVisible();
    await expect(page.getByRole('row', { name: 'Brocolli - 1 Kg 1 120' })).toBeVisible();

    // 2. Compare header/cart selection, line totals, number of items, and total amount.
    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/No\. of Items\s*:\s*2 Total Amount\s*:\s*180/);
    await expect(page.locator('body')).toContainText(/Discount\s*:\s*0%Total After Discount\s*:\s*180/);
  });
});
