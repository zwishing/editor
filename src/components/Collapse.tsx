import React from "react";
import { Collapse as ReactCollapse } from "react-collapse";
import { reducedMotionEnabled } from "../libs/accessibility";

type CollapseProps = {
  isActive: boolean
  children: React.ReactElement
};

const Collapse: React.FC<CollapseProps> = ({ isActive = true, children }) => {
  if (reducedMotionEnabled()) {
    return (
      <div style={{ display: isActive ? "block" : "none" }}>
        {children}
      </div>
    );
  }

  return (
    <ReactCollapse isOpened={isActive}>
      {children}
    </ReactCollapse>
  );
};

export default Collapse;
