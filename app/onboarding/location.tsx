import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { CALOOCAN_BARANGAYS } from '../../src/constants/barangays';
import { saveUserAddress } from '../../src/services/userService';
import { UserAddress } from '../../src/types';

export default function LocationOnboarding() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState({
    fullAddress: '',
    barangay: '',
    city: '',
  });
  const [selectedZone, setSelectedZone] = useState<'north' | 'south' | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showBarangayDropdown, setShowBarangayDropdown] = useState(false);

  // ✅ Ask for location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is needed for personalized alerts. You can enable it later in your device settings.'
        );
        setHasPermission(false);
      } else {
        setHasPermission(true);
        console.log('✅ Location permission granted');
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Please enable location permission to use the map.');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setShowMap(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location.');
      console.error(error);
    }
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setCurrentLocation(coordinate);
  };

  const confirmLocation = async () => {
    if (!currentLocation) return;

    try {
      const geocode = await Location.reverseGeocodeAsync(currentLocation);
      if (geocode.length > 0) {
        const address = geocode[0];
        const fullAddress = `${address.street || ''} ${address.name || ''}`.trim();
        const city = address.city || address.region || 'Caloocan';

        setManualInput(prev => ({
          ...prev,
          fullAddress: fullAddress || prev.fullAddress,
          city: city,
        }));
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }

    setShowMap(false);
  };

  const handleComplete = async () => {
    if (!manualInput.fullAddress || !manualInput.city) {
      Alert.alert('Required', 'Please fill in your full address and city.');
      return;
    }

    if (!selectedZone) {
      Alert.alert('Required', 'Please select your zone.');
      return;
    }

    const locationData: UserAddress = {
      ...manualInput,
      latitude: currentLocation?.latitude || 0,
      longitude: currentLocation?.longitude || 0,
      zone: selectedZone,
    };

    console.log('✅ Saving user address:', locationData);
    await saveUserAddress(locationData);
    
    // Show success message
    Alert.alert(
      'Address Updated',
      'Your location and zone have been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Enter Your Address</Text>
        <Text style={styles.description}>
          Please provide your address details to receive area-specific alerts.
        </Text>

        {/* Street/House Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Street/House Number</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your street/house number"
              placeholderTextColor="#A0AEC0"
              value={manualInput.fullAddress}
              onChangeText={(text) =>
                setManualInput((prev) => ({ ...prev, fullAddress: text }))
              }
            />
          </View>
        </View>

        {/* Barangay Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Barangay</Text>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() => setShowBarangayDropdown(true)}
            activeOpacity={0.7}
          >
            <TextInput
              style={styles.input}
              placeholder="Select your barangay"
              placeholderTextColor="#A0AEC0"
              value={manualInput.barangay}
              editable={false}
            />
            <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Barangay Dropdown Modal */}
        <Modal
          visible={showBarangayDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowBarangayDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowBarangayDropdown(false)}
          >
            <View style={styles.dropdownModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Barangay</Text>
                <TouchableOpacity onPress={() => setShowBarangayDropdown(false)}>
                  <Ionicons name="close" size={24} color="#2D3748" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.dropdownList}>
                {CALOOCAN_BARANGAYS.map((barangay: string) => (
                  <TouchableOpacity
                    key={barangay}
                    style={[
                      styles.dropdownItem,
                      manualInput.barangay === barangay && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setManualInput(prev => ({ ...prev, barangay }));
                      setShowBarangayDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        manualInput.barangay === barangay && styles.dropdownItemTextActive,
                      ]}
                    >
                      {barangay}
                    </Text>
                    {manualInput.barangay === barangay && (
                      <Ionicons name="checkmark-circle" size={22} color="#4A90E2" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* City */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              placeholderTextColor="#A0AEC0"
              value={manualInput.city}
              onChangeText={(text) =>
                setManualInput((prev) => ({ ...prev, city: text }))
              }
            />
          </View>
        </View>

        {/* Zone Picker */}
        <Text style={styles.label}>Zone</Text>
        <View style={styles.zoneContainer}>
          <View style={styles.pickerWrapper}>
            <Ionicons
              name="compass-outline"
              size={20}
              color="#A0AEC0"
              style={{ marginRight: 8 }}
            />
            <Picker
              selectedValue={selectedZone}
              onValueChange={(value) => setSelectedZone(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Zone" value="" color="#A0AEC0" />
              <Picker.Item label="North" value="north" />
              <Picker.Item label="South" value="south" />
            </Picker>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!selectedZone || !manualInput.fullAddress || !manualInput.city) &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!selectedZone || !manualInput.fullAddress || !manualInput.city}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Complete Setup</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  iconContainer: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 12,
  },
  zoneContainer: { gap: 16, marginBottom: 32 },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    minHeight: 56,
  },
  picker: { flex: 1, color: '#2D3748' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  dropdownList: {
    maxHeight: 400,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  dropdownItemActive: {
    backgroundColor: '#F0F7FF',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
  },
  dropdownItemTextActive: {
    fontWeight: '600',
    color: '#4A90E2',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { fontSize: 17, fontWeight: '700', color: '#fff' },
});
