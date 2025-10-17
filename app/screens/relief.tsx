import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ReliefFormScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [zone, setZone] = useState<string>('');
  const [familySize, setFamilySize] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);



  const router = useRouter(); 

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name');
      return false;
    }
    if (!date) {
      Alert.alert('Missing Information', 'Please select a date');
      return false;
    }
    if (!zone) {
      Alert.alert('Missing Information', 'Please select your zone');
      return false;
    }
    if (!familySize || parseInt(familySize) < 1) {
      Alert.alert('Invalid Information', 'Please enter a valid family size');
      return false;
    }
    if (!contact.trim()) {
      Alert.alert('Missing Information', 'Please enter your contact number');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Missing Information', 'Please enter your address');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formData = {
      name,
      date,
      zone,
      familySize: parseInt(familySize),
      contact,
      address,
      submittedAt: new Date().toISOString(),
    };

    console.log('Relief Goods Form:', formData);

    Alert.alert('Success', 'Your relief goods request has been submitted successfully.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header with back button */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Relief Goods Request</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              Fill out this form to request relief goods distribution
            </Text>
          </View>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#A0AEC0" />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#A0AEC0"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date *</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={20} color="#A0AEC0" />
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#A0AEC0"
                value={date}
                editable={false}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <>
                {Platform.OS === 'ios' && (
                  <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          if (tempDate) {
                            const formatted = tempDate.toISOString().split('T')[0];
                            setDate(formatted);
                          }
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={styles.doneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={tempDate || (date ? new Date(date) : new Date())}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setTempDate(selectedDate);
                      }}
                    />
                  </View>
                )}

                {Platform.OS === 'android' && (
                  <DateTimePicker
                    value={date ? new Date(date) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        const formatted = selectedDate.toISOString().split('T')[0];
                        setDate(formatted);
                      }
                    }}
                  />
                )}
              </>
            )}
          </View>


          {/* Zone */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Zone *</Text>
            <View style={styles.pickerWrapper}>
              <Ionicons name="compass-outline" size={20} color="#A0AEC0" style={{ marginRight: 8 }} />
              <Picker
                selectedValue={zone}
                onValueChange={(value) => setZone(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Zone" value="" color="#A0AEC0" />
                <Picker.Item label="North" value="north" />
                <Picker.Item label="South" value="south" />
              </Picker>
            </View>
          </View>

          {/* Family Size */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Family Size *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="people-outline" size={20} color="#A0AEC0" />
              <TextInput
                style={styles.input}
                placeholder="Number of family members"
                placeholderTextColor="#A0AEC0"
                value={familySize}
                onChangeText={(text) => setFamilySize(text.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>

          {/* Contact Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact Number *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#A0AEC0" />
              <TextInput
                style={styles.input}
                placeholder="Enter your contact number"
                placeholderTextColor="#A0AEC0"
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Complete Address *</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#A0AEC0"
                style={styles.textAreaIcon}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter your complete address"
                placeholderTextColor="#A0AEC0"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>



          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
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
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 12,
    paddingVertical: 16,
  },
  selectText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  todayButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F0F7FF',
    borderRadius: 6,
  },
  todayButtonText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  zoneContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  zoneButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  zoneButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  zoneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 8,
  },
  zoneButtonTextActive: {
    color: '#fff',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
    minHeight: 120,
  },
  textAreaIcon: {
    marginTop: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  bottomSpacer: {
    height: 40,
  },
  iosPickerContainer: {
  backgroundColor: '#fff',
  borderRadius: 12,
  marginTop: 8,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cancelText: {
    color: '#A0AEC0',
    fontSize: 16,
  },
  doneText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
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
picker: {
  flex: 1,
  color: '#2D3748',
},

});

export default ReliefFormScreen;