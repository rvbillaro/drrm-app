import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import { fetchEvacuationAreas, fetchHazardAreas, fetchIncidents } from "../../services/mapData";
import { EvacuationArea, HazardArea, Incident } from "../../types";
import { UserLocation } from "./UserLocation";

export default function MapViewComponent() {
  const userLocationContext = useContext(UserLocation);
  const [evacuationAreas, setEvacuationAreas] = useState<EvacuationArea[]>([]);
  const [hazardAreas, setHazardAreas] = useState<HazardArea[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  if (!userLocationContext) return null;
  const { location } = userLocationContext;

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const [evacAreas, hazAreas, inc] = await Promise.all([
          fetchEvacuationAreas(),
          fetchHazardAreas(),
          fetchIncidents(),
        ]);
        setEvacuationAreas(evacAreas);
        setHazardAreas(hazAreas);
        setIncidents(inc);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };

    loadMapData();
  }, []);

  if (!location?.coords?.latitude || !location?.coords?.longitude) return null;

  const getHazardColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'rgba(255, 0, 0, 0.3)';
      case 'medium': return 'rgba(255, 165, 0, 0.3)';
      case 'low': return 'rgba(255, 255, 0, 0.3)';
      default: return 'rgba(128, 128, 128, 0.3)';
    }
  };

  const getIncidentColor = (status: string) => {
    switch (status) {
      case 'reported': return 'red';
      case 'responding': return 'orange';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          pinColor="blue"
        />

        {/* Evacuation Areas */}
        {evacuationAreas.map((area) => (
          <Polygon
            key={area.id}
            coordinates={area.coordinates}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.2)"
            strokeWidth={2}
          />
        ))}

        {/* Hazard Areas */}
        {hazardAreas.map((area) => (
          <Polygon
            key={area.id}
            coordinates={area.coordinates}
            strokeColor={getHazardColor(area.severity)}
            fillColor={getHazardColor(area.severity)}
            strokeWidth={2}
          />
        ))}

        {/* Incidents */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{
              latitude: incident.location.latitude,
              longitude: incident.location.longitude,
            }}
            title={incident.type}
            description={incident.description}
            pinColor={getIncidentColor(incident.status)}
          />
        ))}
      </MapView>
    </View>
  );
}
