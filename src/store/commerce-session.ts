type Reset = () => void;

function removeKey(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* private mode */
  }
}

let resetCart: Reset = () => removeKey('svels-cart');
let resetFavorites: Reset = () => removeKey('svels-favorites');

export function registerCartReset(reset: Reset) {
  resetCart = reset;
}

export function registerFavoritesReset(reset: Reset) {
  resetFavorites = reset;
}

/** Sync clear. Store modules replace the localStorage fallback once they load. */
export function resetCommerceMemory() {
  resetCart();
  resetFavorites();
}
