import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import { colors } from '../theme/colors';

export default function NewsScreen({ navigation }) {
  const [expandedCards, setExpandedCards] = useState({});
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const brands = [
    { 
      id: 1, 
      name: 'Lamborghini', 
      icon: 'https://placehold.co/44x44/FF4500/FFFFFF',
      stories: [
        { type: 'image', url: 'https://placehold.co/400x600/FF4500/FFFFFF?text=Lamborghini+Revuelto', title: 'Nuevo Revuelto 2024' },
        { type: 'image', url: 'https://placehold.co/400x600/FFD700/000000?text=Huracan+STO', title: 'Huracán STO' },
        { type: 'image', url: 'https://placehold.co/400x600/FF4500/FFFFFF?text=Urus+Performante', title: 'Urus Performante' }
      ]
    },
    { 
      id: 2, 
      name: 'Ferrari', 
      icon: 'https://placehold.co/44x44/EF0303/FFFFFF',
      stories: [
        { type: 'image', url: 'https://placehold.co/400x600/EF0303/FFFFFF?text=SF90+Stradale', title: 'SF90 Stradale' },
        { type: 'image', url: 'https://placehold.co/400x600/EF0303/FFFFFF?text=F8+Tributo', title: 'F8 Tributo' },
        { type: 'image', url: 'https://placehold.co/400x600/EF0303/FFFFFF?text=Roma+Spider', title: 'Roma Spider' }
      ]
    },
    { 
      id: 3, 
      name: 'Toyota', 
      icon: 'https://placehold.co/44x44/8A8A8A/FFFFFF',
      stories: [
        { type: 'image', url: 'https://placehold.co/400x600/8A8A8A/FFFFFF?text=GR+Supra', title: 'GR Supra' },
        { type: 'image', url: 'https://placehold.co/400x600/8A8A8A/FFFFFF?text=GR+Corolla', title: 'GR Corolla' }
      ]
    },
    { 
      id: 4, 
      name: 'Lotus', 
      icon: 'https://placehold.co/44x44/444444/FFFFFF',
      stories: [
        { type: 'image', url: 'https://placehold.co/400x600/444444/FFFFFF?text=Emira', title: 'Emira' },
        { type: 'image', url: 'https://placehold.co/400x600/444444/FFFFFF?text=Evija', title: 'Evija' }
      ]
    },
    { 
      id: 5, 
      name: 'BMW', 
      icon: 'https://placehold.co/44x44/1F4DB6/FFFFFF',
      stories: [
        { type: 'image', url: 'https://placehold.co/400x600/1F4DB6/FFFFFF?text=M4+Competition', title: 'M4 Competition' },
        { type: 'image', url: 'https://placehold.co/400x600/1F4DB6/FFFFFF?text=iX+M60', title: 'iX M60' }
      ]
    },
  ];

  const news = [
    {
      id: 1,
      title: 'Ferrari presenta el SF90XX: 0 a 100 en 2,3 segundos',
      date: '08-11-2021',
      image: 'https://placehold.co/320x120',
      shortDescription: 'El SF90XX 0 - 100 en 2.3 Segundos Y Una Nueva Aerodinámica Activa Que Lo Hace Mas Potente Y Rápido Del Mercado',
      fullDescription: 'Ferrari ha presentado oficialmente el SF90XX, un superdeportivo híbrido que establece nuevos récords de rendimiento. Con un motor V8 biturbo de 4.0 litros combinado con tres motores eléctricos, el SF90XX genera una potencia total de 1,016 CV. Su aceleración de 0 a 100 km/h en solo 2.3 segundos lo convierte en uno de los vehículos más rápidos del mercado. La aerodinámica activa incluye un alerón trasero que se ajusta automáticamente según las condiciones de conducción, proporcionando hasta 530 kg de carga aerodinámica a 250 km/h.',
    },
    {
      id: 2,
      title: 'Corvette GT: potencia y aerodinámica redefinidas',
      date: '09-11-2021',
      image: 'https://placehold.co/320x120',
      shortDescription: 'La nueva generación del Corvette GT redefine los límites del rendimiento americano con tecnología de vanguardia',
      fullDescription: 'El Corvette GT representa la evolución más avanzada del deportivo americano por excelencia. Equipado con un motor V8 LT2 de 6.2 litros que produce 495 CV, el Corvette GT combina la tradición de potencia americana con tecnología europea de precisión. Su chasis de fibra de carbono y suspensión magnética adaptativa ofrecen un manejo excepcional tanto en pista como en carretera. El interior cuenta con materiales premium y la última tecnología de conectividad.',
    },
    {
      id: 3,
      title: 'Aston Martin y su nueva tecnología híbrida',
      date: '10-11-2021',
      image: 'https://placehold.co/320x120',
      shortDescription: 'Aston Martin revoluciona el lujo deportivo con su nueva plataforma híbrida de alto rendimiento',
      fullDescription: 'Aston Martin ha desarrollado una nueva plataforma híbrida que combina motores de combustión tradicionales con sistemas eléctricos avanzados. Esta tecnología permite mantener el carácter deportivo de la marca mientras mejora significativamente la eficiencia y reduce las emisiones. El sistema híbrido incluye recuperación de energía en frenado, propulsión eléctrica en bajas velocidades y asistencia eléctrica para mayor potencia en aceleración. Los materiales ligeros y la aerodinámica optimizada completan el paquete tecnológico.',
    },
    {
      id: 4,
      title: 'Cadillac lanza la 4x4 más potente',
      date: '11-11-2021',
      image: 'https://placehold.co/320x120',
      shortDescription: 'Cadillac presenta su SUV más potente con capacidades off-road excepcionales y lujo incomparable',
      fullDescription: 'El nuevo Cadillac SUV establece nuevos estándares en el segmento de vehículos de lujo todo terreno. Con un motor V8 supercargado que genera 668 CV y 893 Nm de par, este SUV combina potencia brutal con refinamiento excepcional. Su sistema de tracción integral inteligente y suspensión neumática adaptativa permiten conquistar cualquier terreno mientras mantienen el confort de un vehículo de lujo. El interior está equipado con los más altos estándares de calidad y tecnología avanzada.',
    },
  ];

  return (
    <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => setIsMenuVisible(true)}
            >
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image source={require('../../assets/logo_navbar.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandsRow}
          >
            {brands.map((b) => (
              <TouchableOpacity 
                key={b.id} 
                style={styles.brandItem}
                onPress={() => {
                  setSelectedBrand(b);
                  setIsBrandModalVisible(true);
                }}
              >
                <Image source={{ uri: b.icon }} style={styles.brandIcon} />
                <Text style={styles.brandLabel} numberOfLines={1}>{b.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>NOTICIAS</Text>
            <TouchableOpacity style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Noticia del día */}
          {news.map((n) => (
            <View key={n.id} style={styles.card}>
              <Image source={{ uri: n.image }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>{n.title}</Text>
                <Text style={styles.cardMeta}>Publicado: {n.date}</Text>
                
                {/* Descripción corta siempre visible */}
                <Text style={styles.cardDescription}>
                  {expandedCards[n.id] ? n.fullDescription : n.shortDescription}
                </Text>
                
                <TouchableOpacity 
                  style={styles.readMore}
                  onPress={() => {
                    setExpandedCards(prev => ({
                      ...prev,
                      [n.id]: !prev[n.id]
                    }));
                  }}
                >
                  <Text style={styles.readMoreText}>
                    {expandedCards[n.id] ? 'Leer menos' : 'Leer más'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}


          <Footer />
        </ScrollView>
      </SafeAreaView>

      {/* Brand Stories Modal */}
      <Modal
        visible={isBrandModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsBrandModalVisible(false);
          setCurrentStoryIndex(0);
        }}
      >
        <View style={styles.storiesOverlay}>
          {/* Story Content */}
          <View style={styles.storyContainer}>
            <Image 
              source={{ uri: selectedBrand?.stories?.[currentStoryIndex]?.url }} 
              style={styles.storyImage}
              resizeMode="cover"
            />
            
            {/* Story Header */}
            <View style={styles.storyHeader}>
              <View style={styles.storyBrandInfo}>
                <Image source={{ uri: selectedBrand?.icon }} style={styles.storyBrandIcon} />
                <Text style={styles.storyBrandName}>{selectedBrand?.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.storyCloseButton}
                onPress={() => {
                  setIsBrandModalVisible(false);
                  setCurrentStoryIndex(0);
                }}
              >
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Story Title */}
            <View style={styles.storyTitleContainer}>
              <Text style={styles.storyTitle}>
                {selectedBrand?.stories?.[currentStoryIndex]?.title}
              </Text>
            </View>

            {/* Story Navigation */}
            <View style={styles.storyNavigation}>
              <TouchableOpacity 
                style={styles.storyNavButton}
                onPress={() => {
                  if (currentStoryIndex > 0) {
                    setCurrentStoryIndex(currentStoryIndex - 1);
                  }
                }}
                disabled={currentStoryIndex === 0}
              >
                <MaterialIcons 
                  name="chevron-left" 
                  size={30} 
                  color={currentStoryIndex === 0 ? 'rgba(255,255,255,0.3)' : '#FFFFFF'} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.storyNavButton}
                onPress={() => {
                  if (currentStoryIndex < (selectedBrand?.stories?.length - 1)) {
                    setCurrentStoryIndex(currentStoryIndex + 1);
                  } else {
                    setIsBrandModalVisible(false);
                    setCurrentStoryIndex(0);
                  }
                }}
              >
                <MaterialIcons 
                  name="chevron-right" 
                  size={30} 
                  color={currentStoryIndex === (selectedBrand?.stories?.length - 1) ? 'rgba(255,255,255,0.3)' : '#FFFFFF'} 
                />
              </TouchableOpacity>
            </View>

            {/* Story Progress Dots */}
            <View style={styles.storyDots}>
              {selectedBrand?.stories?.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.storyDot, 
                    { 
                      backgroundColor: index === currentStoryIndex ? '#FFFFFF' : 'rgba(255,255,255,0.3)' 
                    }
                  ]} 
                />
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.storyActions}>
              <TouchableOpacity 
                style={styles.storyActionButton}
                onPress={() => {
                  setIsBrandModalVisible(false);
                  setCurrentStoryIndex(0);
                  navigation.navigate('BrandHistory', { brandName: selectedBrand?.name });
                }}
              >
                <MaterialIcons name="history" size={20} color="#FFFFFF" />
                <Text style={styles.storyActionText}>Historia</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: { padding: 10, borderRadius: 6 },
  logo: { width: 100, height: 100, tintColor: colors.textPrimary },

  brandsRow: { paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  brandItem: { alignItems: 'center', marginRight: 16 },
  brandIcon: { width: 44, height: 44, borderRadius: 26, borderWidth: 1, borderColor: '#FFFFFF' },
  brandLabel: { color: '#FFFFFF', fontSize: 10, marginTop: 6, width: 72, textAlign: 'center' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 120, backgroundColor: '#D9D9D9' },
  cardBody: { padding: 12 },
  cardTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginBottom: 6 },
  cardMeta: { color: '#BDBDBD', fontSize: 12, marginBottom: 8 },
  cardDescription: { 
    color: '#FFFFFF', 
    fontSize: 12, 
    lineHeight: 18, 
    marginBottom: 12,
    textAlign: 'justify'
  },
  readMore: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  readMoreText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },

  // Stories Modal styles
  storiesOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  storyContainer: {
    flex: 1,
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  storyBrandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyBrandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  storyBrandName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  storyCloseButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  storyTitleContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  storyTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  storyNavigation: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  storyNavButton: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
  },
  storyDots: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  storyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  storyActions: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  storyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  storyActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});


