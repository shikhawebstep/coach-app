import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const RESULTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 2, name: 'Clifford', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
    { id: 3, name: 'Curtis', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 4, name: 'Joshua', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
];

export default function CoachResults({ onBack, title = "My results" }) {
    const [searchQuery, setSearchQuery] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = getStyles(isDark);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={isDark ? '#6B7280' : '#a0a0a0'} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a coach..."
                    placeholderTextColor={isDark ? '#6B7280' : '#a0a0a0'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {RESULTS_DATA.map(item => (
                    <TouchableOpacity key={item.id} style={styles.card}>
                        <View style={styles.colName}>
                            <Text style={styles.nameText}>{item.name}</Text>
                        </View>

                        <View style={styles.colDateTime}>
                            <Text style={styles.dateTimeText}>{item.date}</Text>
                            <Text style={styles.dateTimeText}>{item.time}</Text>
                        </View>

                        <View style={styles.colVenue}>
                            <Text style={styles.venueText}>{item.venue}</Text>
                        </View>

                        <View style={styles.colScore}>
                            <View style={[styles.scoreBadge, { backgroundColor: item.color }]}>
                                <Text style={styles.scoreText}>{item.score}%</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={isDark ? '#fff' : '#000'} style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff',
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
        fontSize: 26,
        fontFamily: 'Urbanist_700Bold',
        color: isDark ? '#fff' : '#1a1a1a',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: isDark ? '#1E1E1E' : '#F9FAFB',
        borderWidth: 1,
        borderColor: isDark ? '#2C2C2E' : '#E5E7EB',
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
        color: isDark ? '#fff' : '#000',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isDark ? '#2C2C2E' : '#F9FAFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0 : 0.03,
        shadowRadius: 8,
        elevation: isDark ? 0 : 1,
    },
    colName: {
        flex: 1,
    },
    nameText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: isDark ? '#fff' : '#1a1a1a',
    },
    colDateTime: {
        flex: 1,
    },
    dateTimeText: {
        fontSize: 12,
        flex: 1,
        fontFamily: 'Urbanist_500Medium',
        color: isDark ? '#9CA3AF' : '#6B7280',
        lineHeight: 18,
    },
    colVenue: {
        flex: 1,
    },
    venueText: {
        textAlign:'center',
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: isDark ? '#fff' : '#1a1a1a',
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
});