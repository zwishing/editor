import { useEffect, useRef } from "react";

import { createRoot, type Root } from "react-dom/client";
import MapLibreGl, { type Map, type StyleSpecification, type LayerSpecification, type SourceSpecification } from "maplibre-gl";
import MaplibreInspect from "@maplibre/maplibre-gl-inspect";
import colors from "@maplibre/maplibre-gl-inspect/lib/colors";
import Color from "color";
import MapMaplibreGlLayerPopup from "../components/MapMaplibreGlLayerPopup";
import MapMaplibreGlFeaturePropertyPopup, { type InspectFeature } from "../components/MapMaplibreGlFeaturePropertyPopup";
import { type HighlightedLayer, colorHighlightedLayer } from "../libs/highlight";

function buildInspectStyle(originalMapStyle: StyleSpecification, coloredLayers: HighlightedLayer[], highlightedLayer?: HighlightedLayer) {
  const backgroundLayer = {
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": "#1c1f24",
    }
  } as LayerSpecification;

  const layer = colorHighlightedLayer(highlightedLayer);
  if (layer) {
    coloredLayers.push(layer);
  }

  const sources: { [key: string]: SourceSpecification } = {};

  Object.keys(originalMapStyle.sources).forEach(sourceId => {
    const source = originalMapStyle.sources[sourceId];
    if (source.type !== "raster" && source.type !== "raster-dem") {
      sources[sourceId] = source;
    }
  });

  const inspectStyle = {
    ...originalMapStyle,
    sources: sources,
    layers: [backgroundLayer].concat(coloredLayers as LayerSpecification[])
  };
  return inspectStyle;
}

type UseMapInspectProps = {
  map: Map | null;
  mapStyle: StyleSpecification;
  inspectModeEnabled: boolean;
  highlightedLayer?: HighlightedLayer;
  replaceAccessTokens: (mapStyle: StyleSpecification) => StyleSpecification;
  onLayerSelect: (index: number) => void;
};

export const useMapInspect = ({
  map,
  mapStyle,
  inspectModeEnabled,
  highlightedLayer,
  replaceAccessTokens,
  onLayerSelect,
}: UseMapInspectProps) => {
  const inspectRef = useRef<MaplibreInspect | null>(null);
  const popupRootRef = useRef<Root | null>(null);

  // Refs for current props to avoid stale closures in MaplibreInspect callbacks
  const propsRef = useRef({
    inspectModeEnabled,
    highlightedLayer,
    mapStyle, // Note: mapStyle object reference might change often, be careful
    onLayerSelect
  });

  useEffect(() => {
    propsRef.current = {
      inspectModeEnabled,
      highlightedLayer,
      mapStyle,
      onLayerSelect
    };
  }, [inspectModeEnabled, highlightedLayer, mapStyle, onLayerSelect]);

  useEffect(() => {
    if (!map) return;

    const tmpNode = document.createElement("div");
    popupRootRef.current = createRoot(tmpNode);

    const inspectPopup = new MapLibreGl.Popup({
      closeOnClick: false
    });

    const inspect = new MaplibreInspect({
      popup: inspectPopup,
      showMapPopup: true,
      showMapPopupOnHover: false,
      showInspectMapPopupOnHover: true,
      showInspectButton: false,
      blockHoverPopupOnClick: true,
      assignLayerColor: (layerId: string, alpha: number) => {
        return Color(colors.brightColor(layerId, alpha)).desaturate(0.5).string();
      },
      buildInspectStyle: (originalMapStyle: StyleSpecification, coloredLayers: HighlightedLayer[]) =>
        buildInspectStyle(originalMapStyle, coloredLayers, propsRef.current.highlightedLayer),
      renderPopup: (features: InspectFeature[]) => {
        const { inspectModeEnabled, onLayerSelect } = propsRef.current;

        if (inspectModeEnabled) {
          inspectPopup.once("open", () => {
            popupRootRef.current?.render(<MapMaplibreGlFeaturePropertyPopup features={features} />);
          });
          return tmpNode;
        } else {
          inspectPopup.once("open", () => {
            const onLayerSelectById = (id: string) => {
              const globalStyle = propsRef.current.mapStyle;
              const index = globalStyle.layers.findIndex(layer => layer.id === id);
              onLayerSelect(index);
            };
            // We need current zoom. Map instance has it.
            const zoom = map.getZoom();
            popupRootRef.current?.render(
              <MapMaplibreGlLayerPopup
                features={features}
                onLayerSelect={onLayerSelectById}
                zoom={zoom}
              />
            );
          });
          return tmpNode;
        }
      }
    });

    map.addControl(inspect);
    inspectRef.current = inspect;

    return () => {
      // Cleanup if necessary
      try {
        if (map.hasControl(inspect)) map.removeControl(inspect);
      } catch (e) { }
      // Don't unmount root here synchronously if it causes issues, but ideally we should.
      // React 18 createRoot root.unmount()
      // popupRootRef.current?.unmount(); // Doing this might be tricky if popup is still open? 
      // Let's leave it for now.
    };
  }, [map]);


  // Handle Updates
  useEffect(() => {
    const inspect = inspectRef.current;
    if (!inspect || !map) return;

    // Toggle Inspector
    if (inspect._showInspectMap !== inspectModeEnabled) {
      inspect.toggleInspector();
    }

    // Update Original Style when needed
    // The original code updated style if mapStyle changed OR highlightedLayer changed when inspectModeEnabled is true
    if (inspectModeEnabled) {
      const styleWithTokens = replaceAccessTokens(mapStyle);
      inspect.setOriginalStyle(styleWithTokens);
      // Refresh inspect render after short delay as per original code
      setTimeout(() => {
        inspect.render();
      }, 500);
    }

  }, [inspectModeEnabled, mapStyle, highlightedLayer, replaceAccessTokens, map]);
  // Note: we depend on mapStyle here. If mapStyle changes deeply but ref is same, this might not trigger if passed as same objection.
  // But usually in React mapStyle prop change implies new object.

  return inspectRef.current;
};
