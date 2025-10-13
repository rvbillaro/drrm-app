import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

interface CurrentWeatherProps {
  weatherData: WeatherData;
  cityData: CityData;
  onRefresh: () => void;
}

// Map weather codes to icons
const getWeatherIcon = (code: number) => {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "🌤️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 55) return "🌧️";
  if (code >= 56 && code <= 57) return "🌨️";
  if (code >= 61 && code <= 65) return "🌧️";
  if (code >= 66 && code <= 67) return "🌨️";
  if (code >= 71 && code <= 75) return "❄️";
  if (code >= 77 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95 && code <= 95) return "⛈️";
  if (code >= 96 && code <= 99) return "⛈️";
  return "🌤️";
};

export default function CurrentWeather({ weatherData, cityData, onRefresh }: CurrentWeatherProps) {
  return (
    <View>
      {/* Refresh Button */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Weather Today</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#fbfbfb" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Location Info & Current Weather */}
        <View style={styles.centerItems}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={20} color="#3B82F6" />
            <Text style={styles.cityName}>{cityData.name}</Text>
          </View>
          <Text style={styles.temperature}>
            {Math.round(weatherData.current.temperature_2m)}°
          </Text>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weatherData.current.weather_code)}
          </Text>
          <Text style={styles.feelsLike}>
            Feels like {Math.round(weatherData.current.apparent_temperature)}°
          </Text>
        </View>

        {/* Current Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="water-percent" size={26} color="#fbfbfb" />
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {weatherData.current.relative_humidity_2m}%
              </Text>
            </View>
            <View style={styles.detailItemBorder}>
              <MaterialCommunityIcons name="weather-windy" size={26} color="#fbfbfb" />
              <Text style={styles.detailLabel}>Wind Speed</Text>
              <Text style={styles.detailValue}>
                {weatherData.current.wind_speed_10m} km/h
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="gauge" size={26} color="#fbfbfb" />
              <Text style={styles.detailLabel}>Pressure</Text>
              <Text style={styles.detailValue}>
                {weatherData.current.pressure_msl}
              </Text>
            </View>
          </View>
        </View>

        {/* Today's Details Card */}
        <View style={styles.todayCard}>
          <Text style={styles.todayTitle}>Today's Details</Text>
          <View>
            {/* Temperature Range */}
            <View style={styles.todayRow}>
              <View style={styles.iconRow}>
                <MaterialCommunityIcons name="thermometer" size={24} color="#4B5563" />
                <Text style={styles.todayLabel}>Temperature Range</Text>
              </View>
              <Text style={styles.todayValue}>
                {Math.round(weatherData.daily.temperature_2m_max[0])}° /{" "}
                {Math.round(weatherData.daily.temperature_2m_min[0])}°
              </Text>
            </View>

            {/* Precipitation */}
            <View style={styles.todayRow}>
              <View style={styles.iconRow}>
                <MaterialCommunityIcons name="weather-pouring" size={24} color="#4B5563" />
                <Text style={styles.todayLabel}>Precipitation</Text>
              </View>
              <Text style={styles.todayValue}>
                {weatherData.daily.precipitation_sum[0]} mm
              </Text>
            </View>

            {/* Sunrise */}
            <View style={styles.todayRow}>
              <View style={styles.iconRow}>
                <MaterialCommunityIcons name="weather-sunset-up" size={24} color="#4B5563" />
                <Text style={styles.todayLabel}>Sunrise</Text>
              </View>
              <Text style={styles.todayValue}>
                {weatherData.daily.sunrise[0].split("T")[1]}
              </Text>
            </View>

            {/* Sunset */}
            <View style={styles.todayRow}>
              <View style={styles.iconRow}>
                <MaterialCommunityIcons name="weather-sunset-down" size={24} color="#4B5563" />
                <Text style={styles.todayLabel}>Sunset</Text>
              </View>
              <Text style={styles.todayValue}>
                {weatherData.daily.sunset[0].split("T")[1]}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  refreshButton: {
    width: 40,
    height: 40,
    backgroundColor: "#4a90e2",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  centerItems: {
    alignItems: "center",
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
  },
  temperature: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#1f2937",
    marginVertical: 8,
  },
  weatherIcon: {
    fontSize: 50,
    color: "#1f2937",
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 16,
    color: "#4b5563",
  },
  detailsCard: {
    backgroundColor: "#4a90e2",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailItemBorder: {
    alignItems: "center",
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#60a5fa",
  },
  detailLabel: {
    color: "#fbfbfb",
    marginTop: 8,
  },
  detailValue: {
    color: "#fbfbfb",
    fontWeight: "bold",
    fontSize: 18,
  },
  todayCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  todayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  todayLabel: {
    color: "#4b5563",
    marginLeft: 8,
  },
  todayValue: {
    color: "#1f2937",
    fontWeight: "600",
  },
});
