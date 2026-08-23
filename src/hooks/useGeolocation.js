import { useState } from 'react';
import { getCurrentLocation } from '../utils/geoUtils.js';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detect = async () => {
    setLoading(true);
    setError('');

    try {
      const detectedLocation = await getCurrentLocation();

      setLocation(detectedLocation);

      console.log(
        'Location detected:',
        detectedLocation
      );
      return detectedLocation;
      
    } catch (err) {
      setError(err.message);
      console.error(
        'Location detection failed:',
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    detect,
  };
}