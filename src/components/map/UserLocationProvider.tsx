import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { UserLocation } from './UserLocation';

export default function UserLocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      if (Platform.OS === 'web') {
        // Web browser geolocation
        if ('geolocation' in navigator) {
          console.log('Requesting high-accuracy location...');
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationData: LocationObject = {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  altitude: position.coords.altitude,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                },
                timestamp: position.timestamp,
              };
              console.log('Web location set with accuracy:', position.coords.accuracy, 'meters');
              console.log('Coordinates:', position.coords.latitude, position.coords.longitude);
              setLocation(locationData);
            },
            (error) => {
              console.error('Error getting location:', error.message, error.code);
              // Fallback location (you can remove this in production)
              const fallbackLocation: LocationObject = {
                coords: {
                  latitude: 14.6760,
                  longitude: 121.0437,
                  altitude: null,
                  accuracy: 0,
                  altitudeAccuracy: null,
                  heading: null,
                  speed: null,
                },
                timestamp: Date.now(),
              };
              setLocation(fallbackLocation);
              alert('Could not get your location. Using default location. Error: ' + error.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            }
          );
        } else {
          console.error('Geolocation is not supported');
          alert('Geolocation is not supported by your browser');
        }
      } else {
        // Mobile - use expo-location
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.error('Permission to access location was denied');
            alert('Permission to access location was denied');
            return;
          }

          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          
          setLocation(location);
          console.log('Mobile location set:', location);
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }
    };

    getLocation();
  }, []);

  return (
    <UserLocation.Provider value={{ location, setLocation }}>
      {children}
    </UserLocation.Provider>
  );
}