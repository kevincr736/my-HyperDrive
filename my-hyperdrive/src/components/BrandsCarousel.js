import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const ITEM_GAP = 10;
const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = (screenWidth - 15 * 10 - ITEM_GAP * 6) / 2;

function BrandCard({ brandName, onPress }) {
  return (
    <TouchableOpacity style={styles.brandCard} onPress={onPress}>
      <View style={styles.brandHeader}>
        {/* Barra superior oscura */}
      </View>
      <View style={styles.brandContent}>
        <Text style={styles.brandText}>{brandName}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BrandsCarousel({ data, onBrandPress }) {
  const brands = ['Lamborghini', 'Ferrari', 'Toyota', 'Lotus', 'BMW'];
  
  return (
    <View style={styles.container}>
      {brands.slice(0, 3).map((brandName, i) => (
        <View key={i} style={[styles.item, { width: ITEM_WIDTH }]}>
          <BrandCard 
            brandName={brandName}
            onPress={() => onBrandPress && onBrandPress(brandName)}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  item: { 
    marginRight: ITEM_GAP,
  },
  brandCard: {
    height: 125,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  brandHeader: {
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  brandContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});