import React from "react";
import classnames from "classnames";
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
      case "duplicate": return <MdContentCopy />;
      case "show": return <MdVisibility />;
      case "hide": return <MdVisibilityOff />;
      case "delete": return <MdDelete />;
    }
  };

  const { classBlockName, classBlockModifier } = props;

  // Legacy class logic retained for backward compatibility if needed by external CSS, 
  // though we are moving to Tailwind. 
  // The user requested strict usage consistency (props), which is preserved.
  let classAdditions = "";
  if (classBlockName) {
    classAdditions = `maputnik-layer-list-icon-action__${classBlockName}`;

    if (classBlockModifier) {
      classAdditions += ` maputnik-layer-list-icon-action__${classBlockName}--${classBlockModifier}`;
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={classnames("h-7 w-7", classAdditions)}
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
  id?: string
  layerIndex: number
  layerId: string
  layerType: string
  isSelected?: boolean
  visibility?: string
  className?: string
  onLayerSelect(index: number): void;
  onLayerCopy?(...args: unknown[]): unknown
  onLayerDestroy?(...args: unknown[]): unknown
  onLayerVisibilityToggle?(...args: unknown[]): unknown
};

const LayerListItem = React.forwardRef<HTMLLIElement, LayerListItemProps>((props, ref) => {
  const {
    isSelected = false,
    visibility = "visible",
    onLayerCopy = () => { },
    onLayerDestroy = () => { },
    onLayerVisibilityToggle = () => { },
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.layerId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const visibilityAction = visibility === "visible" ? "show" : "hide";

  // Cast ref to MutableRefObject since we know from the codebase that's what's always passed
  const refObject = ref as React.MutableRefObject<HTMLLIElement | null> | null;

  return <IconContext.Provider value={{ size: "14px" }}>
    <li
      ref={(node) => {
        setNodeRef(node);
        if (refObject) {
          refObject.current = node;
        }
      }}
      style={style}
      id={props.id}
      onClick={_e => props.onLayerSelect(props.layerIndex)}
      data-wd-key={"layer-list-item:" + props.layerId}
      className={classnames(
        "flex items-center border-b border-border bg-background hover:bg-accent/50 p-0.5 select-none",
        {
          "bg-accent text-accent-foreground border-l-4 border-l-primary": isSelected,
          [props.className!]: true,
        }
      )}>
      <DraggableLabel
        layerId={props.layerId}
        layerType={props.layerType}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
      <span style={{ flexGrow: 1 }} />
      <IconAction
        wdKey={"layer-list-item:" + props.layerId + ":delete"}
        action={"delete"}
        classBlockName="delete"
        onClick={_e => onLayerDestroy!(props.layerIndex)}
      />
      <IconAction
        wdKey={"layer-list-item:" + props.layerId + ":copy"}
        action={"duplicate"}
        classBlockName="duplicate"
        onClick={_e => onLayerCopy!(props.layerIndex)}
      />
      <IconAction
        wdKey={"layer-list-item:" + props.layerId + ":toggle-visibility"}
        action={visibilityAction}
        classBlockName="visibility"
        classBlockModifier={visibilityAction}
        onClick={_e => onLayerVisibilityToggle!(props.layerIndex)}
      />
    </li>
  </IconContext.Provider>;
});

export default LayerListItem;
