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
import { fetchReliefRequests } from '../../../src/services/reliefService';
import { ReliefRequest } from '../../../src/types';

const ReliefRequestsScreen: React.FC = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<ReliefRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      // Get current user
      const user = await getUserSession();
      if (user) {
        // Fetch requests for this user only
        const fetchedRequests = await fetchReliefRequests(user.id);
        setRequests(fetchedRequests);
      }
    } catch (error) {
      console.error('Failed to load relief requests:', error);
      Alert.alert('Error', 'Failed to load relief requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload requests when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests])
  );

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'submitted':
        return '#4A90E2';
      case 'under review':
        return '#F5A623';
      case 'accepted':
        return '#7ED321';
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
      case 'accepted':
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading requests...</Text>
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
        <Text style={styles.headerTitle}>Relief Requests</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {requests.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#CBD5E0" />
            <Text style={styles.emptyTitle}>No Requests Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your relief requests will appear here once you submit them.
            </Text>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={() => router.push('/screens/relief')}
            >
              <Text style={styles.requestButtonText}>Submit a Request</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.requestsList}>
            {requests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={styles.requestCard}
                onPress={() => {
                  // Navigate to request details (to be implemented)
                  console.log('View request details:', request.id);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.requestTypeContainer}>
                    <Ionicons
                      name="person"
                      size={20}
                      color="#4A90E2"
                    />
                    <Text style={styles.requestType}>
                      {request.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(request.status) },
                    ]}
                  >
                    <Ionicons
                      name={getStatusIcon(request.status) as any}
                      size={14}
                      color="#fff"
                    />
                    <Text style={styles.statusText}>
                      {request.status || 'Unknown'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.requestDescription} numberOfLines={2}>
                  Family of {request.familySize} in {request.zone} zone. Contact: {request.contact}
                </Text>

                <View style={styles.requestFooter}>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={14} color="#718096" />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {request.address}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>
                    {formatDate(request.submittedAt)}
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
  requestButton: buttonStyles.actionButton,
  requestButtonText: buttonStyles.actionButtonText,
  requestsList: {
    gap: 16,
  },
  requestCard: cardStyles.card,
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requestType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  statusBadge: cardStyles.statusBadge,
  statusText: textStyles.statusText,
  requestDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 16,
  },
  requestMeta: {
    marginBottom: 16,
  },
  urgencyBadge: cardStyles.urgencyBadge,
  urgencyText: cardStyles.urgencyText,
  requestFooter: {
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

export default ReliefRequestsScreen;
