import React from "react";
import { cn } from "@/lib/utils";

type ScrollContainerProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({ children, className, style }) => {
  return (
    <div
      className={cn("h-full w-full overflow-y-auto overflow-x-hidden", className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
