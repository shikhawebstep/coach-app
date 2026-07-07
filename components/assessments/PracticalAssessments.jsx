import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

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

const COLORS = {
    light: {
        background: '#fff',
        cardBackground: '#fff',
        cardBorder: '#F9FAFB',
        headerTitle: '#1a1a1a',
        name: '#1a1a1a',
        dateTime: '#6B7280',
        venue: '#1a1a1a',
        icon: '#000',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        cardBackground: '#1E1E1E',
        cardBorder: '#2A2A2A',
        headerTitle: '#F5F5F5',
        name: '#F5F5F5',
        dateTime: '#9CA3AF',
        venue: '#F5F5F5',
        icon: '#F5F5F5',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function PracticalAssessments({ onBack, onStart }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
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
                            <Ionicons name="chevron-forward" size={20} color={theme.icon} style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
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
        fontSize: 26,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    infoCol: {
        flex: 1.2,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.name,
    },
    dateTimeCol: {
        flex: 1.5,
    },
    dateTime: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.dateTime,
        lineHeight: 18,
    },
    venueCol: {
        flex: 1,
    },
    venue: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.venue,
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
        width: 85,
    },
    btnStart: {
        backgroundColor: '#3B82F6',
    },
    btnComplete: {
        backgroundColor: '#1CAB4B',
    },
    actionBtnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
    },
    chevron: {
        marginLeft: 8,
    },
});