import AuthInput from '@/components/auth/AuthInput';
import CustomButton from '@/components/common/CustomButton';
import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const router = useRouter();
    const { login, isProfileCompleted, isOnboardingCompleted } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

  const handleLogin = async () => {
    console.log("🚀 Login function called");

    if (!email || !password) {
        console.log("❌ Email or password is missing");
        toast.warning("Please enter email and password");
        return;
    }

    console.log("📧 Email:", email);
    console.log("🔑 Password entered:", password ? "Yes" : "No");

    setIsLoading(true);
    console.log("⏳ Loading started");

    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            email,
            password,
        });

        const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/auth/login`;

        console.log("🌐 API URL:", url);
        console.log("📤 Request Body:", JSON.parse(raw));

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        console.log("📡 Sending request...");

        const response = await fetch(url, requestOptions);

        console.log("📥 Response Status:", response.status);
        console.log("📥 Response OK:", response.ok);

        const resultText = await response.text();

        console.log("📄 Raw Response:", resultText);

        let resultObj = {};

        try {
            resultObj = JSON.parse(resultText);
            console.log("✅ Parsed Response:", resultObj);
        } catch (e) {
            console.log("❌ Failed to parse JSON:", e);
        }

        if (response.ok) {
            console.log("🎉 Login Successful");

            const token =
                resultObj.token ||
                resultObj.data?.token ||
                "";

            const userId =
                resultObj.id ||
                resultObj.userId ||
                resultObj.data?.id ||
                resultObj.data?.user?.id ||
                resultObj.data?.admin?.id ||
                resultObj.user?.id ||
                "";

            console.log("🔑 Token:", token);
            console.log("👤 User ID:", userId);

            toast.success(resultObj.message || "Logged in successfully!");

            console.log("💾 Saving login data...");
            login(token, userId);

            console.log("📋 isProfileCompleted:", isProfileCompleted);
            console.log("📋 isOnboardingCompleted:", isOnboardingCompleted);

            if (!isProfileCompleted) {
                console.log("➡️ Navigating to Fill Profile");
                router.replace("/fill-profile");
            } else if (!isOnboardingCompleted) {
                console.log("➡️ Navigating to Onboarding");
                router.replace("/onboarding");
            } else {
                console.log("➡️ Navigating to Tabs");
                router.replace("/(tabs)");
            }
        } else {
            console.log("❌ Login Failed");
            console.log("📄 Error Response:", resultObj);

            toast.error(
                resultObj.message ||
                    "Login failed. Please check your credentials."
            );
        }
    } catch (error) {
        console.error("💥 Fetch Error:", error);
        toast.error("An error occurred during login.");
    } finally {
        console.log("🏁 Loading finished");
        setIsLoading(false);
    }
};

    const handleForgotPassword = () => {
        router.push('/forgot-password');
    };

    return (
        <ImageBackground
            source={require('@/assets/images/Login.png')}
            resizeMode="cover"
            style={styles.background}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="light-content"
                />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Image
                            source={require('@/assets/images/sslogo.png')}
                            style={styles.logoss}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.header}>
                        <Image
                            source={require('@/assets/images/coach-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.formContainer}>
                        <AuthInput
                            placeholder="email@example.com"
                            value={email}
                            onChangeText={setEmail}
                            icon="mail-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <AuthInput
                            placeholder="**********"
                            value={password}
                            onChangeText={setPassword}
                            icon="lock-closed-outline"
                            isPassword
                        />

                        <TouchableOpacity
                            style={styles.rememberRow}
                            onPress={() => setRememberMe(!rememberMe)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={12} color="#000" />}
                            </View>
                            <Text style={styles.rememberText}>Remember me</Text>
                        </TouchableOpacity>

                        <CustomButton
                            title="Sign in"
                            onPress={handleLogin}
                            loading={isLoading}
                            variant="primary"
                            style={styles.signInButton}
                        />

                        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.poweredBy}>powered by</Text>
                        <Image
                            source={require('@/assets/images/synco-logo2.png')}
                            style={styles.syncoLogo}
                            resizeMode="contain"
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,                // 🔥 REQUIRED
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,                // 🔥 REQUIRED
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,            // 🔥 REQUIRED
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 100,
        marginBottom: 40,

    },
    logoss: {
        width: 300,
        height: 130,
    },
    formContainer: {
        width: '100%',
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#F7D02A',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#F7D02A',
    },
    rememberText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
    },
    signInButton: {
        marginBottom: 20,
        backgroundColor: '#F7D02A',
        color: '#101014',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold'
    },
    forgotContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    forgotText: {
        color: '#F7D02A',
        fontSize: 16,
        fontFamily: 'Urbanist_500Medium',
    },
    footer: {
        alignItems: 'center',
        marginTop: 60,
    },
    syncoLogo: {
        width: 130,
        height: 40,
        opacity: 0.8,
        marginBlockStart: 10,
    },
    poweredBy: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 16,
        opacity: 0.8,
        fontFamily: 'Urbanist_400Regular',
    },
});
