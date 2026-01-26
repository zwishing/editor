import React from "react";
import { latest } from "@maplibre/maplibre-gl-style-spec";
import Block from "./Block";
import InputAutocomplete from "./InputAutocomplete";
import { useTranslation } from "react-i18next";

type FieldSourceLayerProps = {
  value?: string;
  onChange?(...args: unknown[]): void;
  sourceLayerIds?: any[];
  error?: { message: string };
};

const FieldSourceLayer: React.FC<FieldSourceLayerProps> = ({
  onChange = () => { },
  sourceLayerIds = [],
  value,
  error,
}) => {
  const { t } = useTranslation();
  return (
    <Block
      label={t("Source Layer")}
      fieldSpec={latest.layer["source-layer"]}
      data-wd-key="layer-source-layer"
      error={error}
    >
      <InputAutocomplete
        value={value}
        onChange={onChange}
        options={sourceLayerIds?.map((l) => [l, l])}
      />
    </Block>
  );
};

export default FieldSourceLayer;

