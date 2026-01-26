import React from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { cn } from "@/lib/utils";

type CollapserProps = {
  isCollapsed: boolean
  style?: React.CSSProperties
  className?: string
};

const Collapser: React.FC<CollapserProps> = ({ isCollapsed, style, className }) => {
  const Icon = isCollapsed ? MdArrowDropUp : MdArrowDropDown;

  return (
    <Icon
      style={style}
      className={cn("h-5 w-5", className)}
    />
  );
};

export default Collapser;
