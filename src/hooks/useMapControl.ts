import { useEffect, useRef } from "react";
import MapLibreGl, { type Map } from "maplibre-gl";
import MaplibreGeocoder, { type MaplibreGeocoderApi, type MaplibreGeocoderApiConfig } from "@maplibre/maplibre-gl-geocoder";
import ZoomControl from "../libs/zoomcontrol";

type UseMapControlProps = {
  map: Map | null;
  t: (key: string) => string;
};

export const useMapControl = ({ map, t }: UseMapControlProps) => {
  const geocoderRef = useRef<MaplibreGeocoder | null>(null);
  const zoomControlRef = useRef<ZoomControl | null>(null);

  useEffect(() => {
    if (!map) return;

    // Navigation Control
    const nav = new MapLibreGl.NavigationControl({ visualizePitch: true });
    map.addControl(nav, "top-right");

    // Zoom Control
    const zoomControl = new ZoomControl();
    map.addControl(zoomControl, "top-right");
    zoomControlRef.current = zoomControl;
    zoomControl.setLabel(t("Zoom:"));

    // Geocoder
    const geocoderConfig = {
      forwardGeocode: async (config: MaplibreGeocoderApiConfig) => {
        const features = [];
        try {
          const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
          const response = await fetch(request);
          const geojson = await response.json();
          for (const feature of geojson.features) {
            const center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2
            ];
            const point = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: center
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ["place"],
              center
            };
            features.push(point);
          }
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
        }
        return {
          features
        };
      },
    } as unknown as MaplibreGeocoderApi;

    const geocoder = new MaplibreGeocoder(geocoderConfig, {
      placeholder: t("Search"),
      maplibregl: MapLibreGl,
    });
    map.addControl(geocoder, "top-left");
    geocoderRef.current = geocoder;

    // Cleanup not strictly necessary for single-page app components if they are never unmounted except for route change,
    // but good practice.
    // However, map.remove() in useMapInstance cleans up controls usually? 
    // Yes, removing map removes controls.
    // But if we want to be safe:
    return () => {
      if (map) {
        try {
          if (map.hasControl(nav)) map.removeControl(nav);
          if (map.hasControl(zoomControl)) map.removeControl(zoomControl);
          if (map.hasControl(geocoder)) map.removeControl(geocoder);
        } catch (e) {
          // Ignore if map is already removed
        }
      }
    };
  }, [map]);

  // Update labels when t changes
  useEffect(() => {
    if (zoomControlRef.current) {
      zoomControlRef.current.setLabel(t("Zoom:"));
    }
    if (geocoderRef.current) {
      geocoderRef.current.setPlaceholder(t("Search"));
    }
  }, [t]);

  return {
    geocoder: geocoderRef.current,
    zoomControl: zoomControlRef.current
  };
};
