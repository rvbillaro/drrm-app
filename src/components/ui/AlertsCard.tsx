import { Alert, fetchRecentAlerts } from '@/src/services/alertsData';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AlertsCardProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function AlertsCard({ limit = 3, showViewAll = false, onViewAll }: AlertsCardProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, [limit]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecentAlerts(limit);
      setAlerts(data);
    } catch (err) {
      setError('Failed to load alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="notifications" size={24} color="#1A202C" />
            <Text style={styles.headerTitle}>Recent Alerts</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="notifications" size={24} color="#1A202C" />
            <Text style={styles.headerTitle}>Recent Alerts</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAlerts}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="notifications" size={24} color="#1A202C" />
          <Text style={styles.headerTitle}>Recent Alerts</Text>
        </View>
        {showViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      {alerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={48} color="#A0AEC0" />
          <Text style={styles.emptyText}>No alerts at this time</Text>
        </View>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 12,
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
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
  alertTime: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
});