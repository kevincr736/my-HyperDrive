import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import { colors } from '../theme/colors';

export default function BrandHistoryScreen({ navigation, route }) {
  const { brandName = 'Lamborghini' } = route?.params || {};
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const brandData = {
    Lamborghini: {
      logo: 'https://placehold.co/120x120/FFD700/000000?text=L',
      image: 'https://placehold.co/350x200/FF4500/FFFFFF?text=Lamborghini+Revuelto',
      name: 'LAMBORGHINI',
      timeline: [
        {
          year: '1963',
          title: 'Fundación',
          description: 'Ferruccio Lamborghini funda la empresa en Sant\'Agata Bolognese, Italia, con el objetivo de crear el mejor GT del mundo.'
        },
        {
          year: '1966',
          title: 'Miura P400',
          description: 'Unión Central Transversal, Motor V12, Capaz de 300 km/h. El primer superdeportivo de la historia.'
        },
        {
          year: '1978',
          title: 'Crisis & administración',
          description: 'La empresa entra en crisis financiera y es puesta bajo administración judicial.'
        },
        {
          year: '1980',
          title: 'Chrysler compra',
          description: 'Chrysler Corporation adquiere Lamborghini, iniciando una nueva era de desarrollo.'
        },
        {
          year: '1998',
          title: 'Audi (VW Group)',
          description: 'Volkswagen Group a través de Audi adquiere Lamborghini, marcando el inicio de una nueva era de innovación.'
        },
        {
          year: '2003',
          title: 'Gallardo',
          description: 'Lanzamiento del Gallardo, el modelo más exitoso de la historia de la marca con más de 14,000 unidades vendidas.'
        },
        {
          year: '2007',
          title: 'Reventón',
          description: 'Presentación del Reventón, un superdeportivo limitado que combina diseño futurista con tecnología de vanguardia.'
        },
        {
          year: '2017/18',
          title: 'Urus',
          description: 'Lanzamiento del Urus, el primer SUV de Lamborghini que revoluciona el segmento de vehículos de lujo todo terreno.'
        }
      ],
      featuredModels: [
        { name: 'REVUELTO', year: '2023', image: 'https://placehold.co/150x100/FF4500/FFFFFF?text=Revuelto' },
        { name: 'VENENO', year: '2013', image: 'https://placehold.co/150x100/8A8A8A/FFFFFF?text=Veneno' },
        { name: 'URUS', year: '2018', image: 'https://placehold.co/150x100/FFD700/000000?text=Urus' },
        { name: 'HURACAN', year: '2014', image: 'https://placehold.co/150x100/FF4500/FFFFFF?text=Huracan' }
      ]
    },
    Ferrari: {
      logo: 'https://placehold.co/120x120/EF0303/FFFFFF?text=F',
      image: 'https://placehold.co/350x200/EF0303/FFFFFF?text=Ferrari+SF90',
      name: 'FERRARI',
      timeline: [
        {
          year: '1947',
          title: 'Primer Ferrari',
          description: 'Enzo Ferrari presenta el 125 S, el primer automóvil con el nombre Ferrari.'
        },
        {
          year: '1950',
          title: 'F1 Debut',
          description: 'Ferrari hace su debut en la Fórmula 1, comenzando una leyenda en el automovilismo.'
        },
        {
          year: '1962',
          title: '250 GTO',
          description: 'Lanzamiento del legendario 250 GTO, considerado uno de los autos más hermosos jamás construidos.'
        },
        {
          year: '1987',
          title: 'F40',
          description: 'Presentación del F40, el último superdeportivo aprobado por Enzo Ferrari antes de su muerte.'
        },
        {
          year: '2002',
          title: 'Enzo Ferrari',
          description: 'Lanzamiento del Enzo, un superdeportivo de edición limitada que honra al fundador de la marca.'
        },
        {
          year: '2013',
          title: 'LaFerrari',
          description: 'Presentación del LaFerrari, el primer híbrido de la marca con tecnología F1.'
        }
      ],
      featuredModels: [
        { name: 'SF90', year: '2019', image: 'https://placehold.co/150x100/EF0303/FFFFFF?text=SF90' },
        { name: 'F8 TRIBUTO', year: '2019', image: 'https://placehold.co/150x100/EF0303/FFFFFF?text=F8' },
        { name: 'ROMA', year: '2019', image: 'https://placehold.co/150x100/EF0303/FFFFFF?text=Roma' },
        { name: 'PORTOFINO', year: '2017', image: 'https://placehold.co/150x100/EF0303/FFFFFF?text=Portofino' }
      ]
    }
  };

  const currentBrand = brandData[brandName] || brandData.Lamborghini;

  return (
    <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setIsMenuVisible(true)}
            >
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo_navbar.png')} style={styles.logo} resizeMode="contain" />
            </View>
          </View>

          {/* Hero Image */}
          <View style={styles.heroSection}>
            <Image source={{ uri: currentBrand.image }} style={styles.heroImage} />
          </View>

          {/* Brand Logo and Name */}
          <View style={styles.brandSection}>
            <Image source={{ uri: currentBrand.logo }} style={styles.brandLogo} />
            <Text style={styles.brandName}>{currentBrand.name}</Text>
          </View>

          {/* Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.timelineTitle}>HISTORIA</Text>
            <View style={styles.timeline}>
              {currentBrand.timeline.map((item, index) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <Text style={styles.timelineYear}>{item.year}</Text>
                  </View>
                  <View style={styles.timelineCenter}>
                    <View style={styles.timelineDot} />
                    {index < currentBrand.timeline.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineRight}>
                    <Text style={styles.timelineItemTitle}>{item.title}</Text>
                    <Text style={styles.timelineItemDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Featured Models */}
          <View style={styles.modelsSection}>
            <View style={styles.modelsHeader}>
              <Text style={styles.modelsTitle}>MODELOS DESTACADOS</Text>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modelsCarousel}
            >
              {currentBrand.featuredModels.map((model, index) => (
                <View key={index} style={styles.modelCard}>
                  <Image source={{ uri: model.image }} style={styles.modelImage} />
                  <Text style={styles.modelName}>{model.name}</Text>
                  <Text style={styles.modelYear}>{model.year}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <Footer />
        </ScrollView>
      </SafeAreaView>

      {/* Side Menu */}
      <SideMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundDark },
  header: {
    height: 60,
    backgroundColor: colors.header,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  headerButton: { padding: 10, borderRadius: 6 },
  logoContainer: { 
    flex: 1, 
    alignItems: 'flex-end',
    paddingRight: 20
  },
  logo: { width: 100, height: 100, tintColor: colors.textPrimary },

  heroSection: { paddingHorizontal: 20, marginBottom: 20 },
  heroImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 12,
    backgroundColor: '#D9D9D9'
  },

  brandSection: { 
    alignItems: 'center', 
    marginBottom: 30,
    paddingHorizontal: 20 
  },
  brandLogo: { 
    width: 80, 
    height: 80, 
    marginBottom: 12,
    borderRadius: 40
  },
  brandName: { 
    color: colors.textPrimary, 
    fontSize: 24, 
    fontWeight: '800',
    textAlign: 'center'
  },

  timelineSection: { paddingHorizontal: 20, marginBottom: 30 },
  timelineTitle: { 
    color: colors.textPrimary, 
    fontSize: 18, 
    fontWeight: '800', 
    marginBottom: 20,
    textAlign: 'center'
  },
  timeline: { position: 'relative' },
  timelineItem: { 
    flexDirection: 'row', 
    marginBottom: 20,
    alignItems: 'flex-start'
  },
  timelineLeft: { 
    width: 60, 
    alignItems: 'center',
    paddingTop: 5
  },
  timelineYear: { 
    color: colors.textPrimary, 
    fontSize: 14, 
    fontWeight: '600' 
  },
  timelineCenter: { 
    width: 20, 
    alignItems: 'center',
    marginHorizontal: 10
  },
  timelineDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: colors.accentRed,
    marginTop: 2
  },
  timelineLine: { 
    width: 2, 
    height: 60, 
    backgroundColor: colors.gray500,
    marginTop: 5
  },
  timelineRight: { 
    flex: 1, 
    paddingLeft: 10 
  },
  timelineItemTitle: { 
    color: colors.textPrimary, 
    fontSize: 16, 
    fontWeight: '700',
    marginBottom: 4
  },
  timelineItemDescription: { 
    color: colors.textMuted, 
    fontSize: 12, 
    lineHeight: 18 
  },

  modelsSection: { paddingHorizontal: 20, marginBottom: 20 },
  modelsHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16
  },
  modelsTitle: { 
    color: colors.textPrimary, 
    fontSize: 16, 
    fontWeight: '800' 
  },
  backButton: { 
    padding: 8,
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modelsCarousel: { paddingRight: 20 },
  modelCard: { 
    width: 140, 
    marginRight: 16, 
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center'
  },
  modelImage: { 
    width: '100%', 
    height: 80, 
    borderRadius: 8, 
    marginBottom: 8,
    backgroundColor: '#D9D9D9'
  },
  modelName: { 
    color: colors.textPrimary, 
    fontSize: 12, 
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4
  },
  modelYear: { 
    color: colors.textMuted, 
    fontSize: 10 
  },
});
