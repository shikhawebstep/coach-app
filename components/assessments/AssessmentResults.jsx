import { Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const RATINGS = [
    { id: 1, title: 'Coaching Quality', score: '9/10', percentage: 90, emoji: '🤩' },
    { id: 2, title: 'Venue Facilities', score: '8/10', percentage: 80, emoji: '🤩' },
    { id: 3, title: 'Coaches', score: '9/10', percentage: 90, emoji: '🤩' },
    { id: 4, title: 'Progress', score: '8/10', percentage: 80, emoji: '🤩' },
    { id: 5, title: 'Communication', score: '9/10', percentage: 90, emoji: '🤩' },
    { id: 6, title: 'Communication', score: '8/10', percentage: 80, emoji: '🤩' }, // duplicate shown in mock
];

const COLORS = {
    light: {
        background: '#fff',
        headerTitle: '#1a1a1a',
        icon: '#1a1a1a',
        cardBackground: '#fff',
        cardBorder: '#F9FAFB',
        metaLabel: '#6B7280',
        metaValue: '#1a1a1a',
        metaIcon: '#6B7280',
        progressTrack: '#E5E7EB',
        progressFill: '#1CAB4B',
        progressValue: '#1a1a1a',
        progressLabel: '#9CA3AF',
        ratingTitle: '#9CA3AF',
        ratingScore: '#1a1a1a',
        linearTrack: '#E5E7EB',
        linearFill: '#1CAB4B',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        headerTitle: '#F5F5F5',
        icon: '#F5F5F5',
        cardBackground: '#1E1E1E',
        cardBorder: '#2A2A2A',
        metaLabel: '#9CA3AF',
        metaValue: '#F5F5F5',
        metaIcon: '#9CA3AF',
        progressTrack: '#2A2A2A',
        progressFill: '#22C55E',
        progressValue: '#F5F5F5',
        progressLabel: '#9CA3AF',
        ratingTitle: '#9CA3AF',
        ratingScore: '#F5F5F5',
        linearTrack: '#2A2A2A',
        linearFill: '#22C55E',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function AssessmentResults({ onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    // Large center ring properties
    const strokeWidth = 14;
    const radius = 80; // Size of circular progress bar
    const circumference = 2 * Math.PI * radius; // Approx 502
    const percentage = 90; // mock data
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Results</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Meta details card */}
                <View style={styles.metaCard}>
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="calendar-outline" size={14} color={theme.metaIcon} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Date</Text>
                        </View>
                        <Text style={styles.metaValue}>Sat 3rd Apr</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="time-outline" size={14} color={theme.metaIcon} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Time</Text>
                        </View>
                        <Text style={styles.metaValue}>9:30am</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="person-outline" size={14} color={theme.metaIcon} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Students</Text>
                        </View>
                        <Text style={styles.metaValue}>20</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <View style={styles.metaIconRow}>
                            <Ionicons name="location-outline" size={14} color={theme.metaIcon} style={styles.metaIcon} />
                            <Text style={styles.metaLabel}>Venue</Text>
                        </View>
                        <Text style={styles.metaValue}>Chelsea</Text>
                    </View>
                </View>

                {/* Big Circle Progress Bar */}
                <View style={styles.progressCircleContainer}>
                    <Svg width={200} height={200} viewBox="0 0 200 200">
                        {/* Background track circle */}
                        <Circle cx="100" cy="100" r={radius} stroke={theme.progressTrack} strokeWidth={strokeWidth} fill="none" />

                        {/* Foreground fill circle */}
                        <Circle
                            cx="100"
                            cy="100"
                            r={radius}
                            stroke={theme.progressFill}
                            strokeWidth={strokeWidth}
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                        />
                    </Svg>
                    {/* Circle Text Content Overlay */}
                    <View style={styles.progressCircleTextOverlay}>
                        <Text style={styles.progressCircleValue}>90%</Text>
                        <Text style={styles.progressCircleLabel}>Overall percentage</Text>
                    </View>
                </View>

                {/* 2-Column Ratings Grid */}
                <View style={styles.ratingsGrid}>
                    {RATINGS.map(item => (
                        <View key={item.id} style={styles.ratingCard}>
                            <View style={styles.ratingHeader}>
                                <Text style={styles.ratingTitle}>{item.title}</Text>
                                <Text style={styles.ratingEmoji}>{item.emoji}</Text>
                            </View>
                            <Text style={styles.ratingScore}>{item.score}</Text>

                            {/* Linear Progress Bar below */}
                            <View style={styles.linearProgressContainer}>
                                <View style={[styles.linearProgressFill, { width: `${item.percentage}%` }]} />
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ height: 40 }} />
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
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.headerTitle,
    },
    content: {
        paddingHorizontal: 16,
    },
    metaCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    metaItem: {
        flex: 1,
    },
    metaIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    metaIcon: {
        marginRight: 4,
    },
    metaLabel: {
        fontSize: 12,
        color: theme.metaLabel,
        fontWeight: 'bold',
    },
    metaValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: theme.metaValue,
    },
    progressCircleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    progressCircleTextOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressCircleValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.progressValue,
    },
    progressCircleLabel: {
        fontSize: 14,
        color: theme.progressLabel,
        marginTop: 4,
    },
    ratingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    ratingCard: {
        width: '48%', // two columns
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    ratingTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.ratingTitle,
        flex: 1,
        paddingRight: 8,
    },
    ratingEmoji: {
        fontSize: 24,
    },
    ratingScore: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.ratingScore,
        marginBottom: 14,
    },
    linearProgressContainer: {
        height: 6,
        backgroundColor: theme.linearTrack,
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
    },
    linearProgressFill: {
        height: '100%',
        backgroundColor: theme.linearFill,
        borderRadius: 3,
    },
});