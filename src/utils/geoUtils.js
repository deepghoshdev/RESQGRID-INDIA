export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(
        new Error(
          'Geolocation is not supported by this browser.'
        )
      );
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        let message = 'Unable to detect your location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              'Location permission was denied. Please allow location access.';
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              'Your location is currently unavailable. Please try again.';
            break;

          case error.TIMEOUT:
            message =
              'Location detection timed out. Please try again.';
            break;

          default:
            message =
              'An unexpected error occurred while detecting your location.';
        }

        reject(new Error(message));
      },
      options
    );
  });
}

export async function getLocationDetails(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`
  );

  if (!response.ok) {
    throw new Error('Unable to determine district and state.');
  }

  const data = await response.json();
  const address = data.address || {};

  return {
    district:
      address.city_district ||
      address.state_district ||
      address.county ||
      address.city ||
      address.town ||
      address.village ||
      'Unknown',

    state: address.state || 'Unknown',

    displayName: data.display_name || '',
  };
}