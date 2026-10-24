# Cart design

The live cart is the **Сводка** variant. **Док** and **Чек** stay on `/dev/cart-variants` (noindex, not linked, 404 unless `NEXT_PUBLIC_ENABLE_UI_PLAYGROUND=1`, same gate as `/dev/ui`).

## What is there today

The cart is a bottom sheet (a centred dialog from 768px), not a separate page.

- **Basket.** A segmented delivery / pickup / dine-in control, then one bordered card per line. On a phone the quantity stepper is a full-width bar under the title and the price. The footer centres “Итого” above the checkout button.
- **Checkout.** Name and phone, address fields, then disclosure rows for venue, time, payment, comment, and “another person”. That step was already compact. It stays, including every validation message and the sticky total.
- **Promo.** There is no promo-code field. Promo in this product is a menu banner, not a cart discount. A code box would be a new control with no API behind it.

Reference patterns that fit a cafe order:

- **Wolt / Yandex Eda** put the receiving method in one summary line. The line opens a sheet. Dishes are a single list, not a stack of cards. The pay button owns the bottom of the thumb zone.
- **Dodo** uses one surface, a small stepper, and a price that lines up with the dish name.
- **Starbucks** reads like a bill: name, quiet customisations, amount at the end of the line.

## Problems

1. **Cards eat the screen.** Each dish has its own border, 16px padding, and a 12px gap. Fifteen dishes become fifteen boxes. A grouped list with hairlines is shorter and easier to scan.
2. **The stepper is a banner.** On a phone it spans the card, so the title, the price, and the quantity are three stacked blocks. The minus control sits on the left, away from the thumb that just tapped the row.
3. **The price shouts.** It is an 18px accent under the name, the same weight as the title. The name should lead. The amount sits above a small stepper, both at the trailing edge.
4. **“Итого” is centred.** It does not share a column with the amounts in the list, and on a phone it floats above the button as a second, unrelated control.
5. **The receiving switch is always open.** Three segments plus a 28px leftover margin (`1.75rem` on the legacy selector) sit above the food. Guests change this once. Leaving it expanded is the clutter the basket was called out for.
6. **Empty basket is one grey sentence.** It has no frame, so a cleared cart looks like a broken sheet.
7. **Long Russian names.** A price on the title’s line makes the text column too narrow, so a dish name wraps into a paragraph. The name takes the full text width and stops at two lines. The price and a 32×96 stepper sit under it, on the right.

Checkout rows (time, payment, address extras) already disclose one topic at a time. They stay. Their segmented controls, chevron inset, and address field stacking are covered by existing tests and were not the ugly part.

## Principles

- One basket surface, one radius, hairline separators, padding on the 4/8 scale (`--space-*` only).
- The title uses the full text width and clamps at two lines. Variant and modifiers are small muted lines. The price, always with two decimals, sits above a 32×96 stepper at the trailing edge.
- Quantity is that compact stepper, not a full-bleed bar. The checkout button stays a 44px target.
- Two to four choices stay a `SegmentedControl`. The basket does not show that control until the guest asks.
- The primary button is the bottom control in the thumb zone. The total is a label plus an amount directly above it, so the price is readable without opening the button.
- Motion is colour and a 4px settle on the quantity, 120ms, removed when `prefers-reduced-motion` is set. Height is not animated, so opening a checkout row does not move the layout under a test.
- The checkout button and the receiving row stay at least 44px. The quantity stepper is 32px tall and 96px wide, so a short dish stays inside 72–80px. 320px must not scroll sideways. Long names clamp at two lines. A line with no photo still reserves a 48px placeholder so the text column does not shift.

## Three variants

| | Сводка | Док | Чек |
| --- | --- | --- | --- |
| Receiving | One row, “Получение · Доставка”. Opens a sheet with the segmented control. Choosing a method closes the sheet. | One chip with method, address, and time. The sheet holds the switch, the address, and the time, and stays open until “Готово”. | A bill line that expands the segmented control in place. No sheet. |
| Lines | Grouped list. 48px photo or placeholder, name up to two lines, variant as muted text, price above a 32×96 stepper on the right. | 40px photo and name. Stepper under the text until 768px, then on the right. No per-line price. | Dashed bill. Name, dotted leader, price. Quiet stepper underneath. |
| Total | “Итого” on the left, amount on the right, full-width “Оформить заказ” under them. | The amount lives inside the bottom button, next to “Оформить”. | Same bar as Сводка, button reads “Оплатить счёт”, plus a positions line on the bill. |

All three use the same mocked lines on `/dev/cart-variants` (a long name, modifiers, a line with no photo). Quantity and the receiving method are shared across the tabs. Clearing the list shows the empty state.

## Why Сводка is the cart

- **Beauty.** One list, one radius, the price lined up with the name, a quiet total, and the same disclosure row the checkout already uses. Док hides the line price, so the guest cannot check a dish without doing the sum in their head. Чек’s dotted leaders read as a paper bill, which is a nice idea and a weaker menu.
- **Convenience.** Switching delivery and pickup is two taps (open, choose) and the sheet closes itself. The current choice stays visible, so nobody hunts for it. Док asks for a confirmation button after every look at the address. Чек pushes the segmented control back into the scrolling list, which is the clutter we were removing, just one tap later.
- **Compactness.** The always-open switch and its 28px margin are gone. Fifteen rows share one border instead of fifteen cards, and the stepper no longer adds a full-width band. The checkout step is unchanged, so address, time, and payment do not grow.
- **Thumb reach.** The checkout button is full width at the bottom of the sheet. The stepper is the trailing control of each row, under the thumb, and it no longer takes a band of its own. Док’s button also holds the amount, which is easy to hit and harder to read next to a long label. Чек’s quiet stepper is reachable, and the bill is taller because every line is text with no photo to anchor it.

Сводка is wired through `CartBasketBody` in the real cart modal. Док and Чек render only on the preview route.
