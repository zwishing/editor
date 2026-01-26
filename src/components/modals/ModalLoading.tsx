import React from "react";
import { useTranslation } from "react-i18next";

import InputButton from "../InputButton";
import Modal from "./Modal";

export type ModalLoadingProps = {
  isOpen: boolean;
  onCancel(e?: React.MouseEvent | Event): void;
  title: string;
  message: React.ReactNode;
};

const ModalLoading: React.FC<ModalLoadingProps> = ({
  isOpen,
  onCancel,
  title,
  message,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      data-wd-key="modal:loading"
      isOpen={isOpen}
      underlayClickExits={false}
      title={title}
      onOpenToggle={() => onCancel()}
    >
      <div className="space-y-6">
        <p className="text-sm text-foreground/80">{message}</p>
        <div className="flex justify-end p-4">
          <InputButton onClick={(e: any) => onCancel(e)}>
            {t("Cancel")}
          </InputButton>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLoading;
