import { Trash } from "lucide-react";

import { AlertModal } from "~/apps/admin/components/modals/alert-modal";
import { Button } from "./ui/button";

type TDeleteItemProps = {
  isDisabled: boolean;
  confirmCallback: () => void;
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
};

export const DeleteItem = ({
  isDisabled,
  confirmCallback,
  isOpen,
  onOpen,
  onClose,
}: TDeleteItemProps) => {
  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={confirmCallback}
        loading={isDisabled}
      />

      <Button
        disabled={isDisabled}
        variant="destructive"
        size="sm"
        onClick={onOpen}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </>
  );
};
