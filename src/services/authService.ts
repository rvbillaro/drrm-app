// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';

// Complete the auth session for Google OAuth
WebBrowser.maybeCompleteAuthSession();

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  profileImage?: string;
  authProvider?: 'email' | 'google';
  createdAt: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

// Storage keys
const USER_SESSION_KEY = '@user_session';
const AUTH_TOKEN_KEY = '@auth_token';

// Import centralized API configuration
import { API_BASE_URL } from '../config/api';

/**
 * Register a new user with email/password
 */
export const registerUser = async (userData: RegisterUserData): Promise<{ user: User; token: string }> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Make API call to your backend
    const response = await fetch(`${API_BASE_URL}/auth.php?action=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();

    return {
      user: {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        authProvider: 'email',
        createdAt: new Date().toISOString(),
      },
      token: 'dummy-token', // Since backend doesn't return token yet
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login with email/password
 */
export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();

    return {
      user: {
        id: data.user.id.toString(),
        name: data.user.name,
        email: data.user.email,
        emailVerified: data.user.emailVerified || false,
        phone: data.user.phone,
        phoneVerified: data.user.phoneVerified || false,
        authProvider: 'email',
        createdAt: new Date().toISOString(),
      },
      token: 'dummy-token', // Since backend doesn't return token yet
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Google OAuth Sign In
 */
export const signInWithGoogle = async (accessToken: string): Promise<{ user: User; token: string }> => {
  try {
    // Send Google access token to your backend for verification
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Google sign-in failed');
    }

    const data = await response.json();

    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        profileImage: data.user.profileImage,
        authProvider: 'google',
        createdAt: data.user.createdAt || new Date().toISOString(),
      },
      token: data.token,
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Save user session to AsyncStorage
 */
export const saveUserSession = async (user: User, token?: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving user session:', error);
    throw new Error('Failed to save user session');
  }
};

/**
 * Get current user session
 */
export const getUserSession = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_SESSION_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};

/**
 * Get auth token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([USER_SESSION_KEY, AUTH_TOKEN_KEY]);
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getUserSession();
    const token = await getAuthToken();
    return !!(user && token);
  } catch (error) {
    return false;
  }
};
