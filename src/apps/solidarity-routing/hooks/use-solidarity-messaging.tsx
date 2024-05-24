import { notificationService } from "~/services/notification";
import { api } from "~/utils/api";
import type { Member } from "../types.wip";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { Channel } from "~/apps/solidarity-routing/types.wip";
import { useUrlParams } from "~/hooks/use-url-params";
import { useMessageChannelStore } from "../stores/use-message-store";

import { useOptimizedRoutePlan } from "./optimized-data/use-optimized-route-plan";
import { useSolidarityState } from "./optimized-data/use-solidarity-state";

export const useSolidarityMessaging = () => {
  const { updateUrlParams } = useUrlParams();
  const { data: session } = useSession();
  const sessionMessages = useMessageChannelStore((state) => state);
  const { depotId, isUserAllowedToSaveToDepot } = useSolidarityState();
  const { currentDriver } = useOptimizedRoutePlan();

  const getDepotChannels = api.routeMessaging.getAllDepotChannels.useQuery(
    { depotId },
    { enabled: !!depotId }
  );

  const getDepotMembers = api.routeMessaging.getAllMembers.useQuery(
    { depotId },
    { enabled: !!depotId }
  );

  const apiContext = api.useContext();

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

  const createDriverChannels =
    api.routeMessaging.createDriverChannels.useMutation({
      onSuccess: () =>
        notificationService.notifySuccess({
          message: "Driver channels has been successfully created.",
        }),

      onError: (error) =>
        notificationService.notifyError({
          message:
            "Something went wrong with creating the driver channels. Please try again.",
          error,
        }),
    });

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
    if (!currentDriver?.driver?.id) return "";
    return getDriverDepotMemberById(currentDriver?.driver?.id)?.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDriver]);

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

      if (!state) {
      }
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

    messageDriverById: (id: string | null) => {
      sessionMessages.setIsDepot(true);
      setActiveChannelById(id);
      if (id) sessionMessages.setIsDriverMessagePanelOpen(true);
    },

    messageDepotById: (id: string | null) => {
      sessionMessages.setIsDepot(false);
      setActiveChannelById(id);
      if (id) sessionMessages.setIsDriverMessagePanelOpen(true);
    },

    messageDepot: (email: string | null) => {
      sessionMessages.setIsDepot(false);
      setActiveChannelByEmail(email);
      if (email) sessionMessages.setIsDriverMessagePanelOpen(true);
    },
    createDriverChannels,
  };
};
