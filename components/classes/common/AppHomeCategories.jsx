import { LuckiestGuy_400Regular, useFonts } from "@expo-google-fonts/luckiest-guy";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const CATEGORIES = [
    {
        id: 'weekly',
        title: 'WEEKLY\nCLASSES',
        image: require('../../../assets/images/weekly.png'),
        large: true
    },
    {
        id: 'private',
        title: 'PRIVATE\nCLASSES',
        image: require('../../../assets/images/private.png'),
    },
    {
        id: 'holiday',
        title: 'HOLIDAY\nCAMPS',
        image: require('../../../assets/images/holiday (2).png'),
    },
    {
        id: 'birthday',
        title: 'BIRTHDAY\nPARTIES',
        image: require('../../../assets/images/bdy.png'),
    },
    {
        id: 'club',
        title: 'CLUB',
        image: require('../../../assets/images/club.png'),
        labelOnly: true
    }
];



export default function AppHomeCategories({ onCategorySelect }) {
    const [fontsLoaded] = useFonts({
        LuckiestGuy_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Large Top Banner */}
                <TouchableOpacity
                    style={[styles.card, styles.largeCard]}
                    onPress={() => onCategorySelect && onCategorySelect(CATEGORIES[0].id)}
                >
                    <Image source={CATEGORIES[0].image} style={styles.cardImage} />                    {/* Shadow overlay for text readability */}
                    <View style={styles.overlay} />
                    <View style={styles.cardContent}>
                        <Text style={styles.largeCardTitle}>{CATEGORIES[0].title}</Text>
                        <View style={styles.viewBadge}>
                            <Text style={styles.viewBadgeText}>View</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 2x2 Grid Layout below */}
                <View style={styles.gridContainer}>
                    {CATEGORIES.slice(1).map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.card, styles.gridCard]}
                            onPress={() => onCategorySelect && onCategorySelect(item.id)}
                        >
                            <Image source={item.image} style={styles.cardImage} />
                            <View style={styles.overlay} />
                            <View style={styles.cardContent}>
                                <Text style={item.labelOnly ? styles.singleLineTitle : styles.gridCardTitle}>
                                    {item.title}
                                </Text>
                                <View style={styles.viewBadge}>
                                    <Text style={styles.viewBadgeText}>View</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 16,
    },
    largeCard: {
        width: '100%',
        height: 220,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridCard: {
        width: '48%', // Approx half with spacing
        height: 200,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)', // Light overlay to ensure white text pops
    },
    cardContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    largeCardTitle: {
        fontSize: 32,
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#fff',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
        marginBottom: 16,
    },

    gridCardTitle: {
        fontSize: 24,
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#fff',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
        marginBottom: 16,
    },

    singleLineTitle: {
        fontSize: 26,
        fontFamily: 'LuckiestGuy_400Regular',
        color: '#fff',
        textTransform: 'uppercase',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 6,
        marginBottom: 16,
        letterSpacing: 1,
    },
    viewBadge: {
        backgroundColor: '#FBBF24', // Amber/Yellow
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
    },
    viewBadgeText: {
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'Urbanist-Bold',

        color: '#1a1a1a',
    },
});
