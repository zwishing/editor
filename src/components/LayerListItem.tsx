import React from "react";
import { cn } from "@/lib/utils";
import { MdContentCopy, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";
import { IconContext } from "react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";

import IconLayer from "./IconLayer";


type DraggableLabelProps = {
  layerId: string
  layerType: string
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: React.HTMLAttributes<HTMLElement>
};

const DraggableLabel: React.FC<DraggableLabelProps> = (props) => {
  const { dragAttributes, dragListeners } = props;
  return <div
    className="flex items-center cursor-grab active:cursor-grabbing p-1 text-xs"
    {...dragAttributes}
    {...dragListeners}
  >
    <IconLayer
      className="mr-1 text-muted-foreground"
      type={props.layerType}
      style={{ width: "1em", height: "1em", verticalAlign: "middle" }}
    />
    <button className="text-left font-mono truncate max-w-[140px] hover:text-foreground focus:outline-none">
      {props.layerId}
    </button>
  </div>;
};

type IconActionProps = {
  action: string
  onClick(...args: unknown[]): unknown
  wdKey?: string
  classBlockName?: string
  classBlockModifier?: string
};

const IconAction: React.FC<IconActionProps> = (props) => {
  const renderIcon = () => {
    switch (props.action) {
      case "duplicate":
        return <MdContentCopy />;
      case "show":
        return <MdVisibility />;
      case "hide":
        return <MdVisibilityOff />;
      case "delete":
        return <MdDelete />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7 text-panel-muted hover:text-panel-text focus-visible:outline-panel-accent focus-visible:outline-offset-2"
      title={props.action}
      data-wd-key={props.wdKey}
      onClick={props.onClick as React.MouseEventHandler<HTMLButtonElement>}
      tabIndex={-1}
      aria-hidden="true"
    >
      {renderIcon()}
    </Button>
  );
};

type LayerListItemProps = {
  id?: string;
  layerIndex: number;
  layerId: string;
  layerType: string;
  isSelected?: boolean;
  visibility?: string;
  className?: string;
  onLayerSelect(index: number): void;
  onLayerCopy?(...args: unknown[]): unknown;
  onLayerDestroy?(...args: unknown[]): unknown;
  onLayerVisibilityToggle?(...args: unknown[]): unknown;
};

const LayerListItem = React.forwardRef<HTMLLIElement, LayerListItemProps>((props, ref) => {
  const {
    isSelected = false,
    visibility = "visible",
    onLayerCopy = () => { },
    onLayerDestroy = () => { },
    onLayerVisibilityToggle = () => { },
    className,
  } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.layerId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const visibilityAction = visibility === "visible" ? "show" : "hide";
  const refObject = ref as React.MutableRefObject<HTMLLIElement | null> | null;

  return (
    <IconContext.Provider value={{ size: "14px" }}>
      <li
        ref={(node) => {
          setNodeRef(node);
          if (refObject) {
            refObject.current = node;
          }
        }}
        style={style}
        id={props.id}
        onClick={() => props.onLayerSelect(props.layerIndex)}
        data-wd-key={"layer-list-item:" + props.layerId}
        className={cn(
          "flex items-center border-b border-panel-border bg-panel-surface hover:bg-panel-hover p-0.5 select-none transition-all duration-160",
          isSelected && "bg-panel-active text-panel-text border-l-4 border-l-panel-accent",
          className
        )}
      >
        <DraggableLabel
          layerId={props.layerId}
          layerType={props.layerType}
          dragAttributes={attributes}
          dragListeners={listeners}
        />
        <div className="grow" />
        <IconAction
          wdKey={"layer-list-item:" + props.layerId + ":delete"}
          action={"delete"}
          onClick={() => onLayerDestroy!(props.layerIndex)}
        />
        <IconAction
          wdKey={"layer-list-item:" + props.layerId + ":copy"}
          action={"duplicate"}
          onClick={() => onLayerCopy!(props.layerIndex)}
        />
        <IconAction
          wdKey={"layer-list-item:" + props.layerId + ":toggle-visibility"}
          action={visibilityAction}
          onClick={() => onLayerVisibilityToggle!(props.layerIndex)}
        />
      </li>
    </IconContext.Provider>
  );
});

export default LayerListItem;
