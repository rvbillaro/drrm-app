import { IncidentReport } from '../types';

// API base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust port as needed

// Mock data - used as fallback when API is unavailable
const mockReportsData: IncidentReport[] = [
  {
    id: '1',
    incidentType: 'fire',
    description: 'Small fire in residential area, quickly contained by neighbors. No injuries reported.',
    location: {
      address: '123 Main Street, Barangay Central, City',
      latitude: 14.5995,
      longitude: 120.9842,
    },
    mediaFiles: [],
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'resolved',
  },
  {
    id: '2',
    incidentType: 'flood',
    description: 'Street flooding due to heavy rain. Water level rising in low-lying areas.',
    location: {
      address: '456 River Road, Barangay Riverside, City',
      latitude: 14.6015,
      longitude: 120.9820,
    },
    mediaFiles: [],
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    status: 'in progress',
  },
  {
    id: '3',
    incidentType: 'accident',
    description: 'Vehicle collision at intersection. Traffic backed up for several blocks.',
    location: {
      address: '789 Highway Junction, Barangay Traffic, City',
      latitude: 14.5980,
      longitude: 120.9865,
    },
    mediaFiles: [],
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    status: 'under review',
  },
  {
    id: '4',
    incidentType: 'medical',
    description: 'Elderly person experiencing chest pains. Ambulance requested.',
    location: {
      address: '321 Health Avenue, Barangay Medical, City',
      latitude: 14.6025,
      longitude: 120.9810,
    },
    mediaFiles: [],
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    status: 'submitted',
  },
  {
    id: '5',
    incidentType: 'power-outage',
    description: 'Power outage affecting multiple blocks. Utility company notified.',
    location: {
      address: '654 Electric Street, Barangay Power, City',
      latitude: 14.5970,
      longitude: 120.9875,
    },
    mediaFiles: [],
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    status: 'resolved',
  },
];

// API functions for incident reports
export const submitIncidentReport = async (report: Omit<IncidentReport, 'id' | 'status'>): Promise<{ id: string; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting incident report:', error);
    throw error;
  }
};

export const fetchIncidentReports = async (limit?: number): Promise<IncidentReport[]> => {
  try {
    const url = limit ? `${API_BASE_URL}/reports.php?limit=${limit}` : `${API_BASE_URL}/reports.php`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.warn('API unavailable for reports, using mock data:', error);
    // Fallback to mock data
    return limit ? mockReportsData.slice(0, limit) : mockReportsData;
  }
};

export const fetchIncidentReport = async (id: string): Promise<IncidentReport | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports.php?id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching incident report:', error);
    return null;
  }
};
