import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BOOKINGS_DATA = [
    { id: 1, name: 'John Smith', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Pending' },
    { id: 2, name: 'John Smith', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Silver', status: 'Completed' },
    { id: 3, name: 'John Smith', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Completed' },
    { id: 4, name: 'John Smith', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Completed' },
    { id: 5, name: 'John Smith', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Pending' },
    { id: 6, name: 'Mark Gates', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Completed' },
    { id: 7, name: 'Mark Gates', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Completed' },
    { id: 8, name: 'Mark Gates', date: '3rd April 2023', time: '10:30-11:30am', packageType: 'Gold', status: 'Pending' },
];

export default function BirthdayParties({ onBack, onBookingSelect }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBookings = BOOKINGS_DATA.filter((booking) =>
        booking.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Birthday Parties</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, searchQuery ? styles.searchFocused : null]}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search students..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={20} color="#a0a0a0" />
                    </TouchableOpacity>
                )}
            </View>

            {/* List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.listTitle}>Your Birthday Party Bookings</Text>
                {filteredBookings.map((booking) => (
                    <TouchableOpacity
                        key={booking.id}
                        style={styles.card}
                        onPress={() => onBookingSelect && onBookingSelect(booking.id)}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{booking.name}</Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.cardText}>{booking.date}</Text>
                            <Text style={styles.cardText}>{booking.time}</Text>
                        </View>
                        <View style={styles.cardPackage}>
                            <Text style={styles.packageText}>{booking.packageType}</Text>
                        </View>
                        <View style={styles.cardStatusContainer}>
                            <View style={[
                                styles.statusBadge,
                                booking.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    booking.status === 'Completed' ? styles.statusTextWhite : styles.statusTextBlack
                                ]}>{booking.status}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
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
    clearIcon: {
        padding: 4,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1a1a1a',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardInfo: {
        width: 80,
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    cardDetails: {
        flex: 1,
        marginRight: 8,
    },
    cardText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    cardPackage: {
        width: 45,
        alignItems: 'flex-start',
        marginRight: 8,
    },
    packageText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    cardStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    statusCompleted: {
        backgroundColor: '#1CAB4B', // Green
    },
    statusPending: {
        backgroundColor: '#FFD700', // Yellow
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextWhite: {
        color: '#fff',
    },
    statusTextBlack: {
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 4,
    },
});
