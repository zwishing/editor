import React from "react";
import { cn } from "@/lib/utils";
import { MdContentCopy, MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";
import { IconContext } from "react-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";

import IconLayer from "./IconLayer";

const ICON_CONTEXT_VALUE = { size: "16px" };


type DraggableLabelProps = {
  layerId: string
  layerType: string
  dragAttributes?: React.HTMLAttributes<HTMLElement>
  dragListeners?: React.HTMLAttributes<HTMLElement>
};

const DraggableLabel: React.FC<DraggableLabelProps> = (props) => {
  const { dragAttributes, dragListeners } = props;
  return <div
    className="flex items-center cursor-grab active:cursor-grabbing p-1 text-sm pl-2"
    {...dragAttributes}
    {...dragListeners}
  >
    <IconLayer
      className="mr-2 text-muted-foreground"
      type={props.layerType}
      style={{ width: "1.1em", height: "1.1em", verticalAlign: "middle" }}
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
  className?: string
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
      className={cn(
        "h-7 w-7 text-panel-muted hover:text-panel-text focus-visible:outline-panel-accent focus-visible:outline-offset-2",
        props.className
      )}
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
    <IconContext.Provider value={ICON_CONTEXT_VALUE}>
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
          "group flex items-center bg-panel-surface hover:bg-panel-hover/20 py-1.5 px-2 select-none transition-all duration-160 mb-0.5 rounded-sm mx-1",
          isSelected && "bg-panel-active text-panel-text ring-1 ring-panel-accent/50",
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
        <div className="flex transition-opacity duration-200">
          <IconAction
            wdKey={"layer-list-item:" + props.layerId + ":delete"}
            action={"delete"}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onLayerDestroy!(props.layerIndex)}
          />
          <IconAction
            wdKey={"layer-list-item:" + props.layerId + ":copy"}
            action={"duplicate"}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onLayerCopy!(props.layerIndex)}
          />
          <IconAction
            wdKey={"layer-list-item:" + props.layerId + ":toggle-visibility"}
            action={visibilityAction}
            className={cn(
              "transition-opacity",
              visibilityAction === "hide" ? "opacity-100 text-muted-foreground" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={() => onLayerVisibilityToggle!(props.layerIndex)}
          />
        </div>
      </li>
    </IconContext.Provider>
  );
});

export default LayerListItem;
