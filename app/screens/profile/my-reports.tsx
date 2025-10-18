import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getUserSession } from '../../../src/services/authService';
import { buttonStyles } from '../../../src/components/utils/buttonStyles';
import { cardStyles } from '../../../src/components/utils/cardStyles';
import { commonStyles } from '../../../src/components/utils/commonStyles';
import { textStyles } from '../../../src/components/utils/textStyles';
import { fetchIncidentReports } from '../../../src/services/reportsService';
import { IncidentReport } from '../../../src/types';

const MyReportsScreen: React.FC = () => {
  const router = useRouter();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      // Get current user
      const user = await getUserSession();
      if (user) {
        setUserId(user.id);
        // Fetch reports for this user
        const fetchedReports = await fetchIncidentReports(user.id);
        setReports(fetchedReports);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      Alert.alert('Error', 'Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload reports when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'submitted':
        return '#4A90E2';
      case 'under review':
        return '#F5A623';
      case 'in progress':
        return '#7ED321';
      case 'resolved':
        return '#4CAF50';
      case 'rejected':
        return '#D0021B';
      default:
        return '#CBD5E0';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'submitted':
        return 'checkmark-circle';
      case 'under review':
        return 'time';
      case 'in progress':
        return 'play-circle';
      case 'resolved':
        return 'checkmark-circle-outline';
      case 'rejected':
        return 'close-circle';
      default:
        return 'ellipse';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIncidentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      fire: 'Fire',
      flood: 'Flood',
      accident: 'Accident',
      medical: 'Medical Emergency',
      earthquake: 'Earthquake',
      landslide: 'Landslide',
      'power-outage': 'Power Outage',
      other: 'Other',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your incident reports will appear here once you submit them.
            </Text>
            <TouchableOpacity
              style={styles.reportButton}
              onPress={() => router.push('/screens/report')}
            >
              <Text style={styles.reportButtonText}>Submit a Report</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportsList}>
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => {
                  // Navigate to report details (to be implemented)
                  console.log('View report details:', report.id);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.incidentTypeContainer}>
                    <Ionicons
                      name="alert-circle"
                      size={20}
                      color="#4A90E2"
                    />
                    <Text style={styles.incidentType}>
                      {getIncidentTypeLabel(report.incidentType)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(report.status) },
                    ]}
                  >
                    <Ionicons
                      name={getStatusIcon(report.status) as any}
                      size={14}
                      color="#fff"
                    />
                    <Text style={styles.statusText}>
                      {report.status || 'Unknown'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.reportDescription} numberOfLines={2}>
                  {report.description}
                </Text>

                <View style={styles.reportFooter}>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={14} color="#718096" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {report.location.address}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>
                    {formatDate(report.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: commonStyles.loadingContainer,
  loadingText: commonStyles.loadingText,
  headerBar: commonStyles.headerBar,
  backButton: commonStyles.backButton,
  headerTitle: commonStyles.headerTitle,
  placeholder: commonStyles.placeholder,
  content: commonStyles.content,
  emptyState: commonStyles.emptyState,
  emptyTitle: commonStyles.emptyTitle,
  emptySubtitle: commonStyles.emptySubtitle,
  reportButton: buttonStyles.actionButton,
  reportButtonText: buttonStyles.actionButtonText,
  reportsList: {
    gap: 16,
  },
  reportCard: cardStyles.card,
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  incidentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  statusBadge: cardStyles.statusBadge,
  statusText: textStyles.statusText,
  reportDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 16,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#718096',
    flex: 1,
  },
  timestamp: textStyles.timestamp,
  bottomSpacer: commonStyles.bottomSpacer,
});

export default MyReportsScreen;
