import { notificationService } from "~/services/notification";
import { api } from "~/utils/api";
import type { DriverVehicleBundle, Member } from "../types.wip";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Channel } from "~/apps/solidarity-routing/types.wip";
import { useUrlParams } from "~/hooks/use-url-params";
import { useMessageChannelStore } from "./drivers/use-message-store";
import { useOptimizedRoutePlan } from "./optimized-data/use-optimized-route-plan";
import { useSolidarityState } from "./optimized-data/use-solidarity-state";

export const useSolidarityMessaging = () => {
  const { updateUrlParams, getUrlParam } = useUrlParams();
  const { data: session } = useSession();
  const { depotId, isUserAllowedToSaveToDepot, driverId, vehicle } =
    useSolidarityState();

  const optimizedRoute = useOptimizedRoutePlan();
  const { isMessageSheetOpen } = useDriverVehicleBundles();
  const apiContext = api.useContext();

  const sessionMessages = useMessageChannelStore((state) => state);

  const getDepotChannels = api.routeMessaging.getAllDepotChannels.useQuery(
    { depotId },
    { enabled: !!depotId }
  );

  const getDepotMembers = api.routeMessaging.getAllMembers.useQuery(
    { depotId },
    { enabled: !!depotId }
  );

  const depotChannels = getDepotChannels.data ?? [];
  const depotMembers = getDepotMembers.data ?? [];

  const checkIfChannelExists = (id: string | null): Channel | null => {
    return depotChannels?.find((channel: Channel) => channel.id === id) ?? null;
  };

  const checkIfDriverChannelExists = (email: string | null): Channel | null => {
    return (
      depotChannels?.find((channel: Channel) => channel.name === email) ?? null
    );
  };

  const setActiveChannelById = (id: string | null) => {
    updateUrlParams({
      key: "channelId",
      value: id,
    });

    const channel = isUserAllowedToSaveToDepot
      ? checkIfChannelExists(id)
      : null;

    if (!channel) {
      sessionMessages.setActiveChannel(null);
      return;
    }

    if (!isUserAllowedToSaveToDepot) return;
    else sessionMessages.setActiveChannel(channel);
  };

  const setActiveChannelByEmail = (email: string | null) => {
    const channel = isUserAllowedToSaveToDepot
      ? checkIfDriverChannelExists(email)
      : null;

    if (!channel) {
      sessionMessages.setActiveChannel(null);
      return;
    }

    updateUrlParams({
      key: "channelId",
      value: channel.id,
    });

    if (!isUserAllowedToSaveToDepot) return;
    else sessionMessages.setActiveChannel(channel);
  };

  const getDriverDepotMemberById = (id: string | null) => {
    return (
      depotMembers?.find((member: Member) => member.profile.driverId === id) ??
      null
    );
  };

  const getOwnerDepotMemberById = () => {
    const id = session?.user?.id;
    return (
      depotMembers?.find((member: Member) => member.profile.userId === id) ??
      null
    );
  };

  // const driverMemberId =() => getDriverDepotMemberById(driverId)?.id;
  const ownerMemberId = getOwnerDepotMemberById()?.id ?? "";
  const driverMemberId = useMemo(() => {
    if (!optimizedRoute?.currentDriver?.driver?.id) return "";
    return getDriverDepotMemberById(optimizedRoute?.currentDriver?.driver?.id)
      ?.id;
  }, [optimizedRoute?.currentDriver]);

  // const getDepotDriverChannel =
  //   api.routeMessaging.getDepotDriverChannel.useQuery(
  //     {
  //       depotId,
  //       driverId: currentDriver?.driver.id ?? "",
  //     },
  //     { enabled: currentDriver?.driver?.id !== undefined && isMessageSheetOpen }
  //   );

  // const getChannelMembership = api.routeMessaging.getMember.useQuery(
  //   {
  //     depotId,
  //     driverId: !isDepot ? currentDriver?.driver.id : undefined,
  //   },
  //   {
  //     enabled:
  //       (!isDepot ? currentDriver?.driver?.id !== undefined : true) &&
  //       isMessageSheetOpen,
  //   }
  // );

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

  return {
    // driverChannel: getDepotDriverChannel.data,
    // membership: getChannelMembership.data,
    // driverMemberId,
    ownerMemberId,
    memberId: sessionMessages.isDepot ? ownerMemberId : driverMemberId,
    createMessage: createChannelMessage.mutate,
    messages:
      checkIfChannelExists(sessionMessages.activeChannel?.id ?? null)
        ?.messages ?? [],
    setActiveChannelById,
    setActiveChannelByEmail,
    active: sessionMessages.activeChannel,

    isMessageSheetOpen: sessionMessages.isDriverMessagePanelOpen,
    onMessageSheetOpenChange: (state: boolean) => {
      if (!state) setActiveChannelById(null);
      sessionMessages.setIsDriverMessagePanelOpen(state);
    },
    messageById: (id: string) => {
      setActiveChannelById(id);
      sessionMessages.setIsDriverMessagePanelOpen(true);
    },
    messageByEmail: (email: string) => {
      setActiveChannelByEmail(email);
      sessionMessages.setIsDriverMessagePanelOpen(true);
    },
    setIsDepot: sessionMessages.setIsDepot,
    isDepot: sessionMessages.isDepot,

    messageDriver: (email: string | null) => {
      sessionMessages.setIsDepot(true);
      setActiveChannelByEmail(email);
      if (email) sessionMessages.setIsDriverMessagePanelOpen(true);
    },

    messageDepot: (email: string | null) => {
      sessionMessages.setIsDepot(false);
      setActiveChannelByEmail(email);
      if (email) sessionMessages.setIsDriverMessagePanelOpen(true);
    },
  };
};
