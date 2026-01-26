import React, { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import Modal from "./Modal";

export type ModalShortcutsProps = {
  isOpen: boolean;
  onOpenToggle(): void;
};

const ModalShortcuts: React.FC<ModalShortcutsProps> = ({
  isOpen,
  onOpenToggle,
}) => {
  const { t } = useTranslation();

  const help = useMemo(
    () => [
      {
        key: <kbd>?</kbd>,
        text: t("Shortcuts menu"),
      },
      {
        key: <kbd>o</kbd>,
        text: t("Open modal"),
      },
      {
        key: <kbd>e</kbd>,
        text: t("Export modal"),
      },
      {
        key: <kbd>d</kbd>,
        text: t("Data Sources modal"),
      },
      {
        key: <kbd>s</kbd>,
        text: t("Style Settings modal"),
      },
      {
        key: <kbd>i</kbd>,
        text: t("Toggle inspect"),
      },
      {
        key: <kbd>m</kbd>,
        text: t("Focus map"),
      },
      {
        key: <kbd>!</kbd>,
        text: t("Debug modal"),
      },
    ],
    [t]
  );

  const mapShortcuts = useMemo(
    () => [
      {
        key: <kbd>+</kbd>,
        text: t("Increase the zoom level by 1."),
      },
      {
        key: (
          <>
            <kbd>Shift</kbd> + <kbd>+</kbd>
          </>
        ),
        text: t("Increase the zoom level by 2."),
      },
      {
        key: <kbd>-</kbd>,
        text: t("Decrease the zoom level by 1."),
      },
      {
        key: (
          <>
            <kbd>Shift</kbd> + <kbd>-</kbd>
          </>
        ),
        text: t("Decrease the zoom level by 2."),
      },
      {
        key: <kbd>Up</kbd>,
        text: t("Pan up by 100 pixels."),
      },
      {
        key: <kbd>Down</kbd>,
        text: t("Pan down by 100 pixels."),
      },
      {
        key: <kbd>Left</kbd>,
        text: t("Pan left by 100 pixels."),
      },
      {
        key: <kbd>Right</kbd>,
        text: t("Pan right by 100 pixels."),
      },
      {
        key: (
          <>
            <kbd>Shift</kbd> + <kbd>Right</kbd>
          </>
        ),
        text: t("Increase the rotation by 15 degrees."),
      },
      {
        key: (
          <>
            <kbd>Shift</kbd> + <kbd>Left</kbd>
          </>
        ),
        text: t("Decrease the rotation by 15 degrees."),
      },
      {
        key: (
          <>
            <kbd>Shift</kbd> + <kbd>Up</kbd>
          </>
        ),
        text: t("Increase the pitch by 10 degrees."),
      },
      {
        key: (
          <>
            <kbd>Shift</kbd> + <kbd>Down</kbd>
          </>
        ),
        text: t("Decrease the pitch by 10 degrees."),
      },
    ],
    [t]
  );

  return (
    <Modal
      data-wd-key="modal:shortcuts"
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Shortcuts")}
    >
      <section className="maputnik-modal-section space-y-6">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            <Trans t={t}>
              Press <code className="bg-muted px-1 rounded">ESC</code> to lose focus of any active elements, then press one of:
            </Trans>
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {help.map((item, idx) => (
              <div
                key={idx}
                className="maputnik-modal-shortcuts__shortcut flex items-center justify-between py-1 border-b last:border-0 sm:border-0"
              >
                <dt className="bg-muted px-2 py-0.5 rounded font-mono text-sm">
                  {item.key}
                </dt>
                <dd className="text-sm">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold border-b pb-1">
            {t("If the Map is in focused you can use the following shortcuts")}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {mapShortcuts.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-4">
                <span className="bg-muted px-2 py-0.5 rounded font-mono text-xs whitespace-nowrap">
                  {item.key}
                </span>
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Modal>
  );
};

export default ModalShortcuts;
