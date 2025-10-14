import "leaflet/dist/leaflet.css";
import React, { useContext } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { View } from "react-native";
import { UserLocation } from "./UserLocation";

// Fix for default markers in react-leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapViewComponent() {
  const userLocationContext = useContext(UserLocation);

  if (!userLocationContext) return null;
  const { location } = userLocationContext;

  if (!location?.coords?.latitude || !location?.coords?.longitude) return null;

  // Calculate zoom level from latitudeDelta (approximate)
  const latitudeDelta = 0.0422;
  const zoom = Math.round(Math.log2(360 / latitudeDelta));

  return (
    <View style={{ flex: 1 }}>
      <MapContainer
        center={[location.coords.latitude, location.coords.longitude]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[location.coords.latitude, location.coords.longitude]}
        />
      </MapContainer>
    </View>
  );
}
