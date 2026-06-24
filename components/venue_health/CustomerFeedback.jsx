import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// ─── Mock Data ────────────────────────────────────────────────────────────────
const FEEDBACK_CARDS = [
    {
        id: 1,
        percentage: 90,
        date: '18/01/2023',
        venue: 'Chelsea',
        details: {
            date: 'Sat 3rd Apr',
            time: '9:30am',
            students: 20,
            venue: 'Chelsea',
            overallPercentage: 90,
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
        id: 2,
        percentage: 54,
        date: '18/01/2023',
        venue: 'Chelsea',
        details: {
            date: 'Sun 4th Apr',
            time: '10:00am',
            students: 15,
            venue: 'Chelsea',
            overallPercentage: 54,
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

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ percentage, size = 120, strokeWidth = 10, label = 'percentage', color = '#22c55e' }) {
    const r = (size - strokeWidth) / 2;
    const circ = 2 * Math.PI * r;
    const filled = (percentage / 100) * circ;
    const cx = size / 2;
    const cy = size / 2;

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                {/* background track */}
                <Path
                    d={describeArc(cx, cy, r, -210, 30)}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                {/* filled arc */}
                <Path
                    d={describeArcFilled(cx, cy, r, -210, 30, percentage)}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
            </Svg>
            <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: size === 120 ? 22 : 36, fontWeight: 'bold', color: '#1a1a1a' }}>
                    {percentage}%
                </Text>
                <Text style={{ fontSize: size === 120 ? 11 : 13, color: '#6b7280', marginTop: 2 }}>{label}</Text>
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

function describeArcFilled(cx, cy, r, startAngle, endAngle, pct) {
    const totalAngle = endAngle - startAngle; // 240 deg
    const filled = (pct / 100) * totalAngle;
    return describeArc(cx, cy, r, startAngle, startAngle + filled);
}

// ─── Score Progress Bar ───────────────────────────────────────────────────────
function ScoreBar({ score }) {
    return (
        <View style={{ height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, marginTop: 8 }}>
            <View style={{ width: `${(score / 10) * 100}%`, height: 4, backgroundColor: '#22c55e', borderRadius: 2 }} />
        </View>
    );
}

// ─── Screen 1: Card List ──────────────────────────────────────────────────────
function CardListScreen({ searchQuery, setSearchQuery, cards, onCardPress, onChartPress }) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer feedback</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search venue..."
                        placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                {/* Title row */}
                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Customer Satisfaction Results</Text>
                    <TouchableOpacity style={styles.chartIconBtn} onPress={onChartPress}>
                        <Ionicons name="bar-chart-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                {/* Cards grid */}
                <View style={styles.cardsGrid}>
                    {cards.map(card => (
                        <TouchableOpacity
                            key={card.id}
                            style={styles.card}
                            onPress={() => onCardPress(card)}
                            activeOpacity={0.8}
                        >
                            <View style={{ alignItems: 'center', marginBottom: 14 }}>
                                <CircularProgress percentage={card.percentage} size={110} strokeWidth={9} />
                            </View>
                            <View style={styles.cardMeta}>
                                <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                                <Text style={styles.cardMetaText}>{card.date}</Text>
                            </View>
                            <View style={[styles.cardMeta, { marginTop: 4 }]}>
                                <Ionicons name="location-outline" size={14} color="#6b7280" />
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
function ResultsScreen({ card, onBack }) {
    const { details } = card;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
                    <Text style={styles.headerTitle}>Results</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Meta strip */}
                <View style={styles.metaStrip}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                        <View>
                            <Text style={styles.metaLabel}>Date</Text>
                            <Text style={styles.metaValue}>{details.date}</Text>
                        </View>
                    </View>
                    <View style={styles.metaSep} />
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color="#6b7280" />
                        <View>
                            <Text style={styles.metaLabel}>Time</Text>
                            <Text style={styles.metaValue}>{details.time}</Text>
                        </View>
                    </View>
                    <View style={styles.metaSep} />
                    <View style={styles.metaItem}>
                        <Ionicons name="people-outline" size={14} color="#6b7280" />
                        <View>
                            <Text style={styles.metaLabel}>Students</Text>
                            <Text style={styles.metaValue}>{details.students}</Text>
                        </View>
                    </View>
                    <View style={styles.metaSep} />
                    <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={14} color="#6b7280" />
                        <View>
                            <Text style={styles.metaLabel}>Venue</Text>
                            <Text style={styles.metaValue}>{details.venue}</Text>
                        </View>
                    </View>
                </View>

                {/* Big circular progress */}
                <View style={{ alignItems: 'center', marginVertical: 32 }}>
                    <CircularProgress
                        percentage={details.overallPercentage}
                        size={180}
                        strokeWidth={14}
                        label="Overall percentage"
                        color="#22c55e"
                    />
                </View>

                {/* Category grid */}
                <View style={styles.catGrid}>
                    {details.categories.map((cat, i) => (
                        <View key={i} style={styles.catCard}>
                            <View style={styles.catCardHeader}>
                                <Text style={styles.catLabel}>{cat.label}</Text>
                                <Text style={styles.catEmoji}>😁</Text>
                            </View>
                            <Text style={styles.catScore}>{cat.score}/10</Text>
                            <ScoreBar score={cat.score} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// ─── Screen 3: Line Chart ─────────────────────────────────────────────────────
function ChartScreen({ searchQuery, setSearchQuery, onBack }) {
    const pinkLine = "M 0,10 C 20,40 30,120 50,110 C 70,100 80,30 100,30 C 120,30 140,80 160,80 C 180,80 190,20 210,25 C 230,30 240,90 260,80 C 280,70 290,10 310,15";
    const redLine = "M 0,33 C 20,70 30,150 50,140 C 70,130 80,70 100,70 C 120,70 140,110 160,110 C 180,110 190,40 210,45 C 230,50 240,110 260,100 C 280,90 290,30 310,35";
    const blueLine = "M 0,66 C 20,100 30,190 50,180 C 70,170 80,110 100,105 C 120,100 140,150 160,150 C 180,150 190,80 210,85 C 230,90 240,140 260,130 C 280,120 290,60 310,65";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Customer feedback</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search venue..."
                        placeholderTextColor="#9ca3af"
                    />
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                {/* Title row */}
                <View style={styles.chartTitleContainer}>
                    <Text style={styles.chartTitle}>Customer Satisfaction Results</Text>
                    <TouchableOpacity style={styles.chartIconBtn} onPress={onBack}>
                        <Ionicons name="grid-outline" size={20} color="#1a1a1a" />
                    </TouchableOpacity>
                </View>

                {/* Legend */}
                <View style={styles.legendContainer}>
                    {[['#EC4899', 'Chelsea'], ['#EF4444', 'Acton'], ['#3B82F6', 'London Bridge']].map(([color, label]) => (
                        <View key={label} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: color }]} />
                            <Text style={styles.legendText}>{label}</Text>
                        </View>
                    ))}
                </View>

                {/* Chart */}
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
    const [searchQuery, setSearchQuery] = useState('Chelsea');
    const [screen, setScreen] = useState('cards'); // 'cards' | 'results' | 'chart'
    const [selectedCard, setSelectedCard] = useState(null);

    if (screen === 'results' && selectedCard) {
        return <ResultsScreen card={selectedCard} onBack={() => setScreen('cards')} />;
    }

    if (screen === 'chart') {
        return (
            <ChartScreen
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onBack={() => setScreen('cards')}
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
        />
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
    headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    content: { paddingHorizontal: 16, paddingBottom: 40 },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12,
        paddingHorizontal: 16, paddingVertical: 14, marginBottom: 30,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#1a1a1a', fontWeight: '500' },

    chartTitleContainer: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16,
    },
    chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
    chartIconBtn: {
        width: 36, height: 36, borderRadius: 8, borderWidth: 1.5,
        borderColor: '#1e293b', alignItems: 'center', justifyContent: 'center',
    },

    // Cards grid
    cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    card: {
        width: (width - 32 - 14) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    cardMetaText: { fontSize: 13, color: '#374151' },

    // Results
    metaStrip: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
        paddingVertical: 14, paddingHorizontal: 12,
        justifyContent: 'space-between',
    },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
    metaValue: { fontSize: 13, color: '#1a1a1a', fontWeight: '600' },
    metaSep: { width: 1, height: 30, backgroundColor: '#e5e7eb' },

    catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
    catCard: {
        width: (width - 32 - 14) / 2,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    catCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    catLabel: { fontSize: 13, color: '#6b7280' },
    catEmoji: { fontSize: 18 },
    catScore: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },

    // Chart
    legendContainer: { flexDirection: 'row', marginBottom: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    legendText: { fontSize: 13, color: '#4B5563' },

    chartArea: { flexDirection: 'row', marginTop: 10 },
    yAxis: {
        width: 30, height: 220, justifyContent: 'space-between',
        alignItems: 'center', marginRight: 10, paddingBottom: 25,
    },
    axisText: { fontSize: 12, color: '#4B5563', fontWeight: 'bold' },
    chartPlot: { flex: 1, position: 'relative', height: 240 },
    xAxis: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 30,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    axisTextX: { fontSize: 12, color: '#4B5563', fontWeight: 'bold', flex: 1, textAlign: 'center' },
});