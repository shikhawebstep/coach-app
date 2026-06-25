import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RESULTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh',  date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross',   score: 75, color: '#1CAB4B' },
    { id: 2, name: 'Clifford',       date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith',  score: 43, color: '#EF4444' },
    { id: 3, name: 'Curtis',         date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross',   score: 75, color: '#1CAB4B' },
    { id: 4, name: 'Joshua',         date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith',  score: 43, color: '#EF4444' },
];

export default function CoachResults({ onBack, title = 'My results' }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = RESULTS_DATA.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {/* ── Search ── */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a coach..."
                    placeholderTextColor="#9CA3AF"
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
                    <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.85}>

                        {/* Name */}
                        <View style={styles.colName}>
                            <Text style={styles.nameText}>{item.name}</Text>
                        </View>

                        {/* Date / Time */}
                        <View style={styles.colDateTime}>
                            <Text style={styles.dateText}>{item.date}</Text>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>

                        {/* Venue */}
                        <View style={styles.colVenue}>
                            <Text style={styles.venueText}>{item.venue}</Text>
                        </View>

                        {/* Score + Chevron */}
                        <View style={styles.colScore}>
                            <View style={[styles.scoreBadge, { backgroundColor: item.color }]}>
                                <Text style={styles.scoreText}>{item.score}%</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#111827" style={styles.chevron} />
                        </View>

                    </TouchableOpacity>
                ))}
                <View style={{ height: 48 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        color: '#111827',
        letterSpacing: -0.3,
    },

    /* Search */
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: '#F6F6F7',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
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
        color: '#111827',
    },

    /* List */
    listContent: {
        paddingHorizontal: 20,
    },

    /* Card */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
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
        color: '#111827',
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
        color: '#6B7280',
        lineHeight: 18,
    },
    timeText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: '#6B7280',
        lineHeight: 18,
    },

    /* Col: Venue */
    colVenue: {
        flex: 1.5,
    },
    venueText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: '#111827',
        textAlign:'center',
        paddingRight:10,
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
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
    },
    chevron: {
        marginLeft: 6,
    },
});