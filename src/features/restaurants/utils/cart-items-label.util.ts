/** Pieces in the cart: the sum of every line's quantity, not the number of lines. */
export function sumCartQuantity(lines: ReadonlyArray<{ quantity: number }>): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/**
 * Russian plural for a piece count.
 * 1 товар, 2–4 товара, 5+ товаров, and 11–14 товаров.
 */
export function formatCartItemsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} товар`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} товара`;
  }
  return `${count} товаров`;
}
