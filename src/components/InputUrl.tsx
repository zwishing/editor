import React, { useState, useCallback } from "react";
import InputString from "./InputString";
import SmallError from "./SmallError";
import { Trans, useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { ErrorType, validate } from "../libs/urlopen";

function ErrorMessage({ errorType, t }: { errorType: ErrorType | undefined; t: TFunction }) {
  if (!errorType) return null;

  switch (errorType) {
    case ErrorType.EmptyHttpsProtocol:
      return (
        <SmallError>
          <Trans t={t}>
            Must provide protocol: <code>https://</code>
          </Trans>
        </SmallError>
      );
    case ErrorType.EmptyHttpOrHttpsProtocol:
      return (
        <SmallError>
          <Trans t={t}>
            Must provide protocol: <code>http://</code> or <code>https://</code>
          </Trans>
        </SmallError>
      );
    case ErrorType.CorsError:
      return (
        <SmallError>
          <Trans t={t}>
            CORS policy won&apos;t allow fetching resources served over http from https, use a{" "}
            <code>https://</code> domain
          </Trans>
        </SmallError>
      );
    default:
      return null;
  }
}

export type InputUrlProps = {
  "data-wd-key"?: string;
  value: string;
  style?: React.CSSProperties;
  default?: string;
  onChange(url: string | undefined): void;
  onInput?(url: string): void;
  multi?: boolean;
  required?: boolean;
  "aria-label"?: string;
  type?: string;
  className?: string;
};

const InputUrl: React.FC<InputUrlProps> = (props) => {
  const { t } = useTranslation();
  const [error, setError] = useState<ErrorType | undefined>(() => validate(props.value));

  const handleInput = useCallback(
    (url: string | undefined) => {
      const resolvedUrl = url || "";
      const validationError = validate(resolvedUrl);
      setError(validationError);
      props.onInput?.(resolvedUrl);
    },
    [props]
  );

  const handleChange = useCallback(
    (url: string | undefined) => {
      const resolvedUrl = url || "";
      setError(validate(resolvedUrl));
      props.onChange(resolvedUrl || undefined);
    },
    [props]
  );

  return (
    <div className="space-y-1">
      <InputString
        {...props}
        onInput={handleInput}
        onChange={handleChange}
        aria-label={props["aria-label"]}
      />
      <ErrorMessage errorType={error} t={t} />
    </div>
  );
};

export default InputUrl;

