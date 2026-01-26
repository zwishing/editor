import React from "react";
import { Separator } from "@/components/ui/separator";
import Collapser from "./Collapser";
import { MdLabelImportant } from "react-icons/md";
import {
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

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
        className="relative font-bold text-sm bg-panel-surface text-panel-text cursor-pointer select-none leading-relaxed flex flex-col hover:bg-panel-hover focus-within:shadow-[inset_0_0_0_1px_var(--color-panel-accent)]"
        data-wd-key={"layer-editor-group:" + wdKey}
        onClick={() => onActiveToggle(!isActive)}
      >
        <AccordionItemButton className="flex-1 flex py-2 px-3 group items-center bg-panel-surface hover:bg-panel-hover transition-colors">
          <div className="grow flex items-center">
            <MdLabelImportant className="w-3.5 h-3.5 text-panel-accent mr-2" />
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <Collapser isCollapsed={isActive} />
        </AccordionItemButton>
      </AccordionItemHeading>
      <Separator className="w-full bg-border" />
      <AccordionItemPanel className="p-0">{children}</AccordionItemPanel>
    </AccordionItem>
  );
};

export default LayerEditorGroup;
