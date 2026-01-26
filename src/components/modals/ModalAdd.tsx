import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { LayerSpecification, SourceSpecification } from "maplibre-gl";

import InputButton from "../InputButton";
import Modal from "./Modal";
import FieldType from "../FieldType";
import FieldId from "../FieldId";
import FieldSource from "../FieldSource";
import FieldSourceLayer from "../FieldSourceLayer";
import { NON_SOURCE_LAYERS } from "../../libs/non-source-layers";

export type ModalAddProps = {
  layers: LayerSpecification[];
  onLayersChange(layers: LayerSpecification[]): void;
  isOpen: boolean;
  onOpenToggle(): void;
  // A dict of source id's and the available source layers
  sources: Record<string, SourceSpecification & { layers: string[] }>;
};

const ModalAdd: React.FC<ModalAddProps> = ({
  layers,
  onLayersChange,
  isOpen,
  onOpenToggle,
  sources,
}) => {
  const { t } = useTranslation();

  const [id, setId] = useState("");
  const [type, setType] = useState<LayerSpecification["type"]>("fill");
  const [sourceId, setSourceId] = useState<string | undefined>(() => {
    const ids = Object.keys(sources);
    return ids.length > 0 ? ids[0] : undefined;
  });
  const [sourceLayer, setSourceLayer] = useState<string | undefined>(() => {
    const ids = Object.keys(sources);
    if (ids.length > 0) {
      const firstSourceLayers = sources[ids[0]].layers || [];
      return firstSourceLayers.length > 0 ? firstSourceLayers[0] : undefined;
    }
    return undefined;
  });
  const [error, setError] = useState<string | null>(null);

  const getSourcesForType = useCallback(
    (layerType: LayerSpecification["type"]) => {
      switch (layerType) {
        case "background":
          return [];
        case "hillshade":
        case "color-relief":
          return Object.entries(sources)
            .filter(([_, v]) => v.type === "raster-dem")
            .map(([k, _]) => k);
        case "raster":
          return Object.entries(sources)
            .filter(([_, v]) => v.type === "raster")
            .map(([k, _]) => k);
        case "heatmap":
        case "circle":
        case "fill":
        case "fill-extrusion":
        case "line":
        case "symbol":
          return Object.entries(sources)
            .filter(([_, v]) => v.type === "vector" || v.type === "geojson")
            .map(([k, _]) => k);
        default:
          return [];
      }
    },
    [sources]
  );

  // Sync source when type changes
  useEffect(() => {
    const availableSources = getSourcesForType(type);
    if (sourceId && !availableSources.includes(sourceId)) {
      setSourceId(undefined);
      setSourceLayer(undefined);
    } else if (!sourceId && availableSources.length > 0) {
      setSourceId(availableSources[0]);
    }
  }, [type, getSourcesForType, sourceId]);

  // Sync source layer when source changes
  useEffect(() => {
    if (sourceId) {
      const sourceObj = sources[sourceId] || {};
      const sourceLayers = sourceObj.layers || [];
      if (sourceLayers.length > 0) {
        if (!sourceLayer || !sourceLayers.includes(sourceLayer)) {
          setSourceLayer(sourceLayers[0]);
        }
      } else {
        setSourceLayer(undefined);
      }
    } else {
      setSourceLayer(undefined);
    }
  }, [sourceId, sources, sourceLayer]);

  const addLayer = () => {
    if (layers.some((l) => l.id === id)) {
      setError(t("Layer ID already exists"));
      return;
    }

    const layer: any = {
      id,
      type,
    };

    if (type !== "background") {
      layer.source = sourceId;
      if (!NON_SOURCE_LAYERS.includes(type) && sourceLayer) {
        layer["source-layer"] = sourceLayer;
      }
    }

    const changedLayers = [...layers, layer as LayerSpecification];
    onLayersChange(changedLayers);
    onOpenToggle();
  };

  const availableSources = getSourcesForType(type);
  const availableLayers = sourceId ? sources[sourceId]?.layers || [] : [];

  return (
    <Modal
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Add Layer")}
      data-wd-key="modal:add-layer"
      className="maputnik-add-modal"
    >
      {error && (
        <div className="maputnik-modal-error bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-center">
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="maputnik-modal-error-close text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      <div className="maputnik-add-layer space-y-4">
        <FieldId
          value={id}
          wdKey="add-layer.layer-id"
          onChange={(v: string) => {
            setId(v);
            setError(null);
          }}
        />
        <FieldType
          value={type}
          wdKey="add-layer.layer-type"
          onChange={(v: LayerSpecification["type"]) => setType(v)}
        />
        {type !== "background" && (
          <FieldSource
            sourceIds={availableSources}
            wdKey="add-layer.layer-source-block"
            value={sourceId}
            onChange={(v: string) => setSourceId(v)}
          />
        )}
        {!NON_SOURCE_LAYERS.includes(type) && (
          <FieldSourceLayer
            sourceLayerIds={availableLayers}
            value={sourceLayer}
            onChange={(v: string) => setSourceLayer(v)}
          />
        )}
        <InputButton
          className="maputnik-add-layer-button w-full justify-center py-2"
          onClick={addLayer}
          data-wd-key="add-layer"
          disabled={!id}
        >
          {t("Add Layer")}
        </InputButton>
      </div>
    </Modal>
  );
};

export default ModalAdd;
