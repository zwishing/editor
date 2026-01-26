import React from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { cn } from "@/lib/utils";

type LayerEditorGroupProps = {
  id?: string;
  "data-wd-key"?: string;
  title: string;
  isActive: boolean;
  children: React.ReactNode;
  onActiveToggle(active: boolean): unknown;
};

const LayerEditorGroup: React.FC<LayerEditorGroupProps> = ({
  id,
  "data-wd-key": wdKey,
  title,
  isActive,
  children,
  onActiveToggle,
}) => {
  return (
    <AccordionItem uuid={id}>
      <AccordionItemHeading
        className="font-bold text-xs bg-panel-surface text-panel-text cursor-pointer select-none leading-relaxed border-t border-panel-border flex flex-row hover:bg-panel-hover focus-within:shadow-[inset_0_0_0_1px_var(--color-panel-accent)]"
        data-wd-key={"layer-editor-group:" + wdKey}
        onClick={() => onActiveToggle(!isActive)}
      >
        <AccordionItemButton className="flex-1 flex p-1.5 group">
          <span className="grow self-center">{title}</span>
          <MdArrowDropUp
            size={"2em"}
            className={cn(
              "fill-panel-text block group-aria-expanded:hidden",
              !isActive && "block",
              isActive && "hidden"
            )}
          />
          <MdArrowDropDown
            size={"2em"}
            className={cn(
              "fill-panel-text hidden group-aria-expanded:block",
              isActive && "block",
              !isActive && "hidden"
            )}
          />
        </AccordionItemButton>
      </AccordionItemHeading>
      <AccordionItemPanel className="p-0">{children}</AccordionItemPanel>
    </AccordionItem>
  );
};

export default LayerEditorGroup;
