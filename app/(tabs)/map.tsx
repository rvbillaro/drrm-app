import UserLocationProvider from '@/src/components/map/UserLocationProvider';
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import MapView from "../../src/components/map/MapView";
import SearchBar from "../../src/components/ui/SearchBar";

export default function Map() {
  const router = useRouter();

  return (
    <UserLocationProvider>
      <View style={styles.container}>
        <MapView />

        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Search Location"
          />
        </View>
      </View>
    </UserLocationProvider>
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