import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { getUserSession, saveUserSession } from '../../src/services/authService';

const API_BASE_URL = 'http://192.168.8.118/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, email, name } = params;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    // Send initial verification code
    sendVerificationCode();
    
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendVerificationCode = async () => {
    try {
      setResending(true);
      const response = await fetch(`${API_BASE_URL}/auth.php?action=send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          type: 'email',
          email: email,
          name: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      console.log('✅ Verification code sent to email');
      
      // DEVELOPMENT ONLY: Show code in alert for testing
      if (data.dev_code) {
        Alert.alert(
          'Code Sent (DEV MODE)', 
          `Your verification code is: ${data.dev_code}\n\nIn production, this will be sent via email.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Code Sent', 'Please check your email for the verification code.');
      }
      
      setTimer(60); // Reset timer
    } catch (error) {
      console.error('Error sending verification code:', error);
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a 6-digit code.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth.php?action=verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          code: code,
          type: 'email',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Update user session to mark email as verified
      const currentUser = await getUserSession();
      if (currentUser) {
        await saveUserSession({
          ...currentUser,
          emailVerified: true,
        });
      }

      Alert.alert('Success', 'Email verified successfully!', [
        {
          text: 'Continue',
          onPress: () => router.replace('/onboarding/location'),
        },
      ]);
    } catch (error) {
      console.error('Error verifying code:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (timer > 0) {
      Alert.alert('Please Wait', `You can resend the code in ${timer} seconds.`);
      return;
    }
    sendVerificationCode();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="mail" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit verification code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#A0AEC0"
            autoFocus
          />
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyButtonText}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0 || resending}>
            <Text style={[styles.resendLink, (timer > 0 || resending) && styles.resendDisabled]}>
              {resending ? 'Sending...' : timer > 0 ? `Resend (${timer}s)` : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
    color: '#4A90E2',
  },
  codeInputContainer: {
    marginBottom: 24,
  },
  codeInput: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    color: '#1A202C',
  },
  verifyButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#718096',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  resendDisabled: {
    color: '#A0AEC0',
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backText: {
    fontSize: 14,
    color: '#718096',
  },
});
