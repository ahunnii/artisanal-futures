import { notificationService } from "~/services/notification";
import { api } from "~/utils/api";
import type { DriverVehicleBundle } from "../types.wip";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";

import { useSolidarityState } from "./optimized-data/use-solidarity-state";

export const useSolidarityMessaging = ({
  currentDriver,
  isDepot,
}: {
  currentDriver: DriverVehicleBundle | null;
  isDepot: boolean;
}) => {
  //   const [openMessaging, setOpenMessaging] = useState(false);
  const { depotId } = useSolidarityState();
  const { isMessageSheetOpen } = useDriverVehicleBundles();
  const apiContext = api.useContext();

  const getDepotDriverChannel =
    api.routeMessaging.getDepotDriverChannel.useQuery(
      {
        depotId,
        driverId: currentDriver?.driver.id ?? "",
      },
      { enabled: currentDriver?.driver?.id !== undefined && isMessageSheetOpen }
    );

  const getChannelMembership = api.routeMessaging.getMember.useQuery(
    {
      depotId,
      driverId: !isDepot ? currentDriver?.driver.id : undefined,
    },
    {
      enabled:
        (!isDepot ? currentDriver?.driver?.id !== undefined : true) &&
        isMessageSheetOpen,
    }
  );

  const createChannelMessage =
    api.routeMessaging.sendDriverChannelMessage.useMutation({
      onSuccess: () =>
        notificationService.notifySuccess({ message: "Message sent" }),
      onError: (error: unknown) => {
        notificationService.notifyError({
          message: "There was an issue sending your message",
          error,
        });
      },
      onSettled: () => {
        void apiContext.routeMessaging.invalidate();
      },
    });

  console.log(getChannelMembership.data);
  return {
    driverChannel: getDepotDriverChannel.data,
    membership: getChannelMembership.data,
    createMessage: createChannelMessage.mutate,
  };
};
