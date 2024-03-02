import { api } from "~/utils/api";
import { notificationService } from "~/services/notification";

export const useCreateRoadPoint = () => {
  const createRoadPointByLatLng = api.roadPoints.createByLatLng.useMutation({
    onSuccess: () => {
      notificationService.notifySuccess({
        message: "Road point successfully added.",
      });
    },
    onError: (error: unknown) => {
      notificationService.notifyError({
        message: "There was an issue adding the road point. Please try again.",
        error,
      });
    },
  });

  return {
    addRoadPointByLatLng: ({ lat, lng }) => {
      createRoadPointByLatLng.mutate({ lat, lng });
    },
  };
};