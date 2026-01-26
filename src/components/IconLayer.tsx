import React from "react";
import type { CSSProperties } from "react";
import { BsBack, BsDiamondFill, BsSunFill } from "react-icons/bs";
import { MdBubbleChart, MdCircle, MdLocationPin, MdPhoto, MdPriorityHigh } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { IoMdCube } from "react-icons/io";
import { FaMountain } from "react-icons/fa";
import { cn } from "@/lib/utils";

type IconLayerProps = {
  type: string
  style?: CSSProperties
  className?: string
};

const IconLayer: React.FC<IconLayerProps> = ({ type, style, className }) => {
  const iconProps = {
    style,
    className: cn("h-4 w-4 shrink-0", className)
  };

  switch (type) {
    case "fill-extrusion": return <IoMdCube {...iconProps} />;
    case "raster": return <MdPhoto {...iconProps} />;
    case "hillshade": return <BsSunFill {...iconProps} />;
    case "color-relief": return <FaMountain {...iconProps} />;
    case "heatmap": return <MdBubbleChart {...iconProps} />;
    case "fill": return <BsDiamondFill {...iconProps} />;
    case "background": return <BsBack {...iconProps} />;
    case "line": return <IoAnalyticsOutline {...iconProps} />;
    case "symbol": return <MdLocationPin {...iconProps} />;
    case "circle": return <MdCircle {...iconProps} />;
    default: return <MdPriorityHigh {...iconProps} />;
  }
};

export default IconLayer;
