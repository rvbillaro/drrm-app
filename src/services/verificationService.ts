const API_BASE_URL = 'http://192.168.8.118/api';

export interface SendVerificationRequest {
  user_id: string;
  type: 'email' | 'phone';
  email?: string;
  phone?: string;
  name?: string;
}

export interface VerifyCodeRequest {
  user_id: string;
  code: string;
  type: 'email' | 'phone';
}

export const sendVerificationCode = async (data: SendVerificationRequest): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth.php?action=send-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to send verification code');
  }
};

export const verifyCode = async (data: VerifyCodeRequest): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth.php?action=verify-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Verification failed');
  }
};
