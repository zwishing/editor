import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

export type InputNumberProps = {
  value?: number
  default?: number
  min?: number
  max?: number
  onChange?(value: number | undefined): unknown
  allowRange?: boolean
  rangeStep?: number
  "data-wd-key"?: string
  required?: boolean
  "aria-label"?: string
  className?: string
};

const InputNumber: React.FC<InputNumberProps> = ({
  value: propsValue,
  default: defaultValue,
  min,
  max,
  onChange,
  allowRange,
  rangeStep = 1,
  "data-wd-key": dataWdKey,
  required,
  "aria-label": ariaLabel,
  className
}) => {
  const [editing, setEditing] = useState(false);
  const [editingRange, setEditingRange] = useState(false);
  const [value, setValue] = useState(propsValue);
  const [dirtyValue, setDirtyValue] = useState<number | string | undefined>(propsValue);

  const [keyboardEvent, setKeyboardEvent] = useState(false);

  useEffect(() => {
    if (!editing) {
      setValue(propsValue);
      setDirtyValue(propsValue);
    }
  }, [propsValue, editing]);

  const isValid = useCallback((v: number | string | undefined) => {
    if (v === undefined || v === "") return true;
    const num = +v;
    if (isNaN(num)) return false;
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    return true;
  }, [min, max]);

  const changeValue = useCallback((newValue: number | string | undefined) => {
    const numValue = (newValue === "" || newValue === undefined) ? undefined : +newValue;
    const hasChanged = propsValue !== numValue;

    if (isValid(numValue) && hasChanged) {
      if (onChange) onChange(numValue);
      setValue(numValue);
    } else if (!isValid(numValue) && hasChanged) {
      setValue(undefined);
    }
    setDirtyValue(newValue === "" ? undefined : newValue);
  }, [propsValue, onChange, isValid]);

  const resetValue = useCallback(() => {
    setEditing(false);
    if (!value) return;

    if (!isValid(value)) {
      if (isValid(propsValue)) {
        changeValue(propsValue);
        setDirtyValue(propsValue);
      } else {
        changeValue(undefined);
        setDirtyValue(undefined);
      }
    }
  }, [value, propsValue, isValid, changeValue]);

  const onChangeRange = (values: number[]) => {
    if (!values.length) return;
    let val = values[0];

    if (rangeStep) {
      if (keyboardEvent) {
        if (val < +(dirtyValue || 0)) {
          val = (value || 0) - rangeStep;
        } else {
          val = (value || 0) + rangeStep;
        }
      } else {
        const snap = val % rangeStep;
        if (snap < rangeStep / 2) {
          val = val - snap;
        } else {
          val = val + (rangeStep - snap);
        }
      }
    }

    setKeyboardEvent(false);
    val = Math.max(min ?? -Infinity, Math.min(max ?? Infinity, val));
    setValue(val);
    setDirtyValue(val);
    if (onChange) onChange(val);
  };

  const getRangeValue = (val: number | string | undefined, fallback: number) => {
    if (val === undefined || val === "") return fallback;
    const parsed = +val;
    return isNaN(parsed) ? fallback : Math.max(min ?? -Infinity, Math.min(max ?? Infinity, parsed));
  };

  const isRangeMode = min !== undefined && max !== undefined && allowRange;
  const rangeState = useMemo(() => {
    if (!isRangeMode) {
      return null;
    }
    const displayValue = editing ? dirtyValue : value;
    const inputValue = editingRange ? value : displayValue;
    const fallbackValue = defaultValue ?? min!;
    const sliderValue = getRangeValue(editingRange ? value : displayValue, fallbackValue);
    return {
      displayValue,
      inputValue,
      sliderValue,
      sliderValueArray: [sliderValue],
    };
  }, [isRangeMode, editing, dirtyValue, editingRange, value, defaultValue, min]);

  if (isRangeMode) {
    const { inputValue, sliderValueArray } = rangeState!;

    return (
      <div className="flex w-full items-center gap-2">
        <Slider
          className="flex-1"
          min={min}
          max={max}
          step={rangeStep}
          value={sliderValueArray}
          onValueChange={onChangeRange}
          onKeyDown={() => setKeyboardEvent(true)}
          onPointerDown={() => {
            setEditing(true);
            setEditingRange(true);
          }}
          onPointerUp={() => {
            setEditing(false);
            setEditingRange(false);
          }}
          onBlur={() => {
            setEditing(false);
            setEditingRange(false);
            setDirtyValue(value);
          }}
          data-wd-key={`${dataWdKey}-range`}
          aria-label={ariaLabel}
        />
        <Input
          type="text"
          spellCheck="false"
          className="w-16 h-8 text-[11px]"
          placeholder={defaultValue?.toString()}
          value={inputValue === undefined ? "" : inputValue}
          onFocus={() => setEditing(true)}
          onChange={(e) => changeValue(e.target.value)}
          onBlur={() => {
            setEditing(false);
            resetValue();
          }}
          data-wd-key={`${dataWdKey}-text`}
          aria-label={ariaLabel}
        />
      </div>
    );
  }

  const displayValue = editing ? dirtyValue : value;

  return (
    <Input
      aria-label={ariaLabel}
      spellCheck="false"
      className={cn("w-full h-8 text-[11px]", className)}
      placeholder={defaultValue?.toString()}
      value={displayValue === undefined ? "" : displayValue}
      onChange={(e) => changeValue(e.target.value)}
      onFocus={() => setEditing(true)}
      onBlur={resetValue}
      required={required}
      data-wd-key={dataWdKey}
    />
  );
};

export default InputNumber;
