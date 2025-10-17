import 'leaflet/dist/leaflet.css';
import React, { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';
import { Platform, View } from "react-native";
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

  if (Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1 }}>
        <div>Map not available on mobile</div>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapContainer
        center={[location.coords.latitude, location.coords.longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location Marker */}
        <Marker position={[location.coords.latitude, location.coords.longitude]}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Evacuation Areas */}
        {evacuationAreas.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coordinates.map(coord => [coord.latitude, coord.longitude])}
            pathOptions={{
              color: 'blue',
              fillColor: 'blue',
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        ))}

        {/* Hazard Areas */}
        {hazardAreas.map((area) => (
          <Polygon
            key={area.id}
            positions={area.coordinates.map(coord => [coord.latitude, coord.longitude])}
            pathOptions={{
              color: getHazardColor(area.severity),
              fillColor: getHazardColor(area.severity),
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        ))}

        {/* Incidents */}
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.location.latitude, incident.location.longitude]}
          >
            <Popup>
              <div>
                <strong>{incident.type}</strong>
                <br />
                {incident.description}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </View>
  );
}
