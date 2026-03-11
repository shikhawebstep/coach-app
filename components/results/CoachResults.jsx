import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const RESULTS_DATA = [
    { id: 1, name: 'Daniel\nWalsh', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 2, name: 'Clifford', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
    { id: 3, name: 'Curtis', date: '3rd April 2023', time: '10:30-11:30am', venue: 'King Cross', score: 75, color: '#1CAB4B' },
    { id: 4, name: 'Joshua', date: '3rd April 2023', time: '10:30-11:30am', venue: 'Hammersmith', score: 43, color: '#EF4444' },
];

export default function CoachResults({ onBack, title = "My results" }) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {onBack && (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a coach..."
                    placeholderTextColor="#a0a0a0"
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
                            <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB', // Lighter grey border
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
        color: '#000',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    colName: {
        flex: 1,
    },
    nameText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    colDateTime: {
        flex: 1.5,
    },
    dateTimeText: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    colVenue: {
        flex: 1,
    },
    venueText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
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
        fontWeight: 'bold',
        fontSize: 12,
    },
    chevron: {
        marginLeft: 8,
    },
});
