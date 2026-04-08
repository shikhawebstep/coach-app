import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IssueReport({ onBack }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>3rd April 2023</Text>
                </View>
                <TouchableOpacity style={styles.solvedButton}>
                    <Text style={styles.solvedText}>Solved</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Stats Card */}
                <View style={styles.card}>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                            <Ionicons name="calendar-outline" size={14} color="#666" style={styles.cardIcon} />
                            <Text style={styles.cardLabel}>Date</Text>
                        </View>
                        <Text style={styles.cardValue}>Sat 3rd Apr</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                            <Ionicons name="time-outline" size={14} color="#666" style={styles.cardIcon} />
                            <Text style={styles.cardLabel}>Time</Text>
                        </View>
                        <Text style={styles.cardValue}>9:30am</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                            <Ionicons name="list-outline" size={14} color="#666" style={styles.cardIcon} />
                            <Text style={styles.cardLabel}>Category</Text>
                        </View>
                        <Text style={styles.cardValue}>Equipment</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                            <Ionicons name="location-outline" size={14} color="#666" style={styles.cardIcon} />
                            <Text style={styles.cardLabel}>Venue</Text>
                        </View>
                        <Text style={styles.cardValue}>Chelsea</Text>
                    </View>
                </View>

                {/* Report Content */}
                <Text style={styles.reportTitle}>Report issue</Text>
                <Text style={styles.reportDescription}>
                    Not enough footballs in chelsea. We have 10 missing.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    solvedButton: {
        backgroundColor: '#1CAB4B', // Green
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    solvedText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardItem: {
        flex: 1,
    },
    cardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardIcon: {
        marginRight: 4,
    },
    cardLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    cardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280', // Lighter grey bold title
        marginBottom: 12,
    },
    reportDescription: {
        fontSize: 16,
        color: '#1a1a1a',
        lineHeight: 24,
    },
});
