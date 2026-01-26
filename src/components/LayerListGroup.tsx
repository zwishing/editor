import React from "react";
import { MdFolder } from "react-icons/md";
import Collapser from "./Collapser";

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
    <li className="">
      <div
        className="border border-transparent text-[11px] text-panel-muted bg-panel-surface select-none p-1.5 focus-within:border-panel-accent focus-within:shadow-[inset_0_0_0_1px_var(--color-panel-accent)] flex flex-row items-center cursor-pointer"
        data-wd-key={"layer-list-group:" + wdKey}
        onClick={() => onActiveToggle(!isActive)}
      >
        <span className="inline-flex items-center text-panel-muted mr-0.5" aria-hidden="true">
          <MdFolder className="w-3.5 h-3.5" />
        </span>
        <button
          className="bg-transparent border-0 p-0 text-left cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-panel-accent focus-visible:outline-offset-2 focus-visible:rounded-[3px] align-middle"
          aria-controls={ariaControls}
          aria-expanded={isActive}
        >
          {title}
        </button>
        <div className="flex-1" />
        <Collapser style={{ height: 14, width: 14 }} isCollapsed={isActive} />
      </div>
    </li>
  );
};

export default LayerListGroup;
