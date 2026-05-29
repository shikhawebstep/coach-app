import AuthInput from '@/components/auth/AuthInput';
import CustomButton from '@/components/common/CustomButton';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function CreateNewPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!password || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push('/login');
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
                <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} keyboardShouldPersistTaps="handled">
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
                        <Text style={styles.title}>Create a new password</Text>
                        
                        <AuthInput
                            placeholder="New Password"
                            value={password}
                            onChangeText={setPassword}
                            icon="lock-closed-outline"
                            isPassword
                            secureTextEntry
                        />

                        <AuthInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            icon="lock-closed-outline"
                            isPassword
                            secureTextEntry
                            error={error}
                        />

                        <CustomButton
                            title="Change"
                            onPress={handleSave}
                            loading={isLoading}
                            variant="primary"
                            style={styles.changeButton}
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
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
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
        marginBottom: 20,
    },
    logoss: {
        width: 300,
        height: 130,
        marginTop: 20,
    },
    formContainer: {
        width: '100%',
        marginVertical: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFC600',
        marginBottom: 24,
        textAlign: 'center',
        fontFamily: 'Urbanist_700Bold',
    },
    changeButton: {
        marginTop: 10,
        backgroundColor: '#FFC600',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    syncoLogo: {
        width: 130,
        height: 40,
        opacity: 0.8,
        marginTop: 10,
    },
    poweredBy: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        opacity: 0.8,
    },
});
