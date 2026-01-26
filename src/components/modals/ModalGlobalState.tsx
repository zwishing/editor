import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";

import Modal from "./Modal";
import FieldString from "../FieldString";
import InputButton from "../InputButton";
import { PiListPlusBold } from "react-icons/pi";
import { type StyleSpecificationWithId } from "../../libs/definitions";
import { type SchemaSpecification } from "maplibre-gl";
import Doc from "../Doc";

export type ModalGlobalStateProps = {
  mapStyle: StyleSpecificationWithId;
  isOpen: boolean;
  onStyleChanged(style: StyleSpecificationWithId): void;
  onOpenToggle(): void;
};

type GlobalStateVariable = {
  key: string;
  value: any;
};

const ModalGlobalState: React.FC<ModalGlobalStateProps> = ({
  mapStyle,
  isOpen,
  onStyleChanged,
  onOpenToggle,
}) => {
  const { t } = useTranslation();

  const variables = useMemo((): GlobalStateVariable[] => {
    const globalState = mapStyle.state || {};
    return Object.entries(globalState).map(([key, value]) => ({
      key,
      value: value.default,
    }));
  }, [mapStyle.state]);

  const setGlobalStateVariables = useCallback(
    (newVariables: GlobalStateVariable[]) => {
      const globalState: Record<string, SchemaSpecification> = {};
      for (const variable of newVariables) {
        if (variable.key.trim() !== "") {
          globalState[variable.key] = {
            default: variable.value,
          };
        }
      }

      const newStyle = {
        ...mapStyle,
        state: Object.keys(globalState).length > 0 ? globalState : undefined,
      };

      onStyleChanged(newStyle);
    },
    [mapStyle, onStyleChanged]
  );

  const onAddVariable = useCallback(() => {
    let index = 1;
    while (variables.find((v) => v.key === `key${index}`)) {
      index++;
    }
    const newVariables = [...variables, { key: `key${index}`, value: "value" }];
    setGlobalStateVariables(newVariables);
  }, [variables, setGlobalStateVariables]);

  const onRemoveVariable = useCallback(
    (index: number) => {
      const newVariables = [...variables];
      newVariables.splice(index, 1);
      setGlobalStateVariables(newVariables);
    },
    [variables, setGlobalStateVariables]
  );

  const onChangeVariableKey = useCallback(
    (index: number, newKey: string) => {
      const newVariables = [...variables];
      newVariables[index] = { ...newVariables[index], key: newKey };
      setGlobalStateVariables(newVariables);
    },
    [variables, setGlobalStateVariables]
  );

  const onChangeVariableValue = useCallback(
    (index: number, newValue: string) => {
      const newVariables = [...variables];
      newVariables[index] = { ...newVariables[index], value: newValue };
      setGlobalStateVariables(newVariables);
    },
    [variables, setGlobalStateVariables]
  );

  return (
    <Modal
      data-wd-key="modal:global-state"
      isOpen={isOpen}
      onOpenToggle={onOpenToggle}
      title={t("Global State Variables")}
    >
      <div className="space-y-6">
        {variables.length === 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t(
                "No global state variables defined. Add variables to create reusable values in your style."
              )}
            </p>
            <div className="maputnik-doc-inline p-4 bg-muted/30 rounded-md border border-dashed">
              <Doc fieldSpec={latest.$root.state} />
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 font-medium text-sm">{t("Key")}</th>
                  <th className="py-2 font-medium text-sm">{t("Value")}</th>
                  <th className="py-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {variables.map((variable, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2 pr-2">
                      <FieldString
                        label={t("Key")}
                        value={variable.key}
                        onChange={(value: any) =>
                          onChangeVariableKey(index, value || "")
                        }
                        data-wd-key={"global-state-variable-key:" + index}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <FieldString
                        label={t("Value")}
                        value={variable.value}
                        onChange={(value: any) =>
                          onChangeVariableValue(index, value || "")
                        }
                        data-wd-key={"global-state-variable-value:" + index}
                      />
                    </td>
                    <td className="py-2 align-middle">
                      <InputButton
                        onClick={() => onRemoveVariable(index)}
                        title={t("Remove variable")}
                        data-wd-key="global-state-remove-variable"
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        style={{ backgroundColor: "transparent" }}
                      >
                        <MdDelete className="w-5 h-5" />
                      </InputButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="pt-2">
          <InputButton
            onClick={onAddVariable}
            data-wd-key="global-state-add-variable"
            className="flex items-center space-x-2"
          >
            <PiListPlusBold className="w-4 h-4" />
            <span>{t("Add Variable")}</span>
          </InputButton>
        </div>
      </div>
    </Modal>
  );
};

export default ModalGlobalState;
