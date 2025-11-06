import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import { colors } from '../theme/colors';

// Componente para manejar imágenes base64
const Base64Image = ({ base64String, style, ...props }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !base64String) {
    return (
      <View style={[style, { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 14 }}>Imagen no disponible</Text>
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

export default function BrandHistoryScreen({ navigation, route }) {
  const { brandName, brandId } = route?.params || {};
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener la marca desde el API
  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url;
      if (brandId) {
        // Si tenemos ID, buscar por ID
        url = `http://localhost:3000/api/brands/${brandId}`;
      } else if (brandName) {
        // Si tenemos nombre, buscar por nombre
        url = `http://localhost:3000/api/brands/name/${encodeURIComponent(brandName)}`;
      } else {
        throw new Error('Se requiere brandName o brandId');
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBrand(data.data);
      } else {
        setError(data.message || 'Error al obtener la marca');
      }
    } catch (err) {
      console.error('Error al obtener marca:', err);
      setError(err.message || 'Error al cargar la marca');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [brandName, brandId]);

  if (loading) {
    return (
      <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accentRed} />
            <Text style={styles.loadingText}>Cargando marca...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || !brand) {
    return (
      <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color={colors.accentRed} />
            <Text style={styles.errorText}>{error || 'Marca no encontrada'}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchBrand}
            >
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

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
            <Base64Image 
              base64String={brand.carImage}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Brand Logo and Name */}
          <View style={styles.brandSection}>
            <Base64Image 
              base64String={brand.logo}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>{brand.name}</Text>
            {brand.description && (
              <Text style={styles.brandDescription}>{brand.description}</Text>
            )}
          </View>

          {/* Timeline */}
          <View style={styles.timelineSection}>
            <Text style={styles.timelineTitle}>HISTORIA</Text>
            <View style={styles.timeline}>
              {brand.timeline && brand.timeline.length > 0 ? (
                brand.timeline.map((item, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <Text style={styles.timelineYear}>{item.year}</Text>
                    </View>
                    <View style={styles.timelineCenter}>
                      <View style={styles.timelineDot} />
                      {index < brand.timeline.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineRight}>
                      <Text style={styles.timelineItemTitle}>{item.title}</Text>
                      <Text style={styles.timelineItemDescription}>{item.description}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noTimelineText}>No hay información de timeline disponible</Text>
              )}
            </View>
          </View>

          {/* Back Button */}
          <View style={styles.backSection}>
            <TouchableOpacity 
              style={styles.backButtonContainer}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
              <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
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
    borderRadius: 12
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
    textAlign: 'center',
    marginTop: 8
  },
  brandDescription: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20
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

  backSection: { 
    paddingHorizontal: 20, 
    marginBottom: 20,
    alignItems: 'center'
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
  backButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  noTimelineText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    padding: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 12
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20
  },
  retryButton: {
    padding: 12,
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 120
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
});
