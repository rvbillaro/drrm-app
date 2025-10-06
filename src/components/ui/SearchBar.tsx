import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { UserLocation } from "../map/UserLocation";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchBarProps {
  onLocationSelect?: (location: SearchResult) => void;
  placeholder?: string;
  style?: object;
}

export default function LocationSearchBar({
  onLocationSelect,
  placeholder = "Search for a location...",
  style,
}: LocationSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const userLocationContext = useContext(UserLocation);

  const GOOGLE_API_KEY = "AIzaSyBTLhp6b-3HXl4UybmnHiX3CyWfC5iz6_o"; // API key here

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          searchQuery
        )}&key=${GOOGLE_API_KEY}&components=country:ph`
      );
      const json = await res.json();

      if (json.predictions) {
        const places: SearchResult[] = json.predictions.map(
          (p: any, index: number) => ({
            id: p.place_id || index.toString(),
            title: p.structured_formatting.main_text,
            subtitle: p.structured_formatting.secondary_text,
            latitude: 0,
            longitude: 0,
          })
        );
        setResults(places);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    setIsLoading(false);
  };

  const getPlaceDetails = async (placeId: string) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
      );
      const json = await res.json();
      if (json.result && json.result.geometry) {
        return {
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
        };
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
    return null;
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    );
    const json = await res.json();
    if (json.results && json.results.length > 0) {
      return json.results[0].formatted_address;
    }
  } catch (error) {
    console.error("Error fetching address:", error);
  }
  return "Current Location";
};


  const handleLocationSelect = async (item: SearchResult) => {
    let location = { latitude: item.latitude, longitude: item.longitude };

    if (!item.latitude || !item.longitude) {
      const details = await getPlaceDetails(item.id);
      if (details) {
        location = details;
      }
    }

    const newLocation = {
      coords: {
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    } as Location.LocationObject;

    if (userLocationContext) {
      userLocationContext.setLocation(newLocation);
    }

    if (onLocationSelect) {
      onLocationSelect({
        ...item,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }

    setQuery(item.title);
    setShowResults(false);
  };

  const handleCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});

    const address = await getAddressFromCoords(
      loc.coords.latitude,
      loc.coords.longitude
    );

    const currentLocation: SearchResult = {
      id: "current",
      title: address,
      subtitle: "Your GPS location",
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    if (userLocationContext) {
      userLocationContext.setLocation(loc);
    }

    if (onLocationSelect) {
      onLocationSelect(currentLocation);
    }

    setQuery(address); 
    setShowResults(false);
  };


  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="location-sharp" size={24} color="#4a90e2" />

        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            if (!text.trim()) {
              setShowResults(false);
              setResults([]); // clear results
            } else {
              setShowResults(true);
              searchLocations(text);
            }
          }}
          onFocus={() => query ? setShowResults(true) : setShowResults(false)}
        />

        {/* Show loader when searching */}
        {isLoading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <TouchableOpacity onPress={() => searchLocations(query)}>
            <Ionicons name="send" size={24} color="#4a90e2" />
          </TouchableOpacity>
        )}
      </View>

      {showResults && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={[
              { id: "current", title: "Use Current Location", subtitle: "", latitude: 0, longitude: 0 },
              ...results,
            ]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() =>
                  item.id === "current"
                    ? handleCurrentLocation()
                    : handleLocationSelect(item)
                }
              >
                <Ionicons
                  name={item.id === "current" ? "locate" : "location-outline"}
                  size={20}
                  color="#4a90e2"
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  {item.subtitle ? (
                    <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#a8bed2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#333", marginLeft: 10 },
  resultsContainer: {
    position: "absolute",
    top: "100%",
    left: 20,
    right: 20,
    backgroundColor: "#fbfbfb",
    borderRadius: 15,
    maxHeight: 250,
    marginTop: 5,
    elevation: 5,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
  resultSubtitle: { fontSize: 12, color: "#666" },
});
