let e2eGuestPhoneCounter = 0;

/** E.164: +375 29 000-00-0X (X = 1..9), для e2e без случайных номеров. */
export function nextE2eGuestPhone(): string {
  e2eGuestPhoneCounter = (e2eGuestPhoneCounter % 9) + 1;
  return `+37529000000${e2eGuestPhoneCounter}`;
}
