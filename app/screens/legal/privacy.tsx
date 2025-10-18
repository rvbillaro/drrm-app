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

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: October 18, 2025</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy explains how the City Government of Caloocan - Disaster Risk Reduction and Management Office ("we," "us," or "our") collects, uses, discloses, and protects your personal information through the Disaster Risk Reduction and Management (DRRM) Application ("App").
        </Text>

        <Text style={styles.complianceBox}>
          This policy complies with:{'\n'}
          • Republic Act No. 10173 - Data Privacy Act of 2012{'\n'}
          • National Privacy Commission (NPC) Regulations{'\n'}
          • Republic Act No. 11032 - Ease of Doing Business Act{'\n'}
          • Republic Act No. 10121 - Philippine DRRM Act
        </Text>

        <Text style={styles.sectionTitle}>2. Data Controller Information</Text>
        <Text style={styles.contactInfo}>
          Data Controller:{'\n'}
          City Government of Caloocan{'\n'}
          Disaster Risk Reduction and Management Office{'\n\n'}
          Data Protection Officer:{'\n'}
          Name: Maria Teresa Santos{'\n'}
          Email: dpo.drrmo@caloocan.gov.ph{'\n'}
          Phone: (02) 8288-8181{'\n'}
          Address: 10th Avenue corner A. Mabini St., Caloocan City, Metro Manila 1400
        </Text>

        <Text style={styles.sectionTitle}>3. Information We Collect</Text>
        <Text style={styles.subTitle}>Personal Information</Text>
        <Text style={styles.bulletPoint}>• Name - Full legal name</Text>
        <Text style={styles.bulletPoint}>• Email Address - For account verification and notifications</Text>
        <Text style={styles.bulletPoint}>• Phone Number - For SMS alerts and verification</Text>
        <Text style={styles.bulletPoint}>• Address - Street address, barangay, city, and zone</Text>
        <Text style={styles.bulletPoint}>• Location Data - GPS coordinates (with your permission)</Text>

        <Text style={styles.subTitle}>Incident Reports</Text>
        <Text style={styles.bulletPoint}>• Report Details - Description of incident or emergency</Text>
        <Text style={styles.bulletPoint}>• Photos - Images uploaded as evidence</Text>
        <Text style={styles.bulletPoint}>• Location - Where the incident occurred</Text>
        <Text style={styles.bulletPoint}>• Timestamp - Date and time of report submission</Text>

        <Text style={styles.subTitle}>Relief Requests</Text>
        <Text style={styles.bulletPoint}>• Family Size - Number of family members</Text>
        <Text style={styles.bulletPoint}>• Date Needed - When relief is required</Text>
        <Text style={styles.bulletPoint}>• Contact Information - For coordination purposes</Text>

        <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
        <Text style={styles.subTitle}>Primary Purposes</Text>
        <Text style={styles.bulletPoint}>• Disaster Response - Process incident reports and coordinate response</Text>
        <Text style={styles.bulletPoint}>• Relief Distribution - Verify and process relief requests</Text>
        <Text style={styles.bulletPoint}>• Emergency Alerts - Send location-based disaster warnings</Text>
        <Text style={styles.bulletPoint}>• Account Management - Maintain and secure your account</Text>
        <Text style={styles.bulletPoint}>• Communication - Send important notifications and updates</Text>

        <Text style={styles.sectionTitle}>5. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We may share your information with:
        </Text>
        <Text style={styles.bulletPoint}>• Local Disaster Risk Reduction and Management Council (LDRRMC)</Text>
        <Text style={styles.bulletPoint}>• Philippine National Police (PNP) - For emergencies</Text>
        <Text style={styles.bulletPoint}>• Bureau of Fire Protection (BFP) - For fire incidents</Text>
        <Text style={styles.bulletPoint}>• Department of Social Welfare and Development (DSWD) - For relief distribution</Text>
        <Text style={styles.bulletPoint}>• Other relevant government agencies - As required for disaster response</Text>

        <Text style={styles.sectionTitle}>6. Your Rights Under the Data Privacy Act</Text>
        <Text style={styles.paragraph}>
          As a data subject, you have the right to:
        </Text>
        <Text style={styles.bulletPoint}>• Right to Be Informed - Know how your data is collected and used</Text>
        <Text style={styles.bulletPoint}>• Right to Access - Request a copy of your personal data</Text>
        <Text style={styles.bulletPoint}>• Right to Object - Object to processing for direct marketing</Text>
        <Text style={styles.bulletPoint}>• Right to Erasure - Request deletion of your data</Text>
        <Text style={styles.bulletPoint}>• Right to Rectification - Correct inaccurate or incomplete data</Text>
        <Text style={styles.bulletPoint}>• Right to Data Portability - Receive your data in a structured format</Text>

        <Text style={styles.sectionTitle}>7. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures:
        </Text>
        <Text style={styles.bulletPoint}>• Encryption - Data encrypted in transit and at rest</Text>
        <Text style={styles.bulletPoint}>• Access Controls - Limited access to authorized personnel only</Text>
        <Text style={styles.bulletPoint}>• Authentication - Secure login with email and phone verification</Text>
        <Text style={styles.bulletPoint}>• Monitoring - Regular security audits and monitoring</Text>

        <Text style={styles.sectionTitle}>8. Data Retention</Text>
        <Text style={styles.bulletPoint}>• Account Information - Retained while account is active</Text>
        <Text style={styles.bulletPoint}>• Incident Reports - Retained for 5 years for disaster records</Text>
        <Text style={styles.bulletPoint}>• Relief Requests - Retained for 3 years for audit purposes</Text>
        <Text style={styles.bulletPoint}>• Verification Codes - Deleted after 10 minutes or upon use</Text>

        <Text style={styles.sectionTitle}>9. Contact for Privacy Concerns</Text>
        <Text style={styles.contactInfo}>
          Data Protection Officer{'\n'}
          City Government of Caloocan - DRRMO{'\n'}
          Email: dpo.drrmo@caloocan.gov.ph{'\n'}
          Phone: (02) 8288-8181{'\n'}
          Address: 10th Avenue corner A. Mabini St., Caloocan City, Metro Manila 1400{'\n\n'}
          DRRM Office{'\n'}
          Email: drrmo@caloocan.gov.ph{'\n'}
          Phone: (02) 8288-8200 / Emergency Hotline: 8888-0000{'\n'}
          Office Hours: Monday to Friday, 8:00 AM - 5:00 PM
        </Text>

        <Text style={styles.sectionTitle}>10. National Privacy Commission</Text>
        <Text style={styles.paragraph}>
          If not satisfied with our response, you may file a complaint with:
        </Text>
        <Text style={styles.contactInfo}>
          National Privacy Commission{'\n'}
          Website: https://www.privacy.gov.ph{'\n'}
          Email: info@privacy.gov.ph{'\n'}
          Hotline: (02) 8234-2228{'\n'}
          Address: 5th Floor, Delegation Building, PICC Complex, Pasay City
        </Text>

        <Text style={styles.footer}>
          Republic of the Philippines{'\n'}
          City Government of Caloocan{'\n'}
          Disaster Risk Reduction and Management Office{'\n\n'}
          In compliance with:{'\n'}
          Republic Act No. 10173 (Data Privacy Act of 2012){'\n'}
          National Privacy Commission Circulars{'\n'}
          Republic Act No. 10121 (Philippine DRRM Act of 2010){'\n\n'}
          NPC Registration Number: PIC-2024-CALOOCAN-DRRMO-001
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
  complianceBox: {
    backgroundColor: '#DBEAFE',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 16,
    borderRadius: 8,
    fontSize: 14,
    color: '#1E40AF',
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
