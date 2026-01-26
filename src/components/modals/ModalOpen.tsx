import React, { useState, useCallback, type FormEvent } from "react";
import { MdFileUpload, MdAddCircleOutline } from "react-icons/md";
import { Trans, useTranslation } from "react-i18next";

import ModalLoading from "./ModalLoading";
import Modal from "./Modal";
import InputButton from "../InputButton";
import InputUrl from "../InputUrl";

import style from "../../libs/style";
import publicStyles from "../../config/styles.json";

type PublicStyleProps = {
  url: string;
  thumbnailUrl: string;
  title: string;
  onSelect(url: string): void;
};

const PublicStyle: React.FC<PublicStyleProps> = ({
  url,
  thumbnailUrl,
  title,
  onSelect,
}) => {
  return (
    <div className="maputnik-public-style border rounded-md overflow-hidden hover:border-primary transition-colors">
      <InputButton
        className="maputnik-public-style-button w-full flex flex-col p-0 bg-background hover:bg-muted/50"
        aria-label={title}
        onClick={() => onSelect(url)}
      >
        <div className="maputnik-public-style-header flex items-center w-full px-3 py-2 border-b">
          <div className="font-bold text-sm truncate">{title}</div>
          <div className="flex-1" />
          <MdAddCircleOutline className="w-5 h-5 text-muted-foreground" />
        </div>
        <div
          className="maputnik-public-style-thumbnail w-full aspect-video bg-cover bg-center"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
          }}
        ></div>
      </InputButton>
    </div>
  );
};

export type ModalOpenProps = {
  isOpen: boolean;
  onOpenToggle(): void;
  onStyleOpen(mapStyle: any, fileHandle?: FileSystemFileHandle): void;
  fileHandle: FileSystemFileHandle | null;
};

const ModalOpen: React.FC<ModalOpenProps> = ({
  isOpen,
  onOpenToggle,
  onStyleOpen,
}) => {
  const { t } = useTranslation();
  const [styleUrl, setStyleUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [activeRequestUrl, setActiveRequestUrl] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const onCancelActiveRequest = useCallback(
    (e: React.MouseEvent | Event) => {
      if (e) e.stopPropagation();

      if (activeRequest) {
        activeRequest.abort();
        setActiveRequest(null);
        setActiveRequestUrl(null);
      }
    },
    [activeRequest]
  );

  const onStyleSelect = useCallback(
    (url: string) => {
      clearError();

      let canceled = false;
      setActiveRequest({
        abort: () => {
          canceled = true;
        },
      });
      setActiveRequestUrl(url);

      fetch(url, {
        mode: "cors",
        credentials: "same-origin",
      })
        .then((response) => response.json())
        .then((body) => {
          if (canceled) return;

          setActiveRequest(null);
          setActiveRequestUrl(null);

          const mapStyle = style.ensureStyleValidity(body);
          console.log("Loaded style ", mapStyle.id);
          onStyleOpen(mapStyle);
          onOpenToggle();
        })
        .catch((err) => {
          if (canceled) return;

          setError(`Failed to load: '${url}'`);
          setActiveRequest(null);
          setActiveRequestUrl(null);
          console.error(err);
          console.warn("Could not open the style URL", url);
        });
    },
    [onStyleOpen, onOpenToggle, clearError]
  );

  const onSubmitUrl = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onStyleSelect(styleUrl);
  };

  const onOpenFile = async () => {
    clearError();

    const pickerOpts: OpenFilePickerOptions = {
      types: [
        {
          description: "json",
          accept: { "application/json": [".json"] },
        },
      ],
      multiple: false,
    };

    try {
      const [fileHandle] = (await window.showOpenFilePicker(
        pickerOpts
      )) as Array<FileSystemFileHandle>;
      const file = await fileHandle.getFile();
      const content = await file.text();

      let mapStyle;
      try {
        mapStyle = JSON.parse(content);
      } catch (err) {
        setError((err as Error).toString());
        return;
      }
      mapStyle = style.ensureStyleValidity(mapStyle);

      onStyleOpen(mapStyle, fileHandle);
      onOpenToggle();
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).toString());
      }
    }
  };

  const onFileChanged = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    clearError();

    reader.readAsText(file, "UTF-8");
    reader.onload = (e) => {
      let mapStyle;
      try {
        mapStyle = JSON.parse(e.target?.result as string);
      } catch (err) {
        setError((err as Error).toString());
        return;
      }
      mapStyle = style.ensureStyleValidity(mapStyle);
      onStyleOpen(mapStyle);
      onOpenToggle();
    };
    reader.onerror = (e) => console.log(e.target);
  };

  const handleOpenToggle = useCallback(() => {
    setStyleUrl("");
    clearError();
    onOpenToggle();
  }, [onOpenToggle, clearError]);

  const styleOptions = publicStyles.map((s) => (
    <PublicStyle
      key={s.id}
      url={s.url}
      title={s.title}
      thumbnailUrl={s.thumbnail}
      onSelect={onStyleSelect}
    />
  ));

  return (
    <>
      <Modal
        data-wd-key="modal:open"
        isOpen={isOpen}
        onOpenToggle={handleOpenToggle}
        title={t("Open Style")}
      >
        {error && (
          <div className="maputnik-modal-error bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-center">
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="maputnik-modal-error-close text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}
        <section className="maputnik-modal-section space-y-4 mb-8">
          <h1 className="text-lg font-bold border-b pb-1">{t("Open local Style")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Open a local JSON style from your computer.")}
          </p>
          <div>
            {typeof window.showOpenFilePicker === "function" ? (
              <InputButton
                data-wd-key="modal:open.file.button"
                className="maputnik-big-button w-full sm:w-auto flex items-center justify-center py-4 px-8 text-lg"
                onClick={onOpenFile}
              >
                <MdFileUpload className="mr-2" /> {t("Open Style")}
              </InputButton>
            ) : (
              <label>
                <div
                  className="maputnik-button maputnik-upload-button cursor-pointer flex items-center border p-2 rounded hover:bg-muted"
                  aria-label={t("Open Style")}
                >
                  <MdFileUpload className="mr-2" /> {t("Open Style")}
                </div>
                <input
                  data-wd-key="modal:open.file.input"
                  type="file"
                  className="hidden"
                  onChange={(e) => onFileChanged(e.target.files)}
                />
              </label>
            )}
          </div>
        </section>

        <section className="maputnik-modal-section space-y-4 mb-8">
          <form onSubmit={onSubmitUrl} className="space-y-4">
            <h1 className="text-lg font-bold border-b pb-1">{t("Load from URL")}</h1>
            <p className="text-sm text-muted-foreground">
              <Trans t={t}>
                Load from a URL. Note that the URL must have{" "}
                <a
                  href="https://enable-cors.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CORS enabled
                </a>
                .
              </Trans>
            </p>
            <InputUrl
              aria-label={t("Style URL")}
              data-wd-key="modal:open.url.input"
              type="text"
              className="maputnik-input w-full"
              default={t("Enter URL...")}
              value={styleUrl}
              onInput={(v: any) => setStyleUrl(v)}
              onChange={(v: any) => setStyleUrl(v)}
            />
            <div>
              <InputButton
                data-wd-key="modal:open.url.button"
                type="submit"
                className="maputnik-big-button w-full sm:w-auto"
                disabled={styleUrl.length < 1}
              >
                {t("Load from URL")}
              </InputButton>
            </div>
          </form>
        </section>

        <section className="maputnik-modal-section space-y-4">
          <h1 className="text-lg font-bold border-b pb-1">{t("Gallery Styles")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Open one of the publicly available styles to start from.")}
          </p>
          <div className="maputnik-style-gallery-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {styleOptions}
          </div>
        </section>
      </Modal>

      <ModalLoading
        isOpen={!!activeRequest}
        title={t("Loading style")}
        onCancel={(e: any) => onCancelActiveRequest(e)}
        message={t("Loading: {{requestUrl}}", { requestUrl: activeRequestUrl })}
      />
    </>
  );
};

export default ModalOpen;
