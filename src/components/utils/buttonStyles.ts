import { StyleSheet } from 'react-native';

export const buttonStyles = StyleSheet.create({
  // Primary Buttons
  primaryButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },

  // Secondary Buttons
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },

  // Icon Buttons
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },

  // Action Buttons
  actionButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Small Buttons
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F0F7FF',
    borderRadius: 6,
  },
  smallButtonText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },

  // Dashed Buttons
  dashedButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  dashedButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },

  // Danger Buttons
  dangerButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dangerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});
