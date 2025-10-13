export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  time: string;
  location?: string;
  timestamp: string; // ISO timestamp for sorting
}

// Mock data - replace with API fetch later
export const alertsData: Alert[] = [
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

// API functions (ready for backend integration)
export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('YOUR_API_ENDPOINT/alerts');
    // const data = await response.json();
    // return data;
    
    // For now, return mock data
    return alertsData;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const fetchRecentAlerts = async (limit: number = 3): Promise<Alert[]> => {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`YOUR_API_ENDPOINT/alerts?limit=${limit}`);
    // const data = await response.json();
    // return data;
    
    // For now, return limited mock data
    return alertsData.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
    throw error;
  }
};