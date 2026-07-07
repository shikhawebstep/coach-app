import { LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';
import {
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
} from '@expo-google-fonts/urbanist';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import CustomLoader from '@/components/common/CustomLoader';
import { ToastProvider } from '@/components/common/Toast';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootSiblingParent } from 'react-native-root-siblings';

export const unstable_settings = {
    anchor: '(tabs)',
};

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isLoggedIn, isAuthLoading, isProfileCompleted, isOnboardingCompleted } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const inAuthGroup = segments[0] === '(tabs)' || !segments[0] || segments[0] === 'index' || segments[0] === 'first-time-onboarding' || segments[0] === 'fill-profile' || segments[0] === 'success';

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isLoggedIn && inAuthGroup) {
            router.replace('/login');
        } else if (isLoggedIn && (segments[0] === 'login' || segments[0] === 'forgot-password')) {
            if (!isProfileCompleted) {
                router.replace('/fill-profile');
            } else if (!isOnboardingCompleted) {
                router.replace('/first-time-onboarding');
            } else {
                router.replace('/(tabs)');
            }
        }
    }, [isLoggedIn, isAuthLoading, segments, inAuthGroup, isProfileCompleted, isOnboardingCompleted]);

    if (isAuthLoading || (!isLoggedIn && inAuthGroup)) {
        return (
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <View style={{ flex: 1, backgroundColor: '#101014', justifyContent: 'center', alignItems: 'center' }}>
                    <CustomLoader size={80} color="#F7D02A" />
                </View>
            </ThemeProvider>
        );
    }

    return (
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
                <Stack.Screen name="training" options={{ headerShown: false }} />
                <Stack.Screen name="reportIssueList" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

export default function RootLayout() {
    const [loaded] = useFonts({
        Urbanist_400Regular,
        Urbanist_500Medium,
        Urbanist_600SemiBold,
        Urbanist_700Bold,
        LuckiestGuy_400Regular,
    });

    if (!loaded) return null;

    return (
        <RootSiblingParent>
            <AuthProvider>
                <ToastProvider>
                    <RootLayoutNav />
                </ToastProvider>
            </AuthProvider>
        </RootSiblingParent>
    );
}
