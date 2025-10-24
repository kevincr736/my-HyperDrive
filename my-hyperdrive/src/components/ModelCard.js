import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function ModelCard({ title, price, imageUri }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
      <TouchableOpacity style={styles.cta}><Text style={styles.ctaText}>See More</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.12)',
    minHeight: 240,
  },
  image: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
  title: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
  price: { color: colors.textMuted, fontWeight: '800', fontSize: 12, marginTop: 2 },
  cta: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: colors.gray500,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  ctaText: { color: 'white', fontSize: 15 },
});


