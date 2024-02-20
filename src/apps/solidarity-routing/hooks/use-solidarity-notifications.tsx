import { useParams } from "next/navigation";

import { api } from "~/utils/api";

export const useSolidarityNotifications = () => {
  const params = useParams();
  const routeId = params?.routeId;
  const apiContext = api.useContext();

  const getMessagingProfile = api.routeMessaging.getMessageProfile.useQuery(
    { routeId: routeId as string },
    { enabled: !!routeId }
  );

  const updateMessagingStatus =
    api.routeMessaging.updateMessageReadState.useMutation({
      onError: (e) => console.error(e),
      onSettled: () => void apiContext.routeMessaging.invalidate(),
    });

  return {
    notifications: getMessagingProfile.data ?? [],
    updateMessagingStatus: updateMessagingStatus.mutate,
  };
};
