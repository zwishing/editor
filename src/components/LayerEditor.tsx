import React, { type JSX, useMemo, useCallback } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import { Accordion } from "react-accessible-accordion";
import { MdMoreVert, MdClose } from "react-icons/md";
import { IconContext } from "react-icons";
import {
  type LayerSpecification,
  type SourceSpecification,
} from "maplibre-gl";
import { v8 } from "@maplibre/maplibre-gl-style-spec";
import { cn } from "@/lib/utils";

import LayerEditorGroup from "./LayerEditorGroup";
import { changeProperty } from "../libs/layer";
import { formatLayerId } from "../libs/format";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { type MappedError, type MappedLayerErrors, type OnMoveLayerCallback } from "../libs/definitions";

// Import new sub-components
import LayerEditorLayer from "./LayerEditor/LayerEditorLayer";
import LayerEditorFilter from "./LayerEditor/LayerEditorFilter";
import LayerEditorProperties from "./LayerEditor/LayerEditorProperties";
import LayerEditorJson from "./LayerEditor/LayerEditorJson";

type MaputnikLayoutGroup = {
  id: string;
  title: string;
  type: string;
  fields: string[];
};

function getLayoutForSymbolType(t: TFunction): MaputnikLayoutGroup[] {
  const groups: MaputnikLayoutGroup[] = [];
  groups.push({
    title: t("General layout properties"),
    id: "General_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter((f) => f.startsWith("symbol-")),
  });
  groups.push({
    title: t("Text layout properties"),
    id: "Text_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter((f) => f.startsWith("text-")),
  });
  groups.push({
    title: t("Icon layout properties"),
    id: "Icon_layout_properties",
    type: "properties",
    fields: Object.keys(v8["layout_symbol"]).filter((f) => f.startsWith("icon-")),
  });
  groups.push({
    title: t("Text paint properties"),
    id: "Text_paint_properties",
    type: "properties",
    fields: Object.keys(v8["paint_symbol"]).filter((f) => f.startsWith("text-")),
  });
  groups.push({
    title: t("Icon paint properties"),
    id: "Icon_paint_properties",
    type: "properties",
    fields: Object.keys(v8["paint_symbol"]).filter((f) => f.startsWith("icon-")),
  });
  return groups;
}

function getLayoutForType(type: LayerSpecification["type"], t: TFunction): MaputnikLayoutGroup[] {
  if (Object.keys(v8.layer.type.values).indexOf(type) < 0) {
    return [];
  }
  if (type === "symbol") {
    return getLayoutForSymbolType(t);
  }
  const groups: MaputnikLayoutGroup[] = [];
  if (Object.keys(v8["paint_" + type]).length > 0) {
    groups.push({
      title: t("Paint properties"),
      id: "Paint_properties",
      type: "properties",
      fields: Object.keys(v8["paint_" + type]),
    });
  }
  if (Object.keys(v8["layout_" + type]).length > 0) {
    groups.push({
      title: t("Layout properties"),
      id: "Layout_properties",
      type: "properties",
      fields: Object.keys(v8["layout_" + type]),
    });
  }
  return groups;
}

function layoutGroups(
  layerType: LayerSpecification["type"],
  t: TFunction
): { id: string; title: string; type: string; fields?: string[] }[] {
  const layerGroup = {
    id: "layer",
    title: t("Layer"),
    type: "layer",
  };
  const filterGroup = {
    id: "filter",
    title: t("Filter"),
    type: "filter",
  };
  const editorGroup = {
    id: "jsoneditor",
    title: t("JSON Editor"),
    type: "jsoneditor",
  };
  return [layerGroup, filterGroup].concat(getLayoutForType(layerType, t)).concat([editorGroup]);
}

type LayerEditorInternalProps = {
  layer: LayerSpecification;
  sources: { [key: string]: SourceSpecification & { layers: string[] } };
  vectorLayers: { [key: string]: any };
  spec: any;
  onLayerChanged(index: number, layer: LayerSpecification): void;
  onLayerIdChange(...args: unknown[]): unknown;
  onMoveLayer: OnMoveLayerCallback;
  onLayerDestroy(...args: unknown[]): unknown;
  onLayerCopy(...args: unknown[]): unknown;
  onLayerVisibilityToggle(...args: unknown[]): unknown;
  isFirstLayer?: boolean;
  isLastLayer?: boolean;
  layerIndex: number;
  errors?: MappedError[];
  onClose?: () => void;
} & WithTranslation;

// Import shadcn Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const LayerEditorInternal: React.FC<LayerEditorInternalProps> = ({
  layer,
  sources,
  vectorLayers,
  spec,
  onLayerChanged,
  onLayerIdChange,
  onMoveLayer,
  onLayerDestroy,
  onLayerCopy,
  onLayerVisibilityToggle,
  isFirstLayer,
  isLastLayer,
  layerIndex,
  errors = [],
  onClose,
  t,
}) => {
  const groups = useMemo(() => layoutGroups(layer.type, t), [layer.type, t]);

  const [editorGroups, setEditorGroups] = React.useState<Record<string, boolean>>(() => {
    const initialGroups: Record<string, boolean> = {};
    for (const group of groups) {
      initialGroups[group.title] = true;
    }
    return initialGroups;
  });

  React.useEffect(() => {
    setEditorGroups((prev) => {
      const next = { ...prev };
      for (const group of getLayoutForType(layer.type, t)) {
        if (!(group.title in next)) {
          next[group.title] = true;
        }
      }
      return next;
    });
  }, [layer.type, t]);

  const handleChangeProperty = useCallback((group: keyof LayerSpecification | null, property: string, newValue: any) => {
    onLayerChanged(layerIndex, changeProperty(layer, group, property, newValue));
  }, [layer, layerIndex, onLayerChanged]);

  const onGroupToggle = React.useCallback((groupTitle: string, active: boolean) => {
    setEditorGroups((prev) => ({
      ...prev,
      [groupTitle]: active,
    }));
  }, []);

  const errorData: MappedLayerErrors = useMemo(() => {
    const data: MappedLayerErrors = {};
    errors.forEach((error) => {
      if (error.parsed && error.parsed.type === "layer" && error.parsed.data.index === layerIndex) {
        data[error.parsed.data.key] = {
          message: error.parsed.data.message,
        };
      }
    });
    return data;
  }, [errors, layerIndex]);

  const renderGroupType = useCallback((type: string, fields?: string[]): JSX.Element => {
    switch (type) {
      case "layer":
        return (
          <LayerEditorLayer
            layer={layer}
            layerIndex={layerIndex}
            sources={sources}
            errors={errorData}
            onLayerIdChange={onLayerIdChange as any} 
            onLayerChanged={onLayerChanged}
            onChangeProperty={handleChangeProperty}
          />
        );
      case "filter":
        return (
          <LayerEditorFilter
            layer={layer}
            vectorLayers={vectorLayers}
            errors={errorData}
            onChangeProperty={handleChangeProperty}
          />
        );
      case "properties":
        return (
          <LayerEditorProperties
            layer={layer}
            groupFields={fields!}
            spec={spec}
            errors={errorData}
            onChangeProperty={handleChangeProperty}
          />
        );
      case "jsoneditor":
        return (
          <LayerEditorJson
            layer={layer}
            layerIndex={layerIndex}
            onLayerChanged={onLayerChanged}
          />
        );
      default:
        return <></>;
    }
  }, [layer, layerIndex, sources, errorData, onLayerIdChange, onLayerChanged, handleChangeProperty, vectorLayers, spec]);

  const moveLayer = (offset: number) => {
    onMoveLayer({
      oldIndex: layerIndex,
      newIndex: layerIndex + offset,
    });
  };

  const layout = layer.layout || {};

  const items: Record<string, { text: string; handler: () => void; disabled?: boolean; wdKey?: string }> = useMemo(() => ({
    delete: {
      text: t("Delete"),
      handler: () => onLayerDestroy(layerIndex),
      wdKey: "menu-delete-layer",
      disabled: false,
    },
    duplicate: {
      text: t("Duplicate"),
      handler: () => onLayerCopy(layerIndex),
      wdKey: "menu-duplicate-layer",
      disabled: false,
    },
    hide: {
      text: layout.visibility === "none" ? t("Show") : t("Hide"),
      handler: () => onLayerVisibilityToggle(layerIndex),
      wdKey: "menu-hide-layer",
      disabled: false,
    },
    moveLayerUp: {
      text: t("Move layer up"),
      disabled: isFirstLayer,
      handler: () => moveLayer(-1),
      wdKey: "menu-move-layer-up",
    },
    moveLayerDown: {
      text: t("Move layer down"),
      disabled: isLastLayer,
      handler: () => moveLayer(+1),
      wdKey: "menu-move-layer-down",
    },
  }), [t, onLayerDestroy, layerIndex, onLayerCopy, layout.visibility, onLayerVisibilityToggle, isFirstLayer, moveLayer, isLastLayer]);

  const handleSelection = (id: string, event: React.SyntheticEvent) => {
    event.stopPropagation();
    items[id as keyof typeof items].handler();
  };

  const iconContextValue = useMemo(() => ({ size: "14px", color: "#8e8e8e" }), []);

  // Filter groups for tabs
  const styleGroups = useMemo(() => groups.filter(g => 
    g.type !== "filter" && 
    g.type !== "jsoneditor" && 
    !(layer.type === "background" && g.type === "source")
  ), [groups, layer.type]);

  const dataGroups = useMemo(() => groups.filter(g => g.type === "filter"), [groups]);
  const jsonGroups = useMemo(() => groups.filter(g => g.type === "jsoneditor"), [groups]);
  
  const renderAccordionGroups = (targetGroups: typeof groups) => (
    <Accordion allowMultipleExpanded={true} allowZeroExpanded={true} preExpanded={targetGroups.map(g => g.id)}>
      {targetGroups.map((group) => (
        <LayerEditorGroup
          data-wd-key={group.title}
          id={group.id}
          key={group.id}
          title={group.title}
          isActive={editorGroups[group.title]}
          onActiveToggle={(active) => onGroupToggle(group.title, active)}
        >
          {renderGroupType(group.type, group.fields)}
        </LayerEditorGroup>
      ))}
    </Accordion>
  );

  return (
    <IconContext.Provider value={iconContextValue}>
      <section
        className="h-full flex flex-col bg-panel-surface w-layout-editor"
        role="main"
        aria-label={t("Layer editor")}
        data-wd-key="layer-editor"
      >
        {/* Header: opaque, single border, consistent margins */}
        <header className="h-10 px-3 flex items-center shrink-0 z-[10] bg-panel-surface" data-wd-key="layer-editor.header">
          <h2 className="grow m-0 leading-none text-sm font-semibold text-panel-text truncate pr-2">
            {t("Layer: {{layerId}}", { layerId: formatLayerId(layer.id) })}
          </h2>
          <div className="flex items-center gap-1.5">
            <Wrapper className="relative flex items-center" onSelection={handleSelection} closeOnSelection={false}>
              <Button
                id="skip-target-layer-editor"
                data-wd-key="skip-target-layer-editor"
                className="flex items-center justify-center h-6 w-6 hover:bg-panel-hover rounded transition-colors"
                title={"Layer options"}
              >
                <MdMoreVert className="w-4 h-4 fill-panel-muted" />
              </Button>
              <Menu>
                {/* Opaque menu background */}
                <ul className="absolute right-0 top-full mt-1 z-[9999] bg-popover text-popover-foreground border border-panel-border shadow-md min-w-[120px] py-1 m-0 list-none rounded-md">
                  {Object.keys(items).map((id) => {
                    const item = items[id as keyof typeof items];
                    return (
                      <li key={id}>
                        <MenuItem
                          value={id}
                          className={cn(
                            "px-3 py-1.5 text-xs text-panel-text cursor-pointer hover:bg-panel-hover flex items-center justify-between transition-colors",
                            item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                          )}
                          data-wd-key={item.wdKey}
                        >
                          {item.text}
                        </MenuItem>
                      </li>
                    );
                  })}
                </ul>
              </Menu>
            </Wrapper>
            <button
              className="flex items-center justify-center h-6 w-6 bg-panel-surface text-panel-muted hover:text-panel-text rounded hover:bg-panel-hover transition-colors"
              onClick={onClose}
              title={t("Close layer editor")}
            >
              <MdClose className="w-4 h-4" />
            </button>
          </div>
        </header>
        <Separator className="w-full bg-border" />

        {/* Tabs Component: Content grows, List fixed at bottom */}
        <Tabs defaultValue="style" className="flex flex-col grow overflow-hidden">
          <div className="grow overflow-y-auto">
            <TabsContent value="style" className="mt-0 h-full">
              {renderAccordionGroups(styleGroups)}
            </TabsContent>
            <TabsContent value="data" className="mt-0 h-full">
               {renderAccordionGroups(dataGroups)}
            </TabsContent>
            <TabsContent value="json" className="mt-0 h-full">
               {renderAccordionGroups(jsonGroups)}
            </TabsContent>
          </div>
          
          <Separator className="w-full bg-border" />
          <div className="shrink-0 p-3 pb-5 bg-panel-surface">
             <TabsList className="w-full grid w-full grid-cols-3 bg-muted h-10">
              <TabsTrigger value="style" className="text-sm data-[state=active]:font-bold data-[state=active]:text-primary">{t("Style")}</TabsTrigger>
              <TabsTrigger value="data" className="text-sm data-[state=active]:font-bold data-[state=active]:text-primary">{t("Data")}</TabsTrigger>
              <TabsTrigger value="json" className="text-sm data-[state=active]:font-bold data-[state=active]:text-primary">{t("JSON")}</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </section>
    </IconContext.Provider>
  );
};

const LayerEditor = withTranslation()(LayerEditorInternal);
export default LayerEditor;
