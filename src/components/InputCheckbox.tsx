import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export type InputCheckboxProps = {
  value?: boolean
  style?: React.CSSProperties
  onChange(...args: unknown[]): unknown
};

const InputCheckbox: React.FC<InputCheckboxProps> = ({
  value = false,
  onChange,
  style
}) => {
  const onCheckedChange = () => {
    onChange(!value);
  };

  return (
    <Checkbox
      checked={value}
      onCheckedChange={onCheckedChange}
      style={style}
      className={cn(
        "h-[24px] w-[24px] rounded-[4px] border-[#E2E8F0] bg-white",
        "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600",
        "focus-visible:shadow-[0_0_0_2px_rgba(22,119,255,0.12)] focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0",
        "disabled:opacity-100"
      )}
    />
  );
};

export default InputCheckbox;
