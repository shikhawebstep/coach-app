import { LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';
import {
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/context/AuthContext';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        Urbanist_400Regular,
        Urbanist_500Medium,
        Urbanist_600SemiBold,
        Urbanist_700Bold,
        LuckiestGuy_400Regular,
    });

    if (!loaded) return null;

    return (
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                    <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
                    <Stack.Screen name="success" options={{ headerShown: false }} />
                    <Stack.Screen name="create-new-password" options={{ headerShown: false }} />
                    <Stack.Screen name="fill-profile" options={{ headerShown: false }} />
                    <Stack.Screen name="first-time-onboarding" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </AuthProvider>
    );
}
