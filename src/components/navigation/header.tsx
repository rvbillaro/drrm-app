import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router } from "expo-router";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Image source={require('assets/images/header-logo.png')} 
        style={styles.logo}
      />
      <TouchableOpacity 
        onPress={() => router.push("/screens/profile")}
      >
        <FontAwesome5 name="user-circle" size={30} color="#4a90e2" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    //paddingVertical: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    width: '100%',
    ...Platform.select({
      android: {
        shadowColor: '#7090b0',
        elevation: 3
      }
    })
  },
  logo: {
    width: 250,
    height: 60,
    resizeMode: 'contain',
    transform: [{ scale: 1.2 }],
    marginLeft: -65,
  }
});