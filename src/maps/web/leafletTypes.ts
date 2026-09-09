// src/maps/web/leafletTypes.ts

export type LeafletLatLng = [number, number];

export type LeafletMap = {
  setView(center: LeafletLatLng, zoom: number): LeafletMap;
  remove(): void;
  invalidateSize(): void;
};

export type LeafletMarker = {
  addTo(map: LeafletMap): LeafletMarker;
  on(event: "click", handler: () => void): LeafletMarker;
  remove(): void;
};

export type LeafletGlobal = {
  map(element: HTMLElement, options?: Record<string, unknown>): LeafletMap;
  tileLayer(
    urlTemplate: string,
    options?: Record<string, unknown>,
  ): {
    addTo(map: LeafletMap): void;
  };
  divIcon(options: Record<string, unknown>): unknown;
  marker(
    coordinate: LeafletLatLng,
    options?: Record<string, unknown>,
  ): LeafletMarker;
};
