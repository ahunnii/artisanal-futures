// import { useSession } from "next-auth/react";
// import Pusher from "pusher-js";
// import { useEffect, useMemo, useState } from "react";
// import { useBeforeunload } from "react-beforeunload";
// import { env } from "~/env.mjs";
// type PusherLocation = {
//   userId?: number;
//   latitude: number;
//   longitude: number;
//   accuracy: number;
// };
// const useTracking = () => {
//   const { data: session } = useSession();
//   const [pusherLocations, setPusherLocations] = useState<PusherLocation[]>([]);

//   const [currentLocation, setCurrentLocation] = useState<PusherLocation | null>(
//     null
//   );

//   useBeforeunload(() => "You’ll lose your data!");

//   const channel = useMemo(() => {
//     const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
//       cluster: "us2",
//     });
//     return pusher.subscribe("map");
//   }, []);

//   useEffect(() => {
//     getCurrentLocation();
//     listenToActiveUsers();
//   }, []);

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       console.log("Your browser doesn't support the geolocation feature!");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude, accuracy } = position.coords;
//       setCurrentLocation({ latitude, longitude, accuracy });
//     });
//   };

//   const listenToActiveUsers = () => {
//     channel.bind("update-locations", setPusherLocations);
//   };

//   const stopListeningToActiveUsers = () => {
//     channel.unbind("update-locations");
//   };

//   const triggerActiveUser = () => {
//     if (currentLocation) {
//       const { latitude, longitude, accuracy } = currentLocation;
//       fetch("/api/update-location", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: session?.user?.id ?? 0,
//           latitude,
//           longitude,
//           accuracy,
//         }),
//       }).catch((error) => {
//         console.log(error);
//       });
//     }
//   };
//   return {
//     currentLocation,
//     pusherLocations,
//     triggerActiveUser,
//     // getCurrentLocation,
//     getActiveUsers: listenToActiveUsers,
//     deactivate: stopListeningToActiveUsers,
//   };
// };
// export default useTracking;

/* pages/index.js */
