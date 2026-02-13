import { Colors } from '@/constants/theme';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import PercentageBar from '../layout/PercentageBar';
const Banner = () => {
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
    return (

        <View style={[styles.container, { backgroundColor }]}>
            <ScrollView>

                <View style={styles.row}>
                    <Image
                        source={require('@/assets/images/Ellipse.png')}
                        style={styles.logoImage}
                    />
                    <Text style={[styles.greeting, { color: textColor }]}>Morning, Ethan 👋</Text>
                </View>
                <View style={styles.textBetween}>
                    <Text style={[styles.nextSession, { color: textColor }]}>Your next weekly session...</Text>
                    <Text style={styles.seeAll}>See All</Text>
                </View>
                <View style={{ position: 'relative', marginTop: 20, marginBottom: 30 }}>


                    <ImageBackground source={require('@/assets/images/baner.png')} imageStyle={styles.bgImage} style={styles.bannerImage}>

                        <View style={styles.banner}>

                            <Text style={styles.bannerText}>22 HOURS</Text>
                            <Text style={{ color: '#fff', fontSize: 18, marginTop: 10, marginBottom: 5 }}>Kings Cross</Text>
                            <Text style={{ color: '#F7D02A', fontSize: 16, marginBottom: 12 }}>Sat 23rd April | 9am-10am</Text>
                            <TouchableOpacity style={{ backgroundColor: '#F7D02A', width: 70, textAlign: 'center', color: '#fff', borderRadius: 10, padding: 10 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16 }}>View</Text>
                            </TouchableOpacity>
                        </View>
                        <View><Image source={require('@/assets/images/Pose.png')} style={styles.groupImage} /></View>
                    </ImageBackground>
                </View>

                <View style={styles.textBetween}>
                    <Text style={[styles.nextSession, { color: textColor }]}>What’s coming up...</Text>
                    <Text style={styles.seeAll}>See full calendar</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', flexWrap: 'nowrap', overflow: 'scroll', display: 'flex', gap: 20 }}>
                    {bookings.map((booking, index) => (
                        <View key={index} style={{ width: "90%", }}>
                            <ImageBackground imageStyle={styles.bgImage}
                                source={booking.image} style={{ padding: 20, paddingTop: 100 }}>


                                <View style={{ alignItems: 'end', justifyContent: 'end', display: 'flex', gap: 5 }}>
                                    <Text style={{ color: '#fff', fontSize: 24 }}>{booking.service}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Text style={{ color: '#fff', paddingRight: 10, fontSize: 14, borderRightWidth: 1, borderRightColor: '#fff' }}>{booking.date}</Text>
                                        <Text style={{ color: '#fff', fontSize: 14 }}>{booking.time}</Text>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    ))}

                </View>


                <View style={{ flexDirection: 'row', marginTop: 40, position: 'relative', backgroundColor: "#213990", borderRadius: 10, paddingHorizontal: 10, paddingVertical: 20, alignItems: 'center', display: 'flex', gap: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <Image
                            source={require('@/assets/images/aviso.png')}
                            style={{ width: 35, height: 50 }}
                        />
                        <View>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Refer a Coach</Text>
                            <Text style={{ color: '#fff', fontSize: 14, }}>Refer a coach and enjoy £30 on us!</Text>
                            <TouchableOpacity style={{ backgroundColor: '#CCCCCC', padding: 6, borderRadius: 10, marginTop: 10, maxWidth: 80 }}>
                                <Text style={{ textAlign: 'center' }}>Refer now</Text>
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor }}>Your results are in...</Text>
                    <View style={{ width: '100%', marginTop: 10 }}>
                        <ImageBackground source={require('@/assets/images/ThemeDark.png')} imageStyle={styles.bgImage} style={{ padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
                                <View >
                                    <PercentageBar percentage={75} />
                                </View>
                                <View>
                                    <Text style={{ color: '#fff', fontSize: 20 }}>Good Job!</Text>
                                    <Text style={{ color: '#fff', fontSize: 16, marginTop: 20 }}>Click to see full report.</Text>
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
        fontWeight: 'bold',
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
    },
    nextSession: {
        fontSize: 20,
        fontWeight: 'bold'

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
        fontWeight: 'bold',
        color: '#fff',
    },
    groupImage: {
        position: 'absolute',
        bottom: -40,
        right: -20,
    }
})