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

export default function ClasicosScreen({ navigation }) {
  const [expandedCar, setExpandedCar] = useState(null);

  const clasicosData = [
    {
      id: 1,
      name: 'Ferrari 250 GTO',
      price: 'Desde $48.000.000',
      maxSpeed: '280 km/h',
      image: require('../../assets/hyper.png'),
      expanded: true,
      specifications: [
        {
          icon: '🏆',
          title: 'Leyenda del Automovilismo',
          description: 'Considerado uno de los autos más hermosos jamás construidos. Solo se fabricaron 36 unidades entre 1962 y 1964.'
        },
        {
          icon: '⚙️',
          title: 'Motor V12 Colombo',
          description: 'Motor V12 de 3.0 litros con 300 CV de potencia, equipado con 6 carburadores Weber y distribución por cadena.'
        },
        {
          icon: '🏁',
          title: 'Historia Competitiva',
          description: 'Dominó las carreras GT en los años 60, ganando múltiples campeonatos mundiales de constructores.'
        },
        {
          icon: '🔧',
          title: 'Transmisión Manual',
          description: 'Transmisión manual de 5 velocidades con diferencial de deslizamiento limitado y frenos de disco en las cuatro ruedas.'
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
      name: 'Porsche 911 Carrera RS',
      price: 'Desde $1.200.000',
      maxSpeed: '245 km/h',
      image: require('../../assets/hyper.png'),
      expanded: false,
      specifications: [
        {
          icon: '🐍',
          title: 'Carrera RS 2.7',
          description: 'La versión más ligera y potente del 911 clásico, con solo 1,075 kg de peso y 210 CV de potencia.'
        },
        {
          icon: '⚡',
          title: 'Aerodinámica Única',
          description: 'Ala trasera característica "ducktail" que generaba downforce a altas velocidades, convirtiéndose en un ícono.'
        },
        {
          icon: '🏁',
          title: 'Herencia Deportiva',
          description: 'Diseñado para homologación en carreras, dominó las competencias GT de los años 70 con su agilidad excepcional.'
        },
        {
          icon: '🔧',
          title: 'Motor Boxer',
          description: 'Motor boxer de 6 cilindros de 2.7 litros refrigerado por aire, con carburadores Weber y escape deportivo.'
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
      name: 'Lamborghini Miura P400',
      price: 'Desde $3.500.000',
      maxSpeed: '280 km/h',
      image: require('../../assets/hyper.png'),
      expanded: false,
      specifications: [
        {
          icon: '🐂',
          title: 'Primer Superdeportivo',
          description: 'Considerado el primer superdeportivo de la historia, estableció el patrón para todos los deportivos de motor central.'
        },
        {
          icon: '⚙️',
          title: 'Motor V12 Central',
          description: 'Motor V12 de 4.0 litros montado transversalmente, desarrollando 350 CV y conectado a una caja de 5 velocidades.'
        },
        {
          icon: '🎨',
          title: 'Diseño Revolucionario',
          description: 'Carrocería diseñada por Marcello Gandini de Bertone, con líneas fluidas que definieron una nueva era del diseño automotriz.'
        },
        {
          icon: '🔧',
          title: 'Tecnología Avanzada',
          description: 'Suspensión independiente en las cuatro ruedas, frenos de disco y dirección de cremallera para un manejo excepcional.'
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
        <Text style={styles.screenTitle}>CLASICOS</Text>

        {/* Background Pattern */}
        <View style={styles.backgroundPattern} />

        {/* Cars List */}
        <ScrollView 
          style={styles.carsList}
          showsVerticalScrollIndicator={false}
        >
          {clasicosData.map(renderCarCard)}
          
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

