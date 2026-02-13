import AuthInput from '@/components/auth/AuthInput';
import CustomButton from '@/components/common/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (email && password) {
                router.replace('/(tabs)');
            } else {
                alert('Please enter email and password');
            }
        }, 1500);
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
                            secureTextEntry
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
        fontFamily: 'Urbanist_700Bold'
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
    },
    signInButton: {
        marginBottom: 20,
        backgroundColor: '#F7D02A',
        color: '#101014',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Urbanist_700Bold'
    },
    forgotContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    forgotText: {
        color: '#F7D02A',
        fontSize: 16,
        textDecorationLine: 'underline',
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
    },
});
