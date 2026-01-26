import React from "react";
import { type LayerSpecification, type BackgroundLayerSpecification } from "maplibre-gl";
import { type SourceSpecification } from "maplibre-gl";
import FieldId from "../FieldId";
import FieldType from "../FieldType";
import FieldSource from "../FieldSource";
import FieldSourceLayer from "../FieldSourceLayer";
import FieldMinZoom from "../FieldMinZoom";
import FieldMaxZoom from "../FieldMaxZoom";
import FieldComment from "../FieldComment";
import { changeType } from "../../libs/layer";
import { NON_SOURCE_LAYERS } from "../../libs/non-source-layers";
import { type MappedLayerErrors } from "../../libs/definitions";

type LayerEditorLayerProps = {
  layer: LayerSpecification;
  layerIndex: number;
  sources: { [key: string]: SourceSpecification & { layers: string[] } };
  errors: MappedLayerErrors;
  onLayerIdChange: (index: number, oldId: string, newId: string) => void;
  onLayerChanged: (index: number, layer: LayerSpecification) => void;
  onChangeProperty: (group: keyof LayerSpecification | null, property: string, newValue: any) => void;
};

const LayerEditorLayer: React.FC<LayerEditorLayerProps> = React.memo(({
  layer,
  layerIndex,
  sources,
  errors,
  onLayerIdChange,
  onLayerChanged,
  onChangeProperty,
}) => {
  let comment = "";
  if (layer.metadata) {
    comment = (layer.metadata as any)["maputnik:comment"] || "";
  }

  let sourceLayerIds: string[] | undefined;
  const layerSpec = layer as Exclude<LayerSpecification, BackgroundLayerSpecification>;
  if (Object.prototype.hasOwnProperty.call(sources, layerSpec.source)) {
    sourceLayerIds = sources[layerSpec.source].layers;
  }

  return (
    <div className="p-4 bg-panel-surface space-y-4">
      <FieldId
        value={layer.id}
        wdKey="layer-editor.layer-id"
        error={errors.id}
        onChange={(newId) => onLayerIdChange(layerIndex, layer.id, newId || "")}
      />
      <FieldType
        disabled={true}
        error={errors.type}
        value={layer.type}
        onChange={(newType) => onLayerChanged(layerIndex, changeType(layer, newType))}
      />
      {layer.type !== "background" && (
        <FieldSource
          error={errors.source}
          sourceIds={Object.keys(sources)}
          value={layer.source}
          onChange={(v) => onChangeProperty(null, "source", v)}
        />
      )}
      {!NON_SOURCE_LAYERS.includes(layer.type) && (
        <FieldSourceLayer
          error={errors["source-layer"]}
          sourceLayerIds={sourceLayerIds}
          value={(layer as any)["source-layer"]}
          onChange={(v) => onChangeProperty(null, "source-layer", v)}
        />
      )}
      <FieldMinZoom
        error={errors.minzoom}
        value={layer.minzoom}
        onChange={(v) => onChangeProperty(null, "minzoom", v)}
      />
      <FieldMaxZoom
        error={errors.maxzoom}
        value={layer.maxzoom}
        onChange={(v) => onChangeProperty(null, "maxzoom", v)}
      />
      <FieldComment
        error={errors.comment}
        value={comment}
        onChange={(v) => onChangeProperty("metadata", "maputnik:comment", v === "" ? undefined : v)}
      />
    </div>
  );
});

export default LayerEditorLayer;
