import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "../../src/components/map/MapView";
import { UserLocation } from "../../src/components/map/UserLocation";
import SearchBar from "../../src/components/ui/SearchBar";

export default function Home() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      let locationResult = await Location.getCurrentPositionAsync({});
      setLocation(locationResult);
    }
    
    getCurrentLocation();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <UserLocation.Provider value={{ location, setLocation }}>
      <View style={styles.container}>
        <MapView />

        < View style={styles.searchBarContainer}>
          <SearchBar 
            placeholder="Search Location"
          />
        </View>

      </View>
    </UserLocation.Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 5,
  },

  searchBarContainer: {
    position: 'absolute',
    top: 25,
    width: '100%',
    zIndex: 5,
  },
});