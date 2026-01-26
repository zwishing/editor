import React from "react";
import { type LayerSpecification } from "maplibre-gl";
import FilterEditor from "../FilterEditor";
import { type MappedLayerErrors } from "../../libs/definitions";

type LayerEditorFilterProps = {
  layer: LayerSpecification;
  vectorLayers: { [key: string]: any };
  errors: MappedLayerErrors;
  onChangeProperty: (group: keyof LayerSpecification | null, property: string, newValue: any) => void;
};

const LayerEditorFilter: React.FC<LayerEditorFilterProps> = React.memo(({
  layer,
  vectorLayers,
  errors,
  onChangeProperty,
}) => {
  return (
    <div className="p-3 bg-panel-surface">
      <FilterEditor
        errors={errors}
        filter={(layer as any).filter}
        properties={vectorLayers[(layer as any)["source-layer"]]}
        onChange={(f) => onChangeProperty(null, "filter", f)}
      />
    </div>
  );
});

export default LayerEditorFilter;
