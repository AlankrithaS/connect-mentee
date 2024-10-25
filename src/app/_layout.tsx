import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { PocketBaseProvider } from '../context/pocketbase';
import { AuthProvider } from '../context/auth';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const queryClient = new QueryClient();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PocketBaseProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
          >
            <Stack>
              {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
               */}
              <Stack.Screen name="index" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </AuthProvider>
    </PocketBaseProvider>
  );
}
