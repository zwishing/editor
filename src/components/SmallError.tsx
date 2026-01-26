import React from "react";
import { useTranslation } from "react-i18next";

type SmallErrorProps = {
  children?: React.ReactNode
};

const SmallError: React.FC<SmallErrorProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-1 text-xs font-medium text-destructive">
      {t("Error:")} {children}
    </div>
  );
};

export default SmallError;
