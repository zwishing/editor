import React from "react";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type { LightSpecification, ProjectionSpecification, StyleSpecification, TerrainSpecification, TransitionSpecification } from "maplibre-gl";
import { type WithTranslation, withTranslation } from "react-i18next";

import FieldArray from "./FieldArray";
import FieldNumber from "./FieldNumber";
import FieldString from "./FieldString";
import FieldUrl from "./FieldUrl";
import FieldSelect from "./FieldSelect";
import FieldEnum from "./FieldEnum";
import FieldColor from "./FieldColor";
import FieldJson from "./FieldJson";
import Block from "./Block";
import ScrollContainer from "./ScrollContainer";
import fieldSpecAdditional from "../libs/field-spec-additional";
import type { OnStyleChangedCallback, StyleSpecificationWithId } from "../libs/definitions";

type SettingsPanelProps = {
    mapStyle: StyleSpecificationWithId
    onStyleChanged: OnStyleChangedCallback
    onChangeMetadataProperty(...args: unknown[]): unknown
} & WithTranslation;

class SettingsPanelInternal extends React.Component<SettingsPanelProps> {
    changeTransitionProperty(property: keyof TransitionSpecification, value: number | undefined) {
        const transition = {
            ...this.props.mapStyle.transition,
        };

        if (value === undefined) {
            delete transition[property];
        }
        else {
            transition[property] = value;
        }

        this.props.onStyleChanged({
            ...this.props.mapStyle,
            transition,
        });
    }

    changeLightProperty(property: keyof LightSpecification, value: any) {
        const light = {
            ...this.props.mapStyle.light,
        };

        if (value === undefined) {
            delete light[property];
        }
        else {
            // @ts-ignore
            light[property] = value;
        }

        this.props.onStyleChanged({
            ...this.props.mapStyle,
            light,
        });
    }

    changeTerrainProperty(property: keyof TerrainSpecification, value: any) {
        const terrain = {
            ...this.props.mapStyle.terrain,
        } as TerrainSpecification;

        if (value === undefined) {
            delete terrain[property];
        }
        else {
            // @ts-ignore
            terrain[property] = value;
        }

        this.props.onStyleChanged({
            ...this.props.mapStyle,
            terrain,
        });
    }

    changeProjectionType(value: any) {
        const projection = {
            ...this.props.mapStyle.projection,
        } as ProjectionSpecification;

        if (value === undefined) {
            delete projection.type;
        }
        else {
            projection.type = value;
        }

        this.props.onStyleChanged({
            ...this.props.mapStyle,
            projection,
        });
    }

    changeStyleProperty(property: keyof StyleSpecification | "owner", value: any) {
        const changedStyle = {
            ...this.props.mapStyle,
        };

        if (value === undefined) {
            // @ts-ignore
            delete changedStyle[property];
        }
        else {
            // @ts-ignore
            changedStyle[property] = value;
        }
        this.props.onStyleChanged(changedStyle);
    }

    render() {
        const metadata = this.props.mapStyle.metadata || {} as any;
        const { t, onChangeMetadataProperty, mapStyle } = this.props;
        const fsa = fieldSpecAdditional(t);

        const light = this.props.mapStyle.light || {};
        const transition = this.props.mapStyle.transition || {};
        const terrain = this.props.mapStyle.terrain || {} as TerrainSpecification;
        const projection = this.props.mapStyle.projection || {} as ProjectionSpecification;

        return <div className="maputnik-settings-panel">
            <div className="maputnik-sidebar-header">
                <h1>{t("Style Settings")}</h1>
            </div>
            <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
                <ScrollContainer>
                    <div className="maputnik-settings-panel-content" style={{ padding: '16px' }}>
                        <FieldString
                            label={t("Name")}
                            fieldSpec={latest.$root.name}
                            data-wd-key="modal:settings.name"
                            value={this.props.mapStyle.name}
                            onChange={(value) => this.changeStyleProperty("name", value)}
                        />
                        <FieldString
                            label={t("Owner")}
                            fieldSpec={{ doc: t("Owner ID of the style. Used by Mapbox or future style APIs.") }}
                            data-wd-key="modal:settings.owner"
                            value={(this.props.mapStyle as any).owner}
                            onChange={(value) => this.changeStyleProperty("owner", value)}
                        />
                        <Block label={t("Sprite URL")} fieldSpec={latest.$root.sprite} data-wd-key="modal:settings.sprite">
                            <FieldJson
                                lintType="json"
                                value={this.props.mapStyle.sprite as any}
                                onChange={(value) => this.changeStyleProperty("sprite", value)}
                            />
                        </Block>

                        <FieldUrl
                            label={t("Glyphs URL")}
                            fieldSpec={latest.$root.glyphs}
                            data-wd-key="modal:settings.glyphs"
                            value={this.props.mapStyle.glyphs as string}
                            onChange={(value) => this.changeStyleProperty("glyphs", value)}
                        />

                        <FieldString
                            label={fsa.maputnik.maptiler_access_token.label}
                            fieldSpec={fsa.maputnik.maptiler_access_token}
                            data-wd-key="modal:settings.maputnik:openmaptiles_access_token"
                            value={metadata["maputnik:openmaptiles_access_token"]}
                            onChange={(value) => onChangeMetadataProperty("maputnik:openmaptiles_access_token", value)}
                        />

                        <FieldArray
                            label={t("Center")}
                            fieldSpec={latest.$root.center}
                            length={2}
                            type="number"
                            value={mapStyle.center || []}
                            default={[0, 0]}
                            onChange={(value) => this.changeStyleProperty("center", value)}
                        />

                        <FieldNumber
                            label={t("Zoom")}
                            fieldSpec={latest.$root.zoom}
                            value={mapStyle.zoom}
                            default={0}
                            onChange={(value) => this.changeStyleProperty("zoom", value)}
                        />

                        <FieldNumber
                            label={t("Bearing")}
                            fieldSpec={latest.$root.bearing}
                            value={mapStyle.bearing}
                            default={latest.$root.bearing.default}
                            onChange={(value) => this.changeStyleProperty("bearing", value)}
                        />

                        <FieldNumber
                            label={t("Pitch")}
                            fieldSpec={latest.$root.pitch}
                            value={mapStyle.pitch}
                            default={latest.$root.pitch.default}
                            onChange={(value) => this.changeStyleProperty("pitch", value)}
                        />

                        <FieldSelect
                            label={t("Projection")}
                            data-wd-key="modal:settings.projection"
                            options={[
                                ["", "Undefined"],
                                ["mercator", "Mercator"],
                                ["globe", "Globe"],
                                ["vertical-perspective", "Vertical Perspective"]
                            ]}
                            value={projection?.type?.toString() || ""}
                            onChange={(value) => this.changeProjectionType(value)}
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
                            onChange={(value) => onChangeMetadataProperty("maputnik:renderer", value)}
                        />
                    </div>
                </ScrollContainer>
            </div>
        </div>;
    }
}

const SettingsPanel = withTranslation()(SettingsPanelInternal);
export default SettingsPanel;
