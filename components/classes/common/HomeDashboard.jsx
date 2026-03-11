import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeDashboard() {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Greeting */}
                <View style={styles.greetingRow}>
                    <Image source={{ uri: 'https://via.placeholder.com/60/cccccc/ffffff?text=U' }} style={styles.profilePic} />
                    <Text style={styles.greetingText}>
                        Morning, <Text style={styles.greetingName}>Ethan 👋</Text>
                    </Text>
                </View>

                {/* Your next weekly session... */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your next weekly session...</Text>
                    <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
                </View>

                {/* Main Session Card */}
                <TouchableOpacity style={styles.mainCard}>
                    <Image source={{ uri: 'https://via.placeholder.com/600x300/1CAB4B/ffffff?text=Stadium+Background' }} style={styles.mainCardBg} />
                    <View style={styles.mainCardOverlay} />

                    <View style={styles.mainCardContent}>
                        <Text style={styles.largeHours}>22 HOURS</Text>
                        <Text style={styles.cardInfoTitle}>Kings Cross</Text>
                        <Text style={styles.cardInfoDate}>Sat 23rd April | 9am-10am</Text>
                        <View style={styles.viewBtn}>
                            <Text style={styles.viewBtnText}>View</Text>
                        </View>
                    </View>

                    {/* Placeholder for 3D Boy Image */}
                    <Image
                        source={{ uri: 'https://via.placeholder.com/140x240/transparent/3B82F6?text=3D+Boy' }}
                        style={styles.boyImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* What's coming up... */}
                <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                    <Text style={styles.sectionTitle}>What's coming up...</Text>
                    <TouchableOpacity><Text style={styles.seeAllText}>See full calendar</Text></TouchableOpacity>
                </View>

                {/* Horizontal Events ScrollView */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {/* Card 1 */}
                    <TouchableOpacity style={styles.eventCard}>
                        <Image source={{ uri: 'https://via.placeholder.com/300x400/3B82F6/ffffff?text=Kids+Playing' }} style={styles.eventImage} />
                        <View style={styles.eventOverlay} />
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle}>Birthday Party</Text>
                            <View style={styles.eventRow}>
                                <Text style={styles.eventDate}>10th April</Text>
                                <View style={styles.verticalDivider} />
                                <Text style={styles.eventTime}>10:30-12pm</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Card 2 */}
                    <TouchableOpacity style={styles.eventCard}>
                        <Image source={{ uri: 'https://via.placeholder.com/300x400/EC4899/ffffff?text=Holiday+Camp' }} style={styles.eventImage} />
                        <View style={styles.eventOverlay} />
                        <View style={styles.eventContent}>
                            <Text style={styles.eventTitle}>Holiday Camp</Text>
                            <View style={styles.eventRow}>
                                <Text style={styles.eventDate}>22nd July</Text>
                                <View style={styles.verticalDivider} />
                                <Text style={styles.eventTime}>9am-3pm</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>

                {/* Refer a Coach Banner */}
                <TouchableOpacity style={styles.referBanner}>
                    <View style={styles.referContent}>
                        <Image source={{ uri: 'https://via.placeholder.com/60x60/transparent/ffffff?text=D' }} style={styles.megaphone} />
                        <View style={styles.referTextCol}>
                            <Text style={styles.referTitle}>Refer a Coach</Text>
                            <Text style={styles.referText}>Refer a coach and enjoy £30 on us!</Text>
                            <View style={styles.referBtn}>
                                <Text style={styles.referBtnText}>Refer now</Text>
                            </View>
                        </View>
                    </View>
                    {/* Placeholder for 3D Coach Image */}
                    <Image
                        source={{ uri: 'https://via.placeholder.com/120x160/transparent/3B82F6?text=Coach' }}
                        style={styles.coachImage}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                {/* Your results are in... */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your results are in...</Text>
                </View>

                {/* Results Card */}
                <TouchableOpacity style={styles.resultsCard}>
                    {/* Wavy Background Placeholder */}
                    <Image source={{ uri: 'https://via.placeholder.com/600x200/374151/4B5563?text=Wavy+Pattern' }} style={styles.resultsBg} />

                    <View style={styles.resultsContent}>
                        <View style={styles.chartContainer}>
                            <View style={styles.fakeDonut}>
                                <View style={styles.fakeDonutProgress} />
                                <View style={styles.fakeDonutHole}>
                                    <Text style={styles.chartText}>75%</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.resultsTextContent}>
                            <Text style={styles.resultsTitle}>Good Job!</Text>
                            <Text style={styles.resultsSubtitle}>Click to see full report</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 60 }} />
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
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePic: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    greetingName: {
        color: '#FBBF24', // Yellow color for Ethan
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    seeAllText: {
        fontSize: 14,
        color: '#1CAB4B', // Green
        fontWeight: 'bold',
    },
    mainCard: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        marginBottom: 24,
        position: 'relative',
        backgroundColor: '#E5E7EB',
        zIndex: 1,
    },
    mainCardBg: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        position: 'absolute',
    },
    mainCardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
    },
    mainCardContent: {
        padding: 20,
        justifyContent: 'center',
        height: '100%',
    },
    largeHours: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    cardInfoTitle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    cardInfoDate: {
        fontSize: 12,
        color: '#FCD34D', // Gold/Yellow
        marginBottom: 12,
    },
    viewBtn: {
        backgroundColor: '#FBBF24',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    viewBtnText: {
        fontWeight: 'bold',
        color: '#1a1a1a',
        fontSize: 12,
    },
    boyImage: {
        position: 'absolute',
        right: 10,
        bottom: -20, // Overhanging the bottom slightly
        width: 140,
        height: 200,
        zIndex: 10, // Ensure it sits on top
    },
    horizontalScroll: {
        marginBottom: 24,
        overflow: 'visible',
    },
    eventCard: {
        width: 220,
        height: 240,
        borderRadius: 16,
        marginRight: 16,
        position: 'relative',
        backgroundColor: '#E5E7EB',
    },
    eventImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        position: 'absolute',
    },
    eventOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 16,
    },
    eventContent: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventDate: {
        fontSize: 12,
        color: '#fff', // White date
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    verticalDivider: {
        width: 1,
        height: 12,
        backgroundColor: '#fff',
        marginHorizontal: 8,
    },
    eventTime: {
        fontSize: 12,
        color: '#fff',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    referBanner: {
        width: '100%',
        height: 100,
        backgroundColor: '#2563EB', // Blue
        borderRadius: 12,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        position: 'relative',
        zIndex: 1, // needed for overflowing image
    },
    referContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        zIndex: 2,
    },
    megaphone: {
        width: 48,
        height: 48,
        marginRight: 12,
    },
    referTextCol: {
        flex: 1,
        paddingRight: 60, // Space for coach image
    },
    referTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    referText: {
        fontSize: 12,
        color: '#DBEAFE',
        marginBottom: 6,
    },
    referBtn: {
        backgroundColor: '#FBBF24',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    referBtnText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    coachImage: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 100,
        height: 130, // Taller than banner to overhang top
        zIndex: 3, // On top of text
    },
    resultsCard: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        backgroundColor: '#2d333b',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        marginBottom: 20,
    },
    resultsBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.8,
    },
    resultsContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 2,
    },
    chartContainer: {
        width: 80,
        height: 80,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    fakeDonut: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4B5563', // Background track
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    fakeDonutProgress: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 8,
        borderColor: '#FBBF24',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        transform: [{ rotate: '-45deg' }], // Simulated partial ring
    },
    fakeDonutHole: {
        width: 64, // 80 - 16 (8*2 borders)
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2d333b',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    chartText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    resultsTextContent: {
        flex: 1,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    resultsSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
    },
});
