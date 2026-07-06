import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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
    },
};

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ percentage, size = 120, strokeWidth = 10, label = 'percentage', color = '#22c55e', theme }) {
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;

    const startAngle = -220;
    const endAngle = 40;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                <Path
                    d={describeArc(cx, cy, r, startAngle, endAngle)}
                    stroke={theme.progressTrack}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                <Path
                    d={describeArc(cx, cy, r, startAngle, startAngle + (percentage / 100) * 260)}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
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

// ─── Screen 1: Card List ──────────────────────────────────────────────────────
function CardListScreen({ searchQuery, setSearchQuery, cards, onCardPress, onChartPress, onBack, theme, styles }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Customer feedback</Text>
                </View>
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
                    <TouchableOpacity onPress={onChartPress}>
                        <Image
                            source={require('@/assets/images/Chart.png')}
                            style={styles.iconImage}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.cardsGrid}>
                    {cards.map(card => (
                        <TouchableOpacity key={card.id} style={styles.card} onPress={() => onCardPress(card)} activeOpacity={0.8}>
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
            </ScrollView>
        </View>
    );
}

// ─── Screen 2: Results Detail ─────────────────────────────────────────────────
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
                <View style={styles.metaStrip}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={14} color={theme.metaIcon} />
                        <Text style={styles.metaLabel}>Date</Text>
                        <Text style={styles.metaValue}>{details.date}</Text>
                    </View>
                    <View style={styles.metaSep} />
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={theme.metaIcon} />
                        <Text style={styles.metaLabel}>Time</Text>
                        <Text style={styles.metaValue}>{details.time}</Text>
                    </View>
                    <View style={styles.metaSep} />
                    <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={14} color={theme.metaIcon} />
                        <Text style={styles.metaLabel}>Students</Text>
                        <Text style={styles.metaValue}>{details.students}</Text>
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
                        percentage={details.overallPercentage}
                        size={180}
                        strokeWidth={14}
                        label="Overall percentage"
                        color="#22c55e"
                        theme={theme}
                    />
                </View>

                <View style={styles.catGrid}>
                    {details.categories.map((cat, i) => (
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
            </ScrollView>
        </View>
    );
}

// ─── Screen 3: Line Chart ─────────────────────────────────────────────────────
function ChartScreen({ searchQuery, setSearchQuery, onBack, theme, styles }) {
    const pinkLine = "M 0,10 C 20,40 30,120 50,110 C 70,100 80,30 100,30 C 120,30 140,80 160,80 C 180,80 190,20 210,25 C 230,30 240,90 260,80 C 280,70 290,10 310,15";
    const redLine = "M 0,33 C 20,70 30,150 50,140 C 70,130 80,70 100,70 C 120,70 140,110 160,110 C 180,110 190,40 210,45 C 230,50 240,110 260,100 C 280,90 290,30 310,35";
    const blueLine = "M 0,66 C 20,100 30,190 50,180 C 70,170 80,110 100,105 C 120,100 140,150 160,150 C 180,150 190,80 210,85 C 230,90 240,140 260,130 C 280,120 290,60 310,65";

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

                <View style={styles.legendContainer}>
                    {[['#EC4899', 'Chelsea'], ['#EF4444', 'Acton'], ['#3B82F6', 'London Bridge']].map(([color, label]) => (
                        <View key={label} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: color }]} />
                            <Text style={styles.legendText}>{label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.chartArea}>
                    <View style={styles.yAxis}>
                        {['90', '80', '70', '60', '50', '40', '30'].map(v => (
                            <Text key={v} style={styles.axisText}>{v}</Text>
                        ))}
                    </View>
                    <View style={styles.chartPlot}>
                        <Svg width="100%" height={220} viewBox="0 -10 310 220" preserveAspectRatio="none">
                            <Path d={pinkLine} stroke="#EC4899" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <Path d={redLine} stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            <Path d={blueLine} stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                        <View style={styles.xAxis}>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => (
                                <Text key={m} style={styles.axisTextX}>{m}</Text>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function CustomerFeedback({ onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('Chelsea');
    const [screen, setScreen] = useState('cards');
    const [selectedCard, setSelectedCard] = useState(null);

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
            cards={FEEDBACK_CARDS}
            onCardPress={card => { setSelectedCard(card); setScreen('results'); }}
            onChartPress={() => setScreen('chart')}
            onBack={onBack}
            theme={theme}
            styles={styles}
        />
    );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const FEEDBACK_CARDS = [
    {
        id: 1, percentage: 90, date: '18/01/2023', venue: 'Chelsea',
        details: {
            date: 'Sat 3rd Apr', time: '9:30am', students: 20, venue: 'Chelsea', overallPercentage: 90,
            categories: [
                { label: 'Coaching Quality', score: 9 },
                { label: 'Venue Facilities', score: 8 },
                { label: 'Coaches', score: 9 },
                { label: 'Progress', score: 8 },
                { label: 'Communication', score: 8 },
                { label: 'Communication', score: 8 },
            ],
        },
    },
    {
        id: 2, percentage: 54, date: '18/01/2023', venue: 'Chelsea',
        details: {
            date: 'Sun 4th Apr', time: '10:00am', students: 15, venue: 'Chelsea', overallPercentage: 54,
            categories: [
                { label: 'Coaching Quality', score: 5 },
                { label: 'Venue Facilities', score: 6 },
                { label: 'Coaches', score: 5 },
                { label: 'Progress', score: 6 },
                { label: 'Communication', score: 5 },
                { label: 'Communication', score: 6 },
            ],
        },
    },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
    headerTitle: { fontSize: 26, fontFamily: 'Urbanist_700Bold', color: theme.headerTitle },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    content: { paddingHorizontal: 16, paddingBottom: 40 },

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

    legendContainer: { flexDirection: 'row', marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
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