import React from "react";
import FieldSpec, { type FieldSpecProps } from "./FieldSpec";
import FunctionButtons from "./_FunctionButtons";
import labelFromFieldName from "../libs/label-from-field-name";

type SpecPropertyProps = FieldSpecProps & {
  fieldName?: string
  fieldType?: string
  fieldSpec?: any
  value?: any
  errors?: { [key: string]: { message: string } }
  onZoomClick(): void
  onDataClick(): void
  onExpressionClick?(): void
  onElevationClick?(): void
};

const SpecProperty: React.FC<SpecPropertyProps> = (props) => {
  const { errors = {}, fieldName = "", fieldType = "" } = props;

  const functionBtn = (
    <FunctionButtons
      fieldSpec={props.fieldSpec}
      onZoomClick={props.onZoomClick}
      onDataClick={props.onDataClick}
      onExpressionClick={props.onExpressionClick}
      onElevationClick={props.onElevationClick}
    />
  );

  const error = errors[fieldType + "." + fieldName];

  return (
    <FieldSpec
      {...props}
      error={error as { message: string }}
      fieldSpec={props.fieldSpec}
      label={labelFromFieldName(fieldName)}
      action={functionBtn}
    />
  );
};

export default SpecProperty;

