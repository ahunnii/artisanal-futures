/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";

import type {
  ExpandedRouteData,
  PusherMessage,
  PusherUserData,
} from "~/components/tools/routing/types";
import { pusherClient } from "~/server/soketi/client";

import {
  removeCurrentLocation,
  sendCurrentLocation,
} from "~/utils/routing/realtime-utils";

const TRACKING_DURATION = 1000; // 10000ms = 10s

const useRealTime = (routeData?: ExpandedRouteData, routeId?: string) => {
  const [activeUsers, setActiveUsers] = useState<PusherUserData[]>([]);
  const [messages, setMessages] = useState<PusherMessage[]>([]);
  const [isTrackingCurrentUser, setIsTrackingCurrentUser] =
    useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // const apiContext = api.useContext();
  const triggerActiveUser = () => sendCurrentLocation(routeId!, routeData!);
  // const testMessage = (message: string) => {
  //   console.log(message);
  //   if (message === "invalidate") {
  //     void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();
  //     toast.success("Invalidate");
  //   }
  // };

  useEffect(() => {
    // const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
    //   cluster: "us2",
    // });
    const channel = pusherClient.subscribe("map");

    channel.bind("update-locations", setActiveUsers);
    channel.bind("update-messages", setMessages);
    // channel.bind("evt::test-message", testMessage);

    return () => {
      removeCurrentLocation();
      channel.unbind();
    };
  }, []);

  useEffect(() => {
    if (isTrackingCurrentUser) {
      const id = setInterval(triggerActiveUser, TRACKING_DURATION);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);

      removeCurrentLocation();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        removeCurrentLocation();
      }
    };
  }, [isTrackingCurrentUser]);

  return {
    activeUsers,
    messages,
    isTrackingCurrentUser,
    setIsTrackingCurrentUser,
  };
};

export default useRealTime;
