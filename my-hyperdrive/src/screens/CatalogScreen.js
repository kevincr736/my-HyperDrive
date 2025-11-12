import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import Footer from '../components/Footer';
import { colors } from '../theme/colors';

export default function CatalogScreen({ navigation }) {
  const videoRefs = useRef({});

  const categories = [
    {
      id: 1,
      title: 'DEPORTIVOS',
      video: require('../../assets/test.mp4'), // Video de prueba
      position: 'bottom-right',
      screen: 'Deportivos'
    },
    {
      id: 2,
      title: 'CLASICOS',
      video: require('../../assets/clasico.mp4'), // Video de prueba
      position: 'top-left',
      screen: 'Clasicos'
    },
    {
      id: 3,
      title: 'LUJOSOS',
      video: require('../../assets/lujosos.mp4'), // Video de prueba
      position: 'top-right',
      screen: 'Lujosos'
    },
    {
      id: 4,
      title: 'TODO TERRENO',
      video: require('../../assets/terreno.mp4'), // Video de prueba
      position: 'top-left',
      screen: 'Suv'
    }
  ];

  useEffect(() => {
    // Limpiar al desmontar
    return () => {
      Object.values(videoRefs.current).forEach((ref) => {
        if (ref) {
          ref.unloadAsync().catch(() => {});
        }
      });
    };
  }, []);

  const getTitleStyle = (position) => {
    switch (position) {
      case 'top-left':
        return { position: 'absolute', top: 16, left: 16 };
      case 'top-right':
        return { position: 'absolute', top: 16, right: 16 };
      case 'bottom-right':
        return { position: 'absolute', bottom: 16, right: 16 };
      default:
        return { position: 'absolute', top: 16, left: 16 };
    }
  };

  return (
    <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
      <View style={styles.backgroundPattern} />
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

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.screenTitle}>CATALOGO</Text>
          
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              {category.video ? (
                <View style={styles.videoWrapper}>
                  <Video
                    ref={(ref) => {
                      videoRefs.current[category.id] = ref;
                    }}
                    source={category.video}
                    style={styles.categoryVideo}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay
                    isLooping
                    isMuted
                    useNativeControls={false}
                    onLoad={() => {
                      // Asegurar que el video se reproduzca cuando esté listo
                      if (videoRefs.current[category.id]) {
                        videoRefs.current[category.id].playAsync().catch(() => {});
                      }
                    }}
                  />
                </View>
              ) : (
                <View style={styles.categoryPlaceholder}>
                  <MaterialIcons name="videocam-off" size={48} color="#666" />
                  <Text style={styles.placeholderText}>Video no disponible</Text>
                </View>
              )}
              <Text style={[styles.categoryTitle, getTitleStyle(category.position)]}>
                {category.title}
              </Text>
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => navigation.navigate(category.screen)}
              >
                <Text style={styles.seeMoreText}>See More</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <Footer />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#070707',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
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
  refreshButton: {
    padding: 12,
    borderRadius: 6,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryCard: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  videoWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryVideo: {
    width: '100%',
    height: '100%',
  },
  categoryPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  seeMoreButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  seeMoreText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
