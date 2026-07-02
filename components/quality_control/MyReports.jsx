import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

const RESULTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 2, name: 'Clifford', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
    { id: 3, name: 'Curtis', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 4, name: 'Joshua', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
];

const LIGHT = {
    background: '#fff',
    headerTitle: '#1a1a1a',
    searchBg: '#F6F6F7',
    searchBorder: '#9E9FAA',
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
};

const DARK = {
    background: '#121212',
    headerTitle: '#FFFFFF',
    searchBg: '#1E1E1E',
    searchBorder: '#3A3A3C',
    searchIcon: '#8E8E93',
    searchText: '#FFFFFF',
    cardBg: '#1E1E1E',
    cardBorder: '#2C2C2E',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    nameText: '#FFFFFF',
    dateTimeText: '#A1A1AA',
    venueText: '#FFFFFF',
    chevron: '#FFFFFF',
    backIcon: '#FFFFFF',
};

export default function MyReports({ onBack, title = "My reports" }) {
    const [searchQuery, setSearchQuery] = useState('');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? DARK : LIGHT;
    const styles = createStyles(colors);

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

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.searchIcon} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a coach..."
                    placeholderTextColor={colors.searchIcon}
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
                            <Ionicons name="chevron-forward" size={16} color={colors.chevron} style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
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
        marginRight: 12,
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
        paddingVertical: 14,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: colors.searchText,
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
        flex: 1,
    },
    nameText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: colors.nameText,
    },
    colDateTime: {
        flex: 1.5,
    },
    dateTimeText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
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
});