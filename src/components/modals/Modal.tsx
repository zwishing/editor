import React, { type PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ModalProps = PropsWithChildren & {
  "data-wd-key"?: string;
  isOpen: boolean;
  title: string;
  onOpenToggle(): void;
  underlayClickExits?: boolean;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onOpenToggle,
  underlayClickExits = true,
  className,
  children,
  "data-wd-key": dataWdKey,
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenToggle();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background border shadow-lg sm:rounded-lg",
          className
        )}
        onPointerDownOutside={(e) => {
          if (!underlayClickExits) {
            e.preventDefault();
          }
        }}
        data-wd-key={dataWdKey}
      >
        <DialogHeader className="px-6 py-4 border-b shrink-0 flex flex-row items-center justify-between space-y-0">
          <DialogTitle
            className="text-lg font-bold leading-none tracking-tight"
            data-wd-key={dataWdKey ? `${dataWdKey}.title` : undefined}
          >
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 custom-scrollbar">
          <div
            className="maputnik-modal-content"
            data-wd-key={dataWdKey ? `${dataWdKey}.content` : undefined}
          >
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
