import React from "react";
import InputButton from "./InputButton";
import { MdDelete } from "react-icons/md";
import { useTranslation } from "react-i18next";

type DeleteStopButtonProps = {
  onClick?(...args: unknown[]): unknown
};

const DeleteStopButton: React.FC<DeleteStopButtonProps> = (props) => {
  const { t } = useTranslation();
  return (
    <InputButton
      className="maputnik-delete-stop"
      onClick={props.onClick}
      title={t("Remove zoom level from stop")}
    >
      <MdDelete />
    </InputButton>
  );
};

export default DeleteStopButton;

