'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/shared/ui';
import { openInOsmUrl } from '../lib/osm-map';
import type { LocationMapProps } from './location-map-types';
import 'leaflet/dist/leaflet.css';
import './location-map.scss';

export type { LocationMapProps, MapMarker } from './location-map-types';

const LocationMapCanvas = dynamic(
  () => import('./LocationMapCanvas').then((module) => module.LocationMapCanvas),
  {
    ssr: false,
    loading: () => (
      <Skeleton variant="rect" width="100%" height="100%" radius="0" testId="location-map-loading" />
    ),
  },
);

export function LocationMap({
  markers,
  selectedId,
  onSelect,
  onPick,
  height = 280,
}: LocationMapProps) {
  const focus = markers.find((marker) => marker.id === selectedId) ?? markers[0];

  return (
    <div
      className="location-map"
      data-testid="location-map"
      style={{ ['--location-map-h' as string]: `${height}px` }}
    >
      <div className="location-map__frame">
        <LocationMapCanvas
          markers={markers}
          selectedId={selectedId}
          onSelect={onSelect}
          onPick={onPick}
        />
      </div>
      {focus ? (
        <a
          className="location-map__open"
          data-testid="location-map-open"
          href={openInOsmUrl(focus.lat, focus.lng)}
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть в картах
        </a>
      ) : null}
    </div>
  );
}
