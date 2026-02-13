import CustomButton from '@/components/common/CustomButton';
import OnboardingPager from '@/components/onboarding/OnboardingPager';
import { useRouter } from 'expo-router';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const slides = [
    {
        id: '1',
        image: require('@/assets/images/coach.png'),
    },
    {
        id: '2',
        image: require('@/assets/images/coach2.png'),
    },
    {
        id: '3',
        image: require('@/assets/images/coach3.png'),
    },
];

export default function Onboarding() {
    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <OnboardingPager slides={slides} />

            <View style={styles.overlay}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/coach-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Login"
                        onPress={handleLogin}
                        variant="primary"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logo: {
        width: 180,
        height: 80,
    },
    buttonContainer: {
        marginBottom: 20,
    },
});
