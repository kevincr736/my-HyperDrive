import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';

const { width } = Dimensions.get('window');

export default function DeportivosScreen({ navigation }) {
  const [expandedCar, setExpandedCar] = useState(null);
  const [deportivosData, setDeportivosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los carros deportivos del API
  const fetchDeportivos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/cars?category=deportivos');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Mapear los datos del API al formato esperado por el componente
        const mappedCars = data.data.map((car) => ({
          id: car.id,
          name: car.name,
          price: car.price || 'Precio no disponible',
          maxSpeed: car.maxSpeed || 'N/A',
          image: car.imageBase64 ? { uri: car.imageBase64 } : require('../../assets/hyper.png'),
          specifications: car.specifications && car.specifications.length > 0 
            ? car.specifications 
            : [],
          carouselImages: car.imageBase64 
            ? [
                { uri: car.imageBase64 },
                { uri: car.imageBase64 },
                { uri: car.imageBase64 }
              ]
            : [
                require('../../assets/hyper.png'),
                require('../../assets/hyper.png'),
                require('../../assets/hyper.png')
              ]
        }));
        
        setDeportivosData(mappedCars);
      } else {
        setError('No se pudieron cargar los carros deportivos');
      }
    } catch (err) {
      console.error('Error al obtener carros deportivos:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeportivos();
  }, []);

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
        <Text style={styles.screenTitle}>DEPORTIVOS</Text>

        {/* Background Pattern */}
        <View style={styles.backgroundPattern} />

        {/* Cars List */}
        <ScrollView 
          style={styles.carsList}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B0000" />
              <Text style={styles.loadingText}>Cargando carros deportivos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#8B0000" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchDeportivos}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : deportivosData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="directions-car" size={48} color="#666" />
              <Text style={styles.emptyText}>No hay carros deportivos disponibles</Text>
            </View>
          ) : (
            deportivosData.map(renderCarCard)
          )}
          
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#8B0000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
