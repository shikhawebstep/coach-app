import React, { useState } from 'react';
import CustomButton from '@/components/common/CustomButton';
import OnboardingPager from '@/components/onboarding/OnboardingPager';
import { useRouter } from 'expo-router';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

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
    const { completeFirstTimeOnboarding } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleLogin = () => {
        completeFirstTimeOnboarding();
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <OnboardingPager slides={slides} onIndexChanged={setActiveIndex} />

            <View style={styles.overlay} pointerEvents="box-none">
                <View style={styles.logoContainer} pointerEvents="none">
                    <Image
                        source={require('@/assets/images/coach-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.bottomContainer} pointerEvents="box-none">
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title="Login"
                            onPress={handleLogin}
                            variant="primary"
                        />
                    </View>

                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeIndex === index ? styles.activeDot : styles.inactiveDot
                                ]}
                            />
                        ))}
                    </View>
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
    bottomContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 6,
        borderRadius: 3,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
        backgroundColor: '#FFC600',
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#FFC600',
        opacity: 0.3,
    },
});
