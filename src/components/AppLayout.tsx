import React from "react";
import ScrollContainer from "./ScrollContainer";
import { type WithTranslation, withTranslation } from "react-i18next";
import { IconContext } from "react-icons";
import { cn } from "@/lib/utils";

type AppLayoutInternalProps = {
  toolbar: React.ReactElement
  iconRail?: React.ReactElement // New Prop
  layerList: React.ReactElement
  listClassName?: string // New Prop for wider panels
  layerEditor?: React.ReactElement
  codeEditor?: React.ReactElement
  map: React.ReactElement
  bottom?: React.ReactElement
  modals?: React.ReactNode
} & WithTranslation;

const AppLayout: React.FC<AppLayoutInternalProps> = ({
  toolbar,
  iconRail,
  layerList,
  listClassName = "",
  layerEditor,
  codeEditor,
  map,
  bottom,
  modals,
  i18n,
}) => {
  document.body.dir = i18n.dir();

  return (
    <IconContext.Provider value={{ size: "14px" }}>
      <div className="h-screen overflow-hidden font-sans text-white">
        {toolbar}
        <div className="fixed bottom-0 top-12 left-0 right-0 z-[1] flex bg-panel-bg overflow-hidden">
          {iconRail}
          {codeEditor && (
            <div className="w-[800px] bg-black relative flex flex-col transition-all duration-200">
              <ScrollContainer>{codeEditor}</ScrollContainer>
            </div>
          )}
          {!codeEditor && (
            <>
              <div
                className={cn(
                  "w-layout-list bg-panel-surface shadow-md text-panel-text flex flex-col transition-all duration-160",
                  listClassName === "maputnik-layout-list--wide" && "w-[450px]",
                  listClassName === "maputnik-layout-list--extra-wide" && "w-[800px]",
                  listClassName
                )}
              >
                {layerList}
              </div>
              {layerEditor && (
                <div className="w-layout-editor bg-panel-surface border-r border-panel-border shadow-md text-panel-text relative transition-all duration-160">
                  <ScrollContainer>{layerEditor}</ScrollContainer>
                </div>
              )}
            </>
          )}
          {map}
        </div>
        {bottom && <div className="fixed bottom-0 right-0 z-10 w-[calc(100%-660px)] bg-black">{bottom}</div>}
        {modals}
      </div>
    </IconContext.Provider>
  );
};

export default withTranslation()(AppLayout);
