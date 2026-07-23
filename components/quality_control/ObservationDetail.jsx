// ObservationDetail.js
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

// ─── Palette ────────────────────────────────────────────────────────────────
const LIGHT = {
    background: '#F5F4F0',
    headerTitle: '#12141C',
    cardBg: '#FFFFFF',
    cardBorder: '#ECEAE4',
    labelText: '#3654F0',
    valueText: '#171922',
    backIcon: '#171922',
    backBg: '#FFFFFF',
    icon: '#171922',
    primary: '#3654F0',
    primaryTint: '#EAEEFF',
    error: '#E5484D',
    errorTint: '#FDECEC',
    success: '#16A34A',
    successTint: '#E7F8EC',
    warning: '#DB8A00',
    warningTint: '#FEF3E0',
    gold: '#DB8A00',
    divider: '#EFEDE7',
    shadowColor: '#161821',
    shadowOpacity: 0.06,
    trackBg: '#E8E6E0',
    gradientStart: '#3654F0',
    gradientEnd: '#7B5CFA',
    onGradientText: '#FFFFFF',
    onGradientSubtext: 'rgba(255,255,255,0.78)',
    onGradientChipBg: 'rgba(255,255,255,0.16)',
};

const DARK = {
    background: '#0B0C10',
    headerTitle: '#F5F5F7',
    cardBg: '#17181D',
    cardBorder: '#25262C',
    labelText: '#3654F0',
    valueText: '#F5F5F7',
    backIcon: '#F5F5F7',
    backBg: '#17181D',
    icon: '#F5F5F7',
    primary: '#8FA0FF',
    primaryTint: 'rgba(143,160,255,0.15)',
    error: '#FF6B6F',
    errorTint: 'rgba(255,107,111,0.12)',
    success: '#3DDC84',
    successTint: 'rgba(61,220,132,0.15)',
    warning: '#FFC24B',
    warningTint: 'rgba(255,194,75,0.15)',
    gold: '#FFC24B',
    divider: '#25262C',
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    trackBg: '#2A2B31',
    gradientStart: '#3B4FC0',
    gradientEnd: '#6A4FD9',
    onGradientText: '#FFFFFF',
    onGradientSubtext: 'rgba(255,255,255,0.75)',
    onGradientChipBg: 'rgba(255,255,255,0.14)',
};

// SAMBA criteria — reference only now, the venue manager doesn't score each
// one individually anymore, just gives one overall grade out of 10. Kept in
// sync with the create-report screen's CRITERIA list.
const CRITERIA = [
    { L: 'S', name: 'Structure', sub: 'Intro, main body, conclusion' },
    { L: 'E', name: 'Educational Impact', sub: 'Did the kids actually learn?' },
    { L: 'E', name: 'Engagement', sub: 'Active, enjoying · body language, command, confidence' },
    { L: 'D', name: 'Discipline & Group Mgmt', sub: 'Control & organisation' },
    { L: 'A', name: 'Age-Specific Communication', sub: 'Pitched to their stage of development' },
    { L: 'S', name: 'Safety & Set-up', sub: 'Safe & intentional setup' },
    { L: '✓', name: 'Adherence to Session Plan', sub: 'Delivered the plan as set', extra: true },
    { L: '★', name: 'Road to Rio Integration', sub: 'Journey, players & badges woven in', extra: true },
];

const getStatusMeta = (status, colors) => {
    switch ((status || '').toLowerCase()) {
        case 'completed':
        case 'reviewed':
            return { color: colors.success, tint: colors.successTint, icon: 'checkmark-circle' };
        case 'pending':
        case 'in_progress':
            return { color: colors.warning, tint: colors.warningTint, icon: 'time' };
        default:
            return { color: colors.labelText, tint: colors.cardBorder, icon: 'ellipse' };
    }
};

// ⚠️ Grade colour now keyed off /10, matches the create-report screen's gradeColour().
const getGradeColor = (grade, colors) => {
    const v = Number(grade) || 0;
    if (v >= 9) return colors.success;
    if (v >= 7) return colors.success;
    if (v >= 5) return colors.warning;
    return colors.error;
};

const formatDateTime = (isoString) => {
    if (!isoString) return '-';
    try {
        const d = new Date(isoString);
        const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return `${date} • ${time}`;
    } catch {
        return '-';
    }
};

// positives/areasForImprovement now both come back as JSON-stringified arrays
// (the report screen sends { positives: [...], areasForImprovement: [...] })
const parseList = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
        return [String(raw)];
    }
};

const fmtSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

// Deterministic pseudo-waveform bar heights (purely decorative, stable across renders).
const WAVEFORM_BAR_COUNT = 40;
const buildWaveform = () => {
    const bars = [];
    for (let i = 0; i < WAVEFORM_BAR_COUNT; i++) {
        const wave = Math.sin(i * 0.7) * 0.5 + Math.sin(i * 0.35) * 0.3;
        const height = 6 + Math.abs(wave) * 18;
        bars.push(height);
    }
    return bars;
};

export default function ObservationDetail({ observationId, onBack }) {
    const [observation, setObservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ─── Voice note playback state ───────────────────────────────────────────
    const soundRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? DARK : LIGHT;
    const styles = createStyles(colors);
    const waveform = useMemo(buildWaveform, []);

    const { token } = useAuth();

    useEffect(() => {
        fetchObservationDetail();
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, [observationId]);

    const fetchObservationDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/observation/${observationId}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token || ''}` },
                    redirect: 'follow',
                }
            );

            const result = await response.json().catch(() => ({}));

            if (response.ok && result?.data) {
                setObservation(result.data);
            } else {
                setError(result?.message || 'Failed to load observation details.');
            }
        } catch (err) {
            console.error('Failed to fetch observation detail:', err);
            setError('Something went wrong while loading this report.');
        } finally {
            setLoading(false);
        }
    };

    const [isReviewing, setIsReviewing] = useState(false);
    const [isReviewed, setIsReviewed] = useState(false);

    const handleMarkReviewed = async () => {
        if (!observationId) return;
        try {
            setIsReviewing(true);
            const myHeaders = new Headers();
            if (token) {
                myHeaders.append("Authorization", `Bearer ${token}`);
            }

            const requestOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: "",
                redirect: "follow"
            };

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/observation/${observationId}/mark-reviewed`,
                requestOptions
            );

            const resultText = await response.text();

            let json = {};
            try { json = JSON.parse(resultText); } catch (_) { }

            if (response.ok) {
                setObservation(prev => prev ? { ...prev, status: 'reviewed' } : prev);
                setIsReviewed(true);
                Alert.alert("Success", "Report marked as reviewed.");
            } else {
                Alert.alert("Error", json?.message || "Failed to mark report as reviewed.");
            }
        } catch (err) {
            console.error("Error marking report as reviewed:", err);
            Alert.alert("Error", "Something went wrong while updating status.");
        } finally {
            setIsReviewing(false);
        }
    };

    const togglePlayback = async () => {
        const voiceNoteUrl = observation?.voiceNoteUrl;
        if (!voiceNoteUrl) return;

        try {
            if (soundRef.current) {
                const status = await soundRef.current.getStatusAsync();
                if (status.isPlaying) {
                    await soundRef.current.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await soundRef.current.playAsync();
                    setIsPlaying(true);
                }
                return;
            }

            setIsAudioLoading(true);
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

            const { sound } = await Audio.Sound.createAsync(
                { uri: voiceNoteUrl },
                { shouldPlay: true },
                (status) => {
                    if (!status.isLoaded) return;
                    setPlaybackPosition(status.positionMillis / 1000);
                    setPlaybackDuration((status.durationMillis || 0) / 1000);
                    setIsPlaying(status.isPlaying);
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        sound.setPositionAsync(0);
                    }
                }
            );

            soundRef.current = sound;
            setIsPlaying(true);
        } catch (err) {
            console.error('Failed to play voice note', err);
        } finally {
            setIsAudioLoading(false);
        }
    };

    // ─── Plain header used only for loading / error states ──────────────────
    const PlainHeader = () => (
        <View style={styles.plainHeader}>
            {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color={colors.backIcon} />
                </TouchableOpacity>
            )}
            <Text style={styles.plainHeaderTitle}>Observe & Develop</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <PlainHeader />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </View>
        );
    }

    if (error || !observation) {
        return (
            <View style={styles.container}>
                <PlainHeader />
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={40} color={colors.error} style={{ marginBottom: 12 }} />
                    <Text style={styles.errorText}>{error || 'Report not found.'}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchObservationDetail}>
                        <Text style={styles.retryBtnText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const statusMeta = getStatusMeta(observation.status, colors);
    // ⚠️ ADJUST: field name — matches `overallGrade` sent by the report screen's submitReport().
    const grade = observation.overallGrade ?? observation.grade ?? null;
    const gradeColor = getGradeColor(grade, colors);
    const positives = parseList(observation.positives);
    const improvements = parseList(observation.areasForImprovement);
    const coachName = observation.coach?.name || 'Unknown';
    const coachInitial = coachName.charAt(0).toUpperCase() || '?';
    const playbackFraction = playbackDuration ? Math.min(playbackPosition / playbackDuration, 1) : 0;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* ── Scoreboard hero ─────────────────────────────────────────── */}
                <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroGradient}
                >
                    <View style={styles.heroTopRow}>
                        {onBack && (
                            <TouchableOpacity onPress={onBack} style={styles.heroBackButton}>
                                <Ionicons name="arrow-back" size={20} color={colors.onGradientText} />
                            </TouchableOpacity>
                        )}
                        <View style={[styles.statusBadge, { backgroundColor: colors.onGradientChipBg }]}>
                            <Ionicons name={statusMeta.icon} size={12} color={colors.onGradientText} style={{ marginRight: 4 }} />
                            <Text style={[styles.statusText, { color: colors.onGradientText }]}>
                                {(observation.status || 'unknown').toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.heroCoachRow}>
                        {observation.coach?.profile ? (
                            <Image source={{ uri: observation.coach.profile }} style={styles.avatarImage} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitial}>{coachInitial}</Text>
                            </View>
                        )}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.heroCoachName}>{coachName}</Text>
                            <Text style={styles.heroCoachSub}>
                                {observation.classSchedule?.className || 'Class'} • {observation.venue?.name || '-'}
                            </Text>
                        </View>
                    </View>

                    {/* Single overall grade /10 — replaces the old score%/avg-out-of-5 pair */}
                    <View style={styles.heroGradeRow}>
                        <View>
                            <Text style={styles.heroScoreLabel}>ASSESSOR</Text>
                            <Text style={styles.heroAssessorValue}>{observation.assessor?.name || 'You'}</Text>
                            <Text style={styles.heroScoreCaption}>{formatDateTime(observation.createdAt)}</Text>
                        </View>
                        <View style={[styles.heroGradeChip, { backgroundColor: gradeColor }]}>
                            <Text style={styles.heroGradeValue}>{grade ?? '–'}<Text style={styles.heroGradeUnit}>/10</Text></Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* ── Content sheet ───────────────────────────────────────────── */}
                <View style={styles.sheet}>

                    {/* Session Details */}
                    <View style={[styles.card, styles.accentPrimary]}>
                        <Text style={styles.sectionLabel}>Session Details</Text>
                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: colors.primaryTint }]}>
                                <Ionicons name="time" size={16} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.rowValue}>{observation.classSchedule?.className || '-'}</Text>
                                <Text style={styles.rowSubValue}>
                                    {observation.classSchedule?.startTime || ''} - {observation.classSchedule?.endTime || ''}
                                </Text>
                            </View>
                        </View>
                        <View style={[styles.divider, { marginVertical: 12 }]} />
                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: colors.primaryTint }]}>
                                <Ionicons name="location" size={16} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowValue}>{observation.venue?.name || '-'}</Text>
                                {observation.venue?.address && (
                                    <Text style={styles.rowSubValue}>{observation.venue.address}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Voice note player */}
                    {observation.voiceNoteUrl && (
                        <View style={[styles.card, styles.accentPrimary]}>
                            <Text style={styles.sectionLabel}>Voice Note</Text>
                            <View style={styles.playerRow}>
                                <TouchableOpacity
                                    style={styles.playBtn}
                                    onPress={togglePlayback}
                                    activeOpacity={0.85}
                                    disabled={isAudioLoading}
                                >
                                    {isAudioLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#fff" style={!isPlaying ? { marginLeft: 2 } : null} />
                                    )}
                                </TouchableOpacity>

                                <View style={styles.playerTrack}>
                                    <View style={styles.waveformRow}>
                                        {waveform.map((h, idx) => {
                                            const played = idx / waveform.length < playbackFraction;
                                            return (
                                                <View
                                                    key={idx}
                                                    style={[
                                                        styles.waveformBar,
                                                        {
                                                            height: h,
                                                            backgroundColor: played ? colors.primary : colors.trackBg,
                                                        },
                                                    ]}
                                                />
                                            );
                                        })}
                                    </View>
                                    <Text style={styles.playerTime}>
                                        {fmtSeconds(playbackPosition)} / {fmtSeconds(playbackDuration)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Positives — now a list (max 2), matches the AI-drafted line items */}
                    <View style={[styles.card, styles.accentSuccess]}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>What's Working</Text>
                        </View>
                        {positives.length > 0 ? (
                            positives.map((point, idx) => (
                                <View key={idx} style={styles.bulletRow}>
                                    <View style={[styles.bulletDot, { backgroundColor: colors.success }]} />
                                    <Text style={styles.bulletText}>{point}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.descriptionText}>No notes provided.</Text>
                        )}
                    </View>

                    {/* Areas for Improvement */}
                    <View style={[styles.card, styles.accentWarning]}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>Improvements</Text>
                        </View>
                        {improvements.length > 0 ? (
                            improvements.map((point, idx) => (
                                <View key={idx} style={styles.improvementRow}>
                                    <View style={[styles.improvementBadge, { backgroundColor: colors.warningTint }]}>
                                        <Text style={[styles.improvementBadgeText, { color: colors.warning }]}>{idx + 1}</Text>
                                    </View>
                                    <Text style={styles.bulletText}>{point}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.descriptionText}>No improvement points noted.</Text>
                        )}
                    </View>

                    {/* AI Summary */}
                    {observation.aiSummary && (
                        <View style={[styles.card, styles.accentPrimary]}>
                            <View style={styles.sectionHeaderRow}>
                                <Ionicons name="sparkles" size={14} color={colors.primary} style={{ marginRight: 6 }} />
                                <Text style={[styles.sectionLabel, { marginBottom: 0 }]}>AI Summary</Text>
                            </View>
                            <Text style={styles.descriptionText}>{observation.aiSummary}</Text>
                        </View>
                    )}

                    {/* Grade — replaces the old per-criteria "Scoring Breakdown" bars.
                        SAMBA criteria are shown as reference only (what the grade was weighed against),
                        not individually scored. */}
                    <View style={styles.card}>
                        <Text style={styles.sectionLabel}>Grade</Text>
                        {CRITERIA.map((crit, i) => {
                            const isFirstExtra = crit.extra && !CRITERIA[i - 1]?.extra;
                            return (
                                <View key={crit.name}>
                                    {isFirstExtra && <Text style={styles.critDivider}>＋ SAMBA CRITERIA</Text>}
                                    <View style={styles.critRow}>
                                        <View style={[styles.critLetter, { backgroundColor: crit.extra ? colors.gold : colors.primary }]}>
                                            <Text style={styles.critLetterText}>{crit.L}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.rowValue}>{crit.name}</Text>
                                            <Text style={styles.rowSubValue}>{crit.sub}</Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                        <View style={[styles.divider, { marginVertical: 14 }]} />
                        <View style={styles.gradeTotalRow}>
                            <Text style={styles.gradeTotalLabel}>Graded against these areas</Text>
                            <View style={[styles.heroGradeChip, { backgroundColor: gradeColor }]}>
                                <Text style={styles.heroGradeValue}>{grade ?? '–'}<Text style={styles.heroGradeUnit}>/10</Text></Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 20 }}>
                        <TouchableOpacity
                            style={[
                                styles.markReviewedBtn,
                                observation.reviewedAt && styles.markReviewedBtnDone,
                            ]}
                            disabled={isReviewing || observation.reviewedAt}
                            onPress={handleMarkReviewed}
                        >
                            {isReviewing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.markReviewedBtnText}>
                                    {observation.reviewedAt ? '✓ Reviewed' : 'Mark as reviewed'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    // Loading / error states
    plainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        gap: 12,
    },
    plainHeaderTitle: {
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        color: colors.headerTitle,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.backBg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        minHeight: 400,
    },
    errorText: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: colors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    retryBtnText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 14,
    },

    // ─── Scoreboard hero ─────────────────────────────────────────────────────
    heroGradient: {
        paddingTop: 16,
        paddingHorizontal: 20,
        paddingBottom: 36,
    },
    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    heroBackButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'Urbanist_700Bold',
        letterSpacing: 0.4,
    },
    heroCoachRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 14,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    avatarFallback: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 14,
        backgroundColor: 'rgba(255,255,255,0.16)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    avatarInitial: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
    },
    heroCoachName: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        color: colors.onGradientText,
    },
    heroCoachSub: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: colors.onGradientSubtext,
        marginTop: 2,
    },
    heroGradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroScoreLabel: {
        fontSize: 11,
        fontFamily: 'Urbanist_700Bold',
        color: colors.onGradientSubtext,
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    heroAssessorValue: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: colors.onGradientText,
    },
    heroScoreCaption: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: colors.onGradientSubtext,
        marginTop: 4,
    },
    heroGradeChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
    },
    heroGradeValue: {
        fontSize: 22,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
    },
    heroGradeUnit: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: 'rgba(255,255,255,0.85)',
    },

    // ─── Content sheet ───────────────────────────────────────────────────────
    sheet: {
        backgroundColor: colors.background,
        marginTop: -22,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        paddingHorizontal: 16,
        paddingTop: 22,
    },
    card: {
        backgroundColor: colors.cardBg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: colors.shadowOpacity,
        shadowRadius: 12,
        elevation: 1,
    },
    accentPrimary: { borderLeftWidth: 3, borderLeftColor: colors.primary },
    accentSuccess: { borderLeftWidth: 3, borderLeftColor: colors.success },
    accentWarning: { borderLeftWidth: 3, borderLeftColor: colors.warning },

    sectionLabel: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: colors.labelText,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 15,
        fontFamily: 'Urbanist_400Regular',
        color: colors.valueText,
        lineHeight: 22,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowValue: {
        fontSize: 15,
        fontFamily: 'Urbanist_600SemiBold',
        color: colors.valueText,
    },
    rowSubValue: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: colors.labelText,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.divider,
    },

    // Positives list (bulleted, unranked — max 2)
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    bulletDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 12,
        marginTop: 8,
    },

    // Improvement list (numbered — order reflects priority)
    improvementRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    improvementBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginTop: 1,
    },
    improvementBadgeText: {
        fontSize: 11,
        fontFamily: 'Urbanist_700Bold',
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Urbanist_400Regular',
        color: colors.valueText,
        lineHeight: 22,
    },

    // Grade / SAMBA criteria reference list
    critRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    critLetter: {
        width: 26,
        height: 26,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    critLetterText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 12,
    },
    critDivider: {
        fontSize: 10,
        fontFamily: 'Urbanist_700Bold',
        color: colors.gold,
        letterSpacing: 1,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
        paddingTop: 10,
        marginTop: 6,
    },
    gradeTotalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    gradeTotalLabel: {
        fontSize: 15,
        fontFamily: 'Urbanist_700Bold',
        color: colors.valueText,
        flex: 1,
        marginRight: 12,
    },

    // ─── Voice player (waveform) ─────────────────────────────────────────────
    playerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    playerTrack: {
        flex: 1,
    },
    waveformRow: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 26,
        marginBottom: 6,
        gap: 3,
    },
    waveformBar: {
        flex: 1,
        borderRadius: 2,
        minHeight: 3,
    },
    playerTime: {
        fontSize: 12,
        fontFamily: 'Urbanist_500Medium',
        color: colors.labelText,
    },
    markReviewedBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 24,
        minWidth: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markReviewedBtnDone: {
        backgroundColor: colors.success,
    },
    markReviewedBtnText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 15,
    },
});