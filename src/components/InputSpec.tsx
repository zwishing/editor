import React, { type ReactElement } from "react";
import InputColor, { type InputColorProps } from "./InputColor";
import InputNumber, { type InputNumberProps } from "./InputNumber";
import InputCheckbox, { type InputCheckboxProps } from "./InputCheckbox";
import InputString, { type InputStringProps } from "./InputString";
import InputArray, { type InputArrayProps } from "./InputArray";
import InputDynamicArray, { type InputDynamicArrayProps } from "./InputDynamicArray";
import InputFont, { type InputFontProps } from "./InputFont";
import InputAutocomplete, { type InputAutocompleteProps } from "./InputAutocomplete";
import InputEnum, { type InputEnumProps } from "./InputEnum";
import capitalize from "lodash.capitalize";

const iconProperties = ["background-pattern", "fill-pattern", "line-pattern", "fill-extrusion-pattern", "icon-image"];

export type FieldSpecType = "number" | "enum" | "resolvedImage" | "formatted" | "string" | "color" | "boolean" | "array" | "numberArray" | "padding" | "colorArray" | "variableAnchorOffsetCollection";

export type InputSpecProps = {
  onChange?(fieldName: string | undefined, value: any): unknown;
  fieldName?: string;
  fieldSpec?: {
    default?: unknown;
    type?: FieldSpecType;
    minimum?: number;
    maximum?: number;
    values?: any[];
    length?: number;
    value?: string;
  };
  value?: any;
  /** Override the style of the field */
  style?: object;
  "aria-label"?: string;
  label?: string;
  action?: ReactElement;
};

const InputSpec: React.FC<InputSpecProps> = ({
  onChange,
  fieldName,
  fieldSpec,
  value,
  style,
  "aria-label": ariaLabel,
  label,
  action
}) => {
  const enumOptions = React.useMemo(
    () => Object.keys(fieldSpec?.values || {}).map((v) => [v, capitalize(v)] as [string, string]),
    [fieldSpec?.values]
  );
  const autocompleteOptions = React.useMemo(
    () => (Array.isArray(fieldSpec?.values) ? fieldSpec.values : []).map((f) => [f, f] as [string, string]),
    [fieldSpec?.values]
  );
  const normalizedArrayValue = React.useMemo(
    () => (Array.isArray(value) ? value : [value]) as (string | number | undefined)[],
    [value]
  );

  const commonProps = {
    fieldSpec,
    label,
    action,
    style,
    value,
    default: fieldSpec?.default,
    name: fieldName,
    "data-wd-key": `spec-field-input:${fieldName}`,
    onChange: (newValue: any) => onChange?.(fieldName, newValue),
    "aria-label": ariaLabel,
  };

  const renderInput = () => {
    if (!fieldSpec) return null;

    switch (fieldSpec.type) {
      case "number":
        return (
          <InputNumber
            {...(commonProps as InputNumberProps)}
            min={fieldSpec.minimum}
            max={fieldSpec.maximum}
          />
        );
      case "enum": {
        return <InputEnum {...(commonProps as Omit<InputEnumProps, "options">)} options={enumOptions} />;
      }
      case "resolvedImage":
      case "formatted":
      case "string":
        if (fieldName && iconProperties.indexOf(fieldName) >= 0) {
          return (
            <InputAutocomplete
              {...(commonProps as Omit<InputAutocompleteProps, "options">)}
              options={autocompleteOptions}
            />
          );
        } else {
          return <InputString {...(commonProps as InputStringProps)} />;
        }
      case "color":
        return <InputColor {...(commonProps as InputColorProps)} />;
      case "boolean":
        return <InputCheckbox {...(commonProps as InputCheckboxProps)} />;
      case "array":
        if (fieldName === "text-font") {
          return <InputFont {...(commonProps as InputFontProps)} fonts={fieldSpec.values} />;
        } else if (fieldSpec.length) {
          return (
            <InputArray
              {...(commonProps as InputArrayProps)}
              type={fieldSpec.value as any}
              length={fieldSpec.length}
            />
          );
        } else {
          return (
            <InputDynamicArray
              {...(commonProps as InputDynamicArrayProps)}
              fieldSpec={fieldSpec}
              type={fieldSpec.value as InputDynamicArrayProps["type"]}
            />
          );
        }
      case "numberArray":
        return (
          <InputDynamicArray
            {...(commonProps as InputDynamicArrayProps)}
            fieldSpec={fieldSpec}
            type="number"
            value={normalizedArrayValue}
          />
        );
      case "colorArray":
        return (
          <InputDynamicArray
            {...(commonProps as InputDynamicArrayProps)}
            fieldSpec={fieldSpec}
            type="color"
            value={normalizedArrayValue}
          />
        );
      case "padding":
        return (
          <InputArray
            {...(commonProps as InputArrayProps)}
            type="number"
            value={normalizedArrayValue}
            length={4}
          />
        );
      default:
        console.warn(`No proper field input for ${fieldName} type: ${fieldSpec?.type}`);
        return null;
    }
  };

  return (
    <div data-wd-key={`spec-field:${fieldName}`}>
      {renderInput()}
    </div>
  );
};

export default InputSpec;
