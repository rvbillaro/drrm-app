import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { buttonStyles } from '../../src/components/utils/buttonStyles';
import { cardStyles } from '../../src/components/utils/cardStyles';
import { commonStyles } from '../../src/components/utils/commonStyles';
import { textStyles } from '../../src/components/utils/textStyles';
import { clearUserProfile, getUserProfile, updateUserProfile, UserProfile } from '../../src/services/userProfileService';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setUser(profile);
        } else {
          // Fallback to mock data if no profile found
          setUser({
            id: '1',
            name: 'Juan Dela Cruz',
            email: 'juan.delacruz@email.com',
            phone: '+63 912 345 6789',
            location: {
              fullAddress: 'Pasay City, Metro Manila',
              city: 'Pasay City',
              latitude: 14.5547,
              longitude: 120.9842,
            },
            zone: 'North Zone',
            avatar: null as string | null,
          });
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Fallback to mock data on error
        setUser({
          id: '1',
          name: 'Juan Dela Cruz',
          email: 'juan.delacruz@email.com',
          phone: '+63 912 345 6789',
          location: {
            fullAddress: 'Pasay City, Metro Manila',
            city: 'Pasay City',
            latitude: 14.5547,
            longitude: 120.9842,
          },
          zone: 'North Zone',
            avatar: null as string | null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handlePhoneEdit = () => {
    setPhoneInput(user?.phone || '');
    setIsEditingPhone(true);
  };

  const handlePhoneSave = async () => {
    if (phoneInput.trim()) {
      try {
        await updateUserProfile({ phone: phoneInput.trim() });
        setUser(prev => prev ? { ...prev, phone: phoneInput.trim() } : null);
        setIsEditingPhone(false);
      } catch (error) {
        console.error('Failed to update phone:', error);
        Alert.alert('Error', 'Failed to update phone number. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Phone number cannot be empty.');
    }
  };

  const handlePhoneCancel = () => {
    setIsEditingPhone(false);
    setPhoneInput('');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserProfile();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Failed to logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: '2',
      icon: 'location-outline',
      label: 'Location & Zone',
      subtitle: user?.zone || 'Zone not set',
      onPress: () => router.push('/onboarding/location'),
      showChevron: true,
    },
    {
      id: '4',
      icon: 'document-text-outline',
      label: 'My Reports',
      subtitle: 'View incident reports',
      onPress: () => router.push('/screens/profile/my-reports'),
      showChevron: true,
    },
    {
      id: '5',
      icon: 'cube-outline',
      label: 'Relief Requests',
      subtitle: 'Track your requests',
      onPress: () => router.push('/screens/profile/relief-requests'),
      showChevron: true,
    },
  ];

  const supportItems = [
    {
      id: '2',
      icon: 'shield-checkmark-outline',
      label: 'Privacy Policy',
      onPress: () => console.log('Privacy'),
      showChevron: true,
    },
    {
      id: '3',
      icon: 'document-outline',
      label: 'Terms & Conditions',
      onPress: () => console.log('Terms'),
      showChevron: true,
    },
    {
      id: '4',
      icon: 'information-circle-outline',
      label: 'About',
      subtitle: 'Version 1.0.0',
      onPress: () => console.log('About'),
      showChevron: true,
    },
  ];

  return (
    <View style={commonStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton} onPress={handleEditProfile}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
        </View>

        {/* Profile Info Card */}
        <View style={styles.infoSection}>
          <View style={cardStyles.cardSmall}>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#4A90E2" />
              <View style={styles.infoContent}>
                <View style={styles.infoHeader}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <TouchableOpacity onPress={handlePhoneEdit} style={styles.editButton}>
                    <Feather name="edit" size={20} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
                {isEditingPhone ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.phoneInput}
                      value={phoneInput}
                      onChangeText={setPhoneInput}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                    />
                    <View style={styles.editActions}>
                      <TouchableOpacity onPress={handlePhoneSave} style={styles.saveButton}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handlePhoneCancel} style={styles.cancelButton}>
                        <Ionicons name="close" size={16} color="#718096" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.infoText}>{user?.phone || '+63 XXX XXX XXXX'}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color="#4A90E2" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoText}>{user?.location?.fullAddress || 'Location not set'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="map-outline" size={20} color="#4A90E2" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Barangay</Text>
                <Text style={styles.infoText}>{user?.location?.barangay || 'Barangay not set'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={cardStyles.section}>
          <Text style={textStyles.sectionTitle}>Account</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={22} color="#4A90E2" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.showChevron && (
                <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={cardStyles.section}>
          <Text style={textStyles.sectionTitle}>Legal</Text>
          {supportItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon as any} size={22} color="#718096" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {item.showChevron && (
                <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={commonStyles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: textStyles.title,
  userEmail: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    color: '#2D3748',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#A0AEC0',
  },
  logoutButton: buttonStyles.dangerButton,
  logoutText: buttonStyles.dangerButtonText,
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  editButton: {
    padding: 4,
  },
  editContainer: {
    marginTop: 8,
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: '#2D3748',
    backgroundColor: '#fff',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F7FAFC',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E0',
  },
});
