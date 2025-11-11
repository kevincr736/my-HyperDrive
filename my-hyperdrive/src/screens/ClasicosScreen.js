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

export default function ClasicosScreen({ navigation }) {
  const [expandedCar, setExpandedCar] = useState(null);
  const [clasicosData, setClasicosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los carros clásicos del API
  const fetchClasicos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/cars?category=clasicos');
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
          textos: car.textos && Array.isArray(car.textos) ? car.textos : [],
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
        
        setClasicosData(mappedCars);
      } else {
        setError('No se pudieron cargar los carros clásicos');
      }
    } catch (err) {
      console.error('Error al obtener carros clásicos:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasicos();
  }, []);

  const toggleExpanded = (carId) => {
    setExpandedCar(expandedCar === carId ? null : carId);
  };

  const renderCarCard = (car) => (
    <View key={car.id} style={styles.carCard}>
      <View style={styles.carHeader}>
        <Text style={styles.maxSpeed}>Vmax {car.maxSpeed}</Text>
      </View>
      
      <View style={styles.carImageContainer}>
        <Image source={car.image} style={styles.carImage} resizeMode="cover" />
      </View>
      
      <View style={styles.carInfo}>
        {/* Ocultar información básica cuando está expandido */}
        {expandedCar !== car.id && (
          <>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carPrice}>{car.price}</Text>
            
            {/* Mostrar textos siempre, justo después del precio */}
            {car.textos && car.textos.length > 0 && (
              <View style={styles.textosContainer}>
                {car.textos.map((texto, index) => (
                  <View key={index} style={styles.textoItem}>
                    <View style={styles.textoArrowContainer}>
                      <Text style={styles.textoArrow}>→</Text>
                    </View>
                    <Text style={styles.textoText}>{texto}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>

      {/* Contenido expandible: especificaciones */}
      {expandedCar === car.id && (
        <View style={styles.specificationsContainer}>
          {/* Mostrar especificaciones si existen */}
          {car.specifications && car.specifications.length > 0 && (
            <View style={styles.specificationsList}>
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
            </View>
          )}
        </View>
      )}

      <TouchableOpacity 
        style={styles.expandButton}
        onPress={() => toggleExpanded(car.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.expandButtonText}>
          {expandedCar === car.id ? 'Ver menos' : 'Ver más'}
        </Text>
        <MaterialIcons 
          name={expandedCar === car.id ? "keyboard-double-arrow-up" : "keyboard-double-arrow-down"} 
          size={20} 
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B0000" />
              <Text style={styles.loadingText}>Cargando carros clásicos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#8B0000" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchClasicos}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : clasicosData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="directions-car" size={48} color="#666" />
              <Text style={styles.emptyText}>No hay carros clásicos disponibles</Text>
            </View>
          ) : (
            clasicosData.map(renderCarCard)
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
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  carHeader: {
    padding: 18,
    backgroundColor: '#151515',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  maxSpeed: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  carImageContainer: {
    height: 220,
    backgroundColor: '#0a0a0a',
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  carInfo: {
    padding: 24,
    backgroundColor: '#1f1f1f',
  },
  carName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  carPrice: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 20,
    opacity: 0.95,
  },
  specificationsContainer: {
    padding: 24,
    backgroundColor: '#151515',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  textosContainer: {
    marginTop: 4,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  textoItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
    paddingVertical: 2,
  },
  textoArrowContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  textoArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '300',
  },
  textoText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  specificationsList: {
    marginBottom: 24,
  },
  specificationItem: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-start',
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  specIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#8B0000',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  specIconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  specContent: {
    flex: 1,
    paddingTop: 2,
  },
  specTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  specDescription: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#151515',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    gap: 8,
  },
  expandButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
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

