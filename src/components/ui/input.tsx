import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    // Prevent "controlled to uncontrolled" warning by ensuring value is defined
    // if it looks like a controlled input (no defaultValue present, or explicit value usage).
    // We default to "" if value is undefined, unless defaultValue is provided (uncontrolled mode).
    const safeValue = value === undefined && props.defaultValue === undefined ? "" : value;

    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={safeValue}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
