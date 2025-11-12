import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
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

// Componente para extraer thumbnail del video
const VideoThumbnail = ({ videoUrl, style }) => {
  const [loading, setLoading] = useState(true);
  const thumbnailVideoRef = React.useRef(null);

  if (!videoUrl) {
    return (
      <View style={[style, { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="videocam" size={20} color="#666" />
      </View>
    );
  }

  // Usar Video como thumbnail - muestra el primer frame sin reproducir
  return (
    <View style={style} overflow="hidden">
      <Video
        ref={thumbnailVideoRef}
        source={{ uri: videoUrl }}
        style={style}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted
        isLooping={false}
        useNativeControls={false}
        onLoad={() => {
          setLoading(false);
        }}
      />
      {loading && (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

export default function NewsScreen({ navigation }) {
  const [expandedCards, setExpandedCards] = useState({});
  const [isBrandModalVisible, setIsBrandModalVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const [newState, setNewState] = useState({ videoUrl: '', text: '', description: '' });
  const [creatingState, setCreatingState] = useState(false);
  const [videoMode, setVideoMode] = useState('contain'); // 'contain' o 'cover'
  const videoRefs = React.useRef({});

  // Función para obtener los estados desde el API
  const fetchStates = async () => {
    try {
      setStatesLoading(true);
      const response = await fetch('http://localhost:3000/api/states');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Mapear los estados del API al formato esperado por el componente
        const mappedStates = data.data.map((state) => ({
          id: state.id,
          name: state.text, // Usar el texto como nombre
          icon: state.videoUrl, // Usar la URL del video para extraer thumbnail
          videoUrl: state.videoUrl, // Guardar URL del video
          stories: [
            {
              type: 'video',
              url: state.videoUrl,
              title: state.description
            }
          ]
        }));
        setStates(mappedStates);
      }
    } catch (error) {
      console.error('Error al obtener estados:', error);
    } finally {
      setStatesLoading(false);
    }
  };

  // Función para crear un estado
  const createState = async () => {
    try {
      if (!newState.videoUrl || !newState.text || !newState.description) {
        alert('Por favor completa todos los campos');
        return;
      }

      setCreatingState(true);
      const response = await fetch('http://localhost:3000/api/states/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newState),
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar el formulario
        setNewState({ videoUrl: '', text: '', description: '' });
        setIsStateModalVisible(false);
        // Recargar estados
        fetchStates();
      } else {
        alert(data.message || 'Error al crear el estado');
      }
    } catch (error) {
      console.error('Error al crear estado:', error);
      alert('Error al crear el estado');
    } finally {
      setCreatingState(false);
    }
  };

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

  // Función para obtener las noticias desde el API
  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError(null);
      
      const response = await fetch('http://localhost:3000/api/news');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Mapear los datos del API al formato esperado por el componente
        const mappedNews = data.data.map((item) => {
          // Formatear la fecha de publicación
          const pubDate = new Date(item.publicationDate);
          const formattedDate = `${String(pubDate.getDate()).padStart(2, '0')}-${String(pubDate.getMonth() + 1).padStart(2, '0')}-${pubDate.getFullYear()}`;
          
          // Crear descripción corta (primeros 150 caracteres) y completa
          const text = item.text || '';
          const shortDescription = text.length > 150 ? text.substring(0, 150) + '...' : text;
          const fullDescription = text;

          return {
            id: item.id,
            title: item.title,
            date: formattedDate,
            image: item.image, // base64
            shortDescription: shortDescription,
            fullDescription: fullDescription,
          };
        });
        
        setNews(mappedNews);
      } else {
        setNewsError('No se pudieron cargar las noticias');
      }
    } catch (error) {
      console.error('Error al obtener noticias:', error);
      setNewsError('Error al cargar las noticias');
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchStates();
  }, []);

  useEffect(() => {
    // Limpiar videos al desmontar
    return () => {
      Object.values(videoRefs.current).forEach((ref) => {
        if (ref) {
          ref.unloadAsync().catch(() => {});
        }
      });
    };
  }, []);

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
            {statesLoading ? (
              <View style={styles.statesLoadingContainer}>
                <ActivityIndicator size="small" color={colors.accentRed} />
                <Text style={styles.loadingText}>Cargando historias...</Text>
              </View>
            ) : states.length > 0 ? (
              states.map((b) => (
                <TouchableOpacity 
                  key={b.id} 
                  style={styles.brandItem}
                  onPress={() => {
                    setSelectedBrand(b);
                    setCurrentStoryIndex(0);
                    setIsBrandModalVisible(true);
                  }}
                >
                  {b.videoUrl ? (
                    <VideoThumbnail videoUrl={b.videoUrl} style={styles.brandIcon} />
                  ) : (
                    <Image source={{ uri: b.icon }} style={styles.brandIcon} />
                  )}
                  <Text style={styles.brandLabel} numberOfLines={1}>{b.name}</Text>
                </TouchableOpacity>
              ))
            ) : null}
            {/* Botón para agregar nuevo estado */}
            <TouchableOpacity 
              style={styles.addStateButton}
              onPress={() => setIsStateModalVisible(true)}
            >
              <MaterialIcons name="add-circle" size={44} color="#FFFFFF" />
              <Text style={styles.brandLabel} numberOfLines={1}>Agregar</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>NOTICIAS</Text>
          </View>

          {/* Noticias */}
          {newsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.accentRed} />
              <Text style={styles.loadingText}>Cargando noticias...</Text>
            </View>
          ) : newsError ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color={colors.accentRed} />
              <Text style={styles.errorText}>{newsError}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchNews}
              >
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : news.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay noticias disponibles</Text>
            </View>
          ) : (
            news.map((n) => (
              <View key={n.id} style={styles.card}>
                <Base64Image 
                  base64String={n.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
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
            ))
          )}


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
            {selectedBrand?.stories?.[currentStoryIndex]?.type === 'video' ? (
              <View style={styles.videoWrapper}>
                <Video
                  ref={(ref) => {
                    videoRefs.current[selectedBrand?.id] = ref;
                  }}
                  source={{ uri: selectedBrand?.stories?.[currentStoryIndex]?.url }}
                  style={styles.storyVideo}
                  resizeMode={videoMode === 'contain' ? ResizeMode.CONTAIN : ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  isMuted
                  useNativeControls={false}
                  onLoad={() => {
                    if (videoRefs.current[selectedBrand?.id]) {
                      videoRefs.current[selectedBrand?.id].playAsync().catch(() => {});
                    }
                  }}
                />
              </View>
            ) : (
              <Image 
                source={{ uri: selectedBrand?.stories?.[currentStoryIndex]?.url }} 
                style={styles.storyImage}
                resizeMode="cover"
              />
            )}
            
            {/* Story Header */}
            <View style={styles.storyHeader}>
              <View style={styles.storyBrandInfo}>
                <Image source={{ uri: selectedBrand?.icon }} style={styles.storyBrandIcon} />
                <Text style={styles.storyBrandName}>{selectedBrand?.name}</Text>
              </View>
              <View style={styles.storyHeaderButtons}>
                {/* Botón para cambiar modo de video */}
                {selectedBrand?.stories?.[currentStoryIndex]?.type === 'video' && (
                  <TouchableOpacity 
                    style={styles.storyModeButton}
                    onPress={() => setVideoMode(videoMode === 'contain' ? 'cover' : 'contain')}
                  >
                    <MaterialIcons 
                      name={videoMode === 'contain' ? 'fit-screen' : 'crop-free'} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>
                )}
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

      {/* Modal para crear estado */}
      <Modal
        visible={isStateModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear Historia</Text>
              <TouchableOpacity 
                onPress={() => setIsStateModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>URL del Video</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="http://localhost:3000/videos/estado.mp4"
                placeholderTextColor="#666"
                value={newState.videoUrl}
                onChangeText={(videoUrl) => setNewState({ ...newState, videoUrl })}
              />

              <Text style={styles.modalLabel}>Texto (Título)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Lamborghini Revuelto"
                placeholderTextColor="#666"
                value={newState.text}
                onChangeText={(text) => setNewState({ ...newState, text })}
              />

              <Text style={styles.modalLabel}>Descripción</Text>
              <TextInput
                style={[styles.modalInput, { minHeight: 80 }]}
                placeholder="Nuevo Revuelto 2024"
                placeholderTextColor="#666"
                value={newState.description}
                onChangeText={(description) => setNewState({ ...newState, description })}
                multiline
                numberOfLines={3}
              />

              <TouchableOpacity 
                style={[styles.modalSubmitButton, creatingState && styles.modalSubmitButtonDisabled]}
                onPress={createState}
                disabled={creatingState}
              >
                {creatingState ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Crear Historia</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addStateButton: { 
    alignItems: 'center', 
    marginRight: 16,
    justifyContent: 'center',
  },
  statesLoadingContainer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

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
  videoWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  storyVideo: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    minHeight: 44,
  },
  modalSubmitButton: {
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalSubmitButtonDisabled: {
    opacity: 0.6,
  },
  modalSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
  storyHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  storyModeButton: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 16,
    marginTop: 12,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    minWidth: 120,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
});


