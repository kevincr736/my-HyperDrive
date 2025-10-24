import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

export default function LujososScreen({ navigation }) {
  const [expandedCar, setExpandedCar] = useState(null);

  const lujososData = [
    {
      id: 1,
      name: 'Rolls-Royce Phantom',
      price: 'Desde $450.000',
      maxSpeed: '250 km/h',
      image: require('../../assets/hyper.png'),
      expanded: true,
      specifications: [
        {
          icon: '👑',
          title: 'Lujo Supremo',
          description: 'El automóvil de lujo más exclusivo del mundo, con acabados artesanales únicos y materiales de la más alta calidad.'
        },
        {
          icon: '⚙️',
          title: 'Motor V12 Twin Turbo',
          description: 'Motor V12 de 6.75 litros con 563 CV de potencia, diseñado para proporcionar un silencio absoluto y suavidad excepcional.'
        },
        {
          icon: '🛋️',
          title: 'Interior Personalizado',
          description: 'Interior completamente personalizable con cuero de la más alta calidad, madera noble y detalles metálicos únicos.'
        },
        {
          icon: '🔧',
          title: 'Tecnología Avanzada',
          description: 'Sistema de suspensión Magic Carpet Ride, climatización de 4 zonas y sistema de entretenimiento de última generación.'
        }
      ],
      carouselImages: [
        require('../../assets/hyper.png'),
        require('../../assets/hyper.png'),
        require('../../assets/hyper.png')
      ]
    },
    {
      id: 2,
      name: 'Bentley Continental GT',
      price: 'Desde $200.000',
      maxSpeed: '333 km/h',
      image: require('../../assets/hyper.png'),
      expanded: false,
      specifications: [
        {
          icon: '🏆',
          title: 'Gran Turismo de Lujo',
          description: 'La combinación perfecta entre lujo británico y performance deportiva, diseñado para viajes largos con máxima comodidad.'
        },
        {
          icon: '⚙️',
          title: 'Motor W12 Biturbo',
          description: 'Motor W12 de 6.0 litros con 626 CV de potencia, capaz de acelerar de 0 a 100 km/h en solo 3.7 segundos.'
        },
        {
          icon: '💎',
          title: 'Acabados Exclusivos',
          description: 'Interior con cuero Mulliner, madera veneciana, detalles cromados y opciones de personalización ilimitadas.'
        },
        {
          icon: '🔧',
          title: 'Tecnología de Vanguardia',
          description: 'Suspensión adaptativa de 3 cámaras, sistema de navegación Bentley, audio Naim y conectividad completa.'
        }
      ],
      carouselImages: [
        require('../../assets/hyper.png'),
        require('../../assets/hyper.png'),
        require('../../assets/hyper.png')
      ]
    },
    {
      id: 3,
      name: 'Aston Martin DB11',
      price: 'Desde $250.000',
      maxSpeed: '322 km/h',
      image: require('../../assets/hyper.png'),
      expanded: false,
      specifications: [
        {
          icon: '🎭',
          title: 'Elegancia Británica',
          description: 'Diseño atemporal que combina elegancia clásica con tecnología moderna, representando lo mejor del lujo deportivo británico.'
        },
        {
          icon: '⚙️',
          title: 'Motor V12 Biturbo',
          description: 'Motor V12 de 5.2 litros con 630 CV de potencia, desarrollado en colaboración con Mercedes-AMG para máximo rendimiento.'
        },
        {
          icon: '🛡️',
          title: 'Construcción Avanzada',
          description: 'Chasis de aluminio con carrocería de fibra de carbono, proporcionando rigidez excepcional y peso reducido.'
        },
        {
          icon: '🔧',
          title: 'Interior de Lujo',
          description: 'Interior con cuero Bridge of Weir, detalles de aluminio, sistema de audio Bang & Olufsen y climatización de 3 zonas.'
        }
      ],
      carouselImages: [
        require('../../assets/hyper.png'),
        require('../../assets/hyper.png'),
        require('../../assets/hyper.png')
      ]
    }
  ];

  const toggleExpanded = (carId) => {
    setExpandedCar(expandedCar === carId ? null : carId);
  };

  const renderCarCard = (car) => (
    <View key={car.id} style={styles.carCard}>
      <View style={styles.carHeader}>
        <Text style={styles.maxSpeed}>Vmax: {car.maxSpeed}</Text>
      </View>
      
      <View style={styles.carImageContainer}>
        <Image source={car.image} style={styles.carImage} resizeMode="cover" />
      </View>
      
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{car.name}</Text>
        <Text style={styles.carPrice}>{car.price}</Text>
      </View>

      {expandedCar === car.id && car.specifications && (
        <View style={styles.specificationsContainer}>
          {car.specifications.map((spec, index) => (
            <View key={index} style={styles.specificationItem}>
              <View style={styles.specIcon}>
                <Text style={styles.specIconText}>{spec.icon}</Text>
              </View>
              <View style={styles.specContent}>
                <Text style={styles.specTitle}>{spec.title}</Text>
                <Text style={styles.specDescription}>{spec.description}</Text>
              </View>
            </View>
          ))}
          
          {car.carouselImages && (
            <View style={styles.carouselContainer}>
              <TouchableOpacity style={styles.carouselArrow}>
                <MaterialIcons name="keyboard-double-arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
              >
                {car.carouselImages.map((image, index) => (
                  <Image key={index} source={image} style={styles.carouselImage} />
                ))}
              </ScrollView>
              
              <TouchableOpacity style={styles.carouselArrow}>
                <MaterialIcons name="keyboard-double-arrow-right" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity 
        style={styles.expandButton}
        onPress={() => toggleExpanded(car.id)}
      >
        <MaterialIcons 
          name={expandedCar === car.id ? "keyboard-double-arrow-up" : "keyboard-double-arrow-down"} 
          size={24} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image source={require('../../assets/logo_navbar.png')} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="search here....."
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Screen Title */}
        <Text style={styles.screenTitle}>LUJOSOS</Text>

        {/* Background Pattern */}
        <View style={styles.backgroundPattern} />

        {/* Cars List */}
        <ScrollView 
          style={styles.carsList}
          showsVerticalScrollIndicator={false}
        >
          {lujososData.map(renderCarCard)}
          
          {/* Footer */}
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#070707' 
  },
  header: {
    height: 60,
    backgroundColor: '#101010',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  menuButton: {
    padding: 12,
    borderRadius: 6,
  },
  logo: { 
    width: 100, 
    height: 100, 
    tintColor: '#FFFFFF' 
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    paddingLeft: 16,
    paddingRight: 0,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    paddingRight: 8,
  },
  searchButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    padding: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    backgroundColor: '#8B0000',
    transform: [{ rotate: '90deg' }],
  },
  carsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  carCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#444',
  },
  carHeader: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  maxSpeed: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  carImageContainer: {
    height: 200,
    backgroundColor: '#333',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  carInfo: {
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  carName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  carPrice: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  specificationsContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  specificationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  specIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#8B0000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  specIconText: {
    fontSize: 16,
  },
  specContent: {
    flex: 1,
  },
  specTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  carouselArrow: {
    padding: 8,
  },
  carousel: {
    flex: 1,
    marginHorizontal: 8,
  },
  carouselImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  expandButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
});

