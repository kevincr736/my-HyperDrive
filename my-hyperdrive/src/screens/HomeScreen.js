import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
// import * as FileSystem from 'expo-file-system';
import SectionTitle from '../components/SectionTitle';
import ModelCard from '../components/ModelCard';
import IconTile from '../components/IconTile';
import NewsItem from '../components/NewsItem';
import Footer from '../components/Footer';
import { colors } from '../theme/colors';
import ModelsCarousel from '../components/ModelsCarousel';
import BrandsCarousel from '../components/BrandsCarousel';
import SideMenu from '../components/SideMenu';

// Componente para manejar imágenes base64 directamente
const Base64Image = ({ base64String, style, ...props }) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError || !base64String) {
    return (
      <View style={[style, { backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 14 }}>Imagen no disponible</Text>
        <Text style={{ color: '#999', fontSize: 10, marginTop: 5 }}>
          Base64: {base64String ? `${base64String.length} chars` : 'No data'}
        </Text>
      </View>
    );
  }

  // Usar la base64 directamente como URI
  return (
    <Image
      source={{ uri: base64String }}
      style={style}
      onError={() => setImageError(true)}
      {...props}
    />
  );
};

export default function HomeScreen({ navigation }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [monthlyCar, setMonthlyCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [newComment, setNewComment] = useState({ text: '', category: 'Category', avatarUrl: '' });
  const [creatingComment, setCreatingComment] = useState(false);

  // Función para obtener el vehículo mensual
  const fetchMonthlyCar = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cars/monthly_car');
      const data = await response.json();
      
      if (data.success) {
        console.log('Datos recibidos del API:', data.data);
        console.log('Base64 recibido:', data.data.imageBase64?.substring(0, 50) + '...');
        
        // Usar los datos directamente sin procesamiento adicional
        setMonthlyCar(data.data);
      }
    } catch (error) {
      console.error('Error al obtener vehículo mensual:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los MODELOS (tarjetas) con imágenes en base64
  const fetchHomeModels = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cars/home_models');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const mapped = data.data.map((item) => ({
          title: item.title,
          price: item.price,
          imageUri: item.imageBase64,
        }));
        setModels(mapped);
      }
    } catch (error) {
      console.error('Error al obtener modelos para home:', error);
    } finally {
      setModelsLoading(false);
    }
  };

  // Función para obtener las marcas
  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/brands');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const mapped = data.data.map((brand) => ({
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
        }));
        setBrands(mapped);
      }
    } catch (error) {
      console.error('Error al obtener marcas:', error);
    } finally {
      setBrandsLoading(false);
    }
  };

  // Función para obtener los comentarios
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await fetch('http://localhost:3000/api/comments');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        const mapped = data.data.map((comment) => {
          // Formatear la fecha
          const commentDate = new Date(comment.date);
          const formattedDate = `${String(commentDate.getDate()).padStart(2, '0')}-${String(commentDate.getMonth() + 1).padStart(2, '0')}-${commentDate.getFullYear()}`;
          
          return {
            id: comment.id,
            date: formattedDate,
            category: comment.category,
            title: comment.text,
            avatarUri: comment.avatar, // base64
          };
        });
        setComments(mapped);
      }
    } catch (error) {
      console.error('Error al obtener comentarios:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Función para crear un comentario
  const createComment = async () => {
    try {
      if (!newComment.text || !newComment.category) {
        alert('Por favor completa todos los campos');
        return;
      }

      setCreatingComment(true);
      const response = await fetch('http://localhost:3000/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment.text,
          category: newComment.category,
          avatarUrl: newComment.avatarUrl || 'http://localhost:3000/images/logo_lamb.png',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar el formulario
        setNewComment({ text: '', category: 'Category', avatarUrl: '' });
        setIsCommentModalVisible(false);
        // Recargar comentarios
        fetchComments();
      } else {
        alert(data.message || 'Error al crear el comentario');
      }
    } catch (error) {
      console.error('Error al crear comentario:', error);
      alert('Error al crear el comentario');
    } finally {
      setCreatingComment(false);
    }
  };

  useEffect(() => {
    fetchMonthlyCar();
    fetchHomeModels();
    fetchBrands();
    fetchComments();
  }, []);

  return (
    <LinearGradient colors={["#0a0a0a", "#040404"]} style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setIsMenuVisible(true)}
            >
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image source={require('../../assets/logo_navbar.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.heroCard}>
            <Text style={styles.centerTitle}>CARRO DEL MES</Text>
            {loading ? (
              <View style={[styles.heroImage, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Cargando...</Text>
              </View>
            ) : monthlyCar ? (
              <Base64Image 
                base64String={monthlyCar.imageBase64}
                style={styles.heroImage} 
                resizeMode="contain"
              />
            ) : (
              <Image source={{ uri: 'https://placehold.co/363x272' }} style={styles.heroImage} />
            )}
            <Text style={styles.slogan}>
              {monthlyCar ? monthlyCar.description.toUpperCase() : 'DISEÑADO PARA QUIENES NO CONOCEN LIMITES'}
            </Text>
          </View>

          <View style={styles.body}>
            <View style={styles.iconRow}>
              <IconTile 
                label="CATALOGOS" 
                onPress={() => navigation.navigate('Catalog')}
              />
              <IconTile 
                label="NOTICIAS" 
                onPress={() => navigation.navigate('News')}
              />
            </View>

            <View style={styles.spacingBelowIcons} />

            <SectionTitle>MODELOS</SectionTitle>

            {modelsLoading ? (
              <ModelsCarousel
                data={[
                  { title: 'Cargando...', price: '', imageUri: 'https://placehold.co/160x100' },
                ]}
              />
            ) : (
              <ModelsCarousel
                data={
                  models.length > 0
                    ? models
                    : [
                        { title: 'Sin modelos', price: '', imageUri: 'https://placehold.co/160x100' },
                      ]
                }
              />
            )}

            <View style={styles.spacingBetweenCarousels} />
            <Text style={styles.rightTitle}>MARCAS Y SUS HISTORIAS</Text>
            {brandsLoading ? (
              <View style={styles.brandsLoadingContainer}>
                <Text style={styles.loadingText}>Cargando marcas...</Text>
              </View>
            ) : (
              <BrandsCarousel 
                data={brands.length > 0 ? brands : []} 
                onBrandPress={(brand) => {
                  // brand puede ser un objeto con id y name, o solo el name
                  if (typeof brand === 'object' && brand.id) {
                    navigation.navigate('BrandHistory', { brandId: brand.id, brandName: brand.name });
                  } else {
                    navigation.navigate('BrandHistory', { brandName: brand });
                  }
                }}
              />
            )}

            <View style={styles.spacingBelowBrands} />

           

            <View style={styles.commentsSection}>
              {commentsLoading ? (
                <View style={styles.commentsLoadingContainer}>
                  <ActivityIndicator size="small" color={colors.accentRed} />
                  <Text style={styles.loadingText}>Cargando comentarios...</Text>
                </View>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <NewsItem 
                    key={comment.id}
                    date={comment.date}
                    category={comment.category}
                    title={comment.title}
                    avatarUri={comment.avatarUri}
                  />
                ))
              ) : (
                <View style={styles.emptyCommentsContainer}>
                  <Text style={styles.emptyCommentsText}>No hay comentarios aún</Text>
                </View>
              )}

              <Pressable 
                style={({pressed}) => [styles.fab, pressed && styles.fabPressed]}
                onPress={() => setIsCommentModalVisible(true)}
              >
                <View style={styles.fabPlus}>
                  <View style={styles.fabLineH} />
                  <View style={styles.fabLineV} />
                </View>
              </Pressable>
            </View>

            <Footer />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Side Menu */}
      <SideMenu 
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen)}
      />

      {/* Modal para crear comentario */}
      <Modal
        visible={isCommentModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCommentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear Comentario</Text>
              <TouchableOpacity 
                onPress={() => setIsCommentModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>Texto del comentario</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Escribe tu comentario..."
                placeholderTextColor="#666"
                value={newComment.text}
                onChangeText={(text) => setNewComment({ ...newComment, text })}
                multiline
                numberOfLines={4}
              />

              <Text style={styles.modalLabel}>Categoría</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Category"
                placeholderTextColor="#666"
                value={newComment.category}
                onChangeText={(category) => setNewComment({ ...newComment, category })}
              />

              <Text style={styles.modalLabel}>URL del Avatar (opcional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="http://localhost:3000/images/logo_lamb.png"
                placeholderTextColor="#666"
                value={newComment.avatarUrl}
                onChangeText={(avatarUrl) => setNewComment({ ...newComment, avatarUrl })}
              />

              <TouchableOpacity 
                style={[styles.modalSubmitButton, creatingComment && styles.modalSubmitButtonDisabled]}
                onPress={createComment}
                disabled={creatingComment}
              >
                {creatingComment ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>Crear Comentario</Text>
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
  root: { flex: 1, backgroundColor: '#070707' },
  header: { 
    height: 60, 
    backgroundColor: '#101010',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: { 
    width: 100, 
    height: 100, 
    tintColor: '#FFFFFF' 
  },
  menuButton: {
    padding: 12,
    borderRadius: 6,
  },
  scrollContent: { paddingBottom: 24 },
  heroCard: { padding: 16 },
  heroImage: { width: '100%', height: 250, borderRadius: 12 },
  slogan: {
    marginTop: 12,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  body: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 12 },
  spacingBelowIcons: { height: 20 },
  spacingBetweenCarousels: { height: 16 },
  spacingBelowBrands: { height: 12 },
  commentsSection: { marginTop: 16, position: 'relative', paddingBottom: 24 },
  fab: {
    position: 'absolute',
    right: 12,
    bottom: -20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 252, 252, 0.27)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  fabPressed: {
    backgroundColor: '#EF0303',
    borderColor: '#EF0303',
  },
  fabPlus: { width: 20, height: 20, position: 'relative' },
  fabLineH: { position: 'absolute', top: 9, left: 0, right: 0, height: 2, backgroundColor: '#FFFFFF', borderRadius: 2 },
  fabLineV: { position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, backgroundColor: '#FFFFFF', borderRadius: 2 },
  centerTitle: {
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginVertical: 8,
  },
  rightTitle: {
    textAlign: 'right',
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
    marginVertical: 8,
    paddingRight: 16,
  },
  modelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  loadingContainer: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  brandsLoadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  commentsLoadingContainer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyCommentsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCommentsText: {
    color: colors.textMuted,
    fontSize: 14,
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
});


