import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SESSION_ITEMS = [
    {
        id: 1,
        title: 'Small-sided games',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')

    },
    {
        id: 2,
        title: 'Introduction (Head coach)',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '2 mins',
        image: require('../../../assets/images/skill.png')

    },
    {
        id: 3,
        title: 'Warm up activity',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')

    },
    {
        id: 4,
        title: 'Technical exercise',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '12 mins',
        image: require('../../../assets/images/skill.png')

    },
];

export default function ClubSyllabus({ onBack, onSessionSelect, title = "Session 1 plan" }) {
    return (
        <View style={styles.container}>
            {/* Green Header */}
            <View style={styles.greenHeaderContainer}>
                <View style={styles.greenHeader}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={{ width: 24 }} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Banner Section */}
                <View style={styles.bannerContainer}>
                    <Image source={require('../../../assets/images/fundamental.png')} style={styles.bannerImage} />
                </View>

                {/* Session Plan Header */}
                <View style={styles.sessionHeaderRow}>
                    <View style={styles.sessionHeaderLeft}>
                        <Text style={styles.sessionTitle}>Session Plan</Text>
                        <Ionicons name="time-outline" size={16} color="#9CA3AF" style={styles.timeIcon} />
                        <Text style={styles.totalTime}>4 Hours</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="download-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Session List */}
                {SESSION_ITEMS.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.sessionCard}
                        onPress={() => onSessionSelect && onSessionSelect(item.id)}
                    >
                        <View style={styles.imagePlaceholder}>
                            <Image source={item.image} style={styles.mapImage} resizeMode="contain" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                            <Text style={styles.cardTime}>{item.time}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    greenHeaderContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 16,
    },
    greenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1CAB4B',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    bannerContainer: {
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    sessionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sessionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 12,
    },
    timeIcon: {
        marginRight: 4,
        marginTop: 2,
    },
    totalTime: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    sessionCard: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 140,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        marginRight: 16,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 8,
    },
    cardTime: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
});
