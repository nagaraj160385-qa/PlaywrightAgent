import { test, expect } from '@playwright/test';

test.describe('Cart and order review', () => {
  test('Quantity selection and repeat additions update cart consistently', async ({ page }) => {
    // 1. Open the catalog, increase Brocolli quantity from 1 to 2, and add it to cart.
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    const brocolli = page.locator('div.product:has-text("Brocolli - 1 Kg")');
    await brocolli.locator('a:has-text("+")').click();
    await brocolli.locator('button').click();
    await page.locator('a[href="#"] img[alt="Cart"]').click();
    await expect(page.getByRole('row', { name: /Items\s*:\s*1/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price\s*:\s*240/ })).toBeVisible();

    // 2. Decrease the selected Brocolli quantity to 1, add Brocolli again, and open the cart dropdown.
    await page.locator('a[href="#"] img[alt="Cart"]').click();
    await brocolli.locator('a:has-text("–")').click();
    await brocolli.locator('button').click();
    await page.locator('a[href="#"] img[alt="Cart"]').click();
    await expect(page.getByRole('row', { name: /Items\s*:\s*1/ })).toBeVisible();
    await expect(page.getByRole('row', { name: /Price\s*:\s*360/ })).toBeVisible();
    await page.locator('button:has-text("PROCEED TO CHECKOUT")').click();
    await expect(page.getByRole('row', { name: 'Brocolli - 1 Kg 3 120 360' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/No\. of Items\s*:\s*1 Total Amount\s*:\s*360/);
  });
});
