type RefreshListener = () => void;

const listeners = new Set<RefreshListener>();

export function subscribeGuestLoyaltyBalanceRefresh(listener: RefreshListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function requestGuestLoyaltyBalanceRefresh(): void {
  for (const listener of listeners) {
    listener();
  }
}
