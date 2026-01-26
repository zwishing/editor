import React from "react";
import { MdDelete, MdUndo } from "react-icons/md";
import { useTranslation } from "react-i18next";

import Block from "./Block";
import InputButton from "./InputButton";
import labelFromFieldName from "../libs/label-from-field-name";
import FieldJson from "./FieldJson";
import type { StylePropertySpecification } from "maplibre-gl";
import { type MappedLayerErrors } from "../libs/definitions";

type ExpressionPropertyProps = {
  fieldName: string;
  fieldType?: string;
  fieldSpec?: StylePropertySpecification;
  value?: any;
  errors?: MappedLayerErrors;
  onDelete?(...args: unknown[]): unknown;
  onChange(value: object): void;
  onUndo?(...args: unknown[]): unknown;
  canUndo?(...args: unknown[]): unknown;
  onFocus?(...args: unknown[]): unknown;
  onBlur?(...args: unknown[]): unknown;
};

const ExpressionProperty: React.FC<ExpressionPropertyProps> = ({
  fieldName,
  fieldType,
  fieldSpec,
  value,
  errors = {},
  onDelete,
  onChange,
  onUndo,
  canUndo,
  onFocus = () => { },
  onBlur = () => { },
}) => {
  const { t } = useTranslation();
  const undoDisabled = canUndo ? !canUndo() : true;

  const actionButtons = (
    <div className="flex gap-1">
      {onUndo && (
        <InputButton
          onClick={onUndo}
          disabled={undoDisabled}
          className="maputnik-delete-stop"
          title={t("Revert from expression")}
        >
          <MdUndo />
        </InputButton>
      )}
      <InputButton
        onClick={onDelete}
        className="maputnik-delete-stop"
        title={t("Delete expression")}
      >
        <MdDelete />
      </InputButton>
    </div>
  );

  const fieldKey = fieldType ? `${fieldType}.${fieldName}` : fieldName;
  const error = errors[fieldKey];

  return (
    <Block
      fieldSpec={fieldSpec}
      label={t(labelFromFieldName(fieldName))}
      action={actionButtons}
      wideMode={true}
      error={error}
    >
      <FieldJson
        lintType="expression"
        spec={fieldSpec}
        className="maputnik-expression-editor mt-2 border border-border rounded"
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        onChange={onChange}
      />
    </Block>
  );
};

export default ExpressionProperty;

