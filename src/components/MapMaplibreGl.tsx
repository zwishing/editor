import React, { useRef } from "react";
import { type Map, type MapOptions, type StyleSpecification, type LngLat } from "maplibre-gl";
import { type HighlightedLayer } from "../libs/highlight";
import "maplibre-gl/dist/maplibre-gl.css";
import "../maplibregl.css";
import "../libs/maplibre-rtl";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { withTranslation, type WithTranslation } from "react-i18next";
import { useMapInstance } from "../hooks/useMapInstance";
import { useMapControl } from "../hooks/useMapControl";
import { useMapInspect } from "../hooks/useMapInspect";

type MapMaplibreGlInternalProps = {
  onDataChange?(event: { map: Map | null }): unknown;
  onLayerSelect(index: number): void;
  mapStyle: StyleSpecification;
  inspectModeEnabled: boolean;
  highlightedLayer?: HighlightedLayer;
  options?: Partial<MapOptions> & {
    showTileBoundaries?: boolean;
    showCollisionBoxes?: boolean;
    showOverdrawInspector?: boolean;
  };
  replaceAccessTokens(mapStyle: StyleSpecification): StyleSpecification;
  onChange(value: { center: LngLat; zoom: number }): unknown;
} & WithTranslation;

const MapMaplibreGlInternal: React.FC<MapMaplibreGlInternalProps> = ({
  onDataChange,
  onLayerSelect,
  mapStyle,
  inspectModeEnabled,
  highlightedLayer,
  options = {},
  replaceAccessTokens,
  onChange,
  t,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const processedStyle = React.useMemo(() => {
    return replaceAccessTokens(mapStyle);
  }, [mapStyle, replaceAccessTokens]);

  const map = useMapInstance({
    container: containerRef.current,
    mapStyle: processedStyle,
    options,
    onChange,
    onDataChange,
    // We can also pass other callbacks if needed
  });

  useMapControl({
    map,
    t,
  });

  useMapInspect({
    map,
    mapStyle,
    inspectModeEnabled,
    highlightedLayer,
    replaceAccessTokens,
    onLayerSelect,
  });

  return (
    <div
      className="maputnik-map__map"
      role="region"
      aria-label={t("Map view")}
      ref={containerRef}
      data-wd-key="maplibre:map"
    />
  );
};

const MapMaplibreGl = withTranslation()(MapMaplibreGlInternal);
export default MapMaplibreGl;
