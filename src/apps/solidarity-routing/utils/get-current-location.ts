export const getCurrentLocation = (
  success: (result: GeolocationCoordinates ) => void,
  setLocationMessage: React.Dispatch<React.SetStateAction<{ error: boolean; message: string }>>
) => {
  if (!navigator.geolocation) {
    console.log("Your browser doesn't support the geolocation feature!");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      if (latitude === 0 && longitude === 0) {
        success(position.coords);
        setLocationMessage({
          error: true,
          message: '0 lat, 0 lng location (cause: unable to retrieve accurate location)'
        })
      } else {
        success(position.coords);
        setLocationMessage({
          error: false,
          message: "success"
        })
      }
    },
    (error) => {
      let errorMessage = 'Unknown error';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = error.message;
      }
      // Use old GPS position
      setLocationMessage({
        error: true,
        message: errorMessage
      })
    },
    { 
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 2000
    }
  );
};