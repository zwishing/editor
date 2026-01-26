import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type InputStringProps = {
  "data-wd-key"?: string
  value?: string
  style?: React.CSSProperties
  default?: string
  onChange?(value: string | undefined): unknown
  onInput?(value: string | undefined): unknown
  multi?: boolean
  required?: boolean
  disabled?: boolean
  spellCheck?: boolean
  "aria-label"?: string
  title?: string
};

const InputString: React.FC<InputStringProps> = ({
  "aria-label": ariaLabel,
  "data-wd-key": dataWdKey,
  spellCheck,
  disabled,
  style,
  value: propsValue,
  default: placeholder,
  title,
  onChange,
  onInput,
  multi,
  required
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(propsValue || "");

  useEffect(() => {
    if (!editing) {
      setValue(propsValue || "");
    }
  }, [propsValue, editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setEditing(true);
    setValue(newVal);
    if (onInput) onInput(newVal);
  };

  const handleBlur = () => {
    if (value !== propsValue) {
      setEditing(false);
      if (onChange) onChange(value);
    } else {
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !multi && onChange) {
      onChange(value);
    }
  };

  const commonProps = {
    "aria-label": ariaLabel,
    "data-wd-key": dataWdKey,
    spellCheck: spellCheck !== undefined ? spellCheck : !multi,
    disabled,
    style,
    value,
    placeholder,
    title,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    required,
    className: cn(
      "w-full bg-transparent px-3 py-1",
      disabled && "cursor-not-allowed opacity-50"
    ),
  };

  if (multi) {
    return <Textarea {...commonProps} />;
  }

  return <Input {...commonProps} />;
};

export default InputString;
