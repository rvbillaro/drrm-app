import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserAddress } from '../types';

const USER_ADDRESS_KEY = '@user_address';

export const saveUserAddress = async (address: UserAddress): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(address);
    await AsyncStorage.setItem(USER_ADDRESS_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save user address:', e);
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
