import React from "react";
import Block from "./Block";
import InputString from "./InputString";
import { useTranslation } from "react-i18next";

type FieldCommentProps = {
  value?: string;
  onChange(value: string | undefined): void;
  error?: { message: string };
};

const FieldComment: React.FC<FieldCommentProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  const fieldSpec = {
    doc: t("Comments for the current layer. This is non-standard and not in the spec."),
  };

  return (
    <Block
      label={t("Comments")}
      fieldSpec={fieldSpec}
      data-wd-key="layer-comment"
      error={error}
    >
      <InputString
        multi={true}
        value={value}
        onChange={onChange}
        default={t("Comment...")}
        data-wd-key="layer-comment.input"
      />
    </Block>
  );
};

export default FieldComment;

