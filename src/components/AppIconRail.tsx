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
        className={classnames(
            "flex flex-col items-center justify-center p-1 rounded-md transition-colors w-full aspect-square gap-1",
            {
                "bg-primary text-primary-foreground shadow-sm": active,
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground": !active
            }
        )}
        onClick={onClick}
        title={label}
    >
        {icon}
        <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
);

const AppIconRail: React.FC<IconRailProps> = ({ activeModal, onToggleModal, activeView, onViewChange }) => {
    return (
        <div className="flex flex-col w-20 bg-card border-r border-border h-full items-center py-2 z-10 relative">
            <div className="flex flex-col gap-2 w-full px-2">
                <IconRailItem
                    active={activeView === "layers"}
                    onClick={() => onViewChange("layers")}
                    icon={<MdLayers size={20} />}
                    label="Layers"
                />
                <IconRailItem
                    active={activeView === "sources"}
                    onClick={() => onViewChange("sources")}
                    icon={<MdSource size={20} />}
                    label="Sources"
                />
            </div>
            <div className="flex flex-col gap-2 w-full px-2 mt-auto">
                <IconRailItem
                    active={activeView === "codeEditor"}
                    onClick={() => onViewChange("codeEditor")}
                    icon={<MdCode size={20} />}
                    label="Code"
                />
                <IconRailItem
                    active={activeView === "settings"}
                    onClick={() => onViewChange("settings")}
                    icon={<MdSettings size={20} />}
                    label="Settings"
                />
                <IconRailItem
                    active={activeView === "globalState"}
                    onClick={() => onViewChange("globalState")}
                    icon={<MdPublic size={20} />}
                    label="Global"
                />
            </div>
        </div>
    );
};

export default AppIconRail;
