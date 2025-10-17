import { StyleSheet } from 'react-native';

export const textStyles = StyleSheet.create({
  // Titles
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
  },

  // Labels
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },

  // Body Text
  body: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
  },

  // Small Text
  small: {
    fontSize: 12,
    color: '#718096',
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600',
    color: '#718096',
  },

  // Status and Metadata
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  timestamp: {
    fontSize: 12,
    color: '#A0AEC0',
  },

  // Error and Info
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#A0AEC0',
  },

  // Links
  link: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});
