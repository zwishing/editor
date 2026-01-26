import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import Modal from "./Modal";

export type ModalDebugProps = {
  isOpen: boolean;
  renderer: string;
  onChangeMaplibreGlDebug(key: string, checked: boolean): void;
  onChangeOpenlayersDebug(key: string, checked: boolean): void;
  onOpenToggle(): void;
  maplibreGlDebugOptions?: Record<string, boolean>;
  openlayersDebugOptions?: Record<string, boolean>;
  mapView: {
    zoom: number;
    center: {
      lng: number;
      lat: number;
    };
  };
};

const ModalDebug: React.FC<ModalDebugProps> = ({
  isOpen,
  renderer,
  onChangeMaplibreGlDebug,
  onChangeOpenlayersDebug,
  onOpenToggle,
  maplibreGlDebugOptions = {},
  openlayersDebugOptions = {},
  mapView,
}) => {
  const { t } = useTranslation();

  const osmLinkData = useMemo(() => {
    const osmZoom = Math.round(mapView.zoom) + 1;
    const osmLon = +mapView.center.lng.toFixed(5);
    const osmLat = +mapView.center.lat.toFixed(5);
    return { osmZoom, osmLon, osmLat };
  }, [mapView]);

  return (
    <Modal
      data-wd-key="modal:debug"
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Debug")}
    >
      <section className="maputnik-modal-section space-y-4 mb-8">
        <h1 className="text-lg font-bold border-b pb-1">{t("Options")}</h1>
        {renderer === "mlgljs" && (
          <ul className="space-y-2">
            {Object.entries(maplibreGlDebugOptions).map(([key, val]) => (
              <li key={key}>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => onChangeMaplibreGlDebug(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">{key}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
        {renderer === "ol" && (
          <ul className="space-y-2">
            {Object.entries(openlayersDebugOptions).map(([key, val]) => (
              <li key={key}>
                <label className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => onChangeOpenlayersDebug(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">{key}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="maputnik-modal-section space-y-4">
        <h1 className="text-lg font-bold border-b pb-1">{t("Links")}</h1>
        <p className="text-sm text-muted-foreground">
          <Trans t={t}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.openstreetmap.org/#map=${osmLinkData.osmZoom}/${osmLinkData.osmLat}/${osmLinkData.osmLon}`}
              className="text-primary hover:underline font-medium"
            >
              Open in OSM
            </a>
            . Opens the current view on openstreetmap.org
          </Trans>
        </p>
      </section>
    </Modal>
  );
};

export default ModalDebug;
