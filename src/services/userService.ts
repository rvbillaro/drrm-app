import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAddress } from '../types';
import { getUserSession } from './authService';

const USER_ADDRESS_KEY = '@user_address';
const API_BASE_URL = 'http://192.168.8.118/api';

export const saveUserAddress = async (address: UserAddress): Promise<void> => {
  try {
    // Save to local storage first (as backup)
    const jsonValue = JSON.stringify(address);
    await AsyncStorage.setItem(USER_ADDRESS_KEY, jsonValue);
    
    // Get current user to get user_id
    const user = await getUserSession();
    if (!user || !user.id) {
      console.warn('No user session found, address saved locally only');
      return;
    }
    
    // Save to database via API
    const response = await fetch(`${API_BASE_URL}/auth.php?action=update-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.id,
        fullAddress: address.fullAddress,
        barangay: address.barangay,
        city: address.city,
        zone: address.zone,
        latitude: address.latitude,
        longitude: address.longitude,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save address to database');
    }
    
    const data = await response.json();
    console.log('✅ Address saved to database:', data);
  } catch (e) {
    console.error('Failed to save user address:', e);
    // Address is still saved locally even if API fails
    throw e;
  }
};

export const getUserAddress = async (): Promise<UserAddress | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_ADDRESS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to get user address:', e);
    return null;
  }
};

export const clearUserAddress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_ADDRESS_KEY);
  } catch (e) {
    console.error('Failed to clear user address:', e);
  }
};
