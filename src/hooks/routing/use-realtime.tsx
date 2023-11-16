/* eslint-disable react-hooks/exhaustive-deps */

import Pusher from "pusher-js";
import { env } from "~/env.mjs";

import { useEffect, useState } from "react";
import {
  PusherMessage,
  PusherUserData,
  type RouteData,
} from "~/components/tools/routing/types";
import {
  removeCurrentLocation,
  sendCurrentLocation,
} from "~/utils/routing/realtime-utils";

const TRACKING_DURATION = 10000; // 10000ms = 10s

const useRealTime = (routeData?: RouteData, routeId?: string) => {
  const [activeUsers, setActiveUsers] = useState<PusherUserData[]>([]);
  const [messages, setMessages] = useState<PusherMessage[]>([]);
  const [isTrackingCurrentUser, setIsTrackingCurrentUser] =
    useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const triggerActiveUser = () => sendCurrentLocation(routeId!, routeData!);

  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "us2",
    });
    const channel = pusher.subscribe("map");

    channel.bind("update-locations", setActiveUsers);
    channel.bind("update-messages", setMessages);

    return () => {
      removeCurrentLocation();
      pusher.unsubscribe("map");
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
