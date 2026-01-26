import React, { useCallback } from "react";
import FieldFunction from "./FieldFunction";
import type { LayerSpecification } from "maplibre-gl";
import { type MappedLayerErrors } from "../libs/definitions";

const iconProperties = ["background-pattern", "fill-pattern", "line-pattern", "fill-extrusion-pattern", "icon-image"];

/** Extract field spec by {@fieldName} from the {@layerType} in the
 * style specification from either the paint or layout group */
function getFieldSpec(spec: any, layerType: LayerSpecification["type"], fieldName: string) {
  const groupName = getGroupName(spec, layerType, fieldName);
  const group = spec[groupName + "_" + layerType];
  const fieldSpec = group[fieldName];
  if (iconProperties.indexOf(fieldName) >= 0) {
    return {
      ...fieldSpec,
      values: spec.$root.sprite.values,
    };
  }
  if (fieldName === "text-font") {
    return {
      ...fieldSpec,
      values: spec.$root.glyphs.values,
    };
  }
  return fieldSpec;
}

function getGroupName(spec: any, layerType: LayerSpecification["type"], fieldName: string): "paint" | "layout" {
  const paint = spec["paint_" + layerType] || {};
  return fieldName in paint ? "paint" : "layout";
}

type PropertyGroupProps = {
  layer: LayerSpecification;
  groupFields: string[];
  onChange(group: "paint" | "layout", property: string, newValue: any): void;
  spec: any;
  errors?: MappedLayerErrors;
};

const PropertyGroup: React.FC<PropertyGroupProps> = ({ layer, groupFields, onChange, spec, errors }) => {
  const onPropertyChange = useCallback(
    (property: string, newValue: any) => {
      const group = getGroupName(spec, layer.type, property);
      onChange(group, property, newValue);
    },
    [spec, layer.type, onChange]
  );

  const fields = groupFields.map((fieldName) => {
    const fieldSpec = getFieldSpec(spec, layer.type, fieldName);

    const paint = layer.paint || {};
    const layout = layer.layout || {};
    const fieldValue =
      fieldName in paint
        ? paint[fieldName as keyof typeof paint]
        : layout[fieldName as keyof typeof layout];
    const fieldType = fieldName in paint ? "paint" : "layout";

    return (
      <FieldFunction
        errors={errors}
        onChange={onPropertyChange}
        key={fieldName}
        fieldName={fieldName}
        value={fieldValue}
        fieldType={fieldType}
        fieldSpec={fieldSpec}
      />
    );
  });

  return <div className="space-y-4">{fields}</div>;
};

export default PropertyGroup;

