import { EvacuationArea, HazardArea, Incident } from '../types';

// Mock data for development - replace with API calls later
export const mockEvacuationAreas: EvacuationArea[] = [
  {
    id: '1',
    name: 'Barangay Hall Evacuation Center',
    coordinates: [
      { latitude: 14.5995, longitude: 120.9842 },
      { latitude: 14.6000, longitude: 120.9842 },
      { latitude: 14.6000, longitude: 120.9850 },
      { latitude: 14.5995, longitude: 120.9850 },
    ],
    capacity: 500,
    status: 'active',
  },
  {
    id: '2',
    name: 'School Gym Evacuation Center',
    coordinates: [
      { latitude: 14.6010, longitude: 120.9860 },
      { latitude: 14.6015, longitude: 120.9860 },
      { latitude: 14.6015, longitude: 120.9870 },
      { latitude: 14.6010, longitude: 120.9870 },
    ],
    capacity: 300,
    status: 'active',
  },
];

export const mockHazardAreas: HazardArea[] = [
  {
    id: '1',
    name: 'Flood Prone Area',
    type: 'flood',
    coordinates: [
      { latitude: 14.5980, longitude: 120.9830 },
      { latitude: 14.5990, longitude: 120.9830 },
      { latitude: 14.5990, longitude: 120.9840 },
      { latitude: 14.5980, longitude: 120.9840 },
    ],
    severity: 'high',
  },
  {
    id: '2',
    name: 'Landslide Risk Zone',
    type: 'landslide',
    coordinates: [
      { latitude: 14.6020, longitude: 120.9880 },
      { latitude: 14.6030, longitude: 120.9880 },
      { latitude: 14.6030, longitude: 120.9890 },
      { latitude: 14.6020, longitude: 120.9890 },
    ],
    severity: 'medium',
  },
];

export const mockIncidents: Incident[] = [
  {
    id: '1',
    type: 'Flooding',
    description: 'Street flooding reported in Barangay Central',
    location: {
      latitude: 14.5990,
      longitude: 120.9845,
      address: 'Barangay Central, Manila',
    },
    timestamp: '2024-01-15T10:30:00Z',
    status: 'reported',
  },
  {
    id: '2',
    type: 'Power Outage',
    description: 'Power lines down due to strong winds',
    location: {
      latitude: 14.6005,
      longitude: 120.9855,
      address: 'Barangay East, Manila',
    },
    timestamp: '2024-01-15T11:15:00Z',
    status: 'responding',
  },
];

// Service functions - replace with actual API calls when backend is ready
export const fetchEvacuationAreas = async (): Promise<EvacuationArea[]> => {
  // TODO: Replace with actual API call to admin's Leaflet system
  // const response = await fetch('https://admin-api.example.com/evacuation-areas');
  // return response.json();
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockEvacuationAreas), 500);
  });
};

export const fetchHazardAreas = async (): Promise<HazardArea[]> => {
  // TODO: Replace with actual API call to admin's Leaflet system
  // const response = await fetch('https://admin-api.example.com/hazard-areas');
  // return response.json();
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockHazardAreas), 500);
  });
};

export const fetchIncidents = async (): Promise<Incident[]> => {
  // TODO: Replace with actual API call to admin's Leaflet system
  // const response = await fetch('https://admin-api.example.com/incidents');
  // return response.json();
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockIncidents), 500);
  });
};
