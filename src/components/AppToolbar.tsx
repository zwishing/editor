import React from "react";
import { cn } from "@/lib/utils";
import { detect } from "detect-browser";
import {
  MdOpenInBrowser,
  MdFindInPage,
  MdLanguage,
  MdSave,
  MdHelpOutline
} from "react-icons/md";
import pkgJson from "../../package.json";
//@ts-ignore
import maputnikLogo from "maputnik-design/logos/logo-color.svg?inline";
import { withTranslation, type WithTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n";
import type { OnStyleChangedCallback } from "../libs/definitions";

// This is required because of <https://stackoverflow.com/a/49846426>, there isn't another way to detect support that I'm aware of.
const browser = detect();
const colorAccessibilityFiltersEnabled = ["chrome", "firefox"].indexOf(browser!.name) > -1;

export type ModalTypes = "settings" | "sources" | "open" | "shortcuts" | "export" | "debug" | "globalState" | "codeEditor";

const IconText: React.FC<IconTextProps> = ({ children }) => (
  <span className="px-0.5">{children}</span>
);

type ToolbarLinkProps = {
  className?: string;
  children?: React.ReactNode;
  href?: string;
};

const ToolbarLink: React.FC<ToolbarLinkProps> = ({ className, children, href }) => (
  <a
    className={cn(
      "align-top h-12 inline-flex items-center px-2.5 text-xs cursor-pointer text-panel-muted no-underline leading-5 hover:bg-panel-hover hover:text-panel-text hover:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-panel-accent focus-visible:outline-offset-[-2px] focus-visible:rounded-sm",
      className
    )}
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    data-wd-key="toolbar:link"
  >
    {children}
  </a>
);

type ToolbarSelectProps = {
  children?: React.ReactNode;
  wdKey?: string;
};

const ToolbarSelect: React.FC<ToolbarSelectProps> = ({ children, wdKey }) => (
  <div
    className="align-top h-12 inline-flex items-center px-2.5 text-xs cursor-pointer text-panel-muted no-underline leading-5 hover:bg-panel-hover hover:text-panel-text hover:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-panel-accent focus-visible:outline-offset-[-2px] focus-visible:rounded-sm bg-inherit border-0"
    data-wd-key={wdKey}
  >
    {children}
  </div>
);

type ToolbarActionProps = {
  children?: React.ReactNode;
  onClick?(...args: unknown[]): unknown;
  wdKey?: string;
};

const ToolbarAction: React.FC<ToolbarActionProps> = ({ children, onClick, wdKey }) => (
  <button
    className="align-top h-12 inline-flex items-center px-2.5 text-xs cursor-pointer text-panel-muted no-underline leading-5 hover:bg-panel-hover hover:text-panel-text hover:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-panel-accent focus-visible:outline-offset-[-2px] focus-visible:rounded-sm bg-inherit border-0"
    data-wd-key={wdKey}
    onClick={onClick}
  >
    {children}
  </button>
);

export type MapState = "map" | "inspect" | "filter-achromatopsia" | "filter-deuteranopia" | "filter-protanopia" | "filter-tritanopia";

type AppToolbarInternalProps = {
  mapStyle: object
  inspectModeEnabled: boolean
  onStyleChanged: OnStyleChangedCallback
  // A new style has been uploaded
  onStyleOpen: OnStyleChangedCallback
  // A dict of source id's and the available source layers
  sources: object
  children?: React.ReactNode
  onToggleModal(modal: ModalTypes): void
  setMapState?(mapState: MapState): unknown
  onSetMapState?(mapState: MapState): unknown
  mapState?: MapState
  renderer?: string
} & WithTranslation;

const AppToolbarInternal: React.FC<AppToolbarInternalProps> = ({
  i18n,
  t,
  mapState,
  renderer,
  onToggleModal,
  setMapState,
  onSetMapState,
}) => {
  const handleSelection = (val: MapState) => {
    if (setMapState) {
      setMapState(val);
      return;
    }
    onSetMapState?.(val);
  };

  const handleLanguageChange = (val: string) => {
    i18n.changeLanguage(val);
  };

  const onSkip = (target: string) => {
    if (target === "map") {
      (document.querySelector(".maplibregl-canvas") as HTMLCanvasElement).focus();
    } else {
      const el = document.querySelector("#skip-target-" + target) as HTMLButtonElement;
      el.focus();
    }
  };

  const views = [
    { id: "map", group: "general", title: t("Map") },
    { id: "inspect", group: "general", title: t("Inspect"), disabled: renderer === "ol" },
    {
      id: "filter-deuteranopia",
      group: "color-accessibility",
      title: t("Deuteranopia filter"),
      disabled: !colorAccessibilityFiltersEnabled,
    },
    {
      id: "filter-protanopia",
      group: "color-accessibility",
      title: t("Protanopia filter"),
      disabled: !colorAccessibilityFiltersEnabled,
    },
    {
      id: "filter-tritanopia",
      group: "color-accessibility",
      title: t("Tritanopia filter"),
      disabled: !colorAccessibilityFiltersEnabled,
    },
    {
      id: "filter-achromatopsia",
      group: "color-accessibility",
      title: t("Achromatopsia filter"),
      disabled: !colorAccessibilityFiltersEnabled,
    },
  ];

  const currentView = views.find((view) => view.id === mapState);

  return (
    <nav className="fixed h-12 w-full z-[100] left-0 top-0 bg-panel-surface border-b border-panel-border shadow-md text-panel-text">
      <div className="flex">
        <div className="relative">
          <button
            data-wd-key="root:skip:layer-list"
            className="all-unset border border-transparent absolute overflow-hidden w-0 h-full text-center block bg-panel-surface z-[999] leading-[40px] left-0 top-0 active:w-full active:border-panel-border focus:w-full focus:border-panel-border"
            onClick={() => onSkip("layer-list")}
          >
            {t("Layers list")}
          </button>
          <button
            data-wd-key="root:skip:layer-editor"
            className="all-unset border border-transparent absolute overflow-hidden w-0 h-full text-center block bg-panel-surface z-[999] leading-[40px] left-0 top-0 active:w-full active:border-panel-border focus:w-full focus:border-panel-border"
            onClick={() => onSkip("layer-editor")}
          >
            {t("Layer editor")}
          </button>
          <button
            data-wd-key="root:skip:map-view"
            className="all-unset border border-transparent absolute overflow-hidden w-0 h-full text-center block bg-panel-surface z-[999] leading-[40px] left-0 top-0 active:w-full active:border-panel-border focus:w-full focus:border-panel-border"
            onClick={() => onSkip("map")}
          >
            {t("Map view")}
          </button>
          <a
            className="no-underline block flex-[0_0_190px] w-[200px] text-left bg-transparent p-1.5 h-12 relative overflow-hidden"
            target="blank"
            rel="noreferrer noopener"
            href="https://github.com/maplibre/maputnik"
          >
            <img src={maputnikLogo} alt={t("Maputnik on GitHub")} className="w-[30px] pr-1.5 inline-block align-top" />
            <h1 className="inline leading-[26px]">
              <span className="capitalize">{pkgJson.name}</span>
              <span className="text-[10px] mx-1 whitespace-nowrap">v{pkgJson.version}</span>
            </h1>
          </a>
        </div>
        <div className="whitespace-nowrap flex-1 overflow-x-auto" role="navigation" aria-label="Toolbar">
          <ToolbarAction wdKey="nav:open" onClick={() => onToggleModal("open")}>
            <MdOpenInBrowser />
            <IconText>{t("Open")}</IconText>
          </ToolbarAction>
          <ToolbarAction wdKey="nav:export" onClick={() => onToggleModal("export")}>
            <MdSave />
            <IconText>{t("Save")}</IconText>
          </ToolbarAction>

          <ToolbarSelect wdKey="nav:inspect">
            <MdFindInPage />
            <IconText>
              {t("View")}
              <select
                className="mx-1.5 inline w-auto border border-panel-border bg-panel-surface text-panel-text align-inherit mt-[-2px] text-xs px-1 py-0.5"
                data-wd-key="maputnik-select"
                onChange={(e) => handleSelection(e.target.value as MapState)}
                onInput={(e) => handleSelection((e.target as HTMLSelectElement).value as MapState)}
                value={currentView?.id}
              >
                {views
                  .filter((v) => v.group === "general")
                  .map((item) => (
                    <option key={item.id} value={item.id} disabled={item.disabled} data-wd-key={item.id}>
                      {item.title}
                    </option>
                  ))}
                <optgroup label={t("Color accessibility")}>
                  {views
                    .filter((v) => v.group === "color-accessibility")
                    .map((item) => (
                      <option key={item.id} value={item.id} disabled={item.disabled}>
                        {item.title}
                      </option>
                    ))}
                </optgroup>
              </select>
            </IconText>
          </ToolbarSelect>

          <ToolbarSelect wdKey="nav:language">
            <MdLanguage />
            <IconText>
              Language
              <select
                className="mx-1.5 inline w-auto border border-panel-border bg-panel-surface text-panel-text align-inherit mt-[-2px] text-xs px-1 py-0.5"
                data-wd-key="maputnik-lang-select"
                onChange={(e) => handleLanguageChange(e.target.value)}
                onInput={(e) => handleLanguageChange((e.target as HTMLSelectElement).value)}
                value={i18n.language}
              >
                {Object.entries(supportedLanguages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </IconText>
          </ToolbarSelect>

          <ToolbarLink href={"https://github.com/maplibre/maputnik/wiki"}>
            <MdHelpOutline />
            <IconText>{t("Help")}</IconText>
          </ToolbarLink>
        </div>
      </div>
    </nav>
  );
};

const AppToolbar = withTranslation()(AppToolbarInternal);
export default AppToolbar;
