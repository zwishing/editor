import React, { useCallback, useMemo } from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type {
  LightSpecification,
  ProjectionSpecification,
  StyleSpecification,
  TerrainSpecification,
  TransitionSpecification,
} from "maplibre-gl";
import { useTranslation } from "react-i18next";

import FieldArray from "../FieldArray";
import FieldNumber from "../FieldNumber";
import FieldString from "../FieldString";
import FieldUrl from "../FieldUrl";
import FieldSelect from "../FieldSelect";
import FieldEnum from "../FieldEnum";
import FieldColor from "../FieldColor";
import Modal from "./Modal";
import FieldJson from "../FieldJson";
import Block from "../Block";
import fieldSpecAdditional from "../../libs/field-spec-additional";
import type {
  OnStyleChangedCallback,
  StyleSpecificationWithId,
} from "../../libs/definitions";

export type ModalSettingsProps = {
  mapStyle: StyleSpecificationWithId;
  onStyleChanged: OnStyleChangedCallback;
  onChangeMetadataProperty(...args: unknown[]): unknown;
  isOpen: boolean;
  onOpenToggle(): void;
};

const ModalSettings: React.FC<ModalSettingsProps> = ({
  mapStyle,
  onStyleChanged,
  onChangeMetadataProperty,
  isOpen,
  onOpenToggle,
}) => {
  const { t } = useTranslation();
  const fsa = useMemo(() => fieldSpecAdditional(t), [t]);
  const projectionOptions = useMemo<[string, string][]>(
    () => [
      ["", "Undefined"],
      ["mercator", "Mercator"],
      ["globe", "Globe"],
      ["vertical-perspective", "Vertical Perspective"],
    ],
    []
  );
  const rendererOptions = useMemo<[string, string][]>(
    () => [
      ["mlgljs", "MapLibreGL JS"],
      ["ol", t("Open Layers (experimental)")],
    ],
    [t]
  );

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

  const changeTransitionProperty = useCallback(
    (property: keyof TransitionSpecification, value: number | undefined) => {
      const transition = { ...mapStyle.transition };
      if (value === undefined) {
        delete transition[property];
      } else {
        transition[property] = value;
      }
      onStyleChanged({ ...mapStyle, transition });
    },
    [mapStyle, onStyleChanged]
  );

  const changeLightProperty = useCallback(
    (property: keyof LightSpecification, value: any) => {
      const light = { ...mapStyle.light };
      if (value === undefined) {
        delete (light as any)[property];
      } else {
        (light as any)[property] = value;
      }
      onStyleChanged({ ...mapStyle, light });
    },
    [mapStyle, onStyleChanged]
  );

  const changeTerrainProperty = useCallback(
    (property: keyof TerrainSpecification, value: any) => {
      const terrain = { ...mapStyle.terrain } as TerrainSpecification;
      if (value === undefined) {
        delete (terrain as any)[property];
      } else {
        (terrain as any)[property] = value;
      }
      onStyleChanged({ ...mapStyle, terrain });
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
  const light = mapStyle.light || {};
  const transition = mapStyle.transition || {};
  const terrain = mapStyle.terrain || ({} as TerrainSpecification);
  const projection = mapStyle.projection || ({} as ProjectionSpecification);

  return (
    <Modal
      data-wd-key="modal:settings"
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Style Settings")}
    >
      <div className="space-y-4">
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
            doc: t("Owner ID of the style. Used by Mapbox or future style APIs."),
          }}
          data-wd-key="modal:settings.owner"
          value={(mapStyle as any).owner}
          onChange={(value: any) => changeStyleProperty("owner", value)}
        />
        <Block
          label={t("Sprite URL")}
          fieldSpec={latest.$root.sprite}
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
          onChange={(value: string) => changeStyleProperty("glyphs", value)}
        />

        <FieldString
          label={fsa.maputnik.maptiler_access_token.label}
          fieldSpec={fsa.maputnik.maptiler_access_token}
          data-wd-key="modal:settings.maputnik:openmaptiles_access_token"
          value={metadata["maputnik:openmaptiles_access_token"]}
          onChange={(value) =>
            onChangeMetadataProperty("maputnik:openmaptiles_access_token", value)
          }
        />

        <FieldString
          label={fsa.maputnik.thunderforest_access_token.label}
          fieldSpec={fsa.maputnik.thunderforest_access_token}
          data-wd-key="modal:settings.maputnik:thunderforest_access_token"
          value={metadata["maputnik:thunderforest_access_token"]}
          onChange={(value) =>
            onChangeMetadataProperty("maputnik:thunderforest_access_token", value)
          }
        />

        <FieldString
          label={fsa.maputnik.stadia_access_token.label}
          fieldSpec={fsa.maputnik.stadia_access_token}
          data-wd-key="modal:settings.maputnik:stadia_access_token"
          value={metadata["maputnik:stadia_access_token"]}
          onChange={(value) =>
            onChangeMetadataProperty("maputnik:stadia_access_token", value)
          }
        />

        <FieldString
          label={fsa.maputnik.locationiq_access_token.label}
          fieldSpec={fsa.maputnik.locationiq_access_token}
          data-wd-key="modal:settings.maputnik:locationiq_access_token"
          value={metadata["maputnik:locationiq_access_token"]}
          onChange={(value) =>
            onChangeMetadataProperty("maputnik:locationiq_access_token", value)
          }
        />

        <FieldArray
          label={t("Center")}
          fieldSpec={latest.$root.center}
          length={2}
          type="number"
          value={mapStyle.center || []}
          default={[0, 0]}
          onChange={(value) => changeStyleProperty("center", value)}
        />

        <FieldNumber
          label={t("Zoom")}
          fieldSpec={latest.$root.zoom}
          value={mapStyle.zoom}
          default={0}
          onChange={(value) => changeStyleProperty("zoom", value)}
        />

        <FieldNumber
          label={t("Bearing")}
          fieldSpec={latest.$root.bearing}
          value={mapStyle.bearing}
          default={latest.$root.bearing.default || 0}
          onChange={(value) => changeStyleProperty("bearing", value)}
        />

        <FieldNumber
          label={t("Pitch")}
          fieldSpec={latest.$root.pitch}
          value={mapStyle.pitch}
          default={latest.$root.pitch.default || 0}
          onChange={(value) => changeStyleProperty("pitch", value)}
        />

        <FieldEnum
          label={t("Light anchor")}
          fieldSpec={latest.light.anchor}
          name="light-anchor"
          value={(light.anchor as string) || (latest.light.anchor.default as string)}
          options={Object.keys(latest.light.anchor.values).map((v) => [v, v])}
          default={latest.light.anchor.default as string}
          onChange={(value) => changeLightProperty("anchor", value)}
        />

        <FieldColor
          label={t("Light color")}
          fieldSpec={latest.light.color}
          value={(light.color as string) || (latest.light.color.default as string)}
          default={latest.light.color.default as string}
          onChange={(value) => changeLightProperty("color", value)}
        />

        <FieldNumber
          label={t("Light intensity")}
          fieldSpec={latest.light.intensity}
          value={
            light.intensity !== undefined
              ? (light.intensity as number)
              : (latest.light.intensity.default as number)
          }
          default={latest.light.intensity.default as number}
          onChange={(value) => changeLightProperty("intensity", value)}
        />

        <FieldArray
          label={t("Light position")}
          fieldSpec={latest.light.position}
          type="number"
          length={latest.light.position.length}
          value={(light.position as number[]) || (latest.light.position.default as number[])}
          default={latest.light.position.default as number[]}
          onChange={(value) => changeLightProperty("position", value)}
        />

        <FieldString
          label={t("Terrain source")}
          fieldSpec={latest.terrain.source}
          data-wd-key="modal:settings.maputnik:terrain_source"
          value={terrain.source}
          onChange={(value) => changeTerrainProperty("source", value)}
        />

        <FieldNumber
          label={t("Terrain exaggeration")}
          fieldSpec={latest.terrain.exaggeration}
          value={
            terrain.exaggeration !== undefined
              ? terrain.exaggeration
              : (latest.terrain.exaggeration.default as number)
          }
          default={latest.terrain.exaggeration.default as number}
          onChange={(value) => changeTerrainProperty("exaggeration", value)}
        />

        <FieldNumber
          label={t("Transition delay")}
          fieldSpec={latest.transition.delay}
          value={
            transition.delay !== undefined
              ? transition.delay
              : (latest.transition.delay.default as number)
          }
          default={latest.transition.delay.default as number}
          onChange={(value) => changeTransitionProperty("delay", value)}
        />

        <FieldNumber
          label={t("Transition duration")}
          fieldSpec={latest.transition.duration}
          value={
            transition.duration !== undefined
              ? transition.duration
              : (latest.transition.duration.default as number)
          }
          default={latest.transition.duration.default as number}
          onChange={(value) => changeTransitionProperty("duration", value)}
        />

        <FieldSelect
          label={t("Projection")}
          data-wd-key="modal:settings.projection"
          options={projectionOptions}
          value={projection?.type?.toString() || ""}
          onChange={(value: string) => changeProjectionType(value)}
        />

        <FieldSelect
          label={fsa.maputnik.style_renderer.label}
          fieldSpec={fsa.maputnik.style_renderer}
          data-wd-key="modal:settings.maputnik:renderer"
          options={rendererOptions}
          value={metadata["maputnik:renderer"] || "mlgljs"}
          onChange={(value) =>
            onChangeMetadataProperty("maputnik:renderer", value)
          }
        />
      </div>
    </Modal>
  );
};

export default ModalSettings;
