import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { openInOsmUrl, OSM_TILE_URL } from './osm-map.ts';

describe('osm map', () => {
  it('points at OpenStreetMap and not at Yandex', () => {
    const url = new URL(openInOsmUrl(53.9, 27.56));
    assert.equal(url.hostname, 'www.openstreetmap.org');
    assert.equal(new URL(OSM_TILE_URL.replace('{z}', '1').replace('{x}', '1').replace('{y}', '1')).hostname, 'tile.openstreetmap.org');
    assert.equal(url.href.includes('yandex'), false);
  });

  it('does not keep the Yandex map client', () => {
    const map = readFileSync(new URL('../components/LocationMap.tsx', import.meta.url), 'utf8');
    const canvas = readFileSync(new URL('../components/LocationMapCanvas.tsx', import.meta.url), 'utf8');
    assert.equal(/yandex|YANDEX/i.test(map + canvas), false);
    assert.equal(map.includes('leaflet'), true);
  });
});
