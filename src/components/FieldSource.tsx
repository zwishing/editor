import React from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import Block from "./Block";
import InputAutocomplete from "./InputAutocomplete";
import { useTranslation } from "react-i18next";

type FieldSourceProps = {
  value?: string;
  wdKey?: string;
  onChange?(value: string | undefined): void;
  sourceIds?: any[];
  error?: { message: string };
};

const FieldSource: React.FC<FieldSourceProps> = ({
  onChange = () => { },
  sourceIds = [],
  wdKey,
  value,
  error,
}) => {
  const { t } = useTranslation();
  return (
    <Block
      label={t("Source")}
      fieldSpec={latest.layer.source}
      error={error}
      data-wd-key={wdKey}
    >
      <InputAutocomplete
        value={value}
        onChange={onChange}
        options={sourceIds?.map((src) => [src, src])}
      />
    </Block>
  );
};

export default FieldSource;

