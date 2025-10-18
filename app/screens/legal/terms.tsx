import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: October 18, 2025</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to the Disaster Risk Reduction and Management (DRRM) Application ("App"). This App is operated by the City Government of Caloocan - Disaster Risk Reduction and Management Office ("we," "us," or "our") to provide disaster preparedness, response, and relief services to residents.
        </Text>
        <Text style={styles.paragraph}>
          By accessing or using this App, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use this App.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.bulletPoint}>• You must be at least 13 years old to use this App</Text>
        <Text style={styles.bulletPoint}>• You must be a resident or stakeholder within the jurisdiction served by this App</Text>
        <Text style={styles.bulletPoint}>• You must provide accurate and truthful information during registration</Text>

        <Text style={styles.sectionTitle}>3. Account Registration</Text>
        <Text style={styles.subTitle}>3.1 Account Creation</Text>
        <Text style={styles.bulletPoint}>• You must register with a valid email address and phone number</Text>
        <Text style={styles.bulletPoint}>• You are responsible for maintaining the confidentiality of your account credentials</Text>
        <Text style={styles.bulletPoint}>• You must verify your email and phone number before accessing certain features</Text>

        <Text style={styles.sectionTitle}>4. Acceptable Use</Text>
        <Text style={styles.subTitle}>You Agree To:</Text>
        <Text style={styles.bulletPoint}>• Provide accurate and truthful information in all reports and requests</Text>
        <Text style={styles.bulletPoint}>• Use the App only for legitimate disaster-related purposes</Text>
        <Text style={styles.bulletPoint}>• Respect the privacy and rights of other users</Text>
        <Text style={styles.bulletPoint}>• Comply with all applicable Philippine laws and regulations</Text>

        <Text style={styles.subTitle}>You Agree NOT To:</Text>
        <Text style={styles.bulletPoint}>• Submit false or fraudulent incident reports</Text>
        <Text style={styles.bulletPoint}>• Submit false relief requests</Text>
        <Text style={styles.bulletPoint}>• Use another person's identity or information</Text>
        <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the system</Text>

        <Text style={styles.sectionTitle}>5. Services Provided</Text>
        <Text style={styles.subTitle}>5.1 Incident Reporting</Text>
        <Text style={styles.bulletPoint}>• Submit reports of disasters, emergencies, or hazards</Text>
        <Text style={styles.bulletPoint}>• Upload photos as evidence (required)</Text>
        <Text style={styles.bulletPoint}>• Track the status of your reports</Text>

        <Text style={styles.subTitle}>5.2 Relief Requests</Text>
        <Text style={styles.bulletPoint}>• Request relief goods during declared disasters</Text>
        <Text style={styles.bulletPoint}>• Phone verification required before submission</Text>
        <Text style={styles.bulletPoint}>• Requests are subject to verification and approval</Text>
        <Text style={styles.bulletPoint}>• False requests may result in account suspension and legal action</Text>

        <Text style={styles.sectionTitle}>6. Verification Requirements</Text>
        <Text style={styles.paragraph}>
          Email verification is required for account activation. Phone verification is required for submitting relief requests and must be re-verified if phone number is changed.
        </Text>

        <Text style={styles.sectionTitle}>7. Emergency Services</Text>
        <Text style={styles.warningBox}>
          ⚠️ This App does NOT replace emergency hotlines (911, etc.). For immediate life-threatening emergencies, call 911. Use this App to supplement, not replace, emergency services.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact Information</Text>
        <Text style={styles.paragraph}>
          For questions about these Terms:
        </Text>
        <Text style={styles.contactInfo}>
          City Government of Caloocan - DRRM Office{'\n'}
          Address: 10th Avenue corner A. Mabini St., Caloocan City, Metro Manila 1400{'\n'}
          Email: drrmo@caloocan.gov.ph{'\n'}
          Phone: (02) 8288-8200{'\n'}
          Emergency Hotline: 8888-0000{'\n'}
          Office Hours: Monday to Friday, 8:00 AM - 5:00 PM
        </Text>

        <Text style={styles.footer}>
          Republic of the Philippines{'\n'}
          City Government of Caloocan{'\n'}
          Disaster Risk Reduction and Management Office
        </Text>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    marginTop: 24,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 8,
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 22,
    marginVertical: 12,
  },
  contactInfo: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 22,
    backgroundColor: '#EDF2F7',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  footer: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 16,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});
