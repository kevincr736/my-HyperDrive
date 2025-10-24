import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Image source={require('../../assets/hyper.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.right}>
          <View style={styles.pill} />
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon}>
              <Icon name="facebook" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Icon name="instagram" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Icon name="linkedin" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.contactHeader}>Contact information</Text>
          <View style={styles.contactRow}>
            <View style={styles.phoneDot} />
            <Text style={styles.contactLabel}>Per Month :</Text>
            <Text style={styles.contactValue}> 888-675-8098</Text>
          </View>
          <View style={styles.contactRow}>
            <View style={styles.phoneDot} />
            <Text style={styles.contactLabel}>Per Month :</Text>
            <Text style={styles.contactValue}> 888-675-8098</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#040404',
    padding: 10,
    borderRadius: 10,
    marginTop: 24,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flex: 1 },
  right: { flex: 1, alignItems: 'flex-end' },
  logo: { width: 200, height: 200, tintColor: '#e6e6e6' },
  
  socialRow: { flexDirection: 'row', gap: 20, marginTop: 16, marginBottom: 10 },
  socialIcon: { 
    width: 35, 
    height: 22, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  contactHeader: { color: '#ffffff', fontWeight: '700', marginTop: 6 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  phoneDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffffff', marginRight: 8 },
  contactLabel: { color: '#ffffff', fontSize: 10 },
  contactValue: { color: '#ffffff', fontSize: 10, textDecorationLine: 'underline' },
});


