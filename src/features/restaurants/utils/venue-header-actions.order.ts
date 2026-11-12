export type VenueHeaderActionId = 'flame' | 'favorites' | 'cart' | 'profile';

/**
 * Порядок кнопок шапки заведения и порядок фокуса с клавиатуры:
 * огонёк, избранное, корзина, профиль.
 */
export function resolveVenueHeaderActionOrder(input: {
  flame: boolean;
  favorites: boolean;
  cart: boolean;
}): VenueHeaderActionId[] {
  const order: VenueHeaderActionId[] = [];
  if (input.flame) {
    order.push('flame');
  }
  if (input.favorites) {
    order.push('favorites');
  }
  if (input.cart) {
    order.push('cart');
  }
  order.push('profile');
  return order;
}
