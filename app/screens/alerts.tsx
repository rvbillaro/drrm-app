import { fetchAlerts } from '@/src/services/alertsData';
import { Alert } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { buttonStyles } from '../../src/components/utils/buttonStyles';
import { cardStyles } from '../../src/components/utils/cardStyles';
import { commonStyles } from '../../src/components/utils/commonStyles';
import { textStyles } from '../../src/components/utils/textStyles';

export default function AllAlertsScreen() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Failed to load alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: '#FEE',
          borderColor: '#FF6B6B',
          iconColor: '#FF6B6B',
          icon: 'warning' as const,
        };
      case 'warning':
        return {
          backgroundColor: '#FFF4E6',
          borderColor: '#FFB84D',
          iconColor: '#FFB84D',
          icon: 'alert-circle' as const,
        };
      case 'info':
        return {
          backgroundColor: '#E6F7FF',
          borderColor: '#4A90E2',
          iconColor: '#4A90E2',
          icon: 'information-circle' as const,
        };
      default:
        return {
          backgroundColor: '#F7FAFC',
          borderColor: '#CBD5E0',
          iconColor: '#CBD5E0',
          icon: 'ellipse' as const,
        };
    }
  };

  const renderAlert = ({ item }: { item: Alert }) => {
    const alertStyle = getAlertStyle(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.alertCard,
          { 
            backgroundColor: alertStyle.backgroundColor,
            borderLeftColor: alertStyle.borderColor,
          },
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.alertIcon}>
          <Ionicons name={alertStyle.icon} size={24} color={alertStyle.iconColor} />
        </View>
        
        <View style={styles.alertContent}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertTitle}>{item.title}</Text>
            {item.location && (
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={12} color="#718096" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.alertMessage} numberOfLines={2}>
            {item.message}
          </Text>
          
          <Text style={styles.alertTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAlerts}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4A90E2']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#A0AEC0" />
              <Text style={styles.emptyText}>No alerts available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  headerBar: commonStyles.headerBar,
  backButton: commonStyles.backButton,
  headerTitle: commonStyles.headerTitle,
  placeholder: {
    width: 32,
  },
  loadingContainer: commonStyles.loadingContainer,
  loadingText: commonStyles.loadingText,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: buttonStyles.actionButton,
  retryText: buttonStyles.actionButtonText,
  emptyContainer: commonStyles.emptyState,
  emptyText: {
    fontSize: 16,
    color: '#A0AEC0',
    marginTop: 16,
  },
  listContent: {
    padding: 20,
  },
  alertCard: cardStyles.alertCard,
  alertIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
    flex: 1,
    marginRight: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#718096',
  },
  alertMessage: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 8,
  },
  alertTime: textStyles.timestamp,
});
