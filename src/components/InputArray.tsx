import React, { useState, useEffect } from "react";
import InputString from "./InputString";
import InputNumber from "./InputNumber";

export type InputArrayProps = {
  value?: (string | number | undefined)[];
  type?: string;
  length?: number;
  default?: (string | number | undefined)[];
  onChange?(value: (string | number | undefined)[] | undefined): unknown;
  "aria-label"?: string;
  label?: string;
};

const InputArray: React.FC<InputArrayProps> = ({
  value: propsValue = [],
  type,
  length = 0,
  default: defaultValues = [],
  onChange,
  "aria-label": ariaLabel,
  label,
}) => {
  const [internalValue, setInternalValue] = useState<(string | number | undefined)[]>([]);

  useEffect(() => {
    const isDifferent = JSON.stringify(propsValue) !== JSON.stringify(internalValue);
    if (isDifferent) {
      setInternalValue(propsValue.slice(0));
    }
  }, [propsValue, internalValue]);

  const isComplete = (vals: (string | number | undefined)[]) => {
    if (vals.length < length) return false;
    return Array(length)
      .fill(null)
      .every((_, i) => {
        const val = vals[i];
        return !(val === undefined || val === "");
      });
  };

  const changeValue = (idx: number, newValue: string | number | undefined) => {
    const nextValue = [...internalValue];
    nextValue[idx] = newValue;

    setInternalValue(nextValue);

    if (isComplete(nextValue)) {
      onChange?.(nextValue);
    } else {
      onChange?.(undefined);
    }
  };

  const containsValues =
    internalValue.length > 0 && !internalValue.every((val) => val === "" || val === undefined);

  const inputs = Array(length)
    .fill(null)
    .map((_, i) => {
      const commonProps = {
        required: containsValues,
        onChange: (v: any) => changeValue(i, v),
        "aria-label": ariaLabel || label,
      };

      if (type === "number") {
        return (
          <InputNumber
            key={i}
            {...commonProps}
            default={containsValues || !defaultValues ? undefined : (defaultValues[i] as number)}
            value={internalValue[i] as number}
          />
        );
      } else {
        return (
          <InputString
            key={i}
            {...commonProps}
            default={containsValues || !defaultValues ? undefined : (defaultValues[i] as string)}
            value={internalValue[i] as string}
          />
        );
      }
    });

  return <div className="flex flex-wrap gap-2">{inputs}</div>;
};

export default InputArray;

