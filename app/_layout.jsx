import CustomLoader from '@/components/common/CustomLoader';
import { ToastProvider } from '@/components/common/Toast';
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
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { RootSiblingParent } from 'react-native-root-siblings';

export const unstable_settings = {
    anchor: '(tabs)',
};

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isLoggedIn, isAuthLoading, isProfileCompleted, isOnboardingCompleted, hasRole, userRole } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    const inAuthGroup = segments[0] === '(tabs)' || !segments[0] || segments[0] === 'index' || segments[0] === 'onboarding' || segments[0] === 'fill-profile' || segments[0] === 'success';

    useEffect(() => {
        if (isAuthLoading) {
            console.log("⏳ [RootLayout] Auth is loading...");
            return;
        }

        const isCoach = hasRole('coach');
        const isVenueManager = hasRole('venue manager');
        const isOwner = hasRole('owner') || hasRole('super admin');
        
        const needsOnboarding = (isCoach || isVenueManager) && !isOwner;

        console.log("🚦 [RootLayout] Navigation Guard state:", {
            isLoggedIn,
            userRole,
            isCoach,
            isVenueManager,
            isOwner,
            needsOnboarding,
            isProfileCompleted,
            isOnboardingCompleted,
            currentSegment: segments[0],
            inAuthGroup
        });

        if (!isLoggedIn && inAuthGroup) {
            console.log("➡️ [RootLayout] Redirecting to /login (user not logged in)");
            router.replace('/login');
        } else if (isLoggedIn) {
            if (!isProfileCompleted && !isOwner) {
                if (segments[0] !== 'fill-profile') {
                    console.log("➡️ [RootLayout] Redirecting to /fill-profile (profile incomplete)");
                    router.replace('/fill-profile');
                }
            } else if (needsOnboarding && !isOnboardingCompleted) {
                if (segments[0] !== 'onboarding') {
                    console.log("➡️ [RootLayout] Redirecting to /onboarding (Coach/VM role & onboarding incomplete)");
                    router.replace('/onboarding');
                }
            } else {
                const entryScreens = ['login', 'forgot-password', 'success', 'create-new-password', 'index', 'onboarding', 'fill-profile'];
                if (entryScreens.includes(segments[0]) || !segments[0]) {
                    console.log("➡️ [RootLayout] Redirecting to /(tabs) (All requirements met or non-coach)");
                    router.replace('/(tabs)');
                }
            }
        }
    }, [isLoggedIn, isAuthLoading, segments, inAuthGroup, isProfileCompleted, isOnboardingCompleted, userRole]);

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
