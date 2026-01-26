import React, { useState, useEffect, useCallback, useRef } from "react";
import { PiListPlusBold } from "react-icons/pi";
import { TbMathFunction } from "react-icons/tb";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";

import InputButton from "./InputButton";
import InputSpec from "./InputSpec";
import InputNumber from "./InputNumber";
import InputString from "./InputString";
import InputSelect from "./InputSelect";
import Block from "./Block";
import docUid from "../libs/document-uid";
import sortNumerically from "../libs/sort-numerically";
import { findDefaultFromSpec } from "../libs/spec-helper";
import { useTranslation } from "react-i18next";

import labelFromFieldName from "../libs/label-from-field-name";
import DeleteStopButton from "./_DeleteStopButton";
import { type MappedLayerErrors } from "../libs/definitions";

export type Stop = [
  {
    zoom: number;
    value: number;
  },
  number
];

type DataPropertyValue = {
  default?: any;
  property?: string;
  base?: number;
  type?: string;
  stops: Stop[];
};

type DataPropertyProps = {
  onChange?(fieldName: string, value: any): unknown;
  onDeleteStop?(...args: unknown[]): unknown;
  onAddStop?(...args: unknown[]): unknown;
  onExpressionClick?(...args: unknown[]): unknown;
  onChangeToZoomFunction?(...args: unknown[]): unknown;
  fieldName: string;
  fieldType?: string;
  fieldSpec?: any;
  value?: DataPropertyValue;
  errors?: MappedLayerErrors;
};

const DataProperty: React.FC<DataPropertyProps> = (props) => {
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

  const getFieldFunctionType = (fieldSpec: any) => {
    if (fieldSpec.expression.interpolated) {
      return "exponential";
    }
    if (fieldSpec.type === "number") {
      return "interval";
    }
    return "categorical";
  };

  const getDataFunctionTypes = (fieldSpec: any) => {
    if (fieldSpec.expression.interpolated) {
      return ["interpolate", "categorical", "interval", "exponential", "identity"];
    } else {
      return ["categorical", "interval", "identity"];
    }
  };

  const orderStopsByZoom = useCallback((stops: Stop[]) => {
    const mappedWithRef = stops
      .map((stop, idx) => ({
        ref: refsRef.current[idx],
        data: stop,
      }))
      .sort((a, b) => sortNumerically(a.data[0].zoom, b.data[0].zoom));

    const newRefs: { [key: number]: string } = {};
    mappedWithRef.forEach((stop, idx) => {
      newRefs[idx] = stop.ref;
    });

    refsRef.current = newRefs;
    setRefs(newRefs);

    return mappedWithRef.map((item) => item.data);
  }, []);

  const onValueChange = useCallback((fieldName: string, value: any) => {
    let newValue;
    if (value.type === "identity") {
      newValue = {
        type: value.type,
        property: value.property,
      };
    } else {
      const stopValue = value.type === "categorical" ? "" : 0;
      newValue = {
        property: "",
        type: value.type,
        stops: [
          [{ zoom: 6, value: stopValue }, findDefaultFromSpec(props.fieldSpec)],
          [{ zoom: 10, value: stopValue }, findDefaultFromSpec(props.fieldSpec)],
        ],
        ...value,
      };
    }
    props.onChange?.(fieldName, newValue);
  }, [props.onChange, props.fieldSpec]);

  const changeStop = (changeIdx: number, stopData: { zoom: number | undefined; value: number }, value: number) => {
    const stops = props.value?.stops.slice(0) || [];
    stops[changeIdx] = [
      {
        value: stopData.value,
        zoom: stopData.zoom === undefined ? 0 : stopData.zoom,
      },
      value,
    ];

    const orderedStops = orderStopsByZoom(stops);

    const changedValue = {
      ...props.value,
      stops: orderedStops,
    };
    onValueChange(props.fieldName, changedValue);
  };

  const changeBase = (newValue: number | undefined) => {
    const changedValue: any = {
      ...props.value,
      base: newValue,
    };

    if (changedValue.base === undefined) {
      delete changedValue["base"];
    }
    props.onChange?.(props.fieldName, changedValue);
  };

  const changeDataType = (propVal: string) => {
    if (propVal === "interpolate" && props.onChangeToZoomFunction) {
      props.onChangeToZoomFunction();
    } else {
      onValueChange(props.fieldName, {
        ...props.value,
        type: propVal,
      });
    }
  };

  const changeDataProperty = (propName: "property" | "default", propVal: any) => {
    const changedValue = { ...props.value } as any;
    if (propVal) {
      changedValue[propName] = propVal;
    } else {
      delete changedValue[propName];
    }
    onValueChange(props.fieldName, changedValue);
  };

  const currentType = props.value?.type || getFieldFunctionType(props.fieldSpec);

  const dataFields = props.value?.stops?.map((stop, idx) => {
    const zoomLevel = typeof stop[0] === "object" ? stop[0].zoom : undefined;
    const key = refs[idx] || `fallback-${idx}`;
    const dataLevel = typeof stop[0] === "object" ? stop[0].value : stop[0];
    const value = stop[1];

    const dataProps = {
      "aria-label": t("Input value"),
      label: t("Data value"),
      value: dataLevel as any,
      onChange: (newData: string | number | undefined) =>
        changeStop(idx, { zoom: zoomLevel, value: newData as number }, value),
    };

    const dataInput =
      currentType === "categorical" ? (
        <InputString {...dataProps} />
      ) : (
        <InputNumber {...dataProps} />
      );

    const zoomInput = zoomLevel !== undefined ? (
      <InputNumber
        aria-label="Zoom"
        value={zoomLevel}
        onChange={(newZoom) => changeStop(idx, { zoom: newZoom, value: dataLevel as number }, value)}
        min={0}
        max={22}
      />
    ) : null;

    return (
      <tr key={key} className="border-b border-border/50 last:border-0">
        <td className="py-2 pr-2 align-top">{zoomInput}</td>
        <td className="py-2 px-2 align-top">{dataInput}</td>
        <td className="py-2 px-2 align-top">
          <InputSpec
            aria-label={t("Output value")}
            fieldName={props.fieldName}
            fieldSpec={props.fieldSpec}
            value={value}
            onChange={(_, newValue) => changeStop(idx, { zoom: zoomLevel, value: dataLevel as number }, newValue as number)}
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
          <Block label={t("Function")} key="function">
            <InputSelect
              value={currentType}
              onChange={(propVal: string) => changeDataType(propVal)}
              title={t("Select a type of data scale (default is 'categorical').")}
              options={getDataFunctionTypes(props.fieldSpec)}
            />
          </Block>

          {currentType !== "identity" && (
            <Block label={t("Base")} key="base">
              <InputSpec
                fieldName={"base"}
                fieldSpec={latest.function.base as any}
                value={props.value?.base}
                onChange={(_, newValue) => changeBase(newValue as number)}
              />
            </Block>
          )}

          <Block label={t("Property")} key="property">
            <InputString
              value={props.value?.property}
              title={t("Input a data property to base styles off of.")}
              onChange={(propVal) => changeDataProperty("property", propVal)}
            />
          </Block>

          {dataFields && (
            <Block label={t("Default")} key="default">
              <InputSpec
                fieldName={props.fieldName}
                fieldSpec={props.fieldSpec}
                value={props.value?.default}
                onChange={(_, propVal) => changeDataProperty("default", propVal)}
              />
            </Block>
          )}

          {dataFields && (
            <div className="mt-6">
              <table className="w-full border-collapse">
                <caption className="text-left text-xs font-bold mb-2 uppercase tracking-wider text-muted-foreground">
                  {t("Stops")}
                </caption>
                <thead>
                  <tr className="text-[10px] uppercase text-muted-foreground border-b border-border">
                    <th className="pb-1 font-bold text-left">{t("Zoom")}</th>
                    <th className="pb-1 font-bold text-left px-2">{t("Input value")}</th>
                    <th className="pb-1 font-bold text-left px-2" colSpan={2}>
                      {t("Output value")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">{dataFields}</tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {dataFields && (
              <InputButton onClick={() => props.onAddStop?.()}>
                <PiListPlusBold className="mr-1" />
                {t("Add stop")}
              </InputButton>
            )}
            <InputButton onClick={() => props.onExpressionClick?.()}>
              <TbMathFunction className="mr-1" />
              {t("Convert to expression")}
            </InputButton>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default DataProperty;

