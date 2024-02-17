import { notificationService } from "~/services/notification";
import { api } from "~/utils/api";
import { useDepotModal } from "./use-depot-modal.wip";

export const useDepot = () => {
  const apiContext = api.useContext();
  const depotModal = useDepotModal();

  const createDepot = api.depots.createDepot.useMutation({
    onSuccess: ({ id }) =>
      window.location.assign(`/tools/solidarity-pathways/${id}`),
    onError: (error) =>
      notificationService.notifyError({
        message: "Something went wrong",
        error,
      }),
  });

  const updateDepot = api.depots.updateDepot.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({ message: "Depot updated!" }),
    onError: (error) =>
      notificationService.notifyError({
        message: "Something went wrong",
        error,
      }),
    onSettled: () => {
      void apiContext.depots.invalidate();
      depotModal.onClose();
    },
  });
  return {
    createDepot,
    updateDepot,
  };
};
