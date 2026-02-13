import AuthInput from '@/components/auth/AuthInput';
import CustomButton from '@/components/common/CustomButton';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (email) {
                router.push('/success');
            } else {
                alert('Please enter your registered email address');
            }
        }, 1500);
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

                    <View style={styles.content}>
                        <Text style={styles.title}>Forgot Your Password?</Text>
                        <Text style={styles.subtitle}>
                            Please enter your registered email address below.
                        </Text>

                        <AuthInput
                            placeholder="email@example.com"
                            value={email}
                            onChangeText={setEmail}
                            icon="mail-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.hint}>
                            Remember the password?{' '}
                            <Text style={styles.signInLink} onPress={() => router.back()}>
                                Sign in
                            </Text>
                        </Text>

                        <CustomButton
                            title="Submit"
                            onPress={handleSubmit}
                            loading={isLoading}
                            variant="primary"
                            style={styles.submitButton}
                        />
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
        justifyContent: 'center'
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


    },
    logoss: {
        width: 300,
        height: 130,
        marginTop: 40
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFC600',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.8,
    },
    hint: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 16,
        marginBottom: 24,
        opacity: 0.8,
    },
    signInLink: {
        color: '#FFC600',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    submitButton: {
        marginTop: 10,
    },
    footer: {
        alignItems: 'center',
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
