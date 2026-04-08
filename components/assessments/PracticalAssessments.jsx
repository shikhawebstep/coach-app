import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ASSESSMENTS_DATA = [
    {
        id: 1,
        name: 'John Smith',
        date: '3rd April 2023',
        time: '10:30-11:30am',
        venue: 'Acton',
        status: 'Start'
    },
    {
        id: 2,
        name: 'Abdul Ali',
        date: '3rd April 2023',
        time: '10:30-11:30am',
        venue: 'Acton',
        status: 'Complete'
    }
];

export default function PracticalAssessments({ onBack, onStart }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Practical Assessments</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {ASSESSMENTS_DATA.map(assessment => (
                    <TouchableOpacity 
                        key={assessment.id} 
                        style={styles.card}
                        onPress={assessment.status === 'Start' ? onStart : undefined}
                    >

                        <View style={styles.infoCol}>
                            <Text style={styles.name}>{assessment.name}</Text>
                        </View>

                        <View style={styles.dateTimeCol}>
                            <Text style={styles.dateTime}>{assessment.date}</Text>
                            <Text style={styles.dateTime}>{assessment.time}</Text>
                        </View>

                        <View style={styles.venueCol}>
                            <Text style={styles.venue}>{assessment.venue}</Text>
                        </View>

                        <View style={styles.actionCol}>
                            <TouchableOpacity
                                style={[
                                    styles.actionBtn,
                                    assessment.status === 'Start' ? styles.btnStart : styles.btnComplete
                                ]}
                            >
                                <Text style={styles.actionBtnText}>{assessment.status}</Text>
                            </TouchableOpacity>
                            <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoCol: {
        flex: 1.2,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    dateTimeCol: {
        flex: 1.5,
    },
    dateTime: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    venueCol: {
        flex: 1,
    },
    venue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    actionCol: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.5,
        justifyContent: 'flex-end',
    },
    actionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    btnStart: {
        backgroundColor: '#3B82F6', // Blue
    },
    btnComplete: {
        backgroundColor: '#1CAB4B', // Green
    },
    actionBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    chevron: {
        marginLeft: 8,
    },
});
