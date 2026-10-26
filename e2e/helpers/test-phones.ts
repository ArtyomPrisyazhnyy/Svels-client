/** Belarus test mobiles: +375 29 000-00-0X. */
export const E2E_TEST_PHONES = [
  '+375290000000',
  '+375290000001',
  '+375290000002',
  '+375290000003',
  '+375290000004',
  '+375290000005',
  '+375290000006',
  '+375290000007',
  '+375290000008',
  '+375290000009',
] as const;

export function assertE2ETestPhone(phone: string): void {
  if (!/^\+37529000000\d$/.test(phone)) {
    throw new Error(`Test phone must match +375 29 000-00-0X, got ${phone}`);
  }
}
