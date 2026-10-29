import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatVenueOrderDateTime } from './venue-datetime.util.ts';

describe('formatVenueOrderDateTime', () => {
  it('formats UTC instant in Europe/Minsk without seconds', () => {
    const label = formatVenueOrderDateTime('2026-10-28T05:59:03.000Z');
    assert.match(label, /28/);
    assert.match(label, /08:59|8:59/);
    assert.doesNotMatch(label, /:03/);
  });
});
