'use client';

import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { DEFAULT_MAP_CENTER, OSM_ATTRIBUTION, OSM_TILE_URL, openInOsmUrl } from '../lib/osm-map';
import type { LocationMapProps, MapMarker } from './location-map-types';

function markerIcon(selected: boolean): L.DivIcon {
  const state = selected ? ' location-map__pin--selected' : '';
  return L.divIcon({
    className: 'location-map__pin-wrap',
    html: `<span class="location-map__pin${state}" data-testid="location-map-marker"></span>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -18],
  });
}

function MapLifecycle({
  markers,
  onPick,
}: {
  markers: MapMarker[];
  onPick?: (point: { lat: number; lng: number }) => void;
}) {
  const map = useMap();
  const markerKey = markers.map((marker) => `${marker.lat},${marker.lng}`).join('|');

  useEffect(() => {
    const points = markerKey
      .split('|')
      .filter(Boolean)
      .map((pair) => {
        const [lat, lng] = pair.split(',');
        return { lat: Number(lat), lng: Number(lng) };
      })
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
    const fit = () => {
      if (points.length === 0) {
        map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 12);
        return;
      }
      if (points.length === 1) {
        map.setView([points[0].lat, points[0].lng], 16);
        return;
      }
      const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
    };

    const frame = requestAnimationFrame(() => {
      map.invalidateSize();
      fit();
    });
    return () => cancelAnimationFrame(frame);
  }, [map, markerKey]);

  useEffect(() => {
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [map]);

  useMapEvents({
    click(event) {
      onPick?.({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  return null;
}

export function LocationMapCanvas({ markers, selectedId, onSelect, onPick }: LocationMapProps) {
  const focus = markers.find((marker) => marker.id === selectedId) ?? markers[0];
  const center = focus ?? DEFAULT_MAP_CENTER;

  return (
    <MapContainer
      className="location-map__canvas"
      center={[center.lat, center.lng]}
      zoom={markers.length > 1 ? 13 : 16}
      scrollWheelZoom={Boolean(onPick)}
      attributionControl
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url={OSM_TILE_URL} maxZoom={19} />
      <MapLifecycle markers={markers} onPick={onPick} />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.lat, marker.lng]}
          icon={markerIcon(marker.id === selectedId)}
          eventHandlers={{
            click: () => onSelect?.(marker.id),
          }}
          title={marker.title}
        >
          <Popup>
            <div className="location-map__popup" data-testid="location-map-popup">
              <span className="location-map__popup-title">{marker.title?.trim() || 'Точка на карте'}</span>
              <a href={openInOsmUrl(marker.lat, marker.lng)} target="_blank" rel="noopener noreferrer">
                Открыть в картах
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
