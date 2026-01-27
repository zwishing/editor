import React, { useCallback } from "react";
import capitalize from "lodash.capitalize";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";

import InputString from "./InputString";
import InputNumber from "./InputNumber";
import InputButton from "./InputButton";
import InputEnum from "./InputEnum";
import InputUrl from "./InputUrl";
import InputColor from "./InputColor";

export type InputDynamicArrayProps = {
  value?: (string | number | undefined)[];
  type?: "url" | "number" | "enum" | "string" | "color";
  default?: (string | number | undefined)[];
  onChange?(values: (string | number | undefined)[] | undefined): unknown;
  style?: React.CSSProperties;
  fieldSpec?: {
    values?: any;
  };
  "aria-label"?: string;
  label: string;
};

const DeleteValueInputButton: React.FC<{ onClick?(): void }> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <InputButton
      className="maputnik-delete-stop flex items-center justify-center p-1"
      onClick={onClick}
      title={t("Remove array item")}
    >
      <MdDelete className="w-4 h-4" />
    </InputButton>
  );
};

const InputDynamicArray: React.FC<InputDynamicArrayProps> = (props) => {
  const { t } = useTranslation();
  const values = props.value || props.default || [];

  const changeValue = useCallback(
    (idx: number, newValue: string | number | undefined) => {
      const nextValues = [...values];
      nextValues[idx] = newValue;
      props.onChange?.(nextValues);
    },
    [values, props.onChange]
  );

  const addValue = useCallback(() => {
    const nextValues = [...values];
    if (props.type === "number") {
      nextValues.push(0);
    } else if (props.type === "url") {
      nextValues.push("");
    } else if (props.type === "enum") {
      const firstValue = Object.keys(props.fieldSpec?.values || {})[0];
      nextValues.push(firstValue);
    } else if (props.type === "color") {
      nextValues.push("#000000");
    } else {
      nextValues.push("");
    }
    props.onChange?.(nextValues);
  }, [values, props.type, props.fieldSpec, props.onChange]);

  const deleteValue = useCallback(
    (idx: number) => {
      const nextValues = [...values];
      nextValues.splice(idx, 1);
      props.onChange?.(nextValues.length > 0 ? nextValues : undefined);
    },
    [values, props.onChange]
  );

  const inputs = values.map((v, i) => {
    let input;
    const commonProps = {
      value: v as any,
      onChange: (next: any) => changeValue(i, next),
      "aria-label": props["aria-label"] || props.label,
    };

    if (props.type === "url") {
      input = <InputUrl {...commonProps} />;
    } else if (props.type === "number") {
      input = <InputNumber {...commonProps} className="w-24" />;
    } else if (props.type === "enum") {
      const options = Object.keys(props.fieldSpec?.values || {}).map((ov) => [ov, capitalize(ov)]) as [
        string,
        string
      ][];
      input = <InputEnum options={options} {...commonProps} />;
    } else if (props.type === "color") {
      input = <InputColor {...commonProps} />;
    } else {
      input = <InputString {...commonProps} />;
    }

    return (
      <div key={i} className="flex items-center gap-2 group">
        <div className="w-auto min-w-0">{input}</div>
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <DeleteValueInputButton onClick={() => deleteValue(i)} />
        </div>
      </div>
    );
  });

  return (
    <div className="space-y-2">
      <div className="space-y-2">{inputs}</div>
      <InputButton className="w-full justify-center !py-1 text-xs" onClick={addValue}>
        {t("Add value")}
      </InputButton>
    </div>
  );
};

export default InputDynamicArray;

