import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { buildRatingsBreakdown, calculateOverallPercentage } from './Assessmentcriteria.constants';

const { width } = Dimensions.get('window');

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

// All data is now passed in via props from the practical-assessment flow —
// no more hardcoded "Chelsea" / "Sat 3rd Apr" / mock RATINGS array.
//
// Props:
//   assessment: { name, date, time, venue }   — from PracticalAssessments
//   ratings:    { punctuality: 1-5, communicationSkills: 1-5, ... }  — from AssessmentCriteria
//   video:      DocumentPicker asset { name, size, uri } | null      — from UploadVideo
//   notes:      string                                               — from UploadVideo
//   audioUri:   string | null                                        — from SummarisePerformance
//   decision:   'pass' | 'fail'                                      — from AssessmentDecision
export default function AssessmentResults({ onBack, assessment, ratings = {}, video, notes, audioUri, decision }) {
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
        if (!audioUri) return;
        try {
            if (playbackSound) {
                await playbackSound.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: audioUri },
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

    const ratingsBreakdown = buildRatingsBreakdown(ratings);
    const percentage = calculateOverallPercentage(ratings);

    const strokeWidth = 14;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const isPass = decision === 'pass';
    const isFail = decision === 'fail';

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
                        <Text style={styles.metaValue}>{assessment?.date || '—'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                        <Text style={styles.metaLabel}>Time</Text>
                        <Text style={styles.metaValue}>{assessment?.time || '—'}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                        <Text style={styles.metaLabel}>Venue</Text>
                        <Text style={styles.metaValue}>{assessment?.venue || '—'}</Text>
                    </View>
                </View>

                {/* Decision badge */}
                {decision && (
                    <View
                        style={[
                            styles.decisionBadge,
                            { backgroundColor: isPass ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' },
                        ]}
                    >
                        <Ionicons
                            name={isPass ? 'checkmark-circle' : 'close-circle'}
                            size={18}
                            color={isPass ? theme.success : theme.danger}
                        />
                        <Text style={[styles.decisionBadgeText, { color: isPass ? theme.success : theme.danger }]}>
                            {isPass ? 'Passed' : 'Failed'}
                        </Text>
                    </View>
                )}

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
                                stroke={isFail ? theme.danger : theme.success}
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

                {/* Session Video */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Session Video</Text>
                    {video ? (
                        <View style={styles.videoRow}>
                            <TouchableOpacity style={styles.playButton}>
                                <Ionicons name="play" size={22} color="#fff" />
                            </TouchableOpacity>
                            <View style={{ flex: 1, marginLeft: 16 }}>
                                <Text style={styles.audioText} numberOfLines={1}>{video.name}</Text>
                                <Text style={styles.audioSubText}>Tap to watch video</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.emptyStateText}>No video was uploaded for this assessment.</Text>
                    )}
                </View>

                {/* Voice Feedback */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Voice Feedback</Text>
                    {audioUri ? (
                        <>
                            <Text style={styles.cardDescription}>Listen to the assessor's recorded summary.</Text>
                            <View style={styles.audioPlayerContainer}>
                                <TouchableOpacity onPress={isPlaying ? stopPlayback : playAudio} style={styles.playButton}>
                                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
                                </TouchableOpacity>
                                <View style={{ flex: 1, marginLeft: 16 }}>
                                    <Text style={styles.audioText}>Assessor Voice Note</Text>
                                    <Text style={styles.audioSubText}>{isPlaying ? 'Playing feedback...' : 'Tap to listen'}</Text>
                                </View>
                                <Ionicons name="volume-high-outline" size={24} color={theme.textSecondary} />
                            </View>
                        </>
                    ) : (
                        <Text style={styles.emptyStateText}>No voice summary was recorded for this assessment.</Text>
                    )}
                </View>

                {/* Notes */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Assessor Notes</Text>
                    {notes ? (
                        <Text style={styles.feedbackText}>{notes}</Text>
                    ) : (
                        <Text style={styles.emptyStateText}>No notes were added for this assessment.</Text>
                    )}
                </View>

                {/* Scoring Breakdown */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Criteria breakdown</Text>
                    <View style={styles.ratingsList}>
                        {ratingsBreakdown.map(item => (
                            <View key={item.id} style={styles.ratingRow}>
                                <View style={styles.ratingHeader}>
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
        marginBottom: 16,
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
    decisionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    decisionBadgeText: {
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
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
    emptyStateText: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textMuted,
        fontStyle: 'italic',
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
    videoRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    feedbackText: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textSecondary,
        lineHeight: 20,
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