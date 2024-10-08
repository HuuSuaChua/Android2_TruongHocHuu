import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from './../store/store';
import ProductDetail from './ProductDetail/[id]';
import CheckoutScreen from './CheckoutScreen';
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Italic: require('../assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Display nothing until fonts are loaded
  }

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <Provider store={store}>
      <Toast/>
    <ThemeProvider value={theme}>

      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="SignupScreen" options={{ headerShown: false }} />
        <Stack.Screen name="SearchResults" options={{ headerShown: false }} />
        
        <ProductDetail />
        <Stack.Screen name="CartScreen" options={{ headerShown: false }}/>
        <Stack.Screen name="CheckoutScreen" options={{ headerShown: false }}/>
        <Stack.Screen name="ProductDetail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ProductCategory/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
    </Provider>
  );
}
