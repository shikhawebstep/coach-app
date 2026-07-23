import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const LIGHT = {
    background: '#fff',
    headerTitle: '#1a1a1a',
    searchBg: '#F9FAFB',
    searchBorder: '#E5E7EB',
    searchIcon: '#a0a0a0',
    searchText: '#000',
    cardBg: '#fff',
    cardBorder: '#F9FAFB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    nameText: '#1a1a1a',
    dateTimeText: '#6B7280',
    venueText: '#1a1a1a',
    chevron: '#000',
    backIcon: '#000',
    textSecondary: '#6B7280',
    primary: '#3B82F6',
    error: '#EF4444',
    progressTrack: '#E5E7EB',
    progressPercentage: '#1a1a1a',
    progressLabel: '#9CA3AF',
    metaStripBorder: '#E5E7EB',
    metaLabel: '#9CA3AF',
    metaValue: '#1a1a1a',
    metaSep: '#E5E7EB',
    metaIcon: '#6b7280',
    catCardBg: '#fff',
    catCardBorder: '#F3F4F6',
    catLabel: '#9CA3AF',
    catScore: '#1a1a1a',
    scoreBarTrack: '#F3F4F6',
    emptyText: '#9CA3AF',
};

const DARK = {
    background: '#121212',
    headerTitle: '#FFFFFF',
    searchBg: '#1E1E1E',
    searchBorder: '#2C2C2E',
    searchIcon: '#6B7280',
    searchText: '#FFFFFF',
    cardBg: '#1E1E1E',
    cardBorder: '#2C2C2E',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    nameText: '#FFFFFF',
    dateTimeText: '#9CA3AF',
    venueText: '#FFFFFF',
    chevron: '#FFFFFF',
    backIcon: '#FFFFFF',
    textSecondary: '#9CA3AF',
    primary: '#3B82F6',
    error: '#EF4444',
    progressTrack: '#3A3A3A',
    progressPercentage: '#F5F5F5',
    progressLabel: '#9CA3AF',
    metaStripBorder: '#2A2A2A',
    metaLabel: '#9CA3AF',
    metaValue: '#F5F5F5',
    metaSep: '#2A2A2A',
    metaIcon: '#9CA3AF',
    catCardBg: '#1E1E1E',
    catCardBorder: '#2A2A2A',
    catLabel: '#9CA3AF',
    catScore: '#F5F5F5',
    scoreBarTrack: '#2A2A2A',
    emptyText: '#6B7280',
};

// score >= threshold -> green badge, else red
const SCORE_PASS_THRESHOLD = 50;

const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return '-';
    }
};

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ percentage, size = 120, strokeWidth = 10, label = 'percentage', color = '#22c55e', theme }) {
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    stroke={theme.progressTrack}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${cx}, ${cy}`}
                />
            </Svg>
            <View style={{ alignItems: 'center' }}>
                <Text style={{
                    fontSize: size <= 120 ? 22 : 42,
                    fontFamily: 'Urbanist_700Bold',
                    color: theme.progressPercentage,
                }}>
                    {percentage}%
                </Text>
                <Text style={{
                    fontSize: size <= 120 ? 11 : 13,
                    fontFamily: 'Urbanist_400Regular',
                    color: theme.progressLabel,
                    marginTop: 2,
                }}>
                    {label}
                </Text>
            </View>
        </View>
    );
}

// ─── Score Progress Bar ───────────────────────────────────────────────────────
function ScoreBar({ score, theme }) {
    return (
        <View style={{ height: 5, backgroundColor: theme.scoreBarTrack, borderRadius: 3, marginTop: 10 }}>
            <View style={{
                width: `${(score / 10) * 100}%`,
                height: 5,
                backgroundColor: '#22c55e',
                borderRadius: 3,
            }} />
        </View>
    );
}

function deriveCategories(entry) {
    const answers = Array.isArray(entry.answers) ? entry.answers : [];
    return answers
        .filter((a) => a.type === 'rating_10' && a.questionText)
        .map((a) => ({
            label: a.questionText,
            score: a.answer,
        }));
}

function formatSubmittedAt(submittedAt) {
    const submitted = submittedAt ? new Date(submittedAt) : null;
    return {
        date: submitted
            ? submitted.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : '',
        time: submitted
            ? submitted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '',
    };
}

export default function CoachResults({ onBack, title = "My results" }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [reportsData, setReportsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    // Tracks which report's detail is currently open
    const [selectedCard, setSelectedCard] = useState(null);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? DARK : LIGHT;
    const styles = getStyles(colors);

    const { token } = useAuth();

    useEffect(() => {
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/customer-feedback/results`,
                requestOptions
            );

            const result = await response.json().catch(() => ({}));

            if (result.success && Array.isArray(result.data)) {
                setReportsData(mapFeedbackToReports(result.data));
            } else {
                setError(result?.message || "Failed to load results.");
            }
        } catch (err) {
            console.error("Failed to fetch results:", err);
            setError("Something went wrong while loading results.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVenueResponseDetails = async (card) => {
        const responseIds = (card.details?.responses || []).map(r => r.id).filter(id => id != null);

        if (responseIds.length === 0) {
            setSelectedCard(card);
            return;
        }

        try {
            setDetailLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const results = await Promise.all(
                responseIds.map(id =>
                    fetch(
                        `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/customer-feedback/response/${id}`,
                        requestOptions
                    )
                        .then(res => res.json())
                        .catch(() => null)
                )
            );

            const freshResponses = results
                .filter(r => r && r.success && r.data)
                .map(r => {
                    const { date, time } = formatSubmittedAt(r.data.submittedAt);
                    return {
                        id: r.data.id,
                        surveyTitle: r.data.surveyTitle,
                        percentage: Math.round(parseFloat(r.data.overallPercentage || 0)),
                        npsScore: r.data.npsScore,
                        students: r.data.totalStudent ?? r.data.studentCount ?? null,
                        date,
                        time,
                        submittedAt: r.data.submittedAt,
                        answers: r.data.answers || [],
                        categories: deriveCategories(r.data),
                    };
                });

            setSelectedCard({
                ...card,
                details: {
                    ...card.details,
                    responses: freshResponses.length > 0 ? freshResponses : card.details.responses,
                },
            });
        } catch (error) {
            console.error("Failed to fetch response detail:", error);
            setSelectedCard(card);
        } finally {
            setDetailLoading(false);
        }
    };

    const mapFeedbackToReports = (apiVenues = []) =>
        apiVenues.map((venueGroup, idx) => {
            const venueName = venueGroup.venue?.name || 'Unknown';
            const overallPercentage = Math.round(parseFloat(venueGroup.overallPercentage || 0));

            const responses = (venueGroup.responses || []).map((r) => {
                const { date, time } = formatSubmittedAt(r.submittedAt);
                return {
                    id: r.id,
                    surveyTitle: r.surveyTitle,
                    percentage: Math.round(parseFloat(r.overallPercentage || 0)),
                    npsScore: r.npsScore,
                    students: r.students ?? r.studentCount ?? null,
                    date,
                    time,
                    submittedAt: r.submittedAt,
                    answers: r.answers || [],
                    categories: deriveCategories(r),
                };
            });

            const latestResponse = responses[0];

            return {
                id: venueGroup.venue?.id ?? String(idx),
                coachName: venueName,
                observationDate: latestResponse?.submittedAt || null,
                startTime: latestResponse?.time || '',
                endTime: '',
                area: `${venueGroup.totalResponses} ${venueGroup.totalResponses === 1 ? 'response' : 'responses'}`,
                score: `${overallPercentage}%`,
                details: {
                    venue: venueName,
                    overallPercentage,
                    totalResponses: venueGroup.totalResponses,
                    responses,
                }
            };
        });

    const getScoreColor = (score) => {
        const numericScore = parseFloat(String(score).replace('%', '')) || 0;
        return numericScore >= SCORE_PASS_THRESHOLD ? '#1CAB4B' : '#EF4444';
    };

    const filteredReports = reportsData.filter(item => {
        const name = item?.coachName || '';
        return name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    const formatTimeRange = (start, end) => {
        if (!start) return '-';
        if (!end) return start;

        const parseTime = (t) => {
            if (!t) return null;
            const match = t.trim().match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)?/);
            if (!match) return null;

            let hours = parseInt(match[1], 10);
            const minutes = match[2];
            const meridiemRaw = match[3];

            let period;
            if (meridiemRaw) {
                period = meridiemRaw.toLowerCase();
                if (period === 'pm' && hours !== 12) hours += 12;
                if (period === 'am' && hours === 12) hours = 0;
            }

            const displayPeriod = hours >= 12 ? 'pm' : 'am';
            let displayHour = hours % 12;
            if (displayHour === 0) displayHour = 12;

            return {
                display: `${displayHour}:${minutes}`,
                period: displayPeriod,
            };
        };

        const startParsed = parseTime(start);
        const endParsed = parseTime(end);

        if (!startParsed || !endParsed) {
            return `${start} - ${end}`;
        }

        if (startParsed.period === endParsed.period) {
            return `${startParsed.display}-${endParsed.display}${endParsed.period}`;
        }

        return `${startParsed.display}${startParsed.period}-${endParsed.display}${endParsed.period}`;
    };

    // Render detail screen if a card is selected
    if (selectedCard) {
        const { details } = selectedCard;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setSelectedCard(null)} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.backIcon} />
                        <Text style={styles.headerTitle}>Results</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {details.responses.map((res, idx) => (
                        <View key={res.id} style={idx > 0 ? { marginTop: 36 } : null}>
                            {details.responses.length > 1 && (
                                <Text style={styles.surveyTitleHeading}>{res.surveyTitle}</Text>
                            )}

                            <View style={styles.metaStrip}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="calendar-outline" size={14} color={colors.metaIcon} />
                                    <Text style={styles.metaLabel}>Date</Text>
                                    <Text style={styles.metaValue}>{res.date}</Text>
                                </View>
                                <View style={styles.metaSep} />
                                <View style={styles.metaItem}>
                                    <Ionicons name="time-outline" size={14} color={colors.metaIcon} />
                                    <Text style={styles.metaLabel}>Time</Text>
                                    <Text style={styles.metaValue}>{res.time}</Text>
                                </View>
                                <View style={styles.metaSep} />
                                <View style={styles.metaItem}>
                                    <Ionicons name="people-outline" size={14} color={colors.metaIcon} />
                                    <Text style={styles.metaLabel}>Students</Text>
                                    <Text style={styles.metaValue}>{res.students ?? '—'}</Text>
                                </View>
                                <View style={styles.metaSep} />
                                <View style={styles.metaItem}>
                                    <Ionicons name="location-outline" size={14} color={colors.metaIcon} />
                                    <Text style={styles.metaLabel}>Venue</Text>
                                    <Text style={styles.metaValue}>{details.venue}</Text>
                                </View>
                            </View>

                            <View style={{ alignItems: 'center', marginVertical: 32 }}>
                                <CircularProgress
                                    percentage={res.percentage}
                                    size={180}
                                    strokeWidth={14}
                                    label="Overall percentage"
                                    color="#22c55e"
                                    theme={colors}
                                />
                            </View>

                            {res.categories.length > 0 ? (
                                <View style={styles.catGrid}>
                                    {res.categories.map((cat, i) => (
                                        <View key={i} style={styles.catCard}>
                                            <View style={styles.catCardHeader}>
                                                <Text style={styles.catLabel}>{cat.label}</Text>
                                                <Text style={styles.catEmoji}>😁</Text>
                                            </View>
                                            <Text style={styles.catScore}>{cat.score}/10</Text>
                                            <ScoreBar score={cat.score} theme={colors} />
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text style={{ fontFamily: 'Urbanist_500Medium', color: colors.emptyText, textAlign: 'center' }}>
                                    No category breakdown for this response.
                                </Text>
                            )}
                        </View>
                    ))}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.backIcon} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {detailLoading && (
                <View style={styles.detailLoadingOverlay}>
                    <CustomLoader size={80} color={colors.primary} />
                </View>
            )}

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.searchIcon} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by venue..."
                    placeholderTextColor={colors.searchIcon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={colors.searchIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {loading ? (
                <View style={styles.centered}>
                    <CustomLoader size={80} color={colors.primary} />
                </View>
            ) : filteredReports.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No results found</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {filteredReports.map((item, index) => (
                        <TouchableOpacity
                            key={item?.id ?? index}
                            style={styles.card}
                            onPress={() => fetchVenueResponseDetails(item)}
                            activeOpacity={0.7}
                            disabled={detailLoading}
                        >
                            <View style={styles.colName}>
                                <Text style={styles.nameText}>{item?.coachName || 'Unknown'}</Text>
                            </View>

                            <View style={styles.colDateTime}>
                                <Text style={styles.dateTimeText}>{formatDate(item?.observationDate)}</Text>
                                <Text style={styles.dateTimeText}>{formatTimeRange(item?.startTime, item?.endTime)}</Text>
                            </View>

                            <View style={styles.colVenue}>
                                <Text style={styles.venueText}>{item?.area || '-'}</Text>
                            </View>

                            <View style={styles.colScore}>
                                <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item?.score) }]}>
                                    <Text style={styles.scoreText}>
                                        {item?.score ? String(item.score) : '0%'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={colors.chevron} style={styles.chevron} />
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </View>
    );
}

const getStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Urbanist_700Bold',
        color: colors.headerTitle,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: colors.searchBg,
        borderWidth: 1,
        borderColor: colors.searchBorder,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist_500Medium',
        color: colors.searchText,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontFamily: 'Urbanist_400Regular',
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        marginBottom: 12,
        marginHorizontal: 16,
        fontFamily: 'Urbanist_400Regular',
        fontSize: 13,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colors.shadowOpacity,
        shadowRadius: 8,
        elevation: 1,
    },
    colName: {
        flex: 1.2,
    },
    nameText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: colors.nameText,
    },
    colDateTime: {
        flex: 1,
    },
    dateTimeText: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Urbanist_500Medium',
        color: colors.dateTimeText,
        lineHeight: 18,
    },
    colVenue: {
        flex: 1,
    },
    venueText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: colors.venueText,
    },
    colScore: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    scoreBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    scoreText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 12,
    },
    chevron: {
        marginLeft: 8,
    },
    detailLoadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.background,
        opacity: 0.85,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    surveyTitleHeading: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: colors.headerTitle,
        marginBottom: 12,
    },
    metaStrip: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: colors.metaStripBorder, borderRadius: 14,
        paddingVertical: 12, paddingHorizontal: 8,
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    metaItem: { alignItems: 'center', gap: 4 },
    metaLabel: { fontSize: 10, fontFamily: 'Urbanist_400Regular', color: colors.metaLabel },
    metaValue: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: colors.metaValue, textAlign: 'center' },
    metaSep: { width: 1, height: 36, backgroundColor: colors.metaSep },
    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    catCard: {
        width: (width - 32 - 14) / 2,
        backgroundColor: colors.catCardBg,
        borderRadius: 16,
        padding: 16,
        paddingBottom: 18,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colors.shadowOpacity,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.catCardBorder,
    },
    catCardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
    },
    catLabel: { fontSize: 12, fontFamily: 'Urbanist_400Regular', color: colors.catLabel },
    catEmoji: { fontSize: 22 },
    catScore: { fontSize: 28, fontFamily: 'Urbanist_700Bold', color: colors.catScore, marginTop: 4 },
});
