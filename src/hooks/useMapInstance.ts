import { useEffect, useRef, useState } from "react";
import MapLibreGl, { type Map, type MapOptions, type StyleSpecification } from "maplibre-gl";
import { Protocol } from "pmtiles";


type UseMapInstanceProps = {
  container: HTMLDivElement | null;
  mapStyle: StyleSpecification;
  options?: Partial<MapOptions> & {
    showTileBoundaries?: boolean;
    showCollisionBoxes?: boolean;
    showOverdrawInspector?: boolean;
  };
  onChange?: (value: { center: MapLibreGl.LngLat; zoom: number }) => void;
  onDataChange?: (event: { map: Map | null }) => void;
  onMapLoaded?: (map: Map) => void;
};

export const useMapInstance = ({
  container,
  mapStyle,
  options = {},
  onChange,
  onDataChange,
  onMapLoaded,
}: UseMapInstanceProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!container || mapRef.current) return;

    const protocol = new Protocol({ metadata: true });
    MapLibreGl.addProtocol("pmtiles", protocol.tile);

    const mapOpts: MapOptions = {
      ...options,
      container,
      style: mapStyle,
      hash: true,
      maxZoom: 24,
      localIdeographFontFamily: false,
    };

    const mapInstance = new MapLibreGl.Map(mapOpts);
    mapRef.current = mapInstance;

    // Apply specific options that might not be in MapOptions interface directly or need explicit setting
    if (options.showTileBoundaries !== undefined) mapInstance.showTileBoundaries = options.showTileBoundaries;
    if (options.showCollisionBoxes !== undefined) mapInstance.showCollisionBoxes = options.showCollisionBoxes;
    if (options.showOverdrawInspector !== undefined) mapInstance.showOverdrawInspector = options.showOverdrawInspector;

    const mapViewChange = () => {
      if (!onChange) return;
      const center = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      onChange({ center, zoom });
    };

    mapInstance.on("style.load", () => {
      setMap(mapInstance);
      if (onMapLoaded) onMapLoaded(mapInstance);
      // Force update on language change if needed, but in functional component we might rely on props or i18n hook
    });

    mapInstance.on("data", (e) => {
      if (e.dataType !== "tile") return;
      if (onDataChange) onDataChange({ map: mapInstance });
    });

    mapInstance.on("error", (e) => {
      console.log("ERROR", e);
    });

    // Zoom handling with RAF is less needed in functional components if we don't store zoom in state for rendering, 
    // but if we need it for UI, we might. 
    // The original code used RAF for zoom state update. 
    // For now, we delegate to onChange.

    mapInstance.on("dragend", mapViewChange);
    mapInstance.on("zoomend", mapViewChange);

    // Initial view change trigger
    mapViewChange();

    return () => {
      mapInstance.remove();
      mapRef.current = null;
      setMap(null);
    };
  }, [container]); // Re-create map if container changes, but usually container ref is stable. 
  // Dependency on mapStyle is tricky: we usually setStyle, not recreate map.
  // We handle setStyle in a separate effect.

  // Handle Style Updates
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    // We assume replaceAccessTokens is handled before passing mapStyle or we handle it here if passed as prop.
    // The original code did `this.props.replaceAccessTokens(this.props.mapStyle)`.
    // We should probably pass the PROCESSED style to this hook or a function to process it.
    // For now, let's assume mapStyle passed here is what we want to apply, 
    // OR we expose a way to set it.
    // Actually, checking original code: it uses `replaceAccessTokens` prop. 
    // We should probably let the parent handle token replacement and pass the final style here?
    // OR pass the replace function.

    // But wait, the map initialization uses mapStyle. 
    // Updates use setStyle.

    // For this simple hook, let's assume the parent handles the logic of "when to call setStyle" 
    // or we add a specific effect for mapStyle changes here.

    mapInstance.setStyle(mapStyle, { diff: true });

  }, [mapStyle]); // This triggers on every style change.

  // Handle Option Updates
  useEffect(() => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    if (options.showTileBoundaries !== undefined) mapInstance.showTileBoundaries = options.showTileBoundaries;
    if (options.showCollisionBoxes !== undefined) mapInstance.showCollisionBoxes = options.showCollisionBoxes;
    if (options.showOverdrawInspector !== undefined) mapInstance.showOverdrawInspector = options.showOverdrawInspector;
  }, [options.showTileBoundaries, options.showCollisionBoxes, options.showOverdrawInspector]);

  return map;
};
