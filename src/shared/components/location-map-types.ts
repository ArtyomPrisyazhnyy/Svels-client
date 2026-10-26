export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title?: string;
};

export type LocationMapProps = {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Клик по карте ставит или двигает точку (админка). */
  onPick?: (point: { lat: number; lng: number }) => void;
  height?: number;
};
