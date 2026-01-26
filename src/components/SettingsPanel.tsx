import React, { useCallback, useMemo } from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type { ProjectionSpecification, StyleSpecification } from "maplibre-gl";
import { useTranslation } from "react-i18next";

import FieldArray from "./FieldArray";
import FieldNumber from "./FieldNumber";
import FieldString from "./FieldString";
import FieldUrl from "./FieldUrl";
import FieldSelect from "./FieldSelect";
import Block from "./Block";
import ScrollContainer from "./ScrollContainer";
import FieldJson from "./FieldJson";
import fieldSpecAdditional from "../libs/field-spec-additional";
import type { OnStyleChangedCallback, StyleSpecificationWithId } from "../libs/definitions";

export type SettingsPanelProps = {
  mapStyle: StyleSpecificationWithId;
  onStyleChanged: OnStyleChangedCallback;
  onChangeMetadataProperty(...args: any[]): void;
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  mapStyle,
  onStyleChanged,
  onChangeMetadataProperty,
}) => {
  const { t } = useTranslation();
  const fsa = useMemo(() => fieldSpecAdditional(t), [t]);

  const changeStyleProperty = useCallback(
    (property: keyof StyleSpecification | "owner", value: any) => {
      const changedStyle = { ...mapStyle };
      if (value === undefined) {
        delete (changedStyle as any)[property];
      } else {
        (changedStyle as any)[property] = value;
      }
      onStyleChanged(changedStyle);
    },
    [mapStyle, onStyleChanged]
  );

  const changeProjectionType = useCallback(
    (value: any) => {
      const projection = { ...mapStyle.projection } as ProjectionSpecification;
      if (value === undefined) {
        delete projection.type;
      } else {
        projection.type = value;
      }
      onStyleChanged({ ...mapStyle, projection });
    },
    [mapStyle, onStyleChanged]
  );

  const metadata = mapStyle.metadata || ({} as any);
  const projection = (mapStyle.projection || {}) as ProjectionSpecification;

  return (
    <div className="maputnik-settings-panel h-full flex flex-col">
      <div className="maputnik-sidebar-header p-4 border-b">
        <h1 className="text-xl font-bold">{t("Style Settings")}</h1>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <ScrollContainer>
          <div className="maputnik-settings-panel-content space-y-4 p-4">
            <FieldString
              label={t("Name")}
              fieldSpec={latest.$root.name}
              data-wd-key="modal:settings.name"
              value={mapStyle.name}
              onChange={(value: any) => changeStyleProperty("name", value)}
            />
            <FieldString
              label={t("Owner")}
              fieldSpec={{
                doc: t(
                  "Owner ID of the style. Used by Mapbox or future style APIs."
                ),
              }}
              data-wd-key="modal:settings.owner"
              value={(mapStyle as any).owner}
              onChange={(value: any) => changeStyleProperty("owner", value)}
            />
            <Block
              label={t("Sprite URL")}
              fieldSpec={latest.$root.sprite as any}
              data-wd-key="modal:settings.sprite"
            >
              <FieldJson
                lintType="json"
                value={mapStyle.sprite as any}
                onChange={(value: any) => changeStyleProperty("sprite", value)}
              />
            </Block>

            <FieldUrl
              label={t("Glyphs URL")}
              fieldSpec={latest.$root.glyphs}
              data-wd-key="modal:settings.glyphs"
              value={mapStyle.glyphs as string}
              onChange={(value: any) => changeStyleProperty("glyphs", value)}
            />

            <FieldString
              label={fsa.maputnik.maptiler_access_token.label}
              fieldSpec={fsa.maputnik.maptiler_access_token}
              data-wd-key="modal:settings.maputnik:openmaptiles_access_token"
              value={metadata["maputnik:openmaptiles_access_token"]}
              onChange={(value: any) =>
                onChangeMetadataProperty(
                  "maputnik:openmaptiles_access_token",
                  value
                )
              }
            />

            <FieldArray
              label={t("Center")}
              fieldSpec={latest.$root.center as any}
              length={2}
              type="number"
              value={mapStyle.center || []}
              default={[0, 0]}
              onChange={(value: any) => changeStyleProperty("center", value)}
            />

            <FieldNumber
              label={t("Zoom")}
              fieldSpec={latest.$root.zoom as any}
              value={mapStyle.zoom}
              default={0}
              onChange={(value: any) => changeStyleProperty("zoom", value)}
            />

            <FieldNumber
              label={t("Bearing")}
              fieldSpec={latest.$root.bearing as any}
              value={mapStyle.bearing}
              default={latest.$root.bearing.default}
              onChange={(value: any) => changeStyleProperty("bearing", value)}
            />

            <FieldNumber
              label={t("Pitch")}
              fieldSpec={latest.$root.pitch as any}
              value={mapStyle.pitch}
              default={latest.$root.pitch.default}
              onChange={(value: any) => changeStyleProperty("pitch", value)}
            />

            <FieldSelect
              label={t("Projection")}
              data-wd-key="modal:settings.projection"
              options={[
                ["", "Undefined"],
                ["mercator", "Mercator"],
                ["globe", "Globe"],
                ["vertical-perspective", "Vertical Perspective"],
              ]}
              value={projection?.type?.toString() || ""}
              onChange={(value: any) => changeProjectionType(value)}
            />

            <FieldSelect
              label={fsa.maputnik.style_renderer.label}
              fieldSpec={fsa.maputnik.style_renderer}
              data-wd-key="modal:settings.maputnik:renderer"
              options={[
                ["mlgljs", "MapLibreGL JS"],
                ["ol", t("Open Layers (experimental)")],
              ]}
              value={metadata["maputnik:renderer"] || "mlgljs"}
              onChange={(value: any) =>
                onChangeMetadataProperty("maputnik:renderer", value)
              }
            />
          </div>
        </ScrollContainer>
      </div>
    </div>
  );
};

export default SettingsPanel;
