import React, { useCallback } from "react";
import InputAutocomplete from "./InputAutocomplete";

export type InputFontProps = {
  name: string;
  value?: string[];
  default?: string[];
  fonts?: any[];
  style?: React.CSSProperties;
  onChange(values: string[]): void;
  "aria-label"?: string;
};

const InputFont: React.FC<InputFontProps> = ({
  name,
  value,
  default: defaultValue,
  fonts = [],
  style,
  onChange,
  "aria-label": ariaLabel,
}) => {
  const getValues = () => {
    const out = value || defaultValue || [];
    // Always put a "" in the last field to allow adding entries
    if (out[out.length - 1] !== "") {
      return [...out, ""];
    }
    return out;
  };

  const currentValues = getValues();

  const changeFont = useCallback(
    (idx: number, newValue: string | undefined) => {
      const nextValues = [...currentValues];
      nextValues[idx] = newValue || "";
      const filteredValues = nextValues.filter((v) => v !== undefined && v !== "");
      onChange(filteredValues);
    },
    [currentValues, onChange]
  );

  const inputs = currentValues.map((val, i) => (
    <div key={i} className="mb-2 last:mb-0">
      <InputAutocomplete
        aria-label={ariaLabel || name}
        value={val}
        options={fonts.map((f) => [f, f])}
        onChange={(v) => changeFont(i, v)}
      />
    </div>
  ));

  return (
    <div className="space-y-2" style={style}>
      {inputs}
    </div>
  );
};

export default InputFont;

