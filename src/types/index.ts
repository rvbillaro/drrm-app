// Common types for the DRRM app

export interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  time: string;
  location?: string;
  timestamp: string; // ISO timestamp for sorting
}

export interface IncidentReport {
  id?: string;
  incidentType: string;
  description: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  mediaFiles: MediaFile[];
  timestamp: string;
  status?: 'submitted' | 'under review' | 'in progress' | 'resolved' | 'rejected' | 'cancelled';
}

export interface MediaFile {
  uri: string;
  type: 'image' | 'video';
  name: string;
}

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

export interface UserAddress {
  fullAddress: string;
  barangay?: string;
  city: string;
  latitude: number;
  longitude: number;
  zone?: 'north' | 'south';
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  location?: UserAddress;
}

export interface Hotline {
  id: string;
  name: string;
  number: string;
  category: string;
  description?: string;
}

export interface ReliefCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  currentOccupancy: number;
  services: string[];
  contact: string;
}

export interface EvacuationArea {
  id: string;
  name: string;
  coordinates: { latitude: number; longitude: number }[];
  capacity: number;
  status: 'active' | 'inactive';
}

export interface HazardArea {
  id: string;
  name: string;
  type: 'flood' | 'landslide' | 'fire' | 'earthquake' | 'other';
  coordinates: { latitude: number; longitude: number }[];
  severity: 'low' | 'medium' | 'high';
}

export interface Incident {
  id: string;
  type: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: string;
  status: 'reported' | 'responding' | 'resolved';
}

export interface ReliefRequest {
  id?: string;
  name: string;
  date: string;
  zone: string;
  familySize: number;
  contact: string;
  address: string;
  submittedAt: string;
  status?: 'submitted' | 'under review' | 'accepted' | 'rejected';
}

export interface Schedule {
  id: string;
  type: 'training' | 'drill';
  title: string;
  description: string;
  date: string; // ISO date string
  time: string; // e.g., "14:00"
  location?: string;
  timestamp: string; // ISO timestamp
}
