import { cardStyles } from '@/src/components/utils/cardStyles';
import { commonStyles } from '@/src/components/utils/commonStyles';
import { textStyles } from '@/src/components/utils/textStyles';
import { fetchSchedules } from '@/src/services/scheduleData';
import { Schedule } from '@/src/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load schedules function wrapped in useCallback
  const loadSchedules = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSchedules();
      setSchedules(data);
    } catch (err) {
      setError('Failed to load schedules');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load schedules on mount
  React.useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadSchedules();
    setRefreshing(false);
  }, [loadSchedules]);

  // Calendar utilities
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => schedule.date === dateStr);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && styles.today
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayText
          ]}>
            {day}
          </Text>
          {dayEvents.length > 0 && (
            <View style={styles.eventIndicatorContainer}>
              {dayEvents.map((event, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.eventIndicator,
                    event.type === 'training' ? styles.trainingIndicator : styles.drillIndicator
                  ]}
                />
              ))}
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const renderEventsList = () => {
    const eventsToShow = selectedDate
      ? getEventsForDate(selectedDate)
      : schedules.filter(schedule => new Date(schedule.date) >= new Date());

    if (eventsToShow.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {selectedDate ? 'No events scheduled for this day' : 'No upcoming events'}
          </Text>
        </View>
      );
    }

    return eventsToShow.map(schedule => (
      <View key={schedule.id} style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{schedule.title}</Text>
          <View style={[
            styles.eventTypeBadge,
            schedule.type === 'training' ? styles.trainingBadge : styles.drillBadge
          ]}>
            <Text style={styles.eventTypeText}>
              {schedule.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <Text style={styles.eventDetailText}>📅 {schedule.date}</Text>
          <Text style={styles.eventDetailText}>
            🕐 {schedule.time}
          </Text>
          {schedule.location && (
            <Text style={styles.eventDetailText}>📍 {schedule.location}</Text>
          )}
        </View>

        <Text style={styles.eventDescription}>{schedule.description}</Text>
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Loading schedule...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      
      {/* Month Navigation */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.navButton}>
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <View key={day} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {renderCalendarDays()}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.trainingIndicator]} />
          <Text style={styles.legendText}>Training</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.drillIndicator]} />
          <Text style={styles.legendText}>Drill</Text>
        </View>
      </View>

      {/* Events List */}
      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>
          {selectedDate 
            ? `Events on ${selectedDate.toLocaleDateString()}`
            : 'Upcoming Events'}
        </Text>
        {selectedDate && (
          <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Show All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {renderEventsList()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBar: commonStyles.headerBar,
  backButton: commonStyles.backButton,
  headerTitle: commonStyles.headerTitle,
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    ...textStyles.title,
    marginBottom: 20,
  },
  loadingText: {
    ...commonStyles.loadingText,
  },
  monthHeader: {
    ...cardStyles.cardSmall,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    ...textStyles.sectionTitle,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  calendar: {
    ...cardStyles.card,
    padding: 12,
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    ...textStyles.smallBold,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    ...textStyles.body,
  },
  selectedDay: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  today: {
    borderWidth: 2,
    borderColor: '#4a90e2',
    borderRadius: 8,
  },
  todayText: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  eventIndicatorContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  trainingIndicator: {
    backgroundColor: '#3b82f6',
  },
  drillIndicator: {
    backgroundColor: '#f59e0b',
  },
  legend: {
    ...cardStyles.cardSmall,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...textStyles.body,
  },
  eventsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...textStyles.sectionTitle,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  eventCard: {
    ...cardStyles.card,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    ...textStyles.bodyLarge,
    fontWeight: '600',
    flex: 1,
  },
  eventTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  trainingBadge: {
    backgroundColor: '#dbeafe',
  },
  drillBadge: {
    backgroundColor: '#fef3c7',
  },
  eventTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1f2937',
  },
  eventDetails: {
    gap: 6,
    marginBottom: 12,
  },
  eventDetailText: {
    ...textStyles.body,
  },
  eventDescription: {
    ...textStyles.body,
    lineHeight: 20,
  },
  emptyState: {
    ...commonStyles.emptyState,
  },
  emptyStateText: {
    ...textStyles.body,
    color: '#9ca3af',
  },
});
