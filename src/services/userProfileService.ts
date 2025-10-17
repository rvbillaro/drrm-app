import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

const USER_PROFILE_KEY = '@user_profile';

export interface UserProfile extends User {
  avatar?: string | null;
  zone: string;
}

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(USER_PROFILE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to get user profile:', e);
    return null;
  }
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
  try {
    const currentProfile = await getUserProfile();
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      await saveUserProfile(updatedProfile);
    }
  } catch (e) {
    console.error('Failed to update user profile:', e);
  }
};

export const clearUserProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (e) {
    console.error('Failed to clear user profile:', e);
  }
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  const profile = await getUserProfile();
  return profile !== null;
};
