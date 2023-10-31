import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";
import { env } from "~/env.mjs";
type PusherLocation = {
  userId?: number;
  latitude: number;
  longitude: number;
  accuracy: number;
};
const useTracking = () => {
  const { data: session } = useSession();
  const [pusherLocations, setPusherLocations] = useState<PusherLocation[]>([]);

  const [currentLocation, setCurrentLocation] = useState<PusherLocation | null>(
    null
  );
  const [value, setValue] = useState("");
  const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
    cluster: "us2",
  });
  useBeforeunload(() => "You’ll lose your data!");
  const channel = pusher.subscribe("map");

  //   useEffect(() => {
  //     if (!navigator.geolocation) {
  //       console.log("Your browser doesn't support the geolocation feature!");
  //       return;
  //     }
  //     const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  //       cluster: "us2",
  //     });

  //     const channel = pusher.subscribe("map");

  //     const intervalId = setInterval(() => {
  //       navigator.geolocation.getCurrentPosition((position) => {
  //         const { latitude, longitude, accuracy } = position.coords;

  //         channel.bind("update-locations", (data: PusherLocation[]) => {
  //           setCurrentLocation({ latitude, longitude, accuracy });
  //           setPusherLocations(data);
  //         });

  //         fetch("/api/update-location", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             userId: session?.user?.id ?? 0,
  //             latitude,
  //             longitude,
  //             accuracy,
  //           }),
  //         }).catch((error) => {
  //           console.log(error);
  //         });
  //       });
  //     }, 5000);

  //     return () => {
  //       clearInterval(intervalId);
  //     };
  //   }, [session]);

  useEffect(() => {
    getCurrentLocation();
    listenToActiveUsers();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support the geolocation feature!");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setCurrentLocation({ latitude, longitude, accuracy });
    });
  };

  const listenToActiveUsers = () => {
    channel.bind("update-locations", (data: PusherLocation[]) => {
      setPusherLocations(data);
    });

    // const channel = pusher.channel("update-locations");
    // const channel = pusher.subscribe("map");
    // console.log(pusher.channel("map"));

    // const attributes = "subscription_count,user_count";
    // const res = await pusher.trigger(
    //   channels,
    //   "my-event",
    //   {
    //     message: "hello world",
    //   },
    //   {
    //     info: attributes,
    //   }
    // );

    // if (res.status === 200) {
    //   const body = await res.json();
    //   const channelsInfo = body.channels;
    // }

    //     const channel = pusher.subscribe("map");

    //   channel.bind(
    //       "update-locations",
    //       (data: PusherLocation[]) => {
    //         return data;
    //       }
    //     );

    //     return active;
  };

  const triggerActiveUser = () => {
    if (currentLocation) {
      const { latitude, longitude, accuracy } = currentLocation;
      fetch("/api/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id ?? 0,
          latitude,
          longitude,
          accuracy,
        }),
      }).catch((error) => {
        console.log(error);
      });
    }
  };
  return {
    currentLocation,
    pusherLocations,
    triggerActiveUser,
    // getCurrentLocation,
    getActiveUsers: listenToActiveUsers,
  };
};
export default useTracking;
