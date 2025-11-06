import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import axios from 'axios';

export default function LoginScreen() {
  console.log('🟢 LoginScreen renderizado');
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('error'); // 'success' o 'error'

  // Función para validar email en tiempo real
  const validateEmail = (email) => {
    if (!email.trim()) {
      setEmailError('');
      return false;
    }
    
    // Si tiene espacios, claramente no es un email
    if (email.includes(' ')) {
      setEmailError('El email no puede contener espacios');
      return false;
    }
    
    // Si tiene @ pero no tiene punto después del @
    if (email.includes('@') && !email.split('@')[1].includes('.')) {
      setEmailError('Falta la extensión del dominio (ej: .com, .org)');
      return false;
    }
    
    // Si no tiene @ pero parece un dominio (tiene punto)
    if (!email.includes('@') && email.includes('.')) {
      setEmailError('Falta el símbolo @ antes del dominio');
      return false;
    }
    
    // Si no tiene @ y no tiene punto, pero tiene más de 5 caracteres
    // probablemente está escribiendo algo que no es un email
    if (!email.includes('@') && !email.includes('.') && email.length > 5) {
      setEmailError('Formato de email inválido. Debe contener @ y dominio');
      return false;
    }
    
    // Validación completa solo si tiene @ y punto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Formato de email inválido');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  // Función para validar contraseña en tiempo real
  const validatePassword = (password) => {
    if (!password.trim()) {
      setPasswordError('');
      return false;
    }
    
    // Solo mostrar error si ya escribió algo pero es muy corto
    if (password.length > 0 && password.length < 6) {
      setPasswordError(`Faltan ${6 - password.length} caracteres más`);
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  // Función para limpiar errores
  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setLoginError('');
  };

  // Función para mostrar modal
  const showModal = (message, type = 'error') => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleLogin = async () => {
    console.log('🔴 handleLogin llamado');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    // Limpiar errores previos
    clearErrors();

    // Validar campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      console.log('❌ Validaciones fallaron');
      return;
    }

    console.log('✅ Validaciones pasadas, iniciando petición...');
    setLoading(true);

    try {
      console.log('🌐 Enviando petición a:', 'http://localhost:3000/api/login');
      const response = await axios.post('http://localhost:3000/api/login', {
        email: email,
        password: password
      });
      
      console.log('📥 Respuesta recibida:', response.data);

      if (response.data.success) {
        console.log('🚀 Navegando a Home...');
        showModal('✅ ¡Login exitoso!\nBienvenido a HyperDrive', 'success');
        setTimeout(() => {
          navigation.navigate('Home');
        }, 2000);
      } else {
        const errorMessage = response.data.message || 'Credenciales incorrectas. Verifica tu email y contraseña.';
        setLoginError(errorMessage);
        showModal(`❌ ${errorMessage}`, 'error');
      }
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response) {
        // El servidor respondió con un error (400, 401, 404, 500, etc.)
        const statusCode = error.response.status;
        const responseData = error.response.data;
        
        console.log('📥 Respuesta de error del servidor:', responseData);
        
        // Si el servidor envió un mensaje, usarlo
        if (responseData && responseData.message) {
          console.log('🚨 Mostrando error del servidor:', responseData.message);
          setLoginError(responseData.message);
          showModal(`❌ ${responseData.message}`, 'error');
        } else {
          // Mensajes por defecto según el código de estado
          let errorMessage = 'Error del servidor';
          
          if (statusCode === 401) {
            errorMessage = 'Email o contraseña incorrectos';
          } else if (statusCode === 400) {
            errorMessage = 'Datos inválidos. Verifica tu información';
          } else if (statusCode === 404) {
            errorMessage = 'Usuario no encontrado. Verifica tu email';
          } else if (statusCode === 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde';
          }
          
          console.log('🚨 Mostrando error por código:', errorMessage);
          setLoginError(errorMessage);
          showModal(`❌ ${errorMessage}`, 'error');
        }
      } else if (error.request) {
        // Error de red
        const errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        setLoginError(errorMessage);
        showModal(`🌐 ${errorMessage}`, 'error');
      } else {
        // Error inesperado
        const errorMessage = 'Ocurrió un error inesperado. Intenta de nuevo.';
        setLoginError(errorMessage);
        showModal(`⚠️ ${errorMessage}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6F6F6F', '#090909']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.card}>
        <Image source={require('../../assets/hyper.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.spacer16} />

        <Text style={styles.label}>Correo</Text>
        <TextInput
          placeholder="Correo"
          placeholderTextColor="#b3b3b3"
          style={[styles.input, emailError && styles.inputError]}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            // Validar si tiene espacios (inmediatamente)
            if (text.includes(' ')) {
              validateEmail(text);
            }
            // Validar si ya escribió algo significativo
            else if (text.length > 3) {
              validateEmail(text);
            } else {
              setEmailError('');
            }
          }}
          onBlur={() => validateEmail(email)}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.spacer12} />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#b3b3b3"
          style={[styles.input, passwordError && styles.inputError]}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            // Solo validar si ya escribió algo
            if (text.length > 0) {
              validatePassword(text);
            } else {
              setPasswordError('');
            }
          }}
          onBlur={() => validatePassword(password)}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <View style={styles.spacer8} />
        <TouchableOpacity>
          <Text style={styles.forgot}>Olvídaste tu contraseña</Text>
        </TouchableOpacity>

        <View style={styles.spacer12} />

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} 
          onPress={() => {
            console.log('🔘 Botón INGRESAR presionado');
            handleLogin();
          }}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </Text>
        </TouchableOpacity>

        {loginError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.loginErrorText}>❌ {loginError}</Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.spacer16} />

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '85%',
    maxWidth: 360,
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
    width: 200,
    height: 200,
    tintColor: '#e6e6e6',
  },
  label: {
    width: '80%',
    color: '#ffffff',
    fontSize: 10,
    marginBottom: 4,
  },
  input: {
    width: '80%',
    height: 36,
    backgroundColor: '#868686',
    borderRadius: 6,
    paddingHorizontal: 10,
    color: '#f0f0f0',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4444',
    backgroundColor: '#2B2B2B',
  },
  errorText: {
    width: '80%',
    color: '#FF4444',
    fontSize: 10,
    marginTop: 4,
    marginLeft: 2,
  },
  errorContainer: {
    width: '80%',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffebee',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  loginErrorText: {
    color: '#FF4444',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  forgot: {
    color: '#cfcfcf',
    fontSize: 12,
  },
  primaryButton: {
    width: '70%',
    height: 36,
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
  },
  primaryButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#DEE1E6',
    marginVertical: 16,
  },
  googleButton: {
    width: '70%',
    height: 36,
    backgroundColor: '#868686',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  googleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  googleIcon: {
    width: 18,
    height: 18,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  googleText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#d2d2d2',
    fontSize: 12,
  },
  signupLink: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  spacer16: { height: 16 },
  spacer12: { height: 12 },
  spacer8: { height: 8 },
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

