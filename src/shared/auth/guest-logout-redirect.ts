/** Set before guest logout so protected routes send the user to the menu, not /auth. */
let guestLogoutRedirectPending = false;

export function markGuestLogoutRedirectPending(): void {
  guestLogoutRedirectPending = true;
}

export function consumeGuestLogoutRedirectPending(): boolean {
  if (!guestLogoutRedirectPending) {
    return false;
  }
  guestLogoutRedirectPending = false;
  return true;
}
