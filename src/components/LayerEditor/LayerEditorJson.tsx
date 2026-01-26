import React from "react";
import { type LayerSpecification } from "maplibre-gl";
import FieldJson from "../FieldJson";

type LayerEditorJsonProps = {
  layer: LayerSpecification;
  layerIndex: number;
  onLayerChanged: (index: number, layer: LayerSpecification) => void;
};

const LayerEditorJson: React.FC<LayerEditorJsonProps> = React.memo(({
  layer,
  layerIndex,
  onLayerChanged,
}) => {
  return (
    <div className="p-3 bg-panel-surface h-[400px]">
      <FieldJson
        lintType="layer"
        value={layer}
        onChange={(newLayer: LayerSpecification) => {
          onLayerChanged(layerIndex, newLayer);
        }}
      />
    </div>
  );
});

export default LayerEditorJson;
