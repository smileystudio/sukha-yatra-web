export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Reverse geocoding to get city name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const city = data.address?.city || 
                      data.address?.town || 
                      data.address?.village || 
                      data.address?.state_district ||
                      'Unknown Location';
          
          resolve({
            latitude,
            longitude,
            accuracy,
            city
          });
        } catch (error) {
          // If reverse geocoding fails, still return coordinates
          resolve({
            latitude,
            longitude,
            accuracy
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

export const watchLocation = (
  callback: (location: LocationData) => void,
  errorCallback: (error: GeolocationPositionError) => void
): number => {
  if (!navigator.geolocation) {
    errorCallback({
      code: 0,
      message: 'Geolocation not supported',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    } as GeolocationPositionError);
    return -1;
  }

  return navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        
        const city = data.address?.city || 
                    data.address?.town || 
                    data.address?.village || 
                    'Unknown Location';
        
        callback({
          latitude,
          longitude,
          accuracy,
          city
        });
      } catch (error) {
        callback({
          latitude,
          longitude,
          accuracy
        });
      }
    },
    errorCallback,
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
};
