import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type InputButtonProps = {
  "data-wd-key"?: string
  "aria-label"?: string
  onClick?(...args: unknown[]): unknown
  style?: React.CSSProperties
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  id?: string
  title?: string
};

const InputButton: React.FC<InputButtonProps> = ({
  id,
  title,
  type,
  onClick,
  disabled,
  "aria-label": ariaLabel,
  className,
  "data-wd-key": dataWdKey,
  style,
  children
}) => {
  return (
    <Button
      id={id}
      title={title}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "h-auto px-[6px] py-[6px] text-[11px] font-normal rounded-full",
        className
      )}
      data-wd-key={dataWdKey}
      style={style}
      variant="outline"
    >
      {children}
    </Button>
  );
};

export default InputButton;
