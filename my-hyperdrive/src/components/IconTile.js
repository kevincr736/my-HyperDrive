import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function IconTile({ label }) {
  const getIcon = () => {
    if (label === 'CATALOGOS') {
      return <MaterialIcons name="directions-car" size={35} color="#FFFFFF" />;
    } else if (label === 'NOTICIAS') {
      return <MaterialIcons name="article" size={35} color="#FFFFFF" />;
    }
    return <MaterialIcons name="help" size={35} color="#FFFFFF" />;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.icon}>
        {getIcon()}
      </View>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 86,
    height: 68,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.49)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  icon: { 
    width: 40, 
    height: 40, 
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: { marginTop: 3, color: 'white', fontSize: 10 },
});



