import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const VENUES_LIST = [
    { id: 1, name: 'Select all', selected: false },
    { id: 2, name: 'Acton', selected: false },
    { id: 3, name: 'London bridge', selected: true },
    { id: 4, name: 'Finchley', selected: false },
    { id: 5, name: 'London bridge', selected: false },
    { id: 6, name: 'Stonebridge', selected: true },
    { id: 7, name: 'Tottenham', selected: true },
    { id: 8, name: 'London bridge', selected: false },
    { id: 9, name: 'Wembley sun', selected: false },
];

export default function VenuesFilter({ onBack }) {
    const [venues, setVenues] = useState(VENUES_LIST);

    const toggleVenue = (id) => {
        setVenues(venues.map(v =>
            v.id === id ? { ...v, selected: !v.selected } : v
        ));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}></Text>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.pageTitle}>Venues</Text>
            </View>

            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {venues.map(venue => (
                    <TouchableOpacity
                        key={venue.id}
                        style={styles.listItem}
                        onPress={() => toggleVenue(venue.id)}
                    >
                        <Text style={styles.venueName}>{venue.name}</Text>

                        {/* Checkbox manually styled to match screenshot */}
                        <View style={[styles.checkboxContainer, venue.selected && styles.checkboxActive]}>
                            {venue.selected && <Ionicons name="checkmark" size={16} color="#fff" />}
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
        paddingBottom: 8,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        flex: 1,
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', // Line divider under standard title
    },
    pageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    listContent: {
        paddingTop: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    venueName: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#9CA3AF', // Gray border
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: '#3B82F6', // Blue fill
        borderColor: '#3B82F6',
    },
});
