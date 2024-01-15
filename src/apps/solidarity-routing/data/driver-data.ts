import { uniqueId } from "lodash";

export const driverData = (lat: number, lng: number) => {
  return {
    id: parseInt(uniqueId()),
    name: "New Driver",
    address: "Address via LatLng",
    max_travel_time: 60,
    time_window: { startTime: "09:00", endTime: "17:00" },
    max_stops: 10,
    break_slots: [
      {
        id: parseInt(uniqueId()),
        time_windows: [{ startTime: "12:00", endTime: "13:00" }],
        service: 30,
      },
    ],
    coordinates: { latitude: lat, longitude: lng },
  };
};
