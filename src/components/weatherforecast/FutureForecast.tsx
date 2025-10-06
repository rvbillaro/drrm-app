import React from 'react';
import { Text, View } from 'react-native';

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
  if (code >= 77 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95 && code <= 95) return "⛈️";
  if (code >= 96 && code <= 99) return "⛈️";
  return "🌤️";
};

export default function FutureForecast({ weatherData }: FutureForecastProps) {
  return (
    <View className="bg-white rounded-3xl p-5 shadow-lg mx-6 mb-6">
      <Text className="text-xl font-semibold text-gray-800 mb-4">
        7-Day Forecast
      </Text>
      {Array.from({ length: 7 }).map((_, index) => (
        <View
          key={index}
          className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
        >
          <Text className="text-gray-600 text-base w-20">
            {index === 0
              ? "Today"
              : index === 1
              ? "Tomorrow"
              : `Day ${index + 1}`}
          </Text>
          <Text className="text-3xl">
            {getWeatherIcon(weatherData.daily.weather_code[index])}
          </Text>
          <Text className="text-gray-600 text-base flex-1 text-center">
            {Math.round(weatherData.daily.temperature_2m_max[index])}° /{" "}
            {Math.round(weatherData.daily.temperature_2m_min[index])}°
          </Text>
          <Text className="text-gray-800 font-bold text-base w-12 text-right">
            {Math.round(weatherData.daily.temperature_2m_max[index])}°
          </Text>
        </View>
      ))}
    </View>
  );
}