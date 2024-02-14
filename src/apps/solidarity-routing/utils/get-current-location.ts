export const getCurrentLocation = (
  success: (coordinates: GeolocationCoordinates) => void
) => {
  if (!navigator.geolocation) {
    console.log("Your browser doesn't support the geolocation feature!");
    return;
  }

  console.log("Getting current location...");
  // navigator.geolocation.watchPosition((position) => success(position.coords));

  navigator.geolocation.getCurrentPosition((position) =>
    success(position.coords)
  );
};
