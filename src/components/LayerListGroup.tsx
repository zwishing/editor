import React from "react";
import { MdFolder } from "react-icons/md";
import Collapser from "./Collapser";
import { cn } from "@/lib/utils";

type LayerListGroupProps = {
  title: string
  "data-wd-key"?: string
  isActive: boolean
  onActiveToggle(...args: unknown[]): unknown
  "aria-controls"?: string
};

const LayerListGroup: React.FC<LayerListGroupProps> = (props) => {
  const {
    title,
    "data-wd-key": wdKey,
    isActive,
    onActiveToggle,
    "aria-controls": ariaControls,
  } = props;

  return (
    <li className="mt-2 mb-1">
      <div
        className={cn(
          "border border-transparent text-sm font-semibold text-foreground/80 bg-panel-surface select-none py-2 px-3 focus-within:border-panel-accent focus-within:shadow-[inset_0_0_0_1px_var(--color-panel-accent)] flex flex-row items-center cursor-pointer hover:bg-accent/20 rounded-md mx-1 transition-colors",
          isActive && "text-foreground"
        )}
        data-wd-key={"layer-list-group:" + wdKey}
        onClick={() => onActiveToggle(!isActive)}
      >
        <span className="inline-flex items-center text-muted-foreground mr-1.5" aria-hidden="true">
          <MdFolder className="w-4 h-4" />
        </span>
        <button
          className="bg-transparent border-0 p-0 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-panel-accent focus-visible:outline-offset-2 focus-visible:rounded-[3px] align-middle"
          aria-controls={ariaControls}
          aria-expanded={isActive}
        >
          {title}
        </button>
        <div className="flex-1" />
        <Collapser style={{ height: 16, width: 16 }} isCollapsed={isActive} />
      </div>
    </li>
  );
};

export default LayerListGroup;
