import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Image, FlatList } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const ITEM_PADDING = 25;
const ITEM_WIDTH = screenWidth * 0.5; // 50% del ancho de la pantalla

// Componente para manejar imágenes base64
const Base64Image = ({ base64String, style, ...props }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !base64String) {
    return (
      <View style={[style, { backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 10 }}>Sin logo</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: base64String }}
      style={style}
      onError={() => setImageError(true)}
      {...props}
    />
  );
};

function BrandCard({ brand, onPress }) {
  return (
    <TouchableOpacity style={styles.brandCard} onPress={onPress}>
      <View style={styles.brandHeader}>
        {/* Barra superior oscura */}
      </View>
      <View style={styles.brandContent}>
        {brand.logo && (
          <Base64Image 
            base64String={brand.logo}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        )}
        <Text style={styles.brandText}>{brand.name || 'Marca'}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function BrandsCarousel({ data, onBrandPress }) {
  // Si data es un array de objetos con name y logo, usarlo directamente
  // Si es un array de números, usar datos por defecto
  const brands = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' 
    ? data 
    : [];
  
  const ITEM_MARGIN = 20;
  const SNAP_INTERVAL = ITEM_WIDTH + ITEM_MARGIN;
  const CENTER_PADDING = (screenWidth - ITEM_WIDTH) / 2;
  
  const renderItem = ({ item: brand, index }) => (
    <View style={[styles.item, { marginRight: index < brands.length - 1 ? ITEM_MARGIN : 0 }]}>
      <BrandCard 
        brand={brand}
        onPress={() => onBrandPress && onBrandPress(brand)}
      />
    </View>
  );
  
  return (
    <FlatList
      data={brands}
      renderItem={renderItem}
      keyExtractor={(item, index) => item.id || index.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        { 
          paddingLeft: CENTER_PADDING,
          paddingRight: CENTER_PADDING 
        }
      ]}
      snapToInterval={SNAP_INTERVAL}
      getItemLayout={(data, index) => ({
        length: SNAP_INTERVAL,
        offset: SNAP_INTERVAL * index,
        index,
      })}
      decelerationRate={0}
      snapToAlignment="center"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  item: { 
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCard: {
    width: '100%',
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
  brandLogo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});