import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import ModelCard from './ModelCard';

const ITEM_GAP = 16; // separaciones iguales a los márgenes horizontales
const screenWidth = Dimensions.get('window').width;
// Dos cards por vista, con padding 16 a los lados y gap central
const ITEM_WIDTH = (screenWidth - 16 * 2 - ITEM_GAP) / 2;

export default function ModelsCarousel({ data }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    if (scrollRef.current) scrollRef.current.scrollTo({ x: 0, animated: false });
  }, [data]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={ITEM_WIDTH + ITEM_GAP}
      onScroll={(e) => {
        const x = e.nativeEvent.contentOffset.x;
        const idx = Math.round(x / (ITEM_WIDTH + ITEM_GAP));
        if (idx !== currentIndex) setCurrentIndex(idx);
      }}
      scrollEventThrottle={16}
    >
      {data.map((m, i) => (
        <View key={i} style={[styles.item, { width: ITEM_WIDTH }]}> 
          <ModelCard title={m.title} price={m.price} imageUri={m.imageUri} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 10 },
  item: { marginRight: ITEM_GAP },
});


