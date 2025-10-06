import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
}

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface IncidentType {
  id: string;
  label: string;
  icon: string;
}

const IncidentReportForm: React.FC = () => {

  const router = useRouter();

  // Form state
  const [incidentType, setIncidentType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Incident types
  const incidentTypes: IncidentType[] = [
    { id: 'fire', label: 'Fire', icon: 'flame' },
    { id: 'flood', label: 'Flood', icon: 'water' },
    { id: 'accident', label: 'Accident', icon: 'car' },
    { id: 'medical', label: 'Medical Emergency', icon: 'medical' },
    { id: 'earthquake', label: 'Earthquake', icon: 'pulse' },
    { id: 'landslide', label: 'Landslide', icon: 'triangle' },
    { id: 'power-outage', label: 'Power Outage', icon: 'flash-off' },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const getSelectedIncident = () => {
    return incidentTypes.find(type => type.id === incidentType);
  };

  // Get current location
  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services to use this feature.');
        setIsLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocoding to get address
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const addr = addressResponse[0];
        const formattedAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.country || ''}`.replace(/^, |, $|, ,/g, ', ').trim();
        
        setLocation({
          address: formattedAddress,
          latitude,
          longitude,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
      console.error(error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Pick image
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: MediaFile = {
          uri: asset.uri,
          type: asset.type === 'video' ? 'video' : 'image',
          name: asset.fileName || `media_${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
        };
        setMediaFiles([...mediaFiles, newMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media. Please try again.');
      console.error(error);
    }
  };

  // Take photo
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your camera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMedia: MediaFile = {
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
        };
        setMediaFiles([...mediaFiles, newMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      console.error(error);
    }
  };

  // Remove media
  const removeMedia = (index: number) => {
    const updatedMedia = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(updatedMedia);
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!incidentType) {
      Alert.alert('Missing Information', 'Please select an incident type.');
      return false;
    }
    if (!location) {
      Alert.alert('Missing Information', 'Please add location information.');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please provide a description of the incident.');
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = {
        incidentType,
        description,
        location,
        mediaFiles,
        timestamp: new Date().toISOString(),
      };

      console.log('Submitting incident report:', formData);

      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Your incident report has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIncidentType('');
              setDescription('');
              setLocation(null);
              setMediaFiles([]);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report an Incident</Text>
          <View style={styles.placeholder} />
        </View>
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Help us respond quickly by providing detailed information.
        </Text>

        {/* Incident Type Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Incident *</Text>
          
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(true)}
            activeOpacity={0.7}
          >
            {incidentType ? (
              <View style={styles.dropdownSelected}>
                <Ionicons
                  name={getSelectedIncident()?.icon as any}
                  size={22}
                  color="#4A90E2"
                />
                <Text style={styles.dropdownSelectedText}>
                  {getSelectedIncident()?.label}
                </Text>
              </View>
            ) : (
              <Text style={styles.dropdownPlaceholder}>Select incident type</Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#A0AEC0" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Modal */}
        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Incident Type</Text>
                <TouchableOpacity onPress={() => setShowDropdown(false)}>
                  <Ionicons name="close" size={24} color="#2D3748" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.dropdownList}>
                {incidentTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.dropdownItem,
                      incidentType === type.id && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setIncidentType(type.id);
                      setShowDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dropdownItemContent}>
                      <View
                        style={[
                          styles.dropdownIconContainer,
                          incidentType === type.id && styles.dropdownIconContainerActive,
                        ]}
                      >
                        <Ionicons
                          name={type.icon as any}
                          size={22}
                          color={incidentType === type.id ? '#fff' : '#4A90E2'}
                        />
                      </View>
                      <Text
                        style={[
                          styles.dropdownItemText,
                          incidentType === type.id && styles.dropdownItemTextActive,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </View>
                    {incidentType === type.id && (
                      <Ionicons name="checkmark-circle" size={22} color="#4A90E2" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Location Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Information *</Text>
          
          {location ? (
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Ionicons name="location" size={20} color="#4A90E2" />
                <Text style={styles.locationTitle}>Current Location</Text>
              </View>
              <Text style={styles.locationAddress}>{location.address}</Text>
              <Text style={styles.locationCoords}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity
                style={styles.changeLocationButton}
                onPress={getCurrentLocation}
              >
                <Text style={styles.changeLocationText}>Update Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.getLocationButton}
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.getLocationText}>Get Current Location</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Media Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo/Video Evidence</Text>
          <Text style={styles.sectionSubtitle}>
            Add images or videos to help document the incident
          </Text>

          <View style={styles.mediaButtonsContainer}>
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#4A90E2" />
              <Text style={styles.mediaButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
              <Ionicons name="images" size={24} color="#4A90E2" />
              <Text style={styles.mediaButtonText}>Choose Media</Text>
            </TouchableOpacity>
          </View>

          {mediaFiles.length > 0 && (
            <View style={styles.mediaPreviewContainer}>
              {mediaFiles.map((media, index) => (
                <View key={index} style={styles.mediaPreviewItem}>
                  <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                  <TouchableOpacity
                    style={styles.removeMediaButton}
                    onPress={() => removeMedia(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                  </TouchableOpacity>
                  {media.type === 'video' && (
                    <View style={styles.videoIndicator}>
                      <Ionicons name="play-circle" size={32} color="#fff" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description *</Text>
          <Text style={styles.sectionSubtitle}>
            Provide details about what happened
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe the incident in detail..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length} characters</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#Fbfbfb',
  },
  content: {
    padding: 20,
  },

  headerBar: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 3,
  elevation: 2,
},

backButton: {
  padding: 4,
},

headerTitle: {
  fontSize: 20,
  fontWeight: '700',
  color: '#1A202C',
},

placeholder: {
  width: 28,
},
  subtitle: {
    fontSize: 15,
    color: '#718096',
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  dropdownSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownSelectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#A0AEC0',
  },
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
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dropdownIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconContainerActive: {
    backgroundColor: '#4A90E2',
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
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  locationAddress: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
    lineHeight: 20,
  },
  locationCoords: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 12,
  },
  changeLocationButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 6,
  },
  changeLocationText: {
    fontSize: 13,
    color: '#fbfbfb',
    fontWeight: '600',
  },
  getLocationButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  getLocationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  mediaButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 8,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  mediaPreviewItem: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  videoIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  descriptionInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 8,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default IncidentReportForm;