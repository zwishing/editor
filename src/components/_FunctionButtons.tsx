import React from "react";

import InputButton from "./InputButton";
import { MdFunctions, MdInsertChart } from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import { useTranslation } from "react-i18next";

type FunctionInputButtonsProps = {
  fieldSpec?: any
  onZoomClick?(): void
  onDataClick?(): void
  onExpressionClick?(): void
  onElevationClick?(): void
};

const FunctionInputButtons: React.FC<FunctionInputButtonsProps> = (props) => {
  const { t } = useTranslation();

  if (props.fieldSpec.expression?.parameters.includes("zoom")) {
    return (
      <div className="flex items-center gap-1">
        <InputButton
          onClick={props.onExpressionClick}
          title={t("Convert to expression")}
        >
          <TbMathFunction />
        </InputButton>

        {props.fieldSpec["property-type"] === "data-driven" && (
          <InputButton
            onClick={props.onDataClick}
            title={t("Convert property to data function")}
          >
            <MdInsertChart />
          </InputButton>
        )}

        <InputButton
          onClick={props.onZoomClick}
          title={t("Convert property into a zoom function")}
        >
          <MdFunctions />
        </InputButton>
      </div>
    );
  } else if (props.fieldSpec.expression?.parameters.includes("elevation")) {
    return (
      <div className="flex items-center gap-1">
        <InputButton
          onClick={props.onElevationClick}
          title={t("Convert property into a elevation function")}
          data-wd-key='make-elevation-function'
        >
          <MdFunctions />
        </InputButton>
      </div>
    );
  }

  return null;
};

export default FunctionInputButtons;

