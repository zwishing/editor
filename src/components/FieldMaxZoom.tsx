import React from "react";
import { layer } from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import Block from "./Block";
import InputNumber from "./InputNumber";
import { useTranslation } from "react-i18next";

type FieldMaxZoomProps = {
  value?: number;
  onChange(value: number | undefined): void;
  error?: { message: string };
};

const FieldMaxZoom: React.FC<FieldMaxZoomProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  return (
    <Block
      label={t("Max Zoom")}
      fieldSpec={layer.maxzoom}
      error={error}
      inline={true}
      data-wd-key="max-zoom"
    >
      <InputNumber
        allowRange={true}
        value={value}
        onChange={onChange}
        min={layer.maxzoom.minimum}
        max={layer.maxzoom.maximum}
        default={layer.maxzoom.maximum}
        data-wd-key="max-zoom.input"
      />
    </Block>
  );
};

export default FieldMaxZoom;

