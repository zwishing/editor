import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type InputSelectProps = {
  value: string;
  "data-wd-key"?: string;
  options: [string, any][] | string[];
  style?: React.CSSProperties;
  onChange(value: string): void;
  title?: string;
  "aria-label"?: string;
  className?: string;
};

const InputSelect: React.FC<InputSelectProps> = ({
  value,
  "data-wd-key": dataWdKey,
  options: propsOptions,
  style,
  onChange,
  title,
  "aria-label": ariaLabel,
  className,
}) => {
  let options = propsOptions;
  if (options.length > 0 && !Array.isArray(options[0])) {
    options = options.map((v) => [v, v]) as [string, any][];
  }

  // Shadcn/Radix Select doesn't support empty string as value for SelectItem
  const EMPTY_VALUE = "__MAPUTNIK_EMPTY__";
  const mappedValue = value === "" ? EMPTY_VALUE : value;

  const handleValueChange = (newVal: string) => {
    onChange(newVal === EMPTY_VALUE ? "" : newVal);
  };

  return (
    <Select value={mappedValue} onValueChange={handleValueChange}>
      <SelectTrigger
        data-wd-key={dataWdKey}
        style={style}
        title={title}
        aria-label={ariaLabel}
        className={cn("w-full h-8 text-[11px] px-2", className)}
      >
        <SelectValue placeholder="Select option..." />
      </SelectTrigger>
      <SelectContent className="z-[3000]">
        {(options as [string, any][]).map(([val, label]) => {
          const itemValue = val === "" ? EMPTY_VALUE : val;
          return (
            <SelectItem key={itemValue} value={itemValue} className="text-[11px]">
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default InputSelect;

