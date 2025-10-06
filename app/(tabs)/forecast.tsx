import CurrentWeather from '@/src/components/weatherforecast/CurrentWeather';
import FutureForecast from '@/src/components/weatherforecast/FutureForecast';
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    pressure_msl: number;
    cloud_cover: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
    weather_code: number[];
  };
}

interface CityData {
  name: string;
  latitude: number;
  longitude: number;
}

export default function WeatherPage() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cityData, setCityData] = useState<CityData | null>(null);

  useEffect(() => {
    getCurrentLocationAndWeather();
  }, []);

  const getCurrentLocationAndWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to get weather data for your current location.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Try Again', onPress: getCurrentLocationAndWeather }
          ]
        );
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      let cityName = 'Current Location';
      
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode && geocode.length > 0) {
          const address = geocode[0];
          cityName = address.city || address.district || address.subregion || address.region || 'Current Location';
        }
      } catch (geoError) {
        console.log('Geocoding failed, using default location name:', geoError);
      }

      const locationData: CityData = { name: cityName, latitude, longitude };
      setCityData(locationData);
      await fetchWeatherData(locationData);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error", 
        "Failed to get your current location. Please try again.",
        [
          { text: 'Cancel', onPress: () => router.back() },
          { text: 'Retry', onPress: getCurrentLocationAndWeather }
        ]
      );
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async (city: CityData) => {
    if (!city.latitude || !city.longitude) {
      Alert.alert("Error", "Location coordinates not available");
      setIsLoading(false);
      return;
    }

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=weather_code,temperature_2m_min,temperature_2m_max,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration,uv_index_max,daylight_duration,sunshine_duration,uv_index_clear_sky_max,rain_sum,showers_sum,precipitation_sum,snowfall_sum,precipitation_hours,precipitation_probability_max&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure&timezone=auto`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        Alert.alert("Error", "Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Weather API error:", error);
      Alert.alert("Error", "Failed to fetch weather data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!weatherData || !cityData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredWithPadding}>
          <Text style={styles.errorText}>
            Unable to load weather data
          </Text>
          <TouchableOpacity
            onPress={getCurrentLocationAndWeather}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <CurrentWeather 
          weatherData={weatherData} 
          cityData={cityData}
          onRefresh={getCurrentLocationAndWeather}
        />
        <FutureForecast weatherData={weatherData} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredWithPadding: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#222',
  },
  errorText: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6', // blue-500
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
