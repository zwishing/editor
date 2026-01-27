import React, { useState, useEffect, useCallback, useRef } from "react";
import { PiListPlusBold } from "react-icons/pi";
import { TbMathFunction } from "react-icons/tb";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import { useTranslation } from "react-i18next";

import InputButton from "./InputButton";
import InputSpec from "./InputSpec";
import InputNumber from "./InputNumber";
import InputSelect from "./InputSelect";
import Block from "./Block";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import DeleteStopButton from "./_DeleteStopButton";
import labelFromFieldName from "../libs/label-from-field-name";

import docUid from "../libs/document-uid";
import sortNumerically from "../libs/sort-numerically";
import { type MappedLayerErrors } from "../libs/definitions";

type ZoomWithStops = {
  stops: [number | undefined, number][];
  base?: number;
};

type ZoomPropertyProps = {
  onChange?(fieldName: string, value: any): unknown;
  onChangeToDataFunction?(...args: unknown[]): unknown;
  onDeleteStop?(...args: unknown[]): unknown;
  onAddStop?(...args: unknown[]): unknown;
  onExpressionClick?(...args: unknown[]): unknown;
  fieldType?: string;
  fieldName: string;
  fieldSpec?: {
    "property-type"?: string;
    "function-type"?: string;
  };
  errors?: MappedLayerErrors;
  value?: ZoomWithStops;
};

const ZoomProperty: React.FC<ZoomPropertyProps> = (props) => {
  const { t } = useTranslation();
  const [refs, setRefs] = useState<{ [key: number]: string }>({});
  const refsRef = useRef<{ [key: number]: string }>({});

  useEffect(() => {
    if (props.value?.stops) {
      let changed = false;
      const newRefs = { ...refsRef.current };
      props.value.stops.forEach((_, idx) => {
        if (!newRefs[idx]) {
          newRefs[idx] = docUid("stop-");
          changed = true;
        }
      });
      if (changed) {
        refsRef.current = newRefs;
        setRefs(newRefs);
      }
    }
  }, [props.value?.stops]);

  const orderStopsByZoom = useCallback((stops: ZoomWithStops["stops"]) => {
    const mappedWithRef = stops
      .map((stop, idx) => ({
        ref: refsRef.current[idx],
        data: stop,
      }))
      .sort((a, b) => sortNumerically(a.data[0]!, b.data[0]!));

    const newRefs: { [key: number]: string } = {};
    mappedWithRef.forEach((stop, idx) => {
      newRefs[idx] = stop.ref;
    });

    refsRef.current = newRefs;
    setRefs(newRefs);

    return mappedWithRef.map((item) => item.data);
  }, []);

  const changeZoomStop = (changeIdx: number, stopData: number | undefined, value: number) => {
    const stops = props.value?.stops.slice(0) || [];
    stops[changeIdx] = [stopData, value];

    const orderedStops = orderStopsByZoom(stops);

    const changedValue = {
      ...props.value,
      stops: orderedStops,
    };
    props.onChange?.(props.fieldName, changedValue);
  };

  const changeBase = (newValue: number | undefined) => {
    const changedValue = {
      ...props.value,
      base: newValue,
    };

    if (changedValue.base === undefined) {
      delete changedValue["base"];
    }
    props.onChange?.(props.fieldName, changedValue);
  };

  const changeDataType = (type: string) => {
    if (type !== "interpolate" && props.onChangeToDataFunction) {
      props.onChangeToDataFunction(type);
    }
  };

  const getDataFunctionTypes = (fieldSpec: ZoomPropertyProps["fieldSpec"]) => {
    if (fieldSpec?.["property-type"] === "data-driven") {
      return ["interpolate", "categorical", "interval", "exponential", "identity"];
    } else {
      return ["interpolate"];
    }
  };

  const zoomFields = props.value?.stops?.map((stop, idx) => {
    const zoomLevel = stop[0];
    const value = stop[1];
    const key = refs[idx] || `fallback-${idx}`;

    return (
      <tr key={key} className="border-b border-border/50 last:border-0">
        <td className="py-2 pr-2 align-top">
          <InputNumber
            aria-label={t("Zoom")}
            value={zoomLevel}
            onChange={(changedStop) => changeZoomStop(idx, changedStop, value)}
            min={0}
            max={22}
          />
        </td>
        <td className="py-2 px-2 align-top">
          <InputSpec
            aria-label={t("Output value")}
            fieldName={props.fieldName}
            fieldSpec={props.fieldSpec as any}
            value={value}
            onChange={(_, newValue) => changeZoomStop(idx, zoomLevel, newValue as number)}
          />
        </td>
        <td className="py-2 pl-2 align-top text-right">
          <DeleteStopButton onClick={() => props.onDeleteStop?.(idx)} />
        </td>
      </tr>
    );
  });

  return (
    <div className="space-y-4">
      <fieldset className="border border-border rounded-md p-4">
        <legend className="text-xs font-semibold px-2 text-muted-foreground">
          {labelFromFieldName(props.fieldName)}
        </legend>
        <div className="space-y-4">
          <Block label={t("Function")}>
            <InputSelect
              value={"interpolate"}
              onChange={(propVal: string) => changeDataType(propVal)}
              title={t("Select a type of data scale (default is 'categorical').")}
              options={getDataFunctionTypes(props.fieldSpec)}
            />
          </Block>
          <Block label={t("Base")}>
            <InputSpec
              fieldName={"base"}
              fieldSpec={latest.function.base as any}
              value={props.value?.base}
              onChange={(_, newValue) => changeBase(newValue as number | undefined)}
            />
          </Block>
          <div className="mt-6">
            <table className="w-full border-collapse">
              <caption className="text-left text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                {t("Stops")}
              </caption>
              <thead>
                <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                  <th className="pb-1 font-bold text-left">{t("Zoom")}</th>
                  <th className="pb-1 font-bold text-left px-2" colSpan={2}>
                    {t("Output value")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">{zoomFields}</tbody>
            </table>
          </div>
          <TooltipProvider>
            <div className="flex justify-end gap-2 pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputButton onClick={() => props.onAddStop?.()}>
                    <PiListPlusBold className="mr-1" />
                    {t("Add stop")}
                  </InputButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("Add stop")}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputButton onClick={() => props.onExpressionClick?.()}>
                    <TbMathFunction className="mr-1" />
                    {t("Convert to expression")}
                  </InputButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("Convert to expression")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </fieldset>
    </div>
  );
};

export default ZoomProperty;

