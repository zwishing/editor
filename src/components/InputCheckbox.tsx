import React from "react";
import { Checkbox } from "@/components/ui/checkbox";


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
    />
  );
};

export default InputCheckbox;
