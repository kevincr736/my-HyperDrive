import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SectionTitle({ children }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginVertical: 8,
    paddingLeft: 16,
  },
});



