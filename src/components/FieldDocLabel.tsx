import React, { type ReactNode } from "react";
import { MdInfoOutline, MdHighlightOff } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldDocLabelProps = {
  label: ReactNode;
  fieldSpec?: {
    doc?: string;
  };
  onToggleDoc?(state: boolean): void;
};

const FieldDocLabel: React.FC<FieldDocLabelProps> = ({ label, fieldSpec, onToggleDoc }) => {
  const [open, setOpen] = React.useState(false);

  const handleToggleDoc = () => {
    const nextState = !open;
    setOpen(nextState);
    onToggleDoc?.(nextState);
  };

  const { doc } = fieldSpec || {};

  if (!label) return null;

  return (
    <div className="flex items-center gap-1.5 group/doc">
      <Label className="text-xs font-semibold text-foreground/90 leading-tight">
        {label}
      </Label>
      {doc && (
        <button
          type="button"
          aria-label={open ? "close property documentation" : "open property documentation"}
          className={cn(
            "inline-flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            open
              ? "text-blue-600 bg-blue-50"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
          onClick={handleToggleDoc}
          data-wd-key={typeof label === "string" ? `field-doc-button-${label}` : "field-doc-button"}
        >
          {open ? (
            <MdHighlightOff className="w-4 h-4" />
          ) : (
            <MdInfoOutline className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default FieldDocLabel;

