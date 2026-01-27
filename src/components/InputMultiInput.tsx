import React from "react";
import { cn } from "@/lib/utils";

export type InputMultiInputProps = {
  name?: string
  value: string
  options: any[]
  onChange(...args: unknown[]): unknown
  "aria-label"?: string
};

const InputMultiInput: React.FC<InputMultiInputProps> = ({
  name,
  value,
  options: propsOptions,
  onChange,
  "aria-label": ariaLabel
}) => {
  let options = propsOptions;
  if (options.length > 0 && !Array.isArray(options[0])) {
    options = options.map(v => [v, v]);
  }

  const selectedValue = value || (options.length > 0 ? options[0][0] : undefined);

  return (
    <fieldset className="flex items-center m-0 p-0 border-none min-w-0" aria-label={ariaLabel}>
      {options.map(([val, label]) => {
        const isSelected = val === selectedValue;
        return (
          <label
            key={val}
            className={cn(
              "flex cursor-pointer items-center justify-center rounded-none first:rounded-l-md last:rounded-r-md px-2 h-8 text-xs font-medium transition-colors hover:bg-muted border border-input -ml-px first:ml-0 z-0",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 z-10 border-primary"
                : "bg-background text-muted-foreground"
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              onChange={() => onChange(val)}
              value={val}
              checked={isSelected}
            />
            {label}
          </label>
        );
      })}
    </fieldset>
  );
};

export default InputMultiInput;
