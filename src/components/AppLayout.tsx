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
      <div className="h-screen overflow-hidden font-sans text-foreground">
        {toolbar}
        <div className="fixed bottom-0 top-12 left-0 right-0 z-[1] flex bg-background overflow-hidden supports-[height:100dvh]:h-[calc(100dvh-3rem)]">
          {iconRail}
          {codeEditor && (
            <div className="w-[800px] bg-slate-950 relative flex flex-col transition-all duration-200 border-r border-border">
              <ScrollContainer>{codeEditor}</ScrollContainer>
            </div>
          )}
          {!codeEditor && (
            <>
              <div
                className={cn(
                  "w-layout-list bg-card shadow-sm text-card-foreground flex flex-col transition-all duration-160 border-r border-border shrink-0",
                  listClassName === "maputnik-layout-list--wide" && "w-[450px]",
                  listClassName === "maputnik-layout-list--extra-wide" && "w-[800px]",
                  listClassName
                )}
              >
                {layerList}
              </div>
              {layerEditor && (
                <div className="w-layout-editor bg-card border-r border-border shadow-sm text-card-foreground relative transition-all duration-160 shrink-0">
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
