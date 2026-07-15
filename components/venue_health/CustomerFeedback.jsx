import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
const { width } = Dimensions.get('window');

// ─── Theme ─────────────────────────────────────────────────────────────────
const COLORS = {
    light: {
        background: '#fff',
        headerTitle: '#1a1a1a',
        icon: '#1a1a1a',
        searchBg: '#fff',
        searchBorder: '#D1D5DB',
        searchText: '#1a1a1a',
        searchPlaceholder: '#9ca3af',
        searchIcon: '#6B7280',
        chartTitle: '#1e293b',
        cardBg: '#fff',
        cardBorder: '#F3F4F6',
        cardMetaText: '#374151',
        cardMetaIcon: '#9CA3AF',
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
        legendText: '#4B5563',
        axisText: '#4B5563',
        progressTrack: '#E5E7EB',
        progressPercentage: '#1a1a1a',
        progressLabel: '#9CA3AF',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        emptyText: '#9CA3AF',
    },
    dark: {
        background: '#121212',
        headerTitle: '#F5F5F5',
        icon: '#F5F5F5',
        searchBg: '#1E1E1E',
        searchBorder: '#3A3A3A',
        searchText: '#F5F5F5',
        searchPlaceholder: '#9CA3AF',
        searchIcon: '#9CA3AF',
        chartTitle: '#F5F5F5',
        cardBg: '#1E1E1E',
        cardBorder: '#2A2A2A',
        cardMetaText: '#D1D5DB',
        cardMetaIcon: '#9CA3AF',
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
        legendText: '#D1D5DB',
        axisText: '#D1D5DB',
        progressTrack: '#3A3A3A',
        progressPercentage: '#F5F5F5',
        progressLabel: '#9CA3AF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        emptyText: '#6B7280',
    },
};

const LINE_COLORS = ['#EC4899', '#EF4444', '#3B82F6', '#22c55e', '#F59E0B', '#8B5CF6'];
const CHART_MONTHS = 7;

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

function polarToCartesian(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
    const s = polarToCartesian(cx, cy, r, startAngle);
    const e = polarToCartesian(cx, cy, r, endAngle);
    const large = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
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

// ─── Screen 1: Card List (venue-level cards) ──────────────────────────────────
function CardListScreen({ searchQuery, setSearchQuery, cards, loading, detailLoading, onCardPress, onChartPress, theme, styles }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer feedback</Text>
            </View>

            {detailLoading && (
                <View style={styles.detailLoadingOverlay}>
                    <CustomLoader size={80} color="#3B82F6" />
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={theme.searchIcon} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search venue..."
                        placeholderTextColor={theme.searchPlaceholder}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle-outline" size={20} color={theme.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Customer Satisfaction Results</Text>
                    <TouchableOpacity onPress={onChartPress}>
                        <Image
                            source={require('@/assets/images/Chart.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center', justifyContent: 'center' }}>
                        <CustomLoader size={80} color="#3B82F6" />
                    </View>
                ) : cards.length === 0 ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Urbanist_500Medium', color: theme.emptyText }}>
                            No feedback results found.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.cardsGrid}>
                        {cards.map(card => (
                            <TouchableOpacity key={card.id} style={styles.card} onPress={() => onCardPress(card)} activeOpacity={0.8} disabled={detailLoading}>
                                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                    <CircularProgress
                                        percentage={card.percentage}
                                        size={120}
                                        strokeWidth={11}
                                        color="#22c55e"
                                        label="percentage"
                                        theme={theme}
                                    />
                                </View>
                                <View style={styles.cardMeta}>
                                    <Ionicons name="calendar-outline" size={15} color={theme.cardMetaIcon} />
                                    <Text style={[styles.cardMetaText, { fontFamily: 'Urbanist_700Bold' }]}>{card.date}</Text>
                                </View>
                                <View style={styles.cardMeta}>
                                    <Ionicons name="location-outline" size={15} color={theme.cardMetaIcon} />
                                    <Text style={styles.cardMetaText}>{card.venue}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// ─── Screen 2: Results Detail (all responses for the tapped venue) ────────────
function ResultsScreen({ card, onBack, theme, styles }) {
    const { details } = card;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={theme.icon} />
                    <Text style={styles.headerTitle}>Results</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {details.responses.map((res, idx) => (
                    <View key={res.id} style={idx > 0 ? { marginTop: 36 } : null}>
                        {details.responses.length > 1 && (
                            <Text style={styles.surveyTitleHeading}>{res.surveyTitle}</Text>
                        )}

                        <View style={styles.metaStrip}>
                            <View style={styles.metaItem}>
                                <Ionicons name="calendar-outline" size={14} color={theme.metaIcon} />
                                <Text style={styles.metaLabel}>Date</Text>
                                <Text style={styles.metaValue}>{res.date}</Text>
                            </View>
                            <View style={styles.metaSep} />
                            <View style={styles.metaItem}>
                                <Ionicons name="time-outline" size={14} color={theme.metaIcon} />
                                <Text style={styles.metaLabel}>Time</Text>
                                <Text style={styles.metaValue}>{res.time}</Text>
                            </View>
                            <View style={styles.metaSep} />
                            <View style={styles.metaItem}>
                                <Ionicons name="people-outline" size={14} color={theme.metaIcon} />
                                <Text style={styles.metaLabel}>Students</Text>
                                <Text style={styles.metaValue}>{res.students ?? '—'}</Text>
                            </View>
                            <View style={styles.metaSep} />
                            <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={14} color={theme.metaIcon} />
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
                                theme={theme}
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
                                        <ScoreBar score={cat.score} theme={theme} />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={{ fontFamily: 'Urbanist_500Medium', color: theme.emptyText, textAlign: 'center' }}>
                                No category breakdown for this response.
                            </Text>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

// ─── Chart helpers ─────────────────────────────────────────────────────────────
function buildSmoothPath(points) {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
}

// API: { success, data: [{ venueId, venueName, data: [{ month: "2026-07", avgPercentage: "45.00" }] }] }
function buildChartData(trendData = [], searchQuery = '') {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
        ? trendData.filter(v => v.venueName.toLowerCase().includes(query))
        : trendData;

    const now = new Date();
    const months = Array.from({ length: CHART_MONTHS }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1 - i), 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return { key, label: d.toLocaleDateString('en-GB', { month: 'short' }) };
    });

    let allPercentages = [];

    const series = filtered.map((venue, idx) => {
        const byMonth = {};
        (venue.data || []).forEach((d) => {
            byMonth[d.month] = parseFloat(d.avgPercentage || 0);
        });

        const points = months
            .map((m, monthIdx) => {
                if (!(m.key in byMonth)) return null;
                allPercentages.push(byMonth[m.key]);
                return { monthIdx, value: byMonth[m.key] };
            })
            .filter(Boolean);

        return {
            venue: venue.venueName,
            color: LINE_COLORS[idx % LINE_COLORS.length],
            points,
        };
    }).filter(s => s.points.length > 0);

    const yMax = allPercentages.length ? Math.ceil(Math.max(...allPercentages) / 10) * 10 : 100;
    const yMin = allPercentages.length ? Math.floor(Math.min(...allPercentages) / 10) * 10 : 0;
    const yAxisLabels = [];
    for (let v = yMax; v >= yMin; v -= 10) yAxisLabels.push(v);

    return { months, series, yMin, yMax: yMax === yMin ? yMax + 10 : yMax, yAxisLabels };
}

// ─── Screen 3: Line Chart (fetches its own trend data) ─────────────────────────
function ChartScreen({ searchQuery, setSearchQuery, onBack, theme, styles }) {
    const { token } = useAuth();
    const CHART_W = 310;
    const CHART_H = 190;

    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTrend = async () => {
        try {
            setLoading(true);
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}`);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            };

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/customer-feedback/trend`,
                requestOptions
            );
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setTrendData(result.data);
            } else {
                setTrendData([]);
            }
        } catch (error) {
            console.error("Failed to fetch feedback trend:", error);
            setTrendData([]);
        } finally {
            setLoading(false);
        }
    };

    const { months, series, yMin, yMax, yAxisLabels } = buildChartData(trendData, searchQuery);

    const toXY = (monthIdx, value) => ({
        x: months.length > 1 ? (monthIdx / (months.length - 1)) * CHART_W : CHART_W / 2,
        y: CHART_H - ((value - yMin) / (yMax - yMin)) * CHART_H,
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer feedback</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={theme.searchIcon} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search venue..."
                        placeholderTextColor={theme.searchPlaceholder}
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle-outline" size={20} color={theme.icon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Customer Satisfaction Results</Text>
                    <TouchableOpacity onPress={onBack}>
                        <Image
                            source={require('@/assets/images/Chart.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center', justifyContent: 'center' }}>
                        <CustomLoader size={80} color="#3B82F6" />
                    </View>
                ) : series.length === 0 ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Urbanist_500Medium', color: theme.emptyText }}>
                            No feedback data for the selected period.
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.legendContainer}>
                            {series.map((s) => (
                                <View key={s.venue} style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                                    <Text style={styles.legendText}>{s.venue}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.chartArea}>
                            <View style={styles.yAxis}>
                                {yAxisLabels.map(v => (
                                    <Text key={v} style={styles.axisText}>{v}</Text>
                                ))}
                            </View>
                            <View style={styles.chartPlot}>
                                <Svg width="100%" height={220} viewBox={`0 -10 ${CHART_W} ${CHART_H + 30}`} preserveAspectRatio="none">
                                    {series.map((s) => (
                                        <Path
                                            key={s.venue}
                                            d={buildSmoothPath(s.points.map(p => toXY(p.monthIdx, p.value)))}
                                            stroke={s.color}
                                            strokeWidth="2.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    ))}
                                </Svg>
                                <View style={styles.xAxis}>
                                    {months.map(m => (
                                        <Text key={m.key} style={styles.axisTextX}>{m.label}</Text>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

// ─── API mapping ────────────────────────────────────────────────────────────
// Shared: derive category cards from categoryScores, falling back to rating_10 answers
// when categoryScores is empty (e.g. the /response/:id detail endpoint).
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

// API shape: { success, data: [{ venue: {id,name}, totalResponses, overallPercentage, responses: [...] }] }
// Card = venue. Each card.details.responses[] holds every survey submission for that venue.
const mapApiResultsToCards = (apiVenues = []) =>
    apiVenues.map((venueGroup, idx) => {
        const venueName = venueGroup.venue?.name || '';
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

        const latestDate = responses[0]?.date || '';

        return {
            id: venueGroup.venue?.id ?? String(idx),
            percentage: overallPercentage,
            date: latestDate,
            venue: venueName,
            totalResponses: venueGroup.totalResponses,
            details: {
                venue: venueName,
                overallPercentage,
                totalResponses: venueGroup.totalResponses,
                responses,
            },
        };
    });

// Maps a single GET /api/coachpro/customer-feedback/response/:id payload
// (apiData = result.data) into the same `res` shape ResultsScreen expects.
function mapResponseDetail(apiData) {
    const { date, time } = formatSubmittedAt(apiData.submittedAt);

    return {
        id: apiData.id,
        surveyTitle: apiData.surveyTitle,
        percentage: Math.round(parseFloat(apiData.overallPercentage || 0)),
        npsScore: apiData.npsScore,
        students: apiData.totalStudent ?? apiData.studentCount ?? null,
        date,
        time,
        submittedAt: apiData.submittedAt,
        answers: apiData.answers || [],
        categories: deriveCategories(apiData),
    };
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CustomerFeedback({ onBack }) {
    const { token } = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');
    const [screen, setScreen] = useState('cards');
    const [selectedCard, setSelectedCard] = useState(null);

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
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
            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setCards(mapApiResultsToCards(result.data));
            } else {
                setCards([]);
            }
        } catch (error) {
            console.error("Failed to fetch customer feedback:", error);
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    // Fired on venue card tap: re-fetches every response belonging to that
    // venue via GET /api/coachpro/customer-feedback/response/:id, so the
    // Results screen always shows the freshest per-response detail/answers.
    const fetchVenueResponseDetails = async (card) => {
        const responseIds = (card.details?.responses || []).map(r => r.id).filter(id => id != null);

        if (responseIds.length === 0) {
            setSelectedCard(card);
            setScreen('results');
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
                .map(r => mapResponseDetail(r.data));

            setSelectedCard({
                ...card,
                details: {
                    ...card.details,
                    // Fall back to the already-loaded data for any response
                    // whose detail fetch failed, instead of dropping it.
                    responses: freshResponses.length > 0 ? freshResponses : card.details.responses,
                },
            });
            setScreen('results');
        } catch (error) {
            console.error("Failed to fetch response detail:", error);
            // Fall back to the data already loaded from /results
            setSelectedCard(card);
            setScreen('results');
        } finally {
            setDetailLoading(false);
        }
    };

    const filteredCards = searchQuery.trim()
        ? cards.filter(c => c.venue.toLowerCase().includes(searchQuery.trim().toLowerCase()))
        : cards;

    if (screen === 'results' && selectedCard) {
        return <ResultsScreen card={selectedCard} onBack={() => setScreen('cards')} theme={theme} styles={styles} />;
    }

    if (screen === 'chart') {
        return (
            <ChartScreen
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onBack={() => setScreen('cards')}
                theme={theme}
                styles={styles}
            />
        );
    }

    return (
        <CardListScreen
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cards={filteredCards}
            loading={loading}
            detailLoading={detailLoading}
            onCardPress={fetchVenueResponseDetails}
            onChartPress={() => setScreen('chart')}
            theme={theme}
            styles={styles}
        />
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
    headerTitle: { fontSize: 26, fontFamily: 'Urbanist_700Bold', color: theme.headerTitle },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    content: { paddingHorizontal: 16, paddingBottom: 40 },
    detailLoadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: theme.background,
        opacity: 0.85,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.searchBg,
        borderWidth: 1, borderColor: theme.searchBorder, borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 14, marginBottom: 30,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, fontFamily: 'Urbanist_500Medium', color: theme.searchText },

    chartTitleContainer: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16,
    },
    chartTitle: { fontSize: 16, fontFamily: 'Urbanist_700Bold', color: theme.chartTitle },

    cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    card: {
        width: (width - 32 - 14) / 2,
        backgroundColor: theme.cardBg,
        borderRadius: 20,
        padding: 16,
        paddingBottom: 20,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: theme.cardBorder,
    },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    cardMetaText: { fontSize: 14, fontFamily: 'Urbanist_500Medium', color: theme.cardMetaText },

    surveyTitleHeading: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
        marginBottom: 12,
    },

    metaStrip: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: theme.metaStripBorder, borderRadius: 14,
        paddingVertical: 12, paddingHorizontal: 8,
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    metaItem: { alignItems: 'center', gap: 4 },
    metaLabel: { fontSize: 10, fontFamily: 'Urbanist_400Regular', color: theme.metaLabel },
    metaValue: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: theme.metaValue, textAlign: 'center' },
    metaSep: { width: 1, height: 36, backgroundColor: theme.metaSep },

    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    catCard: {
        width: (width - 32 - 14) / 2,
        backgroundColor: theme.catCardBg,
        borderRadius: 16,
        padding: 16,
        paddingBottom: 18,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: theme.catCardBorder,
    },
    catCardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
    },
    catLabel: { fontSize: 12, fontFamily: 'Urbanist_400Regular', color: theme.catLabel },
    catEmoji: { fontSize: 22 },
    catScore: { fontSize: 28, fontFamily: 'Urbanist_700Bold', color: theme.catScore, marginTop: 4 },

    legendContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    legendText: { fontSize: 13, fontFamily: 'Urbanist_400Regular', color: theme.legendText },

    chartArea: { flexDirection: 'row', marginTop: 10 },
    yAxis: {
        width: 30, height: 220, justifyContent: 'space-between',
        alignItems: 'center', marginRight: 10, paddingBottom: 25,
    },
    axisText: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: theme.axisText },
    chartPlot: { flex: 1, position: 'relative', height: 240 },
    xAxis: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 30,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    axisTextX: { fontSize: 12, fontFamily: 'Urbanist_700Bold', color: theme.axisText, flex: 1, textAlign: 'center' },

    iconImage: { height: 25, width: 25 },
});