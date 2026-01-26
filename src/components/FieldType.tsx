import React from "react";
import { v8 } from "@maplibre/maplibre-gl-style-spec";
import Block from "./Block";
import InputSelect from "./InputSelect";
import InputString from "./InputString";
import { useTranslation } from "react-i18next";
import { startCase } from "lodash";

type FieldTypeProps = {
  value: string;
  wdKey?: string;
  onChange(value: string): void;
  error?: { message: string };
  disabled?: boolean;
};

const FieldType: React.FC<FieldTypeProps> = ({ value, wdKey, onChange, error, disabled = false }) => {
  const { t } = useTranslation();
  const layersTypes: [string, string][] = Object.keys(v8.layer.type.values || {}).map((v) => [
    v,
    startCase(v.replace(/-/g, " ")),
  ]);

  return (
    <Block label={t("Type")} fieldSpec={v8.layer.type} data-wd-key={wdKey} error={error}>
      {disabled ? (
        <InputString value={value} disabled={true} />
      ) : (
        <InputSelect
          options={layersTypes}
          onChange={onChange}
          value={value}
          data-wd-key={wdKey + ".select"}
        />
      )}
    </Block>
  );
};

export default FieldType;

