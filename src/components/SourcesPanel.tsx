import React, { useState, useCallback } from "react";
import { MdAddCircleOutline, MdDelete } from "react-icons/md";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type { GeoJSONSourceSpecification, RasterDEMSourceSpecification, RasterSourceSpecification, SourceSpecification, VectorSourceSpecification } from "maplibre-gl";
import { useTranslation } from "react-i18next";

import InputButton from "./InputButton";
import FieldString from "./FieldString";
import FieldSelect from "./FieldSelect";
import ScrollContainer from "./ScrollContainer";
import ModalSourcesTypeEditor, { type EditorMode } from "./modals/ModalSourcesTypeEditor";

import style from "../libs/style";
import { deleteSource, addSource, changeSource } from "../libs/source";
import publicSources from "../config/tilesets.json";
import { type OnStyleChangedCallback, type StyleSpecificationWithId } from "../libs/definitions";

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
        className="maputnik-public-source-select flex items-center w-full justify-between p-2 hover:bg-accent rounded-md transition-colors"
        onClick={() => onSelect(id)}
      >
        <div className="maputnik-public-source-info text-left">
          <p className="maputnik-public-source-name font-medium">{title}</p>
          <p className="maputnik-public-source-id text-xs text-muted-foreground italic">
            #{id}
          </p>
        </div>
        <MdAddCircleOutline className="text-xl" />
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

const ActiveModalSourcesTypeEditor: React.FC<ActiveModalSourcesTypeEditorProps> =
  ({ sourceId, source, onDelete, onChange }) => {
    const { t } = useTranslation();
    return (
      <div className="maputnik-active-source-type-editor p-3 border rounded-md bg-card mb-4">
        <div className="maputnik-active-source-type-editor-header flex items-center justify-between mb-2">
          <span className="maputnik-active-source-type-editor-header-id font-mono text-sm bg-muted px-2 py-0.5 rounded">
            #{sourceId}
          </span>
          <InputButton
            aria-label={t("Remove '{{sourceId}}' source", { sourceId })}
            className="maputnik-active-source-type-editor-header-delete p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
            onClick={() => onDelete(sourceId)}
            style={{ backgroundColor: "transparent" }}
          >
            <MdDelete />
          </InputButton>
        </div>
        <div className="maputnik-active-source-type-editor-content">
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

  const defaultSource = useCallback((mode: EditorMode, currentSource?: any): SourceSpecification => {
    const source = currentSource || {};
    const { protocol } = window.location;

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
          cluster: (source as GeoJSONSourceSpecification).cluster || false,
          data: "",
        };
      case "tilejson_vector":
        return {
          type: "vector",
          url:
                        (source as VectorSourceSpecification).url ||
                        `${protocol}//localhost:3000/tilejson.json`,
        };
      case "tile_vector":
        return {
          type: "vector",
          tiles: (source as VectorSourceSpecification).tiles || [
            `${protocol}//localhost:3000/{x}/{y}/{z}.pbf`,
          ],
          minzoom: (source as VectorSourceSpecification).minzoom || 0,
          maxzoom: (source as VectorSourceSpecification).maxzoom || 14,
          scheme: (source as VectorSourceSpecification).scheme || "xyz",
        };
      case "tilejson_raster":
        return {
          type: "raster",
          url:
                        (source as RasterSourceSpecification).url ||
                        `${protocol}//localhost:3000/tilejson.json`,
        };
      case "tile_raster":
        return {
          type: "raster",
          tiles: (source as RasterSourceSpecification).tiles || [
            `${protocol}//localhost:3000/{x}/{y}/{z}.png`,
          ],
          minzoom: (source as RasterSourceSpecification).minzoom || 0,
          maxzoom: (source as RasterSourceSpecification).maxzoom || 14,
          scheme: (source as RasterSourceSpecification).scheme || "xyz",
          tileSize: (source as RasterSourceSpecification).tileSize || 512,
        };
      case "tilejson_raster-dem":
        return {
          type: "raster-dem",
          url:
                        (source as RasterDEMSourceSpecification).url ||
                        `${protocol}//localhost:3000/tilejson.json`,
        };
      case "tilexyz_raster-dem":
        return {
          type: "raster-dem",
          tiles: (source as RasterDEMSourceSpecification).tiles || [
            `${protocol}//localhost:3000/{x}/{y}/{z}.png`,
          ],
          minzoom: (source as RasterDEMSourceSpecification).minzoom || 0,
          maxzoom: (source as RasterDEMSourceSpecification).maxzoom || 14,
          tileSize: (source as RasterDEMSourceSpecification).tileSize || 512,
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

  const [mode, setMode] = useState<EditorMode>("tilejson_vector");
  const [sourceId, setSourceId] = useState(style.generateId());
  const [source, setSource] = useState<SourceSpecification>(() => defaultSource("tilejson_vector"));

  const handleAdd = () => {
    onAdd(sourceId, source);
  };

  const sourceTypeFieldSpec = {
    doc: latest.source_vector.type.doc,
  };

  return (
    <div className="maputnik-add-source space-y-4">
      <FieldString
        label={t("Source ID")}
        fieldSpec={{
          doc: t(
            "Unique ID that identifies the source and is used in the layer to reference the source."
          ),
        }}
        value={sourceId}
        onChange={(v: string) => setSourceId(v)}
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
        onChange={(m) => {
          const newMode = m as EditorMode;
          setMode(newMode);
          setSource(defaultSource(newMode, source));
        }}
        value={mode as string}
        data-wd-key="modal:sources.add.source_type"
      />
      <ModalSourcesTypeEditor
        onChange={setSource}
        mode={mode}
        source={source}
      />
      <InputButton
        className="maputnik-add-source-button w-full justify-center bg-primary text-primary-content hover:bg-primary/90 mt-2"
        onClick={handleAdd}
        data-wd-key="modal:sources.add.add_source"
      >
        {t("Add Source")}
      </InputButton>
    </div>
  );
};

export type SourcesPanelProps = {
  mapStyle: StyleSpecificationWithId;
  onStyleChanged: OnStyleChangedCallback;
};

const SourcesPanel: React.FC<SourcesPanelProps> = ({
  mapStyle,
  onStyleChanged,
}) => {
  const { t } = useTranslation();

  const stripTitle = (
    source: SourceSpecification & { title?: string }
  ): SourceSpecification => {
    const strippedSource = { ...source };
    delete (strippedSource as any)["title"];
    return strippedSource;
  };

  const activeSources = Object.keys(mapStyle.sources).map((sourceId) => {
    const source = mapStyle.sources[sourceId];
    return (
      <ActiveModalSourcesTypeEditor
        key={sourceId}
        sourceId={sourceId}
        source={source}
        onChange={(src: SourceSpecification) =>
          onStyleChanged(changeSource(mapStyle, sourceId, src))
        }
        onDelete={() => onStyleChanged(deleteSource(mapStyle, sourceId))}
      />
    );
  });

  const tilesetOptions = Object.keys(publicSources)
    .filter((sourceId: string) => !(sourceId in mapStyle.sources))
    .map((sourceId: string) => {
      const source = publicSources[
        sourceId as keyof typeof publicSources
      ] as SourceSpecification & { title: string };
      return (
        <PublicSource
          key={sourceId}
          id={sourceId}
          type={source.type}
          title={source.title}
          onSelect={() =>
            onStyleChanged(addSource(mapStyle, sourceId, stripTitle(source)))
          }
        />
      );
    });

  return (
    <div className="maputnik-sources-panel h-full flex flex-col">
      <div className="maputnik-sidebar-header p-4 border-b">
        <h1 className="text-xl font-bold">{t("Data Sources")}</h1>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <ScrollContainer>
          <div className="p-4 space-y-8">
            <section className="maputnik-modal-section space-y-4">
              <h1 className="text-lg font-bold border-b pb-1">
                {t("Active Sources")}
              </h1>
              {activeSources.length > 0 ? (
                <div className="space-y-2">{activeSources}</div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {t("No active sources.")}
                </p>
              )}
            </section>

            <section className="maputnik-modal-section space-y-4">
              <h1 className="text-lg font-bold border-b pb-1">
                {t("Choose Public Source")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("Add one of the publicly available sources to your style.")}
              </p>
              <div
                className="maputnik-public-sources grid grid-cols-1 gap-2"
                style={{ maxWidth: 500 }}
              >
                {tilesetOptions}
              </div>
            </section>

            <section className="maputnik-modal-section space-y-4">
              <h1 className="text-lg font-bold border-b pb-1">
                {t("Add New Source")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Add a new source to your style. You can only choose the source type and id at creation time!"
                )}
              </p>
              <AddSource
                onAdd={(id: string, source: SourceSpecification) =>
                  onStyleChanged(addSource(mapStyle, id, source))
                }
              />
            </section>
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
};

export default SourcesPanel;
