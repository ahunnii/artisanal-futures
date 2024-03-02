import { api } from "~/utils/api";
import { notificationService } from "~/services/notification";

export const useDeleteRoadPoint = () => {
  const deleteRoadPointByID = api.roadPoints.deleteById.useMutation({
    onSuccess: () => {
      notificationService.notifySuccess({
        message: "Road point successfully deleted.",
      });
    },
    onError: (error: unknown) => {
      notificationService.notifyError({
        message: "There was an issue deleting the road point. Please try again.",
        error,
      });
    },
  });

  return {
    deleteRoadPointByID: (id: string) => {
      deleteRoadPointByID.mutate({ id });
    },
  };
};