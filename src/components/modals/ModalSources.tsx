import React, { useState, useCallback, useMemo } from "react";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type {
  GeoJSONSourceSpecification,
  RasterDEMSourceSpecification,
  RasterSourceSpecification,
  SourceSpecification,
  VectorSourceSpecification,
} from "maplibre-gl";
import { useTranslation } from "react-i18next";

import Modal from "./Modal";
import InputButton from "../InputButton";
import FieldString from "../FieldString";
import FieldSelect from "../FieldSelect";
import ModalSourcesTypeEditor, { type EditorMode } from "./ModalSourcesTypeEditor";

import style from "../../libs/style";
import { deleteSource, addSource, changeSource } from "../../libs/source";
import publicSources from "../../config/tilesets.json";
import {
  type OnStyleChangedCallback,
  type StyleSpecificationWithId,
} from "../../libs/definitions";

type PublicSourceProps = {
  id: string;
  type: string;
  title: string;
  onSelect(id: string): void;
};

const PublicSource: React.FC<PublicSourceProps> = ({ id, title, onSelect }) => {
  return (
    <div className="maputnik-public-source">
      <InputButton
        className="maputnik-public-source-select flex items-center w-full text-left"
        onClick={() => onSelect(id)}
      >
        <div className="maputnik-public-source-info flex-1">
          <p className="maputnik-public-source-name font-bold">{title}</p>
          <p className="maputnik-public-source-id text-xs text-muted-foreground">
            #{id}
          </p>
        </div>
        <MdAddCircleOutline className="ml-2 w-5 h-5 text-muted-foreground" />
      </InputButton>
    </div>
  );
};

function editorMode(source: SourceSpecification): EditorMode | null {
  if (source.type === "raster") {
    if (source.tiles) return "tile_raster";
    return "tilejson_raster";
  }
  if (source.type === "raster-dem") {
    if (source.tiles) return "tilexyz_raster-dem";
    return "tilejson_raster-dem";
  }
  if (source.type === "vector") {
    if (source.tiles) return "tile_vector";
    if (source.url && source.url.startsWith("pmtiles://")) return "pmtiles_vector";
    return "tilejson_vector";
  }
  if (source.type === "geojson") {
    if (typeof source.data === "string") {
      return "geojson_url";
    } else {
      return "geojson_json";
    }
  }
  if (source.type === "image") {
    return "image";
  }
  if (source.type === "video") {
    return "video";
  }
  return null;
}

type ActiveModalSourcesTypeEditorProps = {
  sourceId: string;
  source: SourceSpecification;
  onDelete(id: string): void;
  onChange(src: SourceSpecification): void;
};

const ActiveModalSourcesTypeEditor: React.FC<ActiveModalSourcesTypeEditorProps> = ({
  sourceId,
  source,
  onDelete,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="maputnik-active-source-type-editor border rounded-md mb-4 overflow-hidden">
      <div className="maputnik-active-source-type-editor-header flex items-center px-4 py-2 bg-muted/50 border-b">
        <span className="maputnik-active-source-type-editor-header-id font-mono text-sm">
          #{sourceId}
        </span>
        <div className="flex-1" />
        <InputButton
          aria-label={t("Remove '{{sourceId}}' source", { sourceId })}
          className="maputnik-active-source-type-editor-header-delete p-1 text-muted-foreground hover:text-destructive transition-colors"
          onClick={() => onDelete(sourceId)}
          style={{ backgroundColor: "transparent" }}
        >
          <MdDelete className="w-5 h-5" />
        </InputButton>
      </div>
      <div className="maputnik-active-source-type-editor-content p-4">
        <ModalSourcesTypeEditor
          onChange={onChange}
          mode={editorMode(source)}
          source={source}
        />
      </div>
    </div>
  );
};

type AddSourceProps = {
  onAdd(id: string, source: SourceSpecification): void;
};

const AddSource: React.FC<AddSourceProps> = ({ onAdd }) => {
  const { t } = useTranslation();
  const [sourceId, setSourceId] = useState(() => style.generateId());
  const [mode, setMode] = useState<EditorMode>("tilejson_vector");

  const defaultSource = useCallback((mode: EditorMode, currentSource?: any): SourceSpecification => {
    const { protocol } = window.location;
    const baseSource = currentSource || {};

    switch (mode) {
      case "pmtiles_vector":
        return {
          type: "vector",
          url: `${protocol}//localhost:3000/file.pmtiles`,
        };
      case "geojson_url":
        return {
          type: "geojson",
          data: `${protocol}//localhost:3000/geojson.json`,
        };
      case "geojson_json":
        return {
          type: "geojson",
          cluster: (baseSource as GeoJSONSourceSpecification).cluster || false,
          data: "",
        };
      case "tilejson_vector":
        return {
          type: "vector",
          url: (baseSource as VectorSourceSpecification).url || `${protocol}//localhost:3000/tilejson.json`,
        };
      case "tile_vector":
        return {
          type: "vector",
          tiles: (baseSource as VectorSourceSpecification).tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.pbf`],
          minzoom: (baseSource as VectorSourceSpecification).minzoom || 0,
          maxzoom: (baseSource as VectorSourceSpecification).maxzoom || 14,
          scheme: (baseSource as VectorSourceSpecification).scheme || "xyz",
        };
      case "tilejson_raster":
        return {
          type: "raster",
          url: (baseSource as RasterSourceSpecification).url || `${protocol}//localhost:3000/tilejson.json`,
        };
      case "tile_raster":
        return {
          type: "raster",
          tiles: (baseSource as RasterSourceSpecification).tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.png`],
          minzoom: (baseSource as RasterSourceSpecification).minzoom || 0,
          maxzoom: (baseSource as RasterSourceSpecification).maxzoom || 14,
          scheme: (baseSource as RasterSourceSpecification).scheme || "xyz",
          tileSize: (baseSource as RasterSourceSpecification).tileSize || 512,
        };
      case "tilejson_raster-dem":
        return {
          type: "raster-dem",
          url: (baseSource as RasterDEMSourceSpecification).url || `${protocol}//localhost:3000/tilejson.json`,
        };
      case "tilexyz_raster-dem":
        return {
          type: "raster-dem",
          tiles: (baseSource as RasterDEMSourceSpecification).tiles || [`${protocol}//localhost:3000/{x}/{y}/{z}.png`],
          minzoom: (baseSource as RasterDEMSourceSpecification).minzoom || 0,
          maxzoom: (baseSource as RasterDEMSourceSpecification).maxzoom || 14,
          tileSize: (baseSource as RasterDEMSourceSpecification).tileSize || 512,
        };
      case "image":
        return {
          type: "image",
          url: `${protocol}//localhost:3000/image.png`,
          coordinates: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        };
      case "video":
        return {
          type: "video",
          urls: [`${protocol}//localhost:3000/movie.mp4`],
          coordinates: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        };
      default:
        return {} as any;
    }
  }, []);

  const [source, setSource] = useState<SourceSpecification>(() => defaultSource("tilejson_vector"));

  const handleModeChange = (newMode: string) => {
    const editorMode = newMode as EditorMode;
    setMode(editorMode);
    setSource(defaultSource(editorMode, source));
  };

  const handleAdd = () => {
    onAdd(sourceId, source);
  };

  const sourceTypeFieldSpec = useMemo(() => ({
    doc: latest.source_vector.type.doc,
  }), []);

  return (
    <div className="maputnik-add-source space-y-4 pt-2 border-t mt-4">
      <FieldString
        label={t("Source ID")}
        fieldSpec={{
          doc: t(
            "Unique ID that identifies the source and is used in the layer to reference the source."
          ),
        }}
        value={sourceId}
        onChange={(v: any) => setSourceId(v)}
        data-wd-key="modal:sources.add.source_id"
      />
      <FieldSelect
        label={t("Source Type")}
        fieldSpec={sourceTypeFieldSpec}
        options={[
          ["geojson_json", t("GeoJSON (JSON)")],
          ["geojson_url", t("GeoJSON (URL)")],
          ["tilejson_vector", t("Vector (TileJSON URL)")],
          ["tile_vector", t("Vector (Tile URLs)")],
          ["tilejson_raster", t("Raster (TileJSON URL)")],
          ["tile_raster", t("Raster (Tile URLs)")],
          ["tilejson_raster-dem", t("Raster DEM (TileJSON URL)")],
          ["tilexyz_raster-dem", t("Raster DEM (XYZ URLs)")],
          ["pmtiles_vector", t("Vector (PMTiles)")],
          ["image", t("Image")],
          ["video", t("Video")],
        ]}
        onChange={handleModeChange}
        value={mode as string}
        data-wd-key="modal:sources.add.source_type"
      />
      <ModalSourcesTypeEditor
        onChange={(src: any) => setSource(src)}
        mode={mode}
        source={source}
      />
      <InputButton
        className="maputnik-add-source-button w-full justify-center py-2"
        onClick={handleAdd}
        data-wd-key="modal:sources.add.add_source"
      >
        {t("Add Source")}
      </InputButton>
    </div>
  );
};

export type ModalSourcesProps = {
  mapStyle: StyleSpecificationWithId;
  isOpen: boolean;
  onOpenToggle(): void;
  onStyleChanged: OnStyleChangedCallback;
};

const ModalSources: React.FC<ModalSourcesProps> = ({
  mapStyle,
  isOpen,
  onOpenToggle,
  onStyleChanged,
}) => {
  const { t } = useTranslation();

  const stripTitle = useCallback((source: SourceSpecification & { title?: string }) => {
    const strippedSource = { ...source };
    delete strippedSource["title"];
    return strippedSource;
  }, []);

  const activeSources = useMemo(
    () =>
      Object.keys(mapStyle.sources).map((sourceId) => {
        const source = mapStyle.sources[sourceId];
        return (
          <ActiveModalSourcesTypeEditor
            key={sourceId}
            sourceId={sourceId}
            source={source}
            onChange={(src) => onStyleChanged(changeSource(mapStyle, sourceId, src))}
            onDelete={() => onStyleChanged(deleteSource(mapStyle, sourceId))}
          />
        );
      }),
    [mapStyle, onStyleChanged]
  );

  const tilesetOptions = useMemo(
    () =>
      Object.keys(publicSources)
        .filter((sourceId: string) => !(sourceId in mapStyle.sources))
        .map((sourceId: string) => {
          const source = publicSources[sourceId as keyof typeof publicSources] as SourceSpecification & {
            title: string;
          };
          return (
            <PublicSource
              key={sourceId}
              id={sourceId}
              type={source.type}
              title={source.title}
              onSelect={() => onStyleChanged(addSource(mapStyle, sourceId, stripTitle(source)))}
            />
          );
        }),
    [mapStyle, onStyleChanged, stripTitle]
  );

  return (
    <Modal
      data-wd-key="modal:sources"
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Sources")}
    >
      <section className="maputnik-modal-section space-y-4 mb-8">
        <h1 className="text-lg font-bold border-b pb-1">{t("Active Sources")}</h1>
        <div className="space-y-2">{activeSources}</div>
      </section>

      <section className="maputnik-modal-section space-y-4 mb-8">
        <h1 className="text-lg font-bold border-b pb-1">{t("Choose Public Source")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Add one of the publicly available sources to your style.")}
        </p>
        <div className="maputnik-public-sources grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tilesetOptions}
        </div>
      </section>

      <section className="maputnik-modal-section space-y-4">
        <h1 className="text-lg font-bold border-b pb-1">{t("Add New Source")}</h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "Add a new source to your style. You can only choose the source type and id at creation time!"
          )}
        </p>
        <AddSource
          onAdd={(sourceId, source) => onStyleChanged(addSource(mapStyle, sourceId, source))}
        />
      </section>
    </Modal>
  );
};

export default ModalSources;
