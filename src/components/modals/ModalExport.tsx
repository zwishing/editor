import React, { useCallback, useMemo } from "react";
import Slugify from "slugify";
import { saveAs } from "file-saver";
import { version } from "maplibre-gl/package.json";
import { format } from "@maplibre/maplibre-gl-style-spec";
import { MdMap, MdSave } from "react-icons/md";
import { useTranslation } from "react-i18next";

import FieldString from "../FieldString";
import InputButton from "../InputButton";
import Modal from "./Modal";
import style from "../../libs/style";
import fieldSpecAdditional from "../../libs/field-spec-additional";
import type {
  OnStyleChangedCallback,
  StyleSpecificationWithId,
} from "../../libs/definitions";

const MAPLIBRE_GL_VERSION = version;
const showSaveFilePickerAvailable =
  typeof window.showSaveFilePicker === "function";

export type ModalExportProps = {
  mapStyle: StyleSpecificationWithId;
  onStyleChanged: OnStyleChangedCallback;
  isOpen: boolean;
  onOpenToggle(): void;
  onSetFileHandle(fileHandle: FileSystemFileHandle | null): void;
  fileHandle: FileSystemFileHandle | null;
};

const ModalExport: React.FC<ModalExportProps> = ({
  mapStyle,
  onStyleChanged,
  isOpen,
  onOpenToggle,
  onSetFileHandle,
  fileHandle,
}) => {
  const { t } = useTranslation();
  const fsa = useMemo(() => fieldSpecAdditional(t), [t]);

  const tokenizedStyle = useCallback(() => {
    return format(style.stripAccessTokens(style.replaceAccessTokens(mapStyle)));
  }, [mapStyle]);

  const exportName = useCallback(() => {
    if (mapStyle.name) {
      return Slugify(mapStyle.name, {
        replacement: "_",
        remove: /[*\-+~.()'"!:]/g,
        lower: true,
      });
    } else {
      return mapStyle.id;
    }
  }, [mapStyle.name, mapStyle.id]);

  const createFileHandle = useCallback(async (): Promise<FileSystemFileHandle | null> => {
    const pickerOpts: SaveFilePickerOptions = {
      types: [
        {
          description: "json",
          accept: { "application/json": [".json"] },
        },
      ],
      suggestedName: exportName(),
    };

    try {
      const handle = (await window.showSaveFilePicker(
        pickerOpts
      )) as FileSystemFileHandle;
      onSetFileHandle(handle);
      return handle;
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Failed to create file handle", err);
      }
      return null;
    }
  }, [exportName, onSetFileHandle]);

  const createHtml = useCallback(() => {
    const tokenStyle = tokenizedStyle();
    const htmlTitle = mapStyle.name || t("Map");
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${htmlTitle}</title>
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <script src="https://unpkg.com/maplibre-gl@${MAPLIBRE_GL_VERSION}/dist/maplibre-gl.js"></script>
  <link href="https://unpkg.com/maplibre-gl@${MAPLIBRE_GL_VERSION}/dist/maplibre-gl.css" rel="stylesheet" />
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
      const map = new maplibregl.Map({
         container: 'map',
         style: ${tokenStyle},
      });
      map.addControl(new maplibregl.NavigationControl());
  </script>
</body>
</html>
`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    saveAs(blob, exportName() + ".html");
  }, [tokenizedStyle, mapStyle.name, t, exportName]);

  const saveStyle = useCallback(async () => {
    const tokenStyle = tokenizedStyle();

    if (!showSaveFilePickerAvailable) {
      const blob = new Blob([tokenStyle], {
        type: "application/json;charset=utf-8",
      });
      saveAs(blob, exportName() + ".json");
      return;
    }

    let activeHandle = fileHandle;
    if (activeHandle === null) {
      activeHandle = await createFileHandle();
      if (activeHandle === null) return;
    }

    const writable = await activeHandle.createWritable();
    await writable.write(tokenStyle);
    await writable.close();
    onOpenToggle();
  }, [tokenizedStyle, exportName, fileHandle, createFileHandle, onOpenToggle]);

  const saveStyleAs = useCallback(async () => {
    const tokenStyle = tokenizedStyle();

    const activeHandle = await createFileHandle();
    if (activeHandle === null) return;

    const writable = await activeHandle.createWritable();
    await writable.write(tokenStyle);
    await writable.close();
    onOpenToggle();
  }, [tokenizedStyle, createFileHandle, onOpenToggle]);

  const changeMetadataProperty = useCallback(
    (property: string, value: any) => {
      const changedStyle = {
        ...mapStyle,
        metadata: {
          ...(mapStyle.metadata as any),
          [property]: value,
        },
      };
      onStyleChanged(changedStyle);
    },
    [mapStyle, onStyleChanged]
  );

  return (
    <Modal
      data-wd-key="modal:export"
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Save Style")}
      className="maputnik-export-modal"
    >
      <section className="maputnik-modal-section space-y-4">
        <h1 className="text-lg font-bold border-b pb-1">{t("Save Style")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("Save the JSON style to your computer.")}
        </p>

        <div className="space-y-4">
          <FieldString
            label={fsa.maputnik.maptiler_access_token.label}
            fieldSpec={fsa.maputnik.maptiler_access_token}
            value={
              (mapStyle.metadata || ({} as any))[
                "maputnik:openmaptiles_access_token"
              ]
            }
            onChange={(v: any) =>
              changeMetadataProperty("maputnik:openmaptiles_access_token", v)
            }
          />
          <FieldString
            label={fsa.maputnik.thunderforest_access_token.label}
            fieldSpec={fsa.maputnik.thunderforest_access_token}
            value={
              (mapStyle.metadata || ({} as any))[
                "maputnik:thunderforest_access_token"
              ]
            }
            onChange={(v: any) =>
              changeMetadataProperty("maputnik:thunderforest_access_token", v)
            }
          />
          <FieldString
            label={fsa.maputnik.stadia_access_token.label}
            fieldSpec={fsa.maputnik.stadia_access_token}
            value={
              (mapStyle.metadata || ({} as any))[
                "maputnik:stadia_access_token"
              ]
            }
            onChange={(v: any) =>
              changeMetadataProperty("maputnik:stadia_access_token", v)
            }
          />
          <FieldString
            label={fsa.maputnik.locationiq_access_token.label}
            fieldSpec={fsa.maputnik.locationiq_access_token}
            value={
              (mapStyle.metadata || ({} as any))[
                "maputnik:locationiq_access_token"
              ]
            }
            onChange={(v: any) =>
              changeMetadataProperty("maputnik:locationiq_access_token", v)
            }
          />
        </div>

        <div className="maputnik-modal-export-buttons flex flex-wrap gap-2 pt-4">
          <InputButton onClick={saveStyle} className="flex items-center">
            <MdSave className="mr-1" />
            {t("Save")}
          </InputButton>
          {showSaveFilePickerAvailable && (
            <InputButton onClick={saveStyleAs} className="flex items-center">
              <MdSave className="mr-1" />
              {t("Save as")}
            </InputButton>
          )}

          <InputButton onClick={createHtml} className="flex items-center">
            <MdMap className="mr-1" />
            {t("Create HTML")}
          </InputButton>
        </div>
      </section>
    </Modal>
  );
};

export default ModalExport;
