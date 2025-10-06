import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type HorizontalMenuProps = {
  title: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
  disableLeft?: boolean;
  disableRight?: boolean;
  backgroundColor?: string;
  textColor?: string;
};

const HorizontalMenu: React.FC<HorizontalMenuProps> = ({
  title,
  onPressLeft,
  onPressRight,
  disableLeft = false,
  disableRight = false,
  backgroundColor = 'white',
  textColor = '#222',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.arrow}
        onPress={onPressLeft}
        disabled={disableLeft}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color={backgroundColor}
          style={[disableLeft && styles.disabledArrow]}
        />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>

      <TouchableOpacity
        style={styles.arrow}
        onPress={onPressRight}
        disabled={disableRight}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={backgroundColor}
          style={[disableRight && styles.disabledArrow]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    //shadowColor: 'black',
    //shadowOffset: {width: 1, height: 1},
    //shadowRadius: 10,
    //shadowOpacity: 0.1,
    //paddingVertical: 5,
    //borderRadius: 25,
    //borderCurve: 'continuous',
    
        //...Platform.select({
            //android: {
                //shadowColor: '#7090b0',
                //elevation: 3
            //}
        //})
  },
  arrow: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    borderRadius: 25,
    borderCurve: 'continuous',
    marginHorizontal: 15
  },
  disabledArrow: {
    opacity: 0.3,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HorizontalMenu;