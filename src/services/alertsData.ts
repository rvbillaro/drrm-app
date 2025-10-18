import { Alert } from '../types';

export type { Alert };

// API base URL - change this to your backend URL
// Use your computer's local IP address instead of localhost for mobile testing
const API_BASE_URL = 'http://192.168.8.118/api';

// Mock data - used as fallback when API is unavailable
const mockAlertsData: Alert[] = [
  {
    id: '1',
    type: 'danger',
    title: 'Flash Flood Warning',
    message: 'Heavy rainfall expected. Residents in low-lying areas advised to evacuate immediately. Emergency shelters are open.',
    time: '5 mins ago',
    location: 'North Zone',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    title: 'Typhoon Alert - Signal No. 2',
    message: 'Typhoon Pepito approaching. Signal No. 2 raised in Metro Manila. Expect strong winds and heavy rainfall.',
    time: '15 mins ago',
    location: 'All Areas',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'info',
    title: 'Evacuation Center Update',
    message: 'Barangay Hall evacuation center is now open and accepting evacuees. Food and medical assistance available.',
    time: '30 mins ago',
    location: 'North Zone',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'warning',
    title: 'Road Closure Advisory',
    message: 'Main highway flooded. Alternative routes via Rizal Avenue recommended. Exercise caution.',
    time: '1 hour ago',
    location: 'South Zone',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'danger',
    title: 'Fire Alert - Residential Area',
    message: 'Fire reported in Residential Area Block 5. Fire trucks dispatched. Nearby residents advised to stay alert.',
    time: '2 hours ago',
    location: 'South Zone',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
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
    // Backend returns {records: [...]} format
    const alerts = data.records || data;
    // If API returns empty or no data, use mock data
    if (!alerts || alerts.length === 0) {
      console.log('API returned empty data, using mock data');
      return mockAlertsData;
    }
    return alerts;
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
    // Backend returns {records: [...]} format
    const alerts = data.records || data;
    // If API returns empty or no data, use mock data
    if (!alerts || alerts.length === 0) {
      console.log('API returned empty data, using mock data');
      return mockAlertsData.slice(0, limit);
    }
    return alerts;
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
