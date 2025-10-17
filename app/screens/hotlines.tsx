import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { commonStyles } from '../../src/components/utils/commonStyles';

interface ContactNumber {
  label: string;
  number: string;
}

export default function Hotlines() {
  const router = useRouter();

  const handleCall = (number: string) => {
    const cleanNumber = number.replace(/[\s()-]/g, '');
    
    Alert.alert(
      'Call Emergency Hotline',
      `Do you want to call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${cleanNumber}`).catch(err => {
              Alert.alert('Error', 'Unable to make call');
              console.error('Error making call:', err);
            });
          }
        }
      ]
    );
  };

  const handleCopy = (number: string) => {
    // In React Native, you'd need Clipboard from '@react-native-clipboard/clipboard'
    Alert.alert('Copy', `Number ${number} would be copied to clipboard`);
  };


  const rescueNumbers: ContactNumber[] = [
    { label: 'Mobile 1', number: '0916-797-6365' },
    { label: 'Mobile 2', number: '0947-796-4372' },
    { label: 'Trunkline', number: '(02) 5310-7536' },
    { label: 'Local', number: '2287' }
  ];

  const otherNumbers: ContactNumber[] = [
    { label: 'Medical Center ER', number: '5310-1463' },
    { label: 'City Hall Security', number: '(02) 8288-8811' }
  ];

  const renderContactCard = (contacts: ContactNumber[], title?: string) => (
    <View style={styles.card}>
      {title && <Text style={styles.cardTitle}>{title}</Text>}
      {contacts.map((contact, index) => (
        <View key={index} style={styles.contactRow}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>{contact.label}:</Text>
            <Text style={styles.contactNumber}>{contact.number}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(contact.number)}
            >
              <Ionicons name="call" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => handleCopy(contact.number)}
            >
              <Ionicons name="copy" size={18} color="#1a1a1a" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Hotlines</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* DRRM Rescue Section */}
        <Text style={styles.sectionTitle}>DRRM Rescue & Mobile Contacts</Text>
        {renderContactCard(rescueNumbers)}

        {/* Other Hotlines Section */}
        <Text style={styles.sectionTitle}>Other Useful Local Hotlines</Text>
        {renderContactCard(otherNumbers)}

        {/* Emergency Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="information-circle" size={20} color="#1a1a1a" />
            <Text style={styles.tipsTitle}>Emergency Calling Tips:</Text>
          </View>
          <Text style={styles.tipText}>• Stay calm and speak clearly</Text>
          <Text style={styles.tipText}>• Provide your exact location</Text>
          <Text style={styles.tipText}>• Describe the emergency situation</Text>
          <Text style={styles.tipText}>• Follow dispatcher's instructions</Text>
          <Text style={styles.tipText}>• Don't hang up until told to do so</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBar: commonStyles.headerBar,
  backButton: commonStyles.backButton,
  headerTitle: commonStyles.headerTitle,
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 16,
    color: '#1A202C',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 18,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIcon: {
    fontSize: 18,
  },
  tipsCard: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 8,
  },
});