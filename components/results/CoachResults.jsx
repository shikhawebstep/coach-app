import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const RESULTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh',  date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross',   score: 75, color: '#1CAB4B' },
    { id: 2, name: 'Clifford',       date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith',  score: 43, color: '#EF4444' },
    { id: 3, name: 'Curtis',         date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross',   score: 75, color: '#1CAB4B' },
    { id: 4, name: 'Joshua',         date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith',  score: 43, color: '#EF4444' },
];

// ── Theme tokens ────────────────────────────────────────────────────────────
const palettes = {
    light: {
        background: '#fff',
        headerTitle: '#111827',
        backIcon: '#111827',
        searchBg: '#F6F6F7',
        searchBorder: '#E5E7EB',
        searchIcon: '#9CA3AF',
        searchPlaceholder: '#9CA3AF',
        searchText: '#111827',
        cardBg: '#fff',
        cardBorder: '#F3F4F6',
        nameText: '#111827',
        dateText: '#6B7280',
        timeText: '#6B7280',
        venueText: '#111827',
        scoreText: '#fff',
        chevron: '#111827',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#0B0F14',
        headerTitle: '#F3F4F6',
        backIcon: '#F3F4F6',
        searchBg: '#1A1F26',
        searchBorder: '#2A313B',
        searchIcon: '#7D8590',
        searchPlaceholder: '#7D8590',
        searchText: '#F3F4F6',
        cardBg: '#151A21',
        cardBorder: '#242B33',
        nameText: '#F3F4F6',
        dateText: '#9CA3AF',
        timeText: '#9CA3AF',
        venueText: '#F3F4F6',
        scoreText: '#fff',
        chevron: '#F3F4F6',
        shadowOpacity: 0.3,
    },
};

export default function CoachResults({ onBack, title = 'My results' }) {
    const [searchQuery, setSearchQuery] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? palettes.dark : palettes.light;
    const styles = getStyles(theme);

    const filtered = RESULTS_DATA.filter(item =>
        (item?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    return (
        <View style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color={theme.backIcon} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {/* ── Search ── */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={theme.searchIcon} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a coach..."
                    placeholderTextColor={theme.searchPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* ── Cards ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            >
                {filtered.map(item => (
                    <TouchableOpacity key={item?.id ?? Math.random()} style={styles.card} activeOpacity={0.85}>

                        {/* Name */}
                        <View style={styles.colName}>
                            <Text style={styles.nameText}>{item?.name || '-'}</Text>
                        </View>

                        {/* Date / Time */}
                        <View style={styles.colDateTime}>
                            <Text style={styles.dateText}>{item?.date || '-'}</Text>
                            <Text style={styles.timeText}>{item?.time || '-'}</Text>
                        </View>

                        {/* Venue */}
                        <View style={styles.colVenue}>
                            <Text style={styles.venueText}>{item?.venue || '-'}</Text>
                        </View>

                        {/* Score + Chevron */}
                        <View style={styles.colScore}>
                            <View style={[styles.scoreBadge, { backgroundColor: item?.color || '#6B7280' }]}>
                                <Text style={styles.scoreText}>
                                    {item?.score !== undefined && item?.score !== null ? `${item.score}%` : '-'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={theme.chevron} style={styles.chevron} />
                        </View>

                    </TouchableOpacity>
                ))}
                <View style={{ height: 48 }} />
            </ScrollView>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 10,
        padding: 2,
    },
    headerTitle: {
        fontSize: 26,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
        letterSpacing: -0.3,
    },

    /* Search */
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: theme.searchBg,
        borderWidth: 1.5,
        borderColor: theme.searchBorder,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 22,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Urbanist_400Regular',
        color: theme.searchText,
    },

    /* List */
    listContent: {
        paddingHorizontal: 20,
    },

    /* Card */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBg,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },

    /* Col: Name */
    colName: {
        flex: 1,
    },
    nameText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: theme.nameText,
        lineHeight: 18,
    },

    /* Col: Date/Time */
    colDateTime: {
        flex: 1.3,
        paddingRight: 4,
    },
    dateText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.dateText,
        lineHeight: 18,
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.timeText,
        lineHeight: 18,
    },

    /* Col: Venue */
    colVenue: {
        flex: 1.5,
    },
    venueText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: theme.venueText,
        textAlign: 'center',
        paddingRight: 10,
    },

    /* Col: Score */
    colScore: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    scoreBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        minWidth: 52,
        alignItems: 'center',
    },
    scoreText: {
        color: theme.scoreText,
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
    },
    chevron: {
        marginLeft: 6,
    },
});