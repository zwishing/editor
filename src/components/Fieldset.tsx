import React, { type PropsWithChildren, type ReactElement } from "react";
import classnames from "classnames";
import FieldDocLabel from "./FieldDocLabel";
import Doc from "./Doc";
import { Label } from "@/components/ui/label";

export type FieldsetProps = PropsWithChildren & {
  label?: string;
  fieldSpec?: { doc?: string };
  action?: ReactElement;
  error?: { message: string };
};

const Fieldset: React.FC<FieldsetProps> = (props) => {
  const [showDoc, setShowDoc] = React.useState(false);

  const onToggleDoc = (val: boolean) => {
    setShowDoc(val);
  };

  return (
    <div
      className={classnames("mb-6 space-y-3", {
        "text-destructive": props.error,
      })}
      role="group"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-1 mb-2">
        <div className="flex-1 min-w-0">
          {props.fieldSpec ? (
            <FieldDocLabel
              label={props.label}
              onToggleDoc={onToggleDoc}
              fieldSpec={props.fieldSpec}
            />
          ) : (
            <Label className="text-sm font-bold tracking-tight uppercase text-muted-foreground/80">
              {props.label}
            </Label>
          )}
        </div>
        {props.action && <div className="shrink-0">{props.action}</div>}
      </div>

      <div className="space-y-4">{props.children}</div>

      {props.fieldSpec && (
        <div className="mt-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded" style={{ display: showDoc ? "" : "none" }}>
          <Doc fieldSpec={props.fieldSpec} />
        </div>
      )}
    </div>
  );
};

export default Fieldset;

