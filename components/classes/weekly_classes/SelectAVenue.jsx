import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const VENUES_DATA = [
    { id: 1, name: 'Acton' },
    { id: 2, name: 'Chelsea' },
    { id: 3, name: 'Stonebridge' },
    { id: 4, name: 'Tottenham' },
];

export default function SelectAVenue({ onBack, onVenueSelect }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVenues = VENUES_DATA.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select a venue</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, searchQuery ? styles.searchFocused : null]}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a venue..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.listTitle}>Your venues</Text>
                {filteredVenues.map((venue) => (
                    <TouchableOpacity
                        key={venue.id}
                        style={styles.card}
                        onPress={() => onVenueSelect && onVenueSelect(venue.id)}
                    >
                        <Text style={styles.cardTitle}>{venue.name}</Text>
                    </TouchableOpacity>
                ))}
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
        backgroundColor: '#F8F9FB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    searchFocused: {
        borderColor: '#3B82F6',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1a1a1a',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6', // Light gray background matching screenshot
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        color: '#1a1a1a',
    },
});
