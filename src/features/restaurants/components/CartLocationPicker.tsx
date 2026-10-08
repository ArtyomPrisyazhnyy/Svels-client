'use client';

import { useEffect, useMemo, useState } from 'react';
import { LocationMap } from '@/shared/components/LocationMap';
import type { RestaurantLocation } from '@/shared/types/restaurant-location';
import {
  formatRestaurantLocationLine,
  uniqueLocationCities,
} from '@/shared/types/restaurant-location';
import '../styles/cart-location-picker.scss';

type CartLocationPickerProps = {
  locations: RestaurantLocation[];
  selectedId: string | null;
  onSelect: (locationId: string) => void;
};

export function CartLocationPicker({
  locations,
  selectedId,
  onSelect,
}: CartLocationPickerProps) {
  const cities = useMemo(() => uniqueLocationCities(locations), [locations]);
  const [city, setCity] = useState<string>(() => {
    const selected = locations.find((location) => location.id === selectedId);
    return selected?.city ?? cities[0] ?? '';
  });

  useEffect(() => {
    if (cities.length === 0) {
      return;
    }
    if (!cities.includes(city)) {
      setCity(cities[0]);
    }
  }, [cities, city]);

  const inCity = useMemo(
    () => locations.filter((location) => location.city === city),
    [locations, city],
  );

  useEffect(() => {
    if (inCity.length === 0) {
      return;
    }
    if (selectedId && inCity.some((location) => location.id === selectedId)) {
      return;
    }
    onSelect(inCity[0].id);
  }, [inCity, onSelect, selectedId]);

  const selected = locations.find((location) => location.id === selectedId) ?? inCity[0];
  const mapMarkers = inCity.filter(
    (location) => Number.isFinite(location.lat) && Number.isFinite(location.lng),
  );

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="cart-location-picker" data-testid="cart-location-picker">
      {cities.length > 1 ? (
        <div className="cart-location-picker__cities" role="listbox" aria-label="Город">
          {cities.map((item) => (
            <button
              key={item}
              type="button"
              className={`cart-location-picker__city${
                item === city ? ' cart-location-picker__city--active' : ''
              }`}
              onClick={() => {
                setCity(item);
                const first = locations.find((location) => location.city === item);
                if (first) {
                  onSelect(first.id);
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}

      {mapMarkers.length > 0 ? (
        <LocationMap
          height={240}
          markers={mapMarkers.map((location) => ({
            id: location.id,
            lat: location.lat,
            lng: location.lng,
            title: location.label || location.address,
          }))}
          selectedId={selected?.id}
          onSelect={onSelect}
        />
      ) : null}

      {inCity.length > 1 ? (
        <ul className="cart-location-picker__list">
          {inCity.map((location) => (
            <li key={location.id}>
              <button
                type="button"
                className={location.id === selected?.id ? 'is-active' : undefined}
                onClick={() => onSelect(location.id)}
              >
                {location.label ? <strong>{location.label}</strong> : null}
                <span>{formatRestaurantLocationLine(location)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {selected ? (
        <p className="cart-location-picker__address" data-testid="cart-location-address">
          {formatRestaurantLocationLine(selected)}
        </p>
      ) : null}
    </div>
  );
}
