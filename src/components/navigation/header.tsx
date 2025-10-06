import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from "expo-router";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications" size={28} color="#4a90e2" />
      <Image source={require('assets/images/header-logo.png')} 
        style={{
          width: 250,
          height: 50,
          objectFit: 'contain',
          transform: [{ scale: 1.2 }],
        }}
      />
      <TouchableOpacity 
          onPress={() => router.push("/")}
        >
        <FontAwesome5 name="user-circle" size={28} color="#4a90e2" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display:'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: '5%',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,

    ...Platform.select({
                android: {
                    shadowColor: '#7090b0',
                    elevation: 3
                }
            })
  }
})