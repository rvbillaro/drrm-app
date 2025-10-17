import { ReliefRequest } from '../types';

// API base URL - change this to your backend URL
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust port as needed

// Mock data - used as fallback when API is unavailable
const mockReliefRequestsData: ReliefRequest[] = [
  {
    id: '1',
    name: 'Juan Dela Cruz',
    date: '2024-01-15',
    zone: 'north',
    familySize: 5,
    contact: '+63 912 345 6789',
    address: '123 Flood Street, Barangay Riverside, City',
    submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    status: 'submitted',
  },
];

// API functions for relief requests
export const submitReliefRequest = async (request: Omit<ReliefRequest, 'id' | 'status'>): Promise<{ id: string; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/relief.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting relief request:', error);
    throw error;
  }
};

export const fetchReliefRequests = async (limit?: number): Promise<ReliefRequest[]> => {
  try {
    const url = limit ? `${API_BASE_URL}/relief.php?limit=${limit}` : `${API_BASE_URL}/relief.php`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.warn('API unavailable for relief requests, using mock data:', error);
    // Fallback to mock data
    return limit ? mockReliefRequestsData.slice(0, limit) : mockReliefRequestsData;
  }
};

export const fetchReliefRequest = async (id: string): Promise<ReliefRequest | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/relief.php?id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching relief request:', error);
    return null;
  }
};
