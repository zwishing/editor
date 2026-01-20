import React from "react";
import classnames from "classnames";
import { MdLayers, MdSettings, MdCode, MdPublic, MdSource } from "react-icons/md";

type IconRailProps = {
    activeModal: string | null;
    onToggleModal: (name: string) => void;
    activeView: "layers" | "settings" | "sources" | "globalState" | "codeEditor";
    onViewChange: (view: "layers" | "settings" | "sources" | "globalState" | "codeEditor") => void;
};

const IconRailItem: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}> = ({ active, onClick, icon, label }) => (
    <button
        className={classnames("maputnik-icon-rail-item", { active })}
        onClick={onClick}
        title={label}
    >
        {icon}
        <span className="label">{label}</span>
    </button>
);

const AppIconRail: React.FC<IconRailProps> = ({ activeModal, onToggleModal, activeView, onViewChange }) => {
    return (
        <div className="maputnik-icon-rail">
            <div className="maputnik-icon-rail-group">
                <IconRailItem
                    active={activeView === "layers"}
                    onClick={() => onViewChange("layers")}
                    icon={<MdLayers size={24} />}
                    label="Layers"
                />
                <IconRailItem
                    active={activeView === "sources"}
                    onClick={() => onViewChange("sources")}
                    icon={<MdSource size={24} />}
                    label="Sources"
                />
            </div>
            <div className="maputnik-icon-rail-group bottom">
                <IconRailItem
                    active={activeView === "codeEditor"}
                    onClick={() => onViewChange("codeEditor")}
                    icon={<MdCode size={24} />}
                    label="Code"
                />
                <IconRailItem
                    active={activeView === "settings"}
                    onClick={() => onViewChange("settings")}
                    icon={<MdSettings size={24} />}
                    label="Settings"
                />
                <IconRailItem
                    active={activeView === "globalState"}
                    onClick={() => onViewChange("globalState")}
                    icon={<MdPublic size={24} />}
                    label="Global"
                />
            </div>
        </div>
    );
};

export default AppIconRail;
