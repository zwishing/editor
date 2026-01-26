import React, { useState, useRef, useMemo, useEffect } from "react";
import Color from "color";
import ChromePicker from "react-color/lib/components/chrome/Chrome";
import { type ColorResult } from "react-color";
import lodash from "lodash";
import { cn } from "@/lib/utils";

function formatColor(color: ColorResult): string {
  const rgb = color.rgb;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
}

export type InputColorProps = {
  onChange(...args: unknown[]): unknown
  name?: string
  value?: string
  doc?: string
  style?: React.CSSProperties
  default?: string
  "aria-label"?: string
};

const InputColor: React.FC<InputColorProps> = ({
  onChange,
  name,
  value,
  style,
  default: defaultValue,
  "aria-label": ariaLabel
}) => {
  const [pickerOpened, setPickerOpened] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const throttledOnChange = useMemo(
    () => lodash.throttle((v: string) => onChange(v), 1000 / 30),
    [onChange]
  );

  useEffect(() => {
    return () => {
      throttledOnChange.cancel();
    };
  }, [throttledOnChange]);

  const calcPickerOffset = () => {
    if (colorInputRef.current) {
      const pos = colorInputRef.current.getBoundingClientRect();
      return {
        top: pos.top,
        left: pos.left + 196,
      };
    }
    return { top: 160, left: 555 };
  };

  const currentColor = useMemo(() => {
    try {
      return Color(value).rgb();
    } catch (_err) {
      return Color("rgb(255,255,255)");
    }
  }, [value]);

  const offset = calcPickerOffset();
  const currentChromeColor = {
    r: currentColor.red(),
    g: currentColor.green(),
    b: currentColor.blue(),
    a: currentColor.alpha()
  };

  const handleTogglePicker = () => setPickerOpened(!pickerOpened);

  return (
    <div className="relative flex w-full items-center gap-2">
      {pickerOpened && (
        <div
          className="fixed z-50"
          style={{ left: offset.left, top: offset.top }}
        >
          <ChromePicker
            color={currentChromeColor}
            onChange={(c) => throttledOnChange(formatColor(c))}
          />
          <div
            className="fixed inset-0 -z-10"
            onClick={handleTogglePicker}
          />
        </div>
      )}
      <div
        className="h-6 w-6 shrink-0 rounded border border-input shadow-sm"
        style={{ backgroundColor: value }}
      />
      <input
        aria-label={ariaLabel}
        spellCheck="false"
        autoComplete="off"
        className={cn(
          "h-8 w-full bg-transparent px-2 text-[11px] focus-visible:outline-none",
          "border border-input rounded shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
        )}
        ref={colorInputRef}
        onClick={handleTogglePicker}
        style={style}
        name={name}
        placeholder={defaultValue}
        value={value ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.value)}
      />
    </div>
  );
};

export default InputColor;
