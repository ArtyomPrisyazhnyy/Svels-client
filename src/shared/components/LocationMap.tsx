'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { yandexMapWidgetUrl, yandexMapsScriptUrl } from '../lib/yandex-map';

export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
};

type LocationMapProps = {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Клик по карте ставит/двигает точку (админка). */
  onPick?: (point: { lat: number; lng: number }) => void;
  height?: number;
};

type YMapsApi = {
  ready: (cb: () => void) => void;
  Map: new (
    container: HTMLElement,
    state: { center: [number, number]; zoom: number; controls?: string[] },
    options?: { suppressMapOpenBlock?: boolean },
  ) => YMapInstance;
  Placemark: new (
    coords: [number, number],
    properties?: { balloonContent?: string; hintContent?: string },
    options?: { preset?: string; zIndex?: number },
  ) => YPlacemark;
};

type YMapInstance = {
  geoObjects: {
    add: (object: unknown) => void;
    removeAll: () => void;
    getBounds: () => [[number, number], [number, number]] | null;
  };
  setCenter: (center: [number, number], zoom?: number) => void;
  setBounds: (
    bounds: [[number, number], [number, number]],
    options?: { checkZoomRange?: boolean; zoomMargin?: number },
  ) => void;
  events: {
    add: (event: string, handler: (event: { get: (key: string) => [number, number] }) => void) => void;
  };
  behaviors: { disable: (name: string) => void };
  container: { fitToViewport: () => void };
  destroy: () => void;
};

type YPlacemark = {
  events: { add: (event: string, handler: () => void) => void };
};

const DEFAULT_CENTER: [number, number] = [53.9023, 27.5619];

let ymapsLoader: Promise<YMapsApi> | null = null;

function loadYmaps(): Promise<YMapsApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Yandex Maps only in browser'));
  }

  const existing = (window as unknown as { ymaps?: YMapsApi }).ymaps;
  if (existing) {
    return new Promise((resolve) => existing.ready(() => resolve(existing)));
  }

  if (!ymapsLoader) {
    ymapsLoader = new Promise((resolve, reject) => {
      const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY;
      const src = yandexMapsScriptUrl(apiKey);
      const existed = document.querySelector<HTMLScriptElement>('script[data-svels-ymaps]');
      const script = existed ?? document.createElement('script');

      const finish = () => {
        const ymaps = (window as unknown as { ymaps?: YMapsApi }).ymaps;
        if (!ymaps) {
          reject(new Error('Yandex Maps failed to load'));
          return;
        }
        ymaps.ready(() => resolve(ymaps));
      };

      if (existed && (window as unknown as { ymaps?: YMapsApi }).ymaps) {
        finish();
        return;
      }

      script.src = src;
      script.async = true;
      script.dataset.svelsYmaps = '1';
      script.onload = finish;
      script.onerror = () => {
        ymapsLoader = null;
        reject(new Error('Yandex Maps failed to load'));
      };
      if (!existed) {
        document.head.appendChild(script);
      }
    });
  }

  return ymapsLoader;
}

function syncPlacemarks(
  ymaps: YMapsApi,
  map: YMapInstance,
  markers: MapMarker[],
  selectedId: string | null | undefined,
  onSelect?: (id: string) => void,
) {
  map.geoObjects.removeAll();

  for (const marker of markers) {
    const active = marker.id === selectedId;
    const pin = new ymaps.Placemark(
      [marker.lat, marker.lng],
      {
        balloonContent: marker.title,
        hintContent: marker.title,
      },
      {
        preset: active ? 'islands#redIcon' : 'islands#blueIcon',
        zIndex: active ? 2 : 1,
      },
    );
    pin.events.add('click', () => onSelect?.(marker.id));
    map.geoObjects.add(pin);
  }

  if (markers.length === 1) {
    map.setCenter([markers[0].lat, markers[0].lng], 16);
    return;
  }

  if (markers.length > 1) {
    const bounds = map.geoObjects.getBounds();
    if (bounds) {
      map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 48 });
    }
    return;
  }

  map.setCenter(DEFAULT_CENTER, 12);
}

export function LocationMap({
  markers,
  selectedId,
  onSelect,
  onPick,
  height = 280,
}: LocationMapProps) {
  const reactId = useId();
  const containerId = `svels-location-map-${reactId.replace(/:/g, '')}`;
  const mapRef = useRef<YMapInstance | null>(null);
  const ymapsRef = useRef<YMapsApi | null>(null);
  const markersRef = useRef(markers);
  const selectedIdRef = useRef(selectedId);
  const onSelectRef = useRef(onSelect);
  const onPickRef = useRef(onPick);
  const [useWidgetFallback, setUseWidgetFallback] = useState(false);

  markersRef.current = markers;
  selectedIdRef.current = selectedId;
  onSelectRef.current = onSelect;
  onPickRef.current = onPick;

  const markerKey = markers
    .map((marker) => `${marker.id}:${marker.lat}:${marker.lng}`)
    .join('|');

  useEffect(() => {
    let cancelled = false;

    void loadYmaps()
      .then((ymaps) => {
        if (cancelled) {
          return;
        }

        const el = document.getElementById(containerId);
        if (!el) {
          return;
        }

        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
        }

        const map = new ymaps.Map(
          el,
          {
            center: DEFAULT_CENTER,
            zoom: 12,
            controls: ['zoomControl'],
          },
          { suppressMapOpenBlock: true },
        );

        if (!onPickRef.current) {
          map.behaviors.disable('scrollZoom');
        }

        map.events.add('click', (event) => {
          const coords = event.get('coords');
          onPickRef.current?.({ lat: coords[0], lng: coords[1] });
        });

        ymapsRef.current = ymaps;
        mapRef.current = map;
        syncPlacemarks(ymaps, map, markersRef.current, selectedIdRef.current, (id) =>
          onSelectRef.current?.(id),
        );
        requestAnimationFrame(() => map.container.fitToViewport());
      })
      .catch(() => {
        if (!cancelled) {
          setUseWidgetFallback(true);
        }
      });

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [containerId]);

  useEffect(() => {
    const map = mapRef.current;
    const ymaps = ymapsRef.current;
    if (!map || !ymaps) {
      return;
    }
    syncPlacemarks(ymaps, map, markers, selectedId, (id) => onSelectRef.current?.(id));
  }, [markerKey, selectedId, markers]);

  const widgetSrc = yandexMapWidgetUrl(
    markers.map((marker) => ({
      lat: marker.lat,
      lng: marker.lng,
      selected: marker.id === selectedId,
    })),
  );

  return (
    <div
      data-testid="location-map"
      style={{
        height,
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#e8eef5',
      }}
    >
      {useWidgetFallback ? (
        <iframe
          title="Яндекс Карта"
          src={widgetSrc}
          width="100%"
          height={height}
          frameBorder={0}
          style={{ border: 0, display: 'block' }}
          allow="geolocation"
        />
      ) : (
        <div id={containerId} style={{ height: '100%', width: '100%' }} />
      )}
    </div>
  );
}
