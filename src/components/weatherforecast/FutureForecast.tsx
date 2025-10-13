import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface WeatherData {
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

interface FutureForecastProps {
  weatherData: WeatherData;
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
  if (code === 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "🌤️";
};

export default function FutureForecast({ weatherData }: FutureForecastProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Forecast</Text>
      {Array.from({ length: 7 }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.row,
            index === 6 && { borderBottomWidth: 0 }, // Remove border for last item
          ]}
        >
          <Text style={[styles.text, styles.dayText]}>
            {index === 0
              ? "Today"
              : index === 1
              ? "Tomorrow"
              : `Day ${index + 1}`}
          </Text>
          <Text style={styles.icon}>
            {getWeatherIcon(weatherData.daily.weather_code[index])}
          </Text>
          <Text style={[styles.text, styles.tempRange]}>
            {Math.round(weatherData.daily.temperature_2m_max[index])}° /{" "}
            {Math.round(weatherData.daily.temperature_2m_min[index])}°
          </Text>
          <Text style={[styles.text, styles.maxTemp]}>
            {Math.round(weatherData.daily.temperature_2m_max[index])}°
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937", // gray-800
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6", // gray-100
  },
  text: {
    color: "#4b5563", // gray-600
    fontSize: 16,
  },
  dayText: {
    width: 80,
  },
  icon: {
    fontSize: 28,
  },
  tempRange: {
    flex: 1,
    textAlign: "center",
  },
  maxTemp: {
    color: "#1f2937", // gray-800
    fontWeight: "700",
    fontSize: 16,
    width: 48,
    textAlign: "right",
  },
});
