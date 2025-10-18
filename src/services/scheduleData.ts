import { Schedule } from '../types';

export type { Schedule };

// API base URL - change this to your backend URL
// Use your computer's local IP address instead of localhost for mobile testing
const API_BASE_URL = 'http://192.168.8.118/api';

// Mock data - used as fallback when API is unavailable
const mockSchedulesData: Schedule[] = [
  {
    id: '1',
    type: 'training',
    title: 'Emergency Response Training',
    description: 'Basic first aid and evacuation procedures training session.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00',
    location: 'Barangay Hall A',
    timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'drill',
    title: 'Fire Evacuation Drill',
    description: 'Simulated fire emergency evacuation drill for all residents.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:00',
    location: 'Community Center B',
    timestamp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'training',
    title: 'Flood Preparedness Workshop',
    description: 'Learn about flood prevention and emergency kits preparation.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    location: 'School Gym C',
    timestamp: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// API functions with backend integration
export const fetchSchedules = async (): Promise<Schedule[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    // Fallback to mock data
    return mockSchedulesData;
  }
};

export const fetchUpcomingSchedules = async (limit: number = 10): Promise<Schedule[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const schedules = data.records || [];
    // Filter for upcoming schedules
    const now = new Date();
    return schedules
      .filter((schedule: Schedule) => new Date(schedule.date + 'T' + schedule.time) >= now)
      .slice(0, limit);
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    // Fallback to mock data
    return mockSchedulesData.slice(0, limit);
  }
};

export const createSchedule = async (schedule: Omit<Schedule, 'id' | 'timestamp'>): Promise<Schedule> => {
  try {
    const response = await fetch(`${API_BASE_URL}/schedules.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...schedule,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};
