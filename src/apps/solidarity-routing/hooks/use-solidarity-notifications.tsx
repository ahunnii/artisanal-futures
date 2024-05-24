import { useParams } from "next/navigation";

import { api } from "~/utils/api";
import { useSolidarityState } from "./optimized-data/use-solidarity-state";

export const useSolidarityNotifications = () => {
  const params = useParams();

  const { driverId, pathId, depotId } = useSolidarityState();
  const routeId = params?.routeId;

  const apiContext = api.useContext();

  const getMessagingProfile = api.routeMessaging.getMessageProfile.useQuery(
    { routeId: routeId as string, driverId: pathId ? driverId : undefined },
    { enabled: !!routeId }
  );

  const getUnreadDepotMessages =
    api.routeMessaging.getUnreadMessagesByChannel.useQuery(
      { depotId },
      { enabled: !pathId }
    );

  const getUnreadDriverMessages =
    api.routeMessaging.getUnreadMessagesByChannel.useQuery(
      { vehicleId: pathId ? driverId! : undefined, depotId },
      { enabled: !!driverId && !!pathId }
    );

  const updateMessagingStatus =
    api.routeMessaging.updateMessageReadState.useMutation({
      onError: (e) => console.error(e),
      onSettled: () => void apiContext.routeMessaging.invalidate(),
    });

  const updateOtherMessageStatus =
    api.routeMessaging.updateOtherMessageReadState.useMutation({
      // onSuccess: () =>
      //   notificationService.notifyInfo({ message: "notifications updated" }),
      onError: (e) => console.error(e),
      onSettled: () => void apiContext.routeMessaging.invalidate(),
    });

  return {
    notifications: getMessagingProfile.data ?? [],
    unread: (pathId
      ? getUnreadDriverMessages.data
      : getUnreadDepotMessages.data) ?? {
      channelsByServer: [],
      totalUnread: 0,
    },
    updateMessagingStatus: updateMessagingStatus.mutate,
    updateOtherMessageStatus: updateOtherMessageStatus.mutate,
  };
};
