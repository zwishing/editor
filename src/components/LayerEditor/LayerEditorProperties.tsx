import React from "react";
import { type LayerSpecification } from "maplibre-gl";
import PropertyGroup from "../PropertyGroup";
import { type MappedLayerErrors } from "../../libs/definitions";

type LayerEditorPropertiesProps = {
  layer: LayerSpecification;
  groupFields: string[];
  spec: any;
  errors: MappedLayerErrors;
  onChangeProperty: (group: keyof LayerSpecification | null, property: string, newValue: any) => void;
};

const LayerEditorProperties: React.FC<LayerEditorPropertiesProps> = React.memo(({
  layer,
  groupFields,
  spec,
  errors,
  onChangeProperty,
}) => {
  return (
    <div className="p-3 bg-panel-surface">
      <PropertyGroup
        errors={errors}
        layer={layer}
        groupFields={groupFields}
        spec={spec}
        onChange={onChangeProperty}
      />
    </div>
  );
});

export default LayerEditorProperties;
