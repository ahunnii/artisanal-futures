import { uniqueId } from "lodash";

export const stopData = (lat: number, lng: number) => {
  return {
    id: parseInt(uniqueId()),
    customer_name: "New Stop",
    address: "Address via LatLng",
    drop_off_duration: 5,
    prep_time_duration: 0,
    time_windows: [{ startTime: "09:00", endTime: "17:00" }],
    priority: 1,
    coordinates: { latitude: lat, longitude: lng },
  };
};
