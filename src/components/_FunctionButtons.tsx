import React from "react";

import InputButton from "./InputButton";
import { MdFunctions, MdInsertChart } from "react-icons/md";
import { TbMathFunction } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <InputButton
                onClick={props.onExpressionClick}
              >
                <TbMathFunction className="h-4 w-4" />
              </InputButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("Convert to expression")}</p>
            </TooltipContent>
          </Tooltip>

          {props.fieldSpec["property-type"] === "data-driven" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <InputButton
                  onClick={props.onDataClick}
                >
                  <MdInsertChart className="h-4 w-4" />
                </InputButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("Convert property to data function")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <InputButton
                onClick={props.onZoomClick}
              >
                <MdFunctions className="h-4 w-4" />
              </InputButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("Convert property into a zoom function")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  } else if (props.fieldSpec.expression?.parameters.includes("elevation")) {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <InputButton
                onClick={props.onElevationClick}
                data-wd-key='make-elevation-function'
              >
                <MdFunctions className="h-4 w-4" />
              </InputButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("Convert property into a elevation function")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return null;
};

export default FunctionInputButtons;
