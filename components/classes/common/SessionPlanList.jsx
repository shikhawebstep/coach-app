import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SESSION_ITEMS = [
    {
        id: 1,
        title: 'Small-side games',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '10 mins',
        image: 'https://via.placeholder.com/140x90/86efac/ffffff?text=Small-side+games'
    },
    {
        id: 2,
        title: 'Introduction (Head coach)',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '2 mins',
        image: 'https://via.placeholder.com/140x90/a78bfa/ffffff?text=Introduction'
    },
    {
        id: 3,
        title: 'Warm up activity',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '10 mins',
        image: 'https://via.placeholder.com/140x90/86efac/ffffff?text=Warm+up'
    },
    {
        id: 4,
        title: 'Technical exercise',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '12 mins',
        image: 'https://via.placeholder.com/140x90/86efac/ffffff?text=Technical'
    },
];

export default function SessionPlanList({ onBack, onSessionSelect }) {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Green Header Area */}
                <View style={styles.greenHeaderContainer}>
                    <View style={styles.greenHeader}>
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Session 1 plan</Text>
                        <View style={{ width: 24 }} /> {/* Spacer */}
                    </View>
                </View>

                {/* Banner Image */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/800x200/F59E0B/ffffff?text=THE+FUNDAMENTALS' }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Session Header Section */}
                <View style={styles.sessionPlanRow}>
                    <View style={styles.sessionPlanLeft}>
                        <Text style={styles.sessionPlanTitle}>Session Plan</Text>
                        <View style={styles.timeTag}>
                            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                            <Text style={styles.timeTagText}>4 Hours</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.downloadBtn}>
                        <Ionicons name="download-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Session Cards */}
                <View style={styles.sessionList}>
                    {SESSION_ITEMS.map((item, index) => (
                        <TouchableOpacity 
                            key={`${item.id}-${index}`} 
                            style={styles.sessionCard}
                            onPress={() => onSessionSelect && onSessionSelect(item.id)}
                        >
                            <View style={styles.imagePlaceholder}>
                                <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                                <Text style={styles.cardTime}>{item.time}</Text>
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
        paddingBottom: 40,
    },
    greenHeaderContainer: {
        marginBottom: 16,
    },
    greenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#22c55e', // Solid Green
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    bannerContainer: {
        width: '100%',
        height: 120, // Rectangular banner
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    sessionPlanRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    sessionPlanLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionPlanTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 12,
    },
    timeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    timeTagText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    downloadBtn: {
        padding: 4,
    },
    sessionList: {
        marginTop: 4,
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
        justifyContent: 'center',
        paddingVertical: 2,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 8,
    },
    cardTime: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
});
