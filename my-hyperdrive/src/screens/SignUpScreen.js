import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';

export default function SignUpScreen() {
  console.log('🟢 SignUpScreen renderizado');
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error');

  // Función para validar campos
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          error = '';
        } else if (value.trim().length < 2) {
          error = 'Mínimo 2 caracteres';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          error = '';
        } else if (value.trim().length < 2) {
          error = 'Mínimo 2 caracteres';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = '';
        } else if (value.includes(' ')) {
          error = 'El email no puede contener espacios';
        } else if (value.includes('@') && !value.split('@')[1].includes('.')) {
          error = 'Falta la extensión del dominio (ej: .com)';
        } else if (!value.includes('@') && value.includes('.')) {
          error = 'Falta el símbolo @ antes del dominio';
        } else if (!value.includes('@') && !value.includes('.') && value.length > 5) {
          error = 'Formato de email inválido';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Formato de email inválido';
          }
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = '';
        } else if (value.length < 6) {
          error = `Faltan ${6 - value.length} caracteres más`;
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = '';
        } else if (value !== formData.password) {
          error = 'Las contraseñas no coinciden';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Función para limpiar errores
  const clearErrors = () => {
    setErrors({});
  };

  // Función para mostrar modal
  const showModal = (message, type = 'error') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real
    if (value.length > 0) {
      validateField(name, value);
    } else {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Función para crear cuenta
  const handleSignUp = async () => {
    console.log('🔴 handleSignUp llamado');
    console.log('📝 Datos del formulario:', formData);

    // Limpiar errores previos
    clearErrors();

    // Validar todos los campos
    const isFirstNameValid = validateField('firstName', formData.firstName);
    const isLastNameValid = validateField('lastName', formData.lastName);
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);
    const isConfirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      console.log('❌ Validaciones fallaron');
      return;
    }

    console.log('✅ Validaciones pasadas, iniciando registro...');
    setLoading(true);

    try {
      console.log('🌐 Enviando petición a:', 'http://localhost:3000/signup');
      const response = await axios.post('http://localhost:3000/signup', formData);
      
      console.log('📥 Respuesta recibida:', response.data);

      if (response.data.success) {
        console.log('🚀 Registro exitoso, navegando a Login...');
        showModal('✅ ¡Cuenta creada exitosamente!\nYa puedes iniciar sesión', 'success');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        const errorMessage = response.data.message || 'Error al crear la cuenta. Intenta de nuevo.';
        showModal(`❌ ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response) {
        const responseData = error.response.data;
        const errorMessage = responseData?.message || 'Error del servidor. Intenta más tarde.';
        showModal(`❌ ${errorMessage}`, 'error');
      } else if (error.request) {
        showModal('🌐 Sin conexión. Verifica tu internet.', 'error');
      } else {
        showModal('⚠️ Error inesperado. Intenta de nuevo.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6F6F6F', '#090909']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.root}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={require('../../assets/hyper.png')} style={styles.logo} resizeMode="contain" />

          <View style={styles.spacer16} />

          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a HyperDrive</Text>

          <View style={styles.spacer16} />

          {/* Nombre */}
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            placeholder="Nombre"
            placeholderTextColor="#b3b3b3"
            style={[styles.input, errors.firstName && styles.inputError]}
            value={formData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
            onBlur={() => validateField('firstName', formData.firstName)}
          />
          {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

          <View style={styles.spacer12} />

          {/* Apellido */}
          <Text style={styles.label}>Apellido</Text>
          <TextInput
            placeholder="Apellido"
            placeholderTextColor="#b3b3b3"
            style={[styles.input, errors.lastName && styles.inputError]}
            value={formData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
            onBlur={() => validateField('lastName', formData.lastName)}
          />
          {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

          <View style={styles.spacer12} />

          {/* Email */}
          <Text style={styles.label}>Correo</Text>
          <TextInput
            placeholder="Correo"
            placeholderTextColor="#b3b3b3"
            style={[styles.input, errors.email && styles.inputError]}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            onBlur={() => validateField('email', formData.email)}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <View style={styles.spacer12} />

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            placeholder="Contraseña"
            placeholderTextColor="#b3b3b3"
            style={[styles.input, errors.password && styles.inputError]}
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            onBlur={() => validateField('password', formData.password)}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.spacer12} />

          {/* Confirmar Contraseña */}
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#b3b3b3"
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <View style={styles.spacer16} />

          {/* Botón Crear Cuenta */}
          <TouchableOpacity 
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
            onPress={() => {
              console.log('🔘 Botón CREAR CUENTA presionado');
              handleSignUp();
            }}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'CREANDO...' : 'CREAR CUENTA'}
            </Text>
          </TouchableOpacity>

          <View style={styles.spacer16} />

          {/* Enlace a Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, modalType === 'success' ? styles.modalSuccess : styles.modalError]}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity 
              style={[styles.modalButton, modalType === 'success' ? styles.modalButtonSuccess : styles.modalButtonError]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>
                {modalType === 'success' ? 'Continuar' : 'Entendido'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#2B2B2B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFF0F0',
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 35,
    shadowOffset: { width: 0, height: 3 },
    elevation: 12,
  },
  logo: {
    width: 120,
    height: 120,
    tintColor: '#e6e6e6',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#cfcfcf',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  label: {
    width: '100%',
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#868686',
    borderRadius: 6,
    paddingHorizontal: 12,
    color: '#f0f0f0',
    fontSize: 14,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4444',
    backgroundColor: '#2B2B2B',
  },
  errorText: {
    width: '100%',
    color: '#FF4444',
    fontSize: 10,
    marginTop: 4,
    marginLeft: 2,
  },
  primaryButton: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EF0303',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: '#d2d2d2',
    fontSize: 14,
  },
  loginLink: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  spacer16: { height: 16 },
  spacer12: { height: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#2B2B2B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: 320,
    borderWidth: 2,
  },
  modalSuccess: {
    borderColor: '#4CAF50',
  },
  modalError: {
    borderColor: '#FF4444',
  },
  modalText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  modalButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  modalButtonError: {
    backgroundColor: '#FF4444',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
