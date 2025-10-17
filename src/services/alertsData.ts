import { Alert } from '../types';

export type { Alert };

// API base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust port as needed

// Mock data - used as fallback when API is unavailable
const mockAlertsData: Alert[] = [
  {
    id: '1',
    type: 'danger',
    title: 'Flash Flood Warning',
    message: 'Heavy rainfall expected. Residents in low-lying areas advised to evacuate immediately.',
    time: '5 mins ago',
    location: 'North Zone',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    title: 'Typhoon Alert',
    message: 'Typhoon Pepito approaching. Signal No. 2 raised in Metro Manila.',
    time: '15 mins ago',
    location: 'All Areas',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'danger',
    title: 'Fire Alert',
    message: 'Fire reported in Residential Area Block 5. Fire trucks dispatched.',
    time: '4 hours ago',
    location: 'South Zone',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

// API functions with backend integration
export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts.php`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    // Fallback to mock data
    return mockAlertsData;
  }
};

export const fetchRecentAlerts = async (limit: number = 3): Promise<Alert[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts.php?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    // Fallback to mock data
    return mockAlertsData.slice(0, limit);
  }
};

export const createAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...alert,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};
