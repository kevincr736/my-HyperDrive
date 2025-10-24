import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../theme/colors';

export default function NewsItem({ date, category = 'Category', title, avatarUri }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.meta}>{date}   <Text style={styles.category}>{category}</Text></Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 62, height: 62, borderRadius: 100, marginRight: 16 },
  meta: { color: '#8F86B3', fontSize: 12, marginBottom: 6 },
  category: { color: '#8F86B3' },
  title: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 22 },
  separator: { height: 2, backgroundColor: colors.gray300, marginTop: 12, width: '80%', alignSelf: 'center' },
});


