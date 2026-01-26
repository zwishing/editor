import React, { type JSX } from "react";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";
import { Accordion } from "react-accessible-accordion";
import { MdMoreVert, MdClose } from "react-icons/md";
import { IconContext } from "react-icons";
import {
  type BackgroundLayerSpecification,
  type LayerSpecification,
  type SourceSpecification,
} from "maplibre-gl";
import { v8 } from "@maplibre/maplibre-gl-style-spec";
import { cn } from "@/lib/utils";

import FieldJson from "./FieldJson";
import FilterEditor from "./FilterEditor";
import PropertyGroup from "./PropertyGroup";
import LayerEditorGroup from "./LayerEditorGroup";
import FieldType from "./FieldType";
import FieldId from "./FieldId";
import FieldMinZoom from "./FieldMinZoom";
import FieldMaxZoom from "./FieldMaxZoom";
import FieldComment from "./FieldComment";
import FieldSource from "./FieldSource";
import FieldSourceLayer from "./FieldSourceLayer";
import { changeType, changeProperty } from "../libs/layer";
import { formatLayerId } from "../libs/format";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type TFunction } from "i18next";
import { NON_SOURCE_LAYERS } from "../libs/non-source-layers";
import { type MappedError, type MappedLayerErrors, type OnMoveLayerCallback } from "../libs/definitions";

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
  const [editorGroups, setEditorGroups] = React.useState<Record<string, boolean>>(() => {
    const initialGroups: Record<string, boolean> = {};
    for (const group of layoutGroups(layer.type, t)) {
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

  const handleChangeProperty = (group: keyof LayerSpecification | null, property: string, newValue: any) => {
    onLayerChanged(layerIndex, changeProperty(layer, group, property, newValue));
  };

  const onGroupToggle = (groupTitle: string, active: boolean) => {
    setEditorGroups((prev) => ({
      ...prev,
      [groupTitle]: active,
    }));
  };

  const renderGroupType = (type: string, fields?: string[]): JSX.Element => {
    let comment = "";
    if (layer.metadata) {
      comment = (layer.metadata as any)["maputnik:comment"] || "";
    }

    const errorData: MappedLayerErrors = {};
    errors.forEach((error) => {
      if (error.parsed && error.parsed.type === "layer" && error.parsed.data.index === layerIndex) {
        errorData[error.parsed.data.key] = {
          message: error.parsed.data.message,
        };
      }
    });

    let sourceLayerIds: string[] | undefined;
    const layerSpec = layer as Exclude<LayerSpecification, BackgroundLayerSpecification>;
    if (Object.prototype.hasOwnProperty.call(sources, layerSpec.source)) {
      sourceLayerIds = sources[layerSpec.source].layers;
    }

    switch (type) {
      case "layer":
        return (
          <div className="p-3 bg-panel-surface">
            <FieldId
              value={layer.id}
              wdKey="layer-editor.layer-id"
              error={errorData.id}
              onChange={(newId) => onLayerIdChange(layerIndex, layer.id, newId)}
            />
            <FieldType
              disabled={true}
              error={errorData.type}
              value={layer.type}
              onChange={(newType) => onLayerChanged(layerIndex, changeType(layer, newType))}
            />
            {layer.type !== "background" && (
              <FieldSource
                error={errorData.source}
                sourceIds={Object.keys(sources)}
                value={layer.source}
                onChange={(v) => handleChangeProperty(null, "source", v)}
              />
            )}
            {!NON_SOURCE_LAYERS.includes(layer.type) && (
              <FieldSourceLayer
                error={errorData["source-layer"]}
                sourceLayerIds={sourceLayerIds}
                value={(layer as any)["source-layer"]}
                onChange={(v) => handleChangeProperty(null, "source-layer", v)}
              />
            )}
            <FieldMinZoom
              error={errorData.minzoom}
              value={layer.minzoom}
              onChange={(v) => handleChangeProperty(null, "minzoom", v)}
            />
            <FieldMaxZoom
              error={errorData.maxzoom}
              value={layer.maxzoom}
              onChange={(v) => handleChangeProperty(null, "maxzoom", v)}
            />
            <FieldComment
              error={errorData.comment}
              value={comment}
              onChange={(v) => handleChangeProperty("metadata", "maputnik:comment", v === "" ? undefined : v)}
            />
          </div>
        );
      case "filter":
        return (
          <div className="p-3 bg-panel-surface">
            <FilterEditor
              errors={errorData}
              filter={(layer as any).filter}
              properties={vectorLayers[(layer as any)["source-layer"]]}
              onChange={(f) => handleChangeProperty(null, "filter", f)}
            />
          </div>
        );
      case "properties":
        return (
          <div className="p-3 bg-panel-surface">
            <PropertyGroup
              errors={errorData}
              layer={layer}
              groupFields={fields!}
              spec={spec}
              onChange={handleChangeProperty}
            />
          </div>
        );
      case "jsoneditor":
        return (
          <div className="p-3 bg-panel-surface h-[400px]">
            <FieldJson
              lintType="layer"
              value={layer}
              onChange={(newLayer: LayerSpecification) => {
                onLayerChanged(layerIndex, newLayer);
              }}
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  const moveLayer = (offset: number) => {
    onMoveLayer({
      oldIndex: layerIndex,
      newIndex: layerIndex + offset,
    });
  };

  const layout = layer.layout || {};

  const items: Record<string, { text: string; handler: () => void; disabled?: boolean; wdKey?: string }> = {
    delete: {
      text: t("Delete"),
      handler: () => onLayerDestroy(layerIndex),
      wdKey: "menu-delete-layer",
    },
    duplicate: {
      text: t("Duplicate"),
      handler: () => onLayerCopy(layerIndex),
      wdKey: "menu-duplicate-layer",
    },
    hide: {
      text: layout.visibility === "none" ? t("Show") : t("Hide"),
      handler: () => onLayerVisibilityToggle(layerIndex),
      wdKey: "menu-hide-layer",
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
  };

  const handleSelection = (id: string, event: React.SyntheticEvent) => {
    event.stopPropagation();
    items[id].handler();
  };

  const groupIds = layoutGroups(layer.type, t)
    .filter((group) => !(layer.type === "background" && group.type === "source"))
    .map((g) => g.id);

  return (
    <IconContext.Provider value={{ size: "14px", color: "#8e8e8e" }}>
      <section
        className="h-full flex flex-col bg-panel-surface"
        role="main"
        aria-label={t("Layer editor")}
        data-wd-key="layer-editor"
      >
        <header className="sticky top-0 z-[10] bg-panel-surface border-b border-panel-border" data-wd-key="layer-editor.header">
          <div className="flex p-3 items-center">
            <h2 className="grow m-0 leading-6 text-sm font-semibold text-panel-text">
              {t("Layer: {{layerId}}", { layerId: formatLayerId(layer.id) })}
            </h2>
            <div className="flex items-center gap-1.5">
              <Wrapper className="relative" onSelection={handleSelection} closeOnSelection={false}>
                <Button
                  id="skip-target-layer-editor"
                  data-wd-key="skip-target-layer-editor"
                  className="p-1 hover:bg-panel-hover rounded transition-colors"
                  title={"Layer options"}
                >
                  <MdMoreVert className="w-6 h-6 fill-panel-muted" />
                </Button>
                <Menu>
                  <ul className="absolute right-0 z-[9999] bg-panel-surface border border-panel-border shadow-md min-w-[120px] py-1 m-0 list-none rounded-md">
                    {Object.keys(items).map((id) => {
                      const item = items[id];
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
                className="p-1 px-2.5 bg-panel-surface text-panel-muted border border-panel-border rounded hover:bg-panel-hover transition-colors"
                onClick={onClose}
                title={t("Close layer editor")}
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
        <div className="grow overflow-y-auto">
          <Accordion allowMultipleExpanded={true} allowZeroExpanded={true} preExpanded={groupIds}>
            {layoutGroups(layer.type, t)
              .filter((group) => !(layer.type === "background" && group.type === "source"))
              .map((group) => (
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
        </div>
      </section>
    </IconContext.Provider>
  );
};

const LayerEditor = withTranslation()(LayerEditorInternal);
export default LayerEditor;
