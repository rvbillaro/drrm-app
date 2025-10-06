import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const ReportCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff0f0f', '#d0342c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* Background Warning Image */}
        <Image
          source={require('../../../assets/images/warning-sign.png')}
          style={styles.backgroundWarning}
          resizeMode="contain"
        />

        {/* Content */}
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Report an Emergency</Text>
          <View style={styles.bodyContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.description}>
                Sign up to report emergencies and get help from your LGU right away.
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.reportButton}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientContainer: {
    borderRadius: 16,
    padding: 15,
    position: 'relative',
    overflow: 'hidden', 
  },
  backgroundWarning: {
    position: 'absolute',
    width: 160,
    height: 160,
    opacity: 0.3,
    right: 0,
    top: '40%',
    marginTop: -50,
    zIndex: 0,
  },
  contentWrapper: {
    zIndex: 1,
  },
  bodyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  reportButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#222',
    fontSize: 15,
    fontWeight: 'bold'
  },
});

export default ReportCard;