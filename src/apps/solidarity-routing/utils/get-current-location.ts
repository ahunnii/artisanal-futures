export const getCurrentLocation = (
  success: (result: GeolocationCoordinates | { error: true; message: string }) => void
) => {
  if (!navigator.geolocation) {
    console.log("Your browser doesn't support the geolocation feature!");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => success(position.coords),
    (error) => success({ error: true, message: error.message }),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};