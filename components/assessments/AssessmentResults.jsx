import { Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');

const RATINGS = [
    { id: 1, title: 'Personal Qualities', score: '9/10', percentage: 90, emoji: '🌟' },
    { id: 2, title: 'Delivery Qualities', score: '8/10', percentage: 80, emoji: '⚡' },
    { id: 3, title: 'Coaching Standards', score: '9/10', percentage: 90, emoji: '📋' },
    { id: 4, title: 'Educational Quality', score: '8/10', percentage: 80, emoji: '🎓' },
    { id: 5, title: 'Session Structure', score: '9/10', percentage: 90, emoji: '⏱️' },
];

const COLORS = {
    light: {
        background: '#F9FAFB',
        headerTitle: '#111827',
        icon: '#111827',
        cardBackground: '#fff',
        cardBorder: '#E5E7EB',
        text: '#1F2937',
        textSecondary: '#4B5563',
        textMuted: '#9CA3AF',
        progressTrack: '#E5E7EB',
        progressFill: '#3B82F6',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        headerTitle: '#F9FAFB',
        icon: '#F9FAFB',
        cardBackground: '#1F2937',
        cardBorder: '#374151',
        text: '#F3F4F6',
        textSecondary: '#9CA3AF',
        textMuted: '#6B7280',
        progressTrack: '#374151',
        progressFill: '#60A5FA',
        success: '#34D399',
        warning: '#FBBF24',
        danger: '#F87171',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function AssessmentResults({ onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [playbackSound, setPlaybackSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Clean up sounds on unmount
    useEffect(() => {
        return () => {
            if (playbackSound) {
                playbackSound.unloadAsync();
            }
        };
    }, [playbackSound]);

    async function playAudio() {
        try {
            if (playbackSound) {
                await playbackSound.unloadAsync();
            }

            // Using a demo audio link for mock playback
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
                { shouldPlay: true }
            );

            setPlaybackSound(sound);
            setIsPlaying(true);

            sound.setOnPlaybackStatusUpdate((statusUpdate) => {
                if (statusUpdate.didJustFinish) {
                    setIsPlaying(false);
                }
            });
        } catch (err) {
            console.error('Failed to play audio', err);
        }
    }

    async function stopPlayback() {
        if (playbackSound) {
            await playbackSound.stopAsync();
            setIsPlaying(false);
        }
    }

    const strokeWidth = 14;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const percentage = 86; // Overall Average
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Observation Results</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Meta details card */}
                <View style={styles.metaCard}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
                        <Text style={styles.metaLabel}>Date</Text>
                        <Text style={styles.metaValue}>Sat 3rd Apr</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <Text style={styles.metaLabel}>Time</Text>
                        <Text style={styles.metaValue}>9:30am</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                        <Text style={styles.metaLabel}>Venue</Text>
                        <Text style={styles.metaValue}>Chelsea</Text>
                    </View>
                </View>

                {/* Score Section */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Overall Performance</Text>
                    <View style={styles.progressCircleContainer}>
                        <Svg width={200} height={200} viewBox="0 0 200 200">
                            <Circle cx="100" cy="100" r={radius} stroke={theme.progressTrack} strokeWidth={strokeWidth} fill="none" />
                            <Circle
                                cx="100"
                                cy="100"
                                r={radius}
                                stroke={theme.success}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 100 100)"
                            />
                        </Svg>
                        <View style={styles.progressCircleTextOverlay}>
                            <Text style={styles.progressCircleValue}>{percentage}%</Text>
                            <Text style={styles.progressCircleLabel}>Grade Score</Text>
                        </View>
                    </View>
                </View>

                {/* Feedback Player */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Voice Feedback</Text>
                    <Text style={styles.cardDescription}>Listen to your manager's recorded summary and guidance.</Text>
                    <View style={styles.audioPlayerContainer}>
                        <TouchableOpacity onPress={isPlaying ? stopPlayback : playAudio} style={styles.playButton}>
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={styles.audioText}>Manager Voice Note</Text>
                            <Text style={styles.audioSubText}>{isPlaying ? 'Playing feedback...' : 'Tap to listen'}</Text>
                        </View>
                        <Ionicons name="volume-high-outline" size={24} color={theme.textSecondary} />
                    </View>
                </View>

                {/* Written AI Feedback */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Observations & Summary</Text>
                    <View style={styles.feedbackSection}>
                        <View style={styles.feedbackBlock}>
                            <View style={styles.badgeSuccess}>
                                <Text style={styles.badgeText}>POSITIVES</Text>
                            </View>
                            <Text style={styles.feedbackText}>
                                Great energy right from the warmup. Engaged very well with the children and kept them focused. Excellent control of the layout and clear instructions.
                            </Text>
                        </View>
                        <View style={styles.feedbackBlock}>
                            <View style={styles.badgeDanger}>
                                <Text style={styles.badgeText}>IMPROVEMENTS</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Ionicons name="arrow-forward" size={16} color={theme.danger} style={{ marginTop: 2, marginRight: 8 }} />
                                <Text style={styles.feedbackText}>Project voice more clearly when the outdoor venue has high ambient noise.</Text>
                            </View>
                            <View style={styles.bulletItem}>
                                <Ionicons name="arrow-forward" size={16} color={theme.danger} style={{ marginTop: 2, marginRight: 8 }} />
                                <Text style={styles.feedbackText}>Improve transition speed between the main exercise and the cool down.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Scoring Breakdown */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Criteria breakdown</Text>
                    <View style={styles.ratingsList}>
                        {RATINGS.map(item => (
                            <View key={item.id} style={styles.ratingRow}>
                                <View style={styles.ratingHeader}>
                                    <Text style={styles.ratingEmoji}>{item.emoji}</Text>
                                    <Text style={styles.ratingTitle}>{item.title}</Text>
                                    <Text style={styles.ratingScore}>{item.score}</Text>
                                </View>
                                <View style={styles.linearProgressContainer}>
                                    <View style={[styles.linearProgressFill, { width: `${item.percentage}%`, backgroundColor: theme.progressFill }]} />
                                </View>
                            </View>
                        ))}
                    </View>
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
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: theme.cardBackground,
        borderBottomWidth: 1,
        borderColor: theme.cardBorder,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
        marginLeft: 16,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    metaCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    metaItem: {
        flex: 1,
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 12,
        fontFamily: 'Urbanist_500Medium',
        color: theme.textSecondary,
        marginTop: 4,
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
    },
    card: {
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
        marginBottom: 16,
    },
    cardDescription: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textSecondary,
        marginBottom: 16,
    },
    progressCircleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 10,
    },
    progressCircleTextOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressCircleValue: {
        fontSize: 40,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
    },
    progressCircleLabel: {
        fontSize: 12,
        fontFamily: 'Urbanist_500Medium',
        color: theme.textSecondary,
        marginTop: 2,
    },
    audioPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.cardBorder,
    },
    playButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioText: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
    },
    audioSubText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textSecondary,
        marginTop: 2,
    },
    feedbackSection: {
        gap: 20,
    },
    feedbackBlock: {
        alignItems: 'flex-start',
    },
    badgeSuccess: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    badgeDanger: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 11,
        fontFamily: 'Urbanist_700Bold',
        letterSpacing: 1,
    },
    feedbackText: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textSecondary,
        lineHeight: 20,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    ratingsList: {
        gap: 16,
    },
    ratingRow: {
        width: '100%',
    },
    ratingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingEmoji: {
        fontSize: 18,
        marginRight: 8,
    },
    ratingTitle: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.textSecondary,
        flex: 1,
    },
    ratingScore: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
    },
    linearProgressContainer: {
        height: 6,
        backgroundColor: theme.progressTrack,
        borderRadius: 3,
        overflow: 'hidden',
    },
    linearProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
});