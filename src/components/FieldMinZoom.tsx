import React from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import Block from "./Block";
import InputNumber from "./InputNumber";
import { useTranslation } from "react-i18next";

type FieldMinZoomProps = {
  value?: number;
  onChange(value: number | undefined): void;
  error?: { message: string };
};

const FieldMinZoom: React.FC<FieldMinZoomProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  return (
    <Block
      label={t("Min Zoom")}
      fieldSpec={latest.layer.minzoom}
      error={error}
      inline={true}
      data-wd-key="min-zoom"
    >
      <InputNumber
        allowRange={true}
        value={value}
        onChange={onChange}
        min={latest.layer.minzoom.minimum}
        max={latest.layer.minzoom.maximum}
        default={latest.layer.minzoom.minimum}
        data-wd-key="min-zoom.input"
      />
    </Block>
  );
};

export default FieldMinZoom;

