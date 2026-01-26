import React, { useState, useRef, type CSSProperties, type PropsWithChildren, type SyntheticEvent } from "react";
import classnames from "classnames";
import FieldDocLabel from "./FieldDocLabel";
import Doc from "./Doc";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export type BlockProps = PropsWithChildren & {
  "data-wd-key"?: string
  label?: string
  action?: React.ReactElement
  style?: CSSProperties
  onChange?(...args: unknown[]): unknown
  fieldSpec?: object
  wideMode?: boolean
  inline?: boolean
  error?: { message: string }
};

/** Wrap a component with a label */
const Block: React.FC<BlockProps> = (props) => {
  const [showDoc, setShowDoc] = useState(false);
  const blockElRef = useRef<HTMLDivElement>(null);

  const onToggleDoc = (val: boolean) => {
    setShowDoc(val);
  };

  /**
   * Some fields for example <InputColor/> bind click events inside the element
   * to close the picker. This in turn propagates to the <label/> element
   * causing the picker to reopen. This causes a scenario where the picker can
   * never be closed once open.
   */
  const onLabelClick = (event: SyntheticEvent<any, any>) => {
    const el = event.nativeEvent.target as Node;
    const contains = blockElRef.current?.contains(el);

    if ((event.nativeEvent.target as HTMLElement).nodeName !== "INPUT" && !contains) {
      event.stopPropagation();
    }
    if ((event.nativeEvent.target as HTMLElement).nodeName !== "A") {
      event.preventDefault();
    }
  };

  const containerClasses = classnames(
    "maputnik-input-block", // Keep for legacy global styles if any
    "border-none shadow-none bg-transparent p-0 m-0", // Override standard Card styles to fit existing layout density
    {
      "maputnik-input-block--wide block w-full": props.wideMode,
      "maputnik-input-block--inline flex items-center gap-2": props.inline,
      "maputnik-action-block": props.action,
      "maputnik-input-block--error text-destructive": props.error,
      "flex flex-wrap items-center my-3": !props.wideMode && !props.inline, // Default layout from SCSS (.maputnik-input-block)
    }
  );

  return (
    <Card
      style={props.style}
      data-wd-key={props["data-wd-key"]}
      className={containerClasses}
      onClick={onLabelClick}
    >
      <div className={classnames("maputnik-input-block-label shrink-0", {
        "w-[70px]": !props.wideMode && !props.inline && !props.action,
        "w-[80px] mb-3": !!props.action && !props.inline,
        "w-auto min-w-[80px] mb-0": props.inline,
        "w-auto flex-1": props.wideMode
      })}>
        {props.fieldSpec ? (
          <FieldDocLabel
            label={props.label}
            onToggleDoc={onToggleDoc}
            fieldSpec={props.fieldSpec}
          // Pass Label component if FieldDocLabel supports it, otherwise it renders its own
          />
        ) : (
          <Label className={classnames("text-inherit font-medium text-xs", {
            "text-destructive": props.error
          })}>
            {props.label}
          </Label>
        )}
      </div>

      <div className={classnames("maputnik-input-block-action shrink-0", {
        "w-auto text-right": !props.inline
      })}>
        {props.action}
      </div>

      <div
        className={classnames("maputnik-input-block-content", {
          "flex-1 min-w-0 w-auto": !props.wideMode && !props.inline,
          "block w-auto flex-1": props.wideMode,
          "flex-1 w-auto": props.inline
        })}
        ref={blockElRef}
      >
        {props.children}
      </div>

      {props.fieldSpec && (
        <div
          className="maputnik-doc-inline w-full mt-2"
          style={{ display: showDoc ? "" : "none" }}
        >
          <Doc fieldSpec={props.fieldSpec} />
        </div>
      )}
    </Card>
  );
};

export default Block;
