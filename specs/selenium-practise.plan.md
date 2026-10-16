# GreenKart Selenium Practise End-to-End Test Plan

## Application Overview

Expanded functional and end-to-end plan for https://rahulshettyacademy.com/seleniumPractise/#/. Exploratory review confirmed a 30-product produce catalog with search and per-product quantity controls; cart summary/dropdown; a cart review with line totals, promo code, discounts, and Place Order; a country selection and mandatory Terms & Conditions checkbox before order completion; a policy route with a Home link; and a Top Deals table with search, sorting, page-size selection, pagination, and Delivery Date inputs/calendar controls. The application is a demo, with no real payment. Each scenario starts in a fresh browser context at the stated app route with no pre-existing cart, and should avoid dependencies on other test cases. Assertions for invalid promo behavior should focus on no discount and no false success; exact rejection wording is not specified by the observed UI.

## Test Scenarios

### 1. Catalog, navigation, and product discovery

**Seed:** `tests\seed.spec.ts`

#### 1.1. Fresh catalog renders the complete catalog and product details

**File:** `tests\catalog\catalog-load.spec.ts`

**Steps:**
  1. Open the root app route in a fresh browser context.
    - expect: The page title is GreenKart - veg and fruits kart.
    - expect: The catalog shows 30 products, each with a name, unit price, quantity initially set to 1, and ADD TO CART button.
    - expect: The footer and header navigation/search/cart controls are visible.
  2. Scroll through the catalog from its first to last product card.
    - expect: Products remain accessible through the full catalog, including produce, fruit, and nuts.
    - expect: No product card overlaps or hides its name, price, quantity control, or action.

#### 1.2. Catalog search supports matching, empty, and no-result states

**File:** `tests\catalog\catalog-search.spec.ts`

**Steps:**
  1. Open the root route and enter 'apple' into Search for Vegetables and Fruits.
    - expect: The matching Apple - 1 Kg card is displayed with its ₹72 price and product controls.
  2. Replace the query with a string with no match, such as 'zzzx-nonexistent-123'.
    - expect: No product cards are displayed.
    - expect: The empty state says 'Sorry, no products matched your search!' and invites the user to enter a different keyword.
  3. Clear the search field, then search using different letter casing for a known product.
    - expect: Clearing restores the full catalog.
    - expect: Search returns the expected match without requiring exact letter casing.

#### 1.3. Product quantity controls enforce a minimum and update independently

**File:** `tests\catalog\product-quantity.spec.ts`

**Steps:**
  1. Open the root route and locate Brocolli - 1 Kg; note its initial quantity of 1.
    - expect: The product has decrement and increment controls and quantity starts at 1.
  2. Click decrement at quantity 1, then click increment twice.
    - expect: The decrement does not produce a quantity below 1.
    - expect: The quantity increases to 3; other product quantities remain unchanged.
  3. Click decrement once and add the product to cart.
    - expect: The quantity is 2 before adding.
    - expect: The cart contains two Brocolli units and the total amount is ₹240.

#### 1.4. Direct quantity entry handles invalid and boundary values safely

**File:** `tests\catalog\quantity-entry-boundaries.spec.ts`

**Steps:**
  1. Open the root route and locate a product quantity input.
    - expect: The quantity is an editable numeric/spin control initialized to 1.
  2. Attempt to enter zero, a negative value, a decimal, and non-numeric text, one input at a time.
    - expect: Invalid quantities are prevented, normalized, or clearly rejected; no invalid item quantity is silently added.
  3. Set a valid quantity and add the item.
    - expect: The cart quantity and product total reflect the valid entered quantity.

#### 1.5. Header Top Deals navigation opens the offers route

**File:** `tests\navigation\header-routes.spec.ts`

**Steps:**
  1. Open the catalog and activate Top Deals.
    - expect: The app navigates to the offers route and renders the offers table.
  2. Use the catalog link/home navigation, if offered, or navigate back to the root URL.
    - expect: The produce catalog is rendered again without a broken page.

#### 1.6. Header external links point to their advertised destinations

**File:** `tests\navigation\external-links.spec.ts`

**Steps:**
  1. Open the catalog and inspect the Flight Booking and QA Career Accelerator header links.
    - expect: Flight Booking targets the separate dropdownsPractise application.
    - expect: The QA Career Accelerator link targets its advertised academy page.
    - expect: Following either external link does not replace an assertion for GreenKart functionality; test the destination only if it is included in the release scope.

### 2. Cart and order review

**Seed:** `tests\seed.spec.ts`

#### 2.1. Adding one product updates header cart summary

**File:** `tests\cart\cart-summary.spec.ts`

**Steps:**
  1. Open the app in a fresh context and add one Brocolli - 1 Kg unit.
    - expect: The header summary shows 1 item and price ₹120.
  2. Open the cart dropdown.
    - expect: The dropdown lists Brocolli and offers a remove (×) control and PROCEED TO CHECKOUT action.

#### 2.2. Multiple products produce accurate line and order totals

**File:** `tests\cart\multiple-products-totals.spec.ts`

**Steps:**
  1. Add one Brocolli (₹120) and one Cauliflower (₹60), then open the cart and proceed to checkout review.
    - expect: Both products appear with quantity 1, correct unit prices and correct line totals.
    - expect: No. of Items is 2, Total Amount is ₹180, Discount is 0%, and Total After Discount is ₹180.

#### 2.3. Quantity selection and repeat additions update cart consistently

**File:** `tests\cart\quantity-and-repeat-add.spec.ts`

**Steps:**
  1. Set Brocolli quantity to 2 and add to cart; then add a second product once.
    - expect: Header item count and amount reflect the quantities and product prices.
  2. Add Brocolli again from the catalog at its default quantity.
    - expect: The cart quantity/line total for Brocolli reflects the additional unit, whether merged into the existing row or represented consistently by the app.
    - expect: The header count and total agree with the cart review.

#### 2.4. Removing a product updates cart and checkout totals

**File:** `tests\cart\remove-product.spec.ts`

**Steps:**
  1. Add Brocolli and Cauliflower and open the cart dropdown.
    - expect: Both products appear and the cart summary reflects both.
  2. Remove Cauliflower using its × control.
    - expect: Cauliflower is removed; Brocolli remains.
    - expect: Header count and amount recalculate to 1 item and ₹120.
  3. Proceed to the cart review.
    - expect: Only Brocolli remains and all summary values recalculate correctly.

#### 2.5. Removing the final cart item produces a safe empty-cart state

**File:** `tests\cart\remove-last-product.spec.ts`

**Steps:**
  1. Add one product and open the cart dropdown.
    - expect: The product appears with a remove (×) action.
  2. Remove the only product and inspect the header/cart dropdown and checkout affordance.
    - expect: The item count and amount return to zero/empty state.
    - expect: The removed product is absent and the user cannot accidentally place an order containing the removed item.

#### 2.6. Proceed to checkout opens a correct cart review

**File:** `tests\cart\checkout-entry.spec.ts`

**Steps:**
  1. Add two distinct products, open the cart dropdown, and choose PROCEED TO CHECKOUT.
    - expect: The app navigates to the cart review route.
    - expect: The review table displays product name, quantity, price, and total columns with rows matching the selected cart.
  2. Compare header/cart selection, line totals, number of items, and total amount.
    - expect: All quantities and monetary totals are consistent across cart and review; totals equal the sum of line totals.

### 3. Promo code and discount calculations

**Seed:** `tests\seed.spec.ts`

#### 3.1. Known promo code applies the observed discount to order total

**File:** `tests\checkout\valid-promo.spec.ts`

**Steps:**
  1. Add one Brocolli and proceed to the cart review.
    - expect: The pre-discount total is ₹120, discount is 0%, and promo input and Apply button are available.
  2. Enter 'rahulshettyacademy' and activate Apply.
    - expect: After processing, 'Code applied ..!' is displayed.
    - expect: Discount updates to 10% and Total After Discount is ₹108.

#### 3.2. Unsupported promo code does not apply a discount

**File:** `tests\checkout\invalid-promo.spec.ts`

**Steps:**
  1. Add one Brocolli and proceed to cart review.
    - expect: Discount is initially 0% and total after discount equals ₹120.
  2. Enter 'NOT_A_VALID_CODE' and activate Apply; wait for processing to finish.
    - expect: No valid-code success message is shown.
    - expect: Discount stays at 0% and total after discount stays ₹120.
    - expect: If the app displays an error, it is associated with the promo field/action and does not alter cart contents.

#### 3.3. Promo application is stable across repeat and empty submissions

**File:** `tests\checkout\promo-reapply.spec.ts`

**Steps:**
  1. Add one Brocolli and proceed to cart review; apply the valid code once.
    - expect: The discount is 10% and total after discount is ₹108.
  2. Apply the same code again, then clear the field and apply an empty value.
    - expect: No duplicate discounts are applied; totals do not fall below the single-code discount result.
    - expect: An empty value does not produce a false success or change the order total.

#### 3.4. Promo discount is calculated against a multi-item order

**File:** `tests\checkout\promo-multi-line.spec.ts`

**Steps:**
  1. Add one Brocolli and one Cauliflower, proceed to cart review, and confirm the ₹180 pre-discount total.
    - expect: Both line items total ₹180 before discount.
  2. Apply 'rahulshettyacademy'.
    - expect: The 10% discount is calculated from the order total and the displayed after-discount amount is ₹162.
    - expect: Item quantities and line totals remain unchanged by the promo.

### 4. Checkout, legal terms, and order completion

**Seed:** `tests\seed.spec.ts`

#### 4.1. Place Order advances from review to country selection

**File:** `tests\checkout\place-order-route.spec.ts`

**Steps:**
  1. Add a product, enter checkout review, and activate Place Order.
    - expect: The app navigates to the country-selection route.
    - expect: Choose Country, a country selector, Terms & Conditions checkbox/link, and Proceed control are displayed.

#### 4.2. Proceed is blocked until Terms and Conditions are accepted

**File:** `tests\checkout\terms-required.spec.ts`

**Steps:**
  1. Reach the country step with a product in the order; leave default country and checkbox unchecked; activate Proceed.
    - expect: The user remains on the country step and the validation message 'Please accept Terms & Conditions - Required' is displayed.
  2. Select a valid country but leave the checkbox unchecked and activate Proceed again.
    - expect: The order remains blocked until acceptance of Terms & Conditions.

#### 4.3. Country selector accepts a valid country

**File:** `tests\checkout\country-selection.spec.ts`

**Steps:**
  1. Reach country selection and inspect the dropdown options.
    - expect: A disabled Select placeholder is present and country options are available.
  2. Select India and inspect the selected value.
    - expect: India remains selected; the placeholder cannot be submitted as a valid destination.

#### 4.4. Complete demo order with country and required terms

**File:** `tests\checkout\complete-order.spec.ts`

**Steps:**
  1. Add a product, proceed through cart review, select Place Order, and reach country selection.
    - expect: The country and terms controls are available.
  2. Select India, accept Terms & Conditions, and activate Proceed.
    - expect: The flow completes and returns to the catalog root route.
    - expect: The completed order does not remain as an unintended active cart; the app shows its expected post-order state.

#### 4.5. Terms link opens policy page and Home returns to catalog

**File:** `tests\checkout\terms-policy-route.spec.ts`

**Steps:**
  1. Open the policy route using the Terms & Conditions link or directly at #/policy.
    - expect: The policy page displays the terms-page message and a Home link.
  2. Activate Home.
    - expect: The app returns to the root catalog route.

#### 4.6. Complete an end-to-end order with promo discount applied

**File:** `tests\checkout\complete-order-with-promo.spec.ts`

**Steps:**
  1. Add two products, apply the valid promo on cart review, and verify all line totals and the 10% discount.
    - expect: Order review reflects the selected products and discounted total without changing quantities.
  2. Place the order, select a country, accept terms, and proceed.
    - expect: The order flow completes successfully and returns to the root route/post-order state.

### 5. Top Deals offers, sorting, pagination, and delivery date

**Seed:** `tests\seed.spec.ts`

#### 5.1. Top Deals table displays offer data and initial table controls

**File:** `tests\offers\offers-table.spec.ts`

**Steps:**
  1. Open #/offers in a fresh context.
    - expect: The table includes Veg/fruit name, Price, and Discount price columns.
    - expect: The initial page size is 5 and page 1 is selected.
    - expect: First and Previous are disabled on the first page; Next and Last are available.

#### 5.2. Top Deals search filters matching and unmatched offers

**File:** `tests\offers\offers-search.spec.ts`

**Steps:**
  1. Open #/offers and enter 'Tomato' in Search.
    - expect: The table filters to Tomato rows and excludes unrelated offers.
  2. Replace with an unmatched search term, then clear the field.
    - expect: No unrelated rows are shown for the unmatched query.
    - expect: Clearing restores offer rows and valid pagination.

#### 5.3. Offer columns sort in both directions

**File:** `tests\offers\offers-sort.spec.ts`

**Steps:**
  1. Open #/offers and activate Veg/fruit name column header twice.
    - expect: Rows change to ascending then descending name order and sort direction is announced.
  2. Activate Price and Discount price headers in turn.
    - expect: The selected column is sorted and the accessible sort status reflects the active column/direction.
    - expect: Sorting one column does not corrupt row values or headers.

#### 5.4. Page-size and pagination controls show the expected rows

**File:** `tests\offers\offers-pagination-pagesize.spec.ts`

**Steps:**
  1. Open #/offers, move to page 2, then use Previous, Next, First, and Last controls.
    - expect: The current-page marker changes correctly and rows update with each page.
    - expect: First and Previous are disabled on page 1; Next and Last are disabled on the final page.
  2. Select page size 10, then 20.
    - expect: The table displays up to the selected number of rows per page.
    - expect: Pagination and current-page state remain valid after the page-size change.

#### 5.5. Delivery date controls accept valid date and handle invalid input

**File:** `tests\offers\delivery-date.spec.ts`

**Steps:**
  1. Open #/offers and inspect Delivery Date day, month, year inputs and adjacent calendar controls.
    - expect: Day, month, and year inputs are visible and editable; calendar controls are available.
  2. Enter a valid date and use the calendar control to choose a date if the picker is available.
    - expect: The selected date is represented consistently by the date fields.
    - expect: Calendar selection and direct entry do not leave a malformed date.
  3. Try incomplete or out-of-range day/month values and a nonnumeric year.
    - expect: Invalid or incomplete dates are rejected, constrained, normalized, or clearly surfaced; the control must not silently represent an unrelated valid date.

### 6. Session, state, and resilience

**Seed:** `tests\seed.spec.ts`

#### 6.1. Cart state remains coherent through route navigation and refresh

**File:** `tests\state\route-refresh-back.spec.ts`

**Steps:**
  1. Add two different products, open cart review, then refresh the page.
    - expect: The route renders without an error and cart rows/totals remain coherent with the app's documented state behavior.
  2. Navigate back and forward between catalog, cart review, and country step where supported.
    - expect: The browser history does not show stale totals, duplicate items, or a broken route.

#### 6.2. Fresh tests do not inherit items from prior scenarios

**File:** `tests\state\isolated-test-state.spec.ts`

**Steps:**
  1. Open the application in a newly created browser context after an order completion or cart activity in another test context.
    - expect: The new context starts with an empty cart and default catalog state; no prior test's promo, country, or order state leaks into it.
