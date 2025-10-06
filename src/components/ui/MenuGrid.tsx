import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  library?: 'Ionicons' | 'FontAwesome5';
  onPress?: () => void;
};

interface MenuGridProps {
  scrollEnabled?: boolean;
}

export default function MenuGrid({ scrollEnabled = false }: MenuGridProps) {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: '1',
      icon: 'call',
      label: 'Hotline',
      library: 'Ionicons',
      onPress: () => console.log('Navigate to Hotline'),
    },
    {
      id: '2',
      icon: 'calendar',
      label: 'Calendar',
      library: 'Ionicons',
      onPress: () => console.log('Navigate to Calendar'),
    },
    {
      id: '3',
      icon: 'box',
      label: 'Relief Goods',
      library: 'FontAwesome5',
      onPress: () => router.push('/screens/relief'),
    },
  ];

  const renderItem: ListRenderItem<MenuItem> = ({ item }) => {
    const IconComponent =
      item.library === 'FontAwesome5' ? FontAwesome5 : Ionicons;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View>
          <IconComponent name={item.icon} size={25} color="#4A90E2" />
        </View>
        <Text style={styles.label}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={menuItems}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.container}
      scrollEnabled={scrollEnabled}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 16,
    padding: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  item: {
    flex: 1,
    margin: 5,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 3,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
  },
});
