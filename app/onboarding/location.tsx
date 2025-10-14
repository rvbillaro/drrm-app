import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface UserAddress {
  fullAddress: string;
  barangay?: string;
  city: string;
  latitude: number;
  longitude: number;
  zone?: 'north' | 'south';
}

export default function LocationOnboarding() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState({
    fullAddress: '',
    barangay: '',
    city: '',
  });
  const [selectedZone, setSelectedZone] = useState<'north' | 'south' | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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

  const handleComplete = () => {
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
      latitude: 0,
      longitude: 0,
      zone: selectedZone,
    };

    console.log('✅ Saving user address:', locationData);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Enter Your Address</Text>
        <Text style={styles.description}>
          Please provide your address details to receive area-specific alerts.
        </Text>

        {/* Full Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Address</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your full address"
              placeholderTextColor="#A0AEC0"
              value={manualInput.fullAddress}
              onChangeText={(text) =>
                setManualInput((prev) => ({ ...prev, fullAddress: text }))
              }
            />
          </View>
        </View>

        {/* Barangay */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Barangay</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your barangay"
              placeholderTextColor="#A0AEC0"
              value={manualInput.barangay}
              onChangeText={(text) =>
                setManualInput((prev) => ({ ...prev, barangay: text }))
              }
            />
          </View>
        </View>

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
