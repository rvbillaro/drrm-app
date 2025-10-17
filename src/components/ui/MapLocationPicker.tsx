import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface MapLocationPickerProps {
  onLocationSelected: (location: LocationData) => void;
  currentLocation: LocationData | null;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onLocationSelected,
  currentLocation
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState({
    latitude: 14.6760,
    longitude: 121.0437,
  });
  const [address, setAddress] = useState('');
  const mapRef = useRef<MapView>(null);

  // Load current location when modal opens
  useEffect(() => {
    if (modalVisible && !currentLocation) {
      getCurrentLocation();
    } else if (modalVisible && currentLocation) {
      setSelectedPosition({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
      setAddress(currentLocation.address);
    }
  }, [modalVisible]);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services.');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setSelectedPosition({ latitude, longitude });

      // Animate map to current location
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);

      // Get address
      await getAddressFromCoords(latitude, longitude);
    } catch (error) {
      Alert.alert('Error', 'Failed to get location.');
      console.error(error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const formattedAddress = [
          addr.street,
          addr.city || addr.subregion,
          addr.region,
          addr.country
        ].filter(Boolean).join(', ');
        
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress('Address unavailable');
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedPosition({ latitude, longitude });
    await getAddressFromCoords(latitude, longitude);
  };

  const handleConfirmLocation = () => {
    onLocationSelected({
      address,
      latitude: selectedPosition.latitude,
      longitude: selectedPosition.longitude,
    });
    setModalVisible(false);
  };

  return (
    <>
      {/* Button to open map */}
      <TouchableOpacity
        style={styles.openMapButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.mapIcon}>📍</Text>
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonTitle}>Choose Location</Text>
            {currentLocation && (
              <Text style={styles.buttonSubtitle} numberOfLines={1}>
                {currentLocation.address}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Map Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Choose Location</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: selectedPosition.latitude,
              longitude: selectedPosition.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={selectedPosition}
              draggable
              onDragEnd={async (e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setSelectedPosition({ latitude, longitude });
                await getAddressFromCoords(latitude, longitude);
              }}
            >
              <View style={styles.customMarker}>
                <View style={styles.markerPulse} />
                <View style={styles.markerPin}>
                  <Text style={styles.markerIcon}>📍</Text>
                </View>
              </View>
            </Marker>
          </MapView>

          {/* My Location Button */}
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : (
              <Text style={styles.locationIcon}>🎯</Text>
            )}
          </TouchableOpacity>

          {/* Scale Indicator */}
          <View style={styles.scaleContainer}>
            <View style={styles.scaleLine} />
            <Text style={styles.scaleText}>150 m</Text>
          </View>

          {/* Bottom Card */}
          <View style={styles.bottomCard}>
            <TouchableOpacity
              style={styles.changePinButton}
              onPress={() => {
                // Center map on marker
                mapRef.current?.animateToRegion({
                  ...selectedPosition,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 500);
              }}
            >
              <Text style={styles.changePinIcon}>📌</Text>
              <Text style={styles.changePinText}>Change Pin</Text>
            </TouchableOpacity>

            <View style={styles.addressContainer}>
              <Text style={styles.addressIcon}>📍</Text>
              <View style={styles.addressTextContainer}>
                {address ? (
                  <Text style={styles.addressText}>{address}</Text>
                ) : (
                  <Text style={styles.addressPlaceholder}>
                    Tap on map to select location
                  </Text>
                )}
                <Text style={styles.coordsText}>
                  {selectedPosition.latitude.toFixed(6)}, {selectedPosition.longitude.toFixed(6)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !address && styles.confirmButtonDisabled
              ]}
              onPress={handleConfirmLocation}
              disabled={!address}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  openMapButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapIcon: {
    fontSize: 24,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 13,
    color: '#718096',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#2D3748',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  placeholder: {
    width: 36,
  },
  map: {
    flex: 1,
    width: width,
    height: height,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    opacity: 0.2,
  },
  markerPin: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 28,
  },
  myLocationButton: {
    position: 'absolute',
    right: 20,
    top: 120,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationIcon: {
    fontSize: 24,
  },
  scaleContainer: {
    position: 'absolute',
    left: 20,
    top: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scaleLine: {
    width: 40,
    height: 2,
    backgroundColor: '#2D3748',
  },
  scaleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  changePinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    marginBottom: 16,
  },
  changePinIcon: {
    fontSize: 20,
  },
  changePinText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  addressContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  addressIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 6,
    lineHeight: 20,
  },
  addressPlaceholder: {
    fontSize: 15,
    color: '#A0AEC0',
    marginBottom: 6,
  },
  coordsText: {
    fontSize: 12,
    color: '#718096',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default MapLocationPicker;