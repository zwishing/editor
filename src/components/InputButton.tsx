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

const InputButton = React.forwardRef<HTMLButtonElement, InputButtonProps>(({
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
}, ref) => {
  return (
    <Button
      ref={ref}
      id={id}
      title={title}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "h-7 w-auto px-2 text-muted-foreground hover:text-foreground hover:bg-accent/40",
        className
      )}
      data-wd-key={dataWdKey}
      style={style}
      variant="ghost"
    >
      {children}
    </Button>
  );
});

InputButton.displayName = "InputButton";

export default InputButton;
