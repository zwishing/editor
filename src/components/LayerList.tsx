import React, { type JSX } from "react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import LayerListGroup from "./LayerListGroup";
import LayerListItem from "./LayerListItem";
import ModalAdd from "./modals/ModalAdd";

import type { LayerSpecification, SourceSpecification } from "maplibre-gl";
import generateUniqueId from "../libs/document-uid";
import { layerPrefix } from "../libs/layer";
import { type WithTranslation, withTranslation } from "react-i18next";
import { type MappedError, type OnMoveLayerCallback } from "../libs/definitions";

type LayerListContainerProps = {
  layers: LayerSpecification[]
  selectedLayerIndex: number
  onLayersChange(layers: LayerSpecification[]): unknown
  onLayerSelect(index: number): void;
  onLayerDestroy?(...args: unknown[]): unknown
  onLayerCopy(...args: unknown[]): unknown
  onLayerVisibilityToggle(...args: unknown[]): unknown
  sources: Record<string, SourceSpecification & { layers: string[] }>;
  errors: MappedError[]
};
type LayerListContainerInternalProps = LayerListContainerProps & WithTranslation;

// List of collapsible layer editors
const LayerListContainerInternal: React.FC<LayerListContainerInternalProps> = ({
  layers,
  selectedLayerIndex,
  onLayersChange,
  onLayerSelect,
  onLayerDestroy,
  onLayerCopy,
  onLayerVisibilityToggle,
  sources,
  errors,
  t,
}) => {
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});
  const [areAllGroupsExpanded, setAreAllGroupsExpanded] = React.useState(false);
  const [modalKeys, setModalKeys] = React.useState({ add: +generateUniqueId() });
  const [modalOpen, setModalOpen] = React.useState({ add: false });

  const selectedItemRef = React.useRef<any>(null);
  const scrollContainerRef = React.useRef<HTMLElement | null>(null);

  const toggleModal = (modalName: string) => {
    setModalKeys((prev) => ({ ...prev, [modalName]: +generateUniqueId() }));
    setModalOpen((prev) => ({ ...prev, [modalName]: !prev[modalName as keyof typeof prev] }));
  };

  const groupedLayers = React.useMemo(() => {
    const groups: (LayerSpecification & { key: string })[][] = [];
    const layerIdCount = new Map();

    for (let i = 0; i < layers.length; i++) {
      const origLayer = layers[i];
      const previousLayer = layers[i - 1];
      layerIdCount.set(origLayer.id, (layerIdCount.get(origLayer.id) || 0) + 1);
      const layer = {
        ...origLayer,
        key: `layers-list-${origLayer.id}-${layerIdCount.get(origLayer.id)}`,
      };
      if (previousLayer && layerPrefix(previousLayer.id) === layerPrefix(layer.id)) {
        groups[groups.length - 1].push(layer);
      } else {
        groups.push([layer]);
      }
    }
    return groups;
  }, [layers]);

  const toggleLayers = () => {
    let idx = 0;
    const newGroups: Record<string, boolean> = {};

    groupedLayers.forEach((layersGrp) => {
      const groupPrefix = layerPrefix(layersGrp[0].id);
      const lookupKey = [groupPrefix, idx].join("-");
      if (layersGrp.length > 1) {
        newGroups[lookupKey] = areAllGroupsExpanded;
      }
      idx += layersGrp.length;
    });

    setCollapsedGroups(newGroups);
    setAreAllGroupsExpanded(!areAllGroupsExpanded);
  };

  const isCollapsed = (groupPrefix: string, idx: number) => {
    const collapsed = collapsedGroups[[groupPrefix, idx].join("-")];
    return collapsed === undefined ? true : collapsed;
  };

  const toggleLayerGroup = (groupPrefix: string, idx: number) => {
    const lookupKey = [groupPrefix, idx].join("-");
    setCollapsedGroups((prev) => ({
      ...prev,
      [lookupKey]: !isCollapsed(groupPrefix, idx),
    }));
  };

  React.useEffect(() => {
    const selectedItemNode = selectedItemRef.current;
    if (selectedItemNode && selectedItemNode.node) {
      const target = selectedItemNode.node;
      const options = {
        root: scrollContainerRef.current,
        threshold: 1.0,
      };
      const observer = new IntersectionObserver((entries) => {
        observer.unobserve(target);
        if (entries.length > 0 && entries[0].intersectionRatio < 1) {
          target.scrollIntoView();
        }
      }, options);

      observer.observe(target);
    }
  }, [selectedLayerIndex]);

  const listItems: JSX.Element[] = [];
  let globalIdx = 0;

  groupedLayers.forEach((layersGrp) => {
    const groupPrefix = layerPrefix(layersGrp[0].id);
    const firstIdxInGroup = globalIdx;

    if (layersGrp.length > 1) {
      listItems.push(
        <LayerListGroup
          data-wd-key={[groupPrefix, firstIdxInGroup].join("-")}
          aria-controls={layersGrp.map((l) => l.key).join(" ")}
          key={`group-${groupPrefix}-${firstIdxInGroup}`}
          title={groupPrefix}
          isActive={!isCollapsed(groupPrefix, firstIdxInGroup) || firstIdxInGroup === selectedLayerIndex}
          onActiveToggle={() => toggleLayerGroup(groupPrefix, firstIdxInGroup)}
        />
      );
    }

    layersGrp.forEach((layer, idxInGroup) => {
      const currentIdx = globalIdx;
      const layerError = errors.find(
        (error) => error.parsed && error.parsed.type === "layer" && error.parsed.data.index === currentIdx
      );

      listItems.push(
        <LayerListItem
          className={cn(
            layersGrp.length > 1 &&
            isCollapsed(groupPrefix, firstIdxInGroup) &&
            currentIdx !== selectedLayerIndex &&
            "absolute max-h-0 overflow-hidden p-0 opacity-0 invisible",
            idxInGroup === layersGrp.length - 1 && layersGrp.length > 1 && "border-b-2 border-panel-border",
            !!layerError && "text-red-600"
          )}
          key={layer.key}
          id={layer.key}
          layerId={layer.id}
          layerIndex={currentIdx}
          layerType={layer.type}
          visibility={(layer.layout || {}).visibility as any}
          isSelected={currentIdx === selectedLayerIndex}
          onLayerSelect={onLayerSelect}
          onLayerDestroy={onLayerDestroy}
          onLayerCopy={onLayerCopy}
          onLayerVisibilityToggle={onLayerVisibilityToggle}
          ref={currentIdx === selectedLayerIndex ? selectedItemRef : undefined}
        />
      );
      globalIdx++;
    });
  });

  return (
    <section
      className="h-full overflow-y-auto overflow-x-hidden flex flex-col"
      data-wd-key="layer-list"
      role="complementary"
      aria-label={t("Layers list")}
      ref={scrollContainerRef}
    >
      <ModalAdd
        key={modalKeys.add}
        layers={layers}
        sources={sources}
        isOpen={modalOpen.add}
        onOpenToggle={() => toggleModal("add")}
        onLayersChange={onLayersChange}
      />
      <header
        className="p-3 pb-1.5 sticky top-0 z-[2001] bg-card border-b border-panel-border flex flex-row items-center flex-none"
        data-wd-key="layer-list.header"
      >
        <span className="text-xs text-panel-text font-semibold leading-relaxed">{t("Layers")}</span>
        <div className="grow" />
        <div className="mr-2">
          <button
            id="skip-target-layer-list"
            data-wd-key="skip-target-layer-list"
            onClick={toggleLayers}
            className="px-3 py-1 bg-panel-surface text-panel-text border border-panel-border rounded-md hover:bg-panel-hover text-xs transition-colors"
          >
            {areAllGroupsExpanded ? t("Collapse") : t("Expand")}
          </button>
        </div>
        <div>
          <button
            onClick={() => toggleModal("add")}
            data-wd-key="layer-list:add-layer"
            className="px-3 py-1 bg-panel-active text-panel-text border border-panel-accent rounded-md text-xs transition-colors"
          >
            {t("Add Layer")}
          </button>
        </div>
      </header>
      <div role="navigation" aria-label={t("Layers list")}>
        <ul className="p-0 m-0 pb-6 flex-1 overflow-x-hidden overflow-y-visible">{listItems}</ul>
      </div>
    </section>
  );
};

const LayerListContainer = withTranslation()(LayerListContainerInternal);

type LayerListProps = LayerListContainerProps & {
  onMoveLayer: OnMoveLayerCallback
};

const LayerList: React.FC<LayerListProps> = (props) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const oldIndex = props.layers.findIndex(layer => layer.id === active.id);
    const newIndex = props.layers.findIndex(layer => layer.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      props.onMoveLayer({ oldIndex, newIndex });
    }
  };

  const layerIds = props.layers.map(layer => layer.id);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
        <LayerListContainer {...props} />
      </SortableContext>
    </DndContext>
  );
};

export default LayerList;
