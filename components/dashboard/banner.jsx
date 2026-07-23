import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import PercentageBar from '../common/PercentageBar';

const Banner = () => {
    const router = useRouter();
    const { coachProfile } = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const textColor = Colors[theme].text;
    const backgroundColor = Colors[theme].background;

    const bookings = [
        {
            image: require('@/assets/images/birthday.png'),
            service: 'Birthday Party',
            date: '10th April',
            time: '10:30-12pm',

        },
        {
            image: require('@/assets/images/holiday.png'),
            service: 'Holiday Camps',
            date: '22nd July',
            time: '9am-1pm',

        },
    ]
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        return 'Evening';
    };

    return (

        <View style={[styles.container, { backgroundColor }]}>
            <ScrollView>

                <View style={styles.row}>
                    <Image
                        source={coachProfile?.profile ? { uri: coachProfile.profile } : require('@/assets/images/Ellipse.png')}
                        style={[styles.logoImage, { borderRadius: 40 }]}
                    />
                    <Text style={[styles.greeting, { color: textColor }]}>{getGreeting()}, {coachProfile?.firstName || 'Coach'} 👋</Text>
                </View>
                <View style={styles.textBetween}>
                    <Text style={[styles.nextSession, { color: textColor }]}>Your next weekly session...</Text>
                    <Text style={styles.seeAll}>See All</Text>
                </View>
                <View style={{ position: 'relative', marginTop: 20, marginBottom: 30 }}>


                    <ImageBackground source={require('@/assets/images/baner.png')} imageStyle={styles.bgImage} style={styles.bannerImage}>
                        <View style={styles.overlay} />
                        <View style={styles.banner}>
                            <Text style={styles.bannerText}>24 HOURS</Text>
                            <Text style={{ color: '#fff', fontSize: 18, marginTop: 10, marginBottom: 5, fontFamily: 'Urbanist_700Bold' }}>Kings Cross</Text>
                            <Text style={{ color: '#F7D02A', fontSize: 16, marginBottom: 12, fontFamily: 'Urbanist_700Bold' }}>Sat 23rd April | 9am-10am</Text>
                            <TouchableOpacity style={{ backgroundColor: '#F7D02A', width: 70, textAlign: 'center', color: '#fff', borderRadius: 10, padding: 10 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: 'Urbanist_600SemiBold' }}>View</Text>
                            </TouchableOpacity>
                        </View>
                        <View><Image source={require('@/assets/images/Pose.png')} style={styles.groupImage} /></View>
                    </ImageBackground>
                </View>

                <View style={styles.textBetween}>
                    <Text style={[styles.nextSession, { color: textColor }]}>What’s coming up...</Text>
                    <TouchableOpacity onPress={() => router.push('/calendar')}>
                        <Text style={styles.seeAll}>See full calendar</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    style={{ marginHorizontal: -16, marginTop: 20 }}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {bookings.map((booking, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{ width: 280, marginRight: 16 }}
                            onPress={() => {
                                if (booking.service === 'Birthday Party') {
                                    router.push({ pathname: '/classes', params: { view: 'birthday' } });
                                } else if (booking.service === 'Holiday Camps') {
                                    router.push({ pathname: '/classes', params: { view: 'holiday' } });
                                }
                            }}
                        >
                            <ImageBackground imageStyle={styles.bgImage}
                                source={booking.image} style={{ padding: 20, paddingTop: 100 }}>
                                <View style={styles.overlay} />
                                <View style={{ alignItems: 'flex-start', justifyContent: 'flex-end', display: 'flex', gap: 5 }}>
                                    <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Urbanist_700Bold' }}>{booking.service}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Text style={{ color: '#fff', paddingRight: 10, fontSize: 14, borderRightWidth: 1, borderRightColor: '#fff', fontFamily: 'Urbanist_500Medium' }}>{booking.date}</Text>
                                        <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Urbanist_400Regular' }}>{booking.time}</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}

                </ScrollView>


                <View style={{ flexDirection: 'row', marginTop: 40, position: 'relative', backgroundColor: "#213990", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 20, alignItems: 'center', display: 'flex', gap: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Image
                            source={require('@/assets/images/aviso.png')}
                            style={{ width: 35, height: 50 }}
                        />
                        <View>
                            <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Urbanist_700Bold' }}>Refer a Coach</Text>
                            <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Urbanist_400Regular' }}>Refer a coach and enjoy £30 on us!</Text>
                            <TouchableOpacity style={{ backgroundColor: '#CCCCCC', padding: 6, borderRadius: 10, marginTop: 10, maxWidth: 80 }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'Urbanist_600SemiBold' }}>Refer now</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                        <Image
                            source={require('@/assets/images/Ricocool.png')}

                        />
                    </View>
                </View>

                <View style={{ marginTop: 20, width: '100%' }}>
                    <Text style={{ fontSize: 20, fontFamily: 'Urbanist_700Bold', color: textColor }}>Your results are in...</Text>
                    <View style={{ width: '100%', marginTop: 10 }}>
                        <ImageBackground source={require('@/assets/images/ThemeDark.png')} imageStyle={styles.bgImage} style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                                <View >
                                    <PercentageBar percentage={75} />
                                </View>
                                <View>
                                    <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Urbanist_600SemiBold' }}>Good Job!</Text>
                                    <Text style={{ color: '#fff', fontSize: 16, marginTop: 20, fontFamily: 'Urbanist_400Regular' }}>Click to see full report.</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </ScrollView >


        </View >

    )
}

export default Banner

const styles = StyleSheet.create({
    container: {
        padding: 16,
        overflow: 'auto'
    },
    logoImage: {
        width: 80,
        height: 80,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        gap: 10,
    },
    greeting: {
        fontSize: 32,
        fontFamily: 'Urbanist_700Bold',
    },
    bgImage: {
        borderRadius: 20,

    },
    textBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        gap: 10,
        marginTop: 20,
        justifyContent: 'space-between',
    },
    seeAll: {
        color: '#1BAC4B',
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
    },
    nextSession: {
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
    },
    bannerImage: {
        width: '100%',
        borderRadius: 30,
        marginTop: 20,
        position: 'relative',
    },
    banner: {
        overflow: 'hidden',
        padding: 30,
    },
    bannerText: {
        fontSize: 30,
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#fff',
    },
    groupImage: {
        position: 'absolute',
        bottom: -40,
        right: -20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    }
})