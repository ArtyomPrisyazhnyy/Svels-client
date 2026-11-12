type Reset = () => void;

function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* private mode */
  }
}

let epoch = 0;

let resetCart: Reset = () => removeKey('svels-cart');
let resetFavorites: Reset = () => removeKey('svels-favorites');

export function commerceEpoch(): number {
  return epoch;
}

export function registerCartReset(reset: Reset) {
  resetCart = reset;
}

export function registerFavoritesReset(reset: Reset) {
  resetFavorites = reset;
}

/** Sync clear. Store modules replace the localStorage fallback once they load. */
export function resetCommerceMemory() {
  epoch += 1;
  resetCart();
  resetFavorites();
  removeKey('svels-cart');
  removeKey('svels-favorites');
}
