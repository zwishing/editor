import React, { useState, useMemo, useEffect, useId } from "react";
import lodash from "lodash";
import { useActiveColorStore } from "../libs/store/active-color-store";
import { cn } from "@/lib/utils";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "./kibo-ui/color-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [open, setOpen] = useState(false);
  const id = useId();

  const { activeId, activeColor, setActiveColor, updateColor, clearActiveColor } = useActiveColorStore();
  const isActive = activeId === id;

  // The display value is the active color if this component is active, otherwise the prop value.
  // This effectively decouples the UI from the prop loop during editing.
  const displayValue = isActive ? (activeColor || "") : (value || defaultValue || "#000000");

  // Sync prop changes to store if we are NOT active (e.g. undo/redo)
  // If we ARE active, we ignore prop changes to prevent "jump back"
  useEffect(() => {
    if (!isActive && open) {
      // If opened but not yet active in store (edge case), or ensures sync on re-open
      setActiveColor(id, value || defaultValue || "#000000");
    }
  }, [open, value, defaultValue, isActive, id, setActiveColor]);


  // Throttle updates to prevent lag during drag
  const throttledOnChange = useMemo(
    () => lodash.throttle((v: string | undefined) => onChange(v), 1000 / 30),
    [onChange]
  );

  // Cancel throttle on unmount
  useEffect(() => {
    return () => {
      throttledOnChange.cancel();
    };
  }, [throttledOnChange]);

  const handleUpdate = (v: any, formatted?: string) => {
    // If we have a formatted string from the picker (based on mode), use it directly.
    // This allows the input to match the picker's mode (Hex, HSL, etc.)
    if (formatted) {
      updateColor(formatted);
      throttledOnChange(formatted);
      return;
    }

    // Fallback for safety or initial loads
    // Convert [r, g, b, a] to rgba string for compatibility
    const [r, g, b, rawA] = v;
    // Round RGB to integers, keep Alpha as float
    const safeR = Math.round(r);
    const safeG = Math.round(g);
    const safeB = Math.round(b);
    const a = (typeof rawA === "number" && !isNaN(rawA)) ? rawA : 1;
    const newValue = `rgba(${safeR}, ${safeG}, ${safeB}, ${a})`;

    updateColor(newValue);
    throttledOnChange(newValue);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen) {
            setActiveColor(id, value || defaultValue || "#000000");
          } else {
            // When closing, ensure final value is committed and clear store
            if (isActive) {
              onChange(activeColor || undefined);
              clearActiveColor();
            }
          }
        }}
      >
        <PopoverTrigger asChild>
          <div
            className="h-6 w-6 shrink-0 rounded border border-input shadow-sm cursor-pointer"
            style={{ backgroundColor: displayValue }}
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4"
          align="start"
        // Prevent auto-focus stealing if needed, but standard behavior is fine
        >
          <ColorPicker
            value={displayValue}
            onChange={handleUpdate}
            className="w-64"
          >
            <ColorPickerSelection className="h-48 w-full" />
            <div className="flex flex-col gap-2">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerOutput />
              <ColorPickerEyeDropper />
            </div>
            <ColorPickerFormat />
          </ColorPicker>
        </PopoverContent>
      </Popover>

      <input
        aria-label={ariaLabel}
        spellCheck="false"
        autoComplete="off"
        className={cn(
          "h-8 w-full bg-transparent px-2 text-[11px] focus-visible:outline-none",
          "border border-input rounded shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
        )}
        style={style}
        name={name}
        placeholder={defaultValue}
        value={displayValue}
        onChange={(e) => {
          const val = e.target.value;
          if (!isActive) {
            setActiveColor(id, val);
          } else {
            updateColor(val);
          }
          throttledOnChange(val === "" ? undefined : val);
        }}
        onFocus={() => {
          setActiveColor(id, value || defaultValue || "#000000");
        }}
        onBlur={() => {
          // Commit final value
          onChange(activeColor === "" ? undefined : activeColor);
          clearActiveColor();
        }}
      />
    </div>
  );
};

export default InputColor;
