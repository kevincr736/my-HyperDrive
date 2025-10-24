import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import NewsScreen from './src/screens/NewsScreen';
import BrandHistoryScreen from './src/screens/BrandHistoryScreen';
import DeportivosScreen from './src/screens/DeportivosScreen';
import ClasicosScreen from './src/screens/ClasicosScreen';
import LujososScreen from './src/screens/LujososScreen';
import SuvScreen from './src/screens/SuvScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Catalog" component={CatalogScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="BrandHistory" component={BrandHistoryScreen} />
        <Stack.Screen name="Deportivos" component={DeportivosScreen} />
        <Stack.Screen name="Clasicos" component={ClasicosScreen} />
        <Stack.Screen name="Lujosos" component={LujososScreen} />
        <Stack.Screen name="Suv" component={SuvScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
