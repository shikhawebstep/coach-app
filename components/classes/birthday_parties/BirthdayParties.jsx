// BirthdayParties.jsx

import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BirthdayParties({ onBack, onBookingSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/birthday-party/bookings`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (response.ok) setBookings(result?.data || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const studentName = `${booking.students?.[0]?.studentFirstName || ''} ${booking.students?.[0]?.studentLastName || ''}`.toLowerCase()
        const parentName = booking.lead?.parentName?.toLowerCase() || ''
        const q = searchQuery.toLowerCase()
        return studentName.includes(q) || parentName.includes(q)
    })

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
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.listTitle}>Your Birthday Party Bookings</Text>
                    {filteredBookings.length === 0 ? (
                        <Text style={styles.emptyText}>No bookings found</Text>
                    ) : (
                        filteredBookings.map((booking) => {
                            const student = booking.students?.[0]
                            const studentName = `${student?.studentFirstName || ''} ${student?.studentLastName || ''}`.trim()
                            const date = booking.date
                                ? new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                                : '-'
                            const time = booking.time || '-'
                            const packageType = booking.package?.packageName || '-'
                            const status = booking.status

                            return (
                                <TouchableOpacity
                                    key={booking.id}
                                    style={styles.card}
                                    onPress={() => onBookingSelect && onBookingSelect(booking)}
                                >
                                    <View style={styles.cardInfo}>
                                        <Text style={styles.cardTitle}>{studentName}</Text>
                                    </View>
                                    <View style={styles.cardDetails}>
                                        <Text style={styles.cardText}>{date}</Text>
                                        <Text style={styles.cardText}>{time}</Text>
                                    </View>
                                    <View style={styles.cardPackage}>
                                        <Text style={styles.packageText}>{packageType}</Text>
                                    </View>
                                    <View style={styles.cardStatusContainer}>
                                        <View style={[
                                            styles.statusBadge,
                                            status === 'active' ? styles.statusCompleted : styles.statusPending
                                        ]}>
                                            <Text style={[
                                                styles.statusText,
                                                status === 'active' ? styles.statusTextWhite : styles.statusTextBlack
                                            ]}>
                                                {status === 'active' ? 'Active' : 'Pending'}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    )}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: { marginRight: 12 },
    headerTitle: { fontSize: 24,  color: '#1a1a1a', fontFamily: 'Urbanist_700Bold' },
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
    searchFocused: { borderColor: '#3B82F6' },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#000', fontFamily: 'Urbanist_400Regular' },
    clearIcon: { padding: 4 },
    listContainer: { flex: 1, paddingHorizontal: 16 },
    listTitle: { fontSize: 18,  marginBottom: 16, color: '#1a1a1a', fontFamily: 'Urbanist_700Bold' },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 15, fontFamily: 'Urbanist_400Regular' },
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
    cardInfo: { width: 80, marginRight: 16 },
    cardTitle: { fontSize: 14,  color: '#1a1a1a', fontFamily: 'Urbanist_700Bold' },
    cardDetails: { flex: 1, marginRight: 8 },
    cardText: { fontSize: 13, color: '#666', lineHeight: 18, fontFamily: 'Urbanist_400Regular' },
    cardPackage: { width: 45, alignItems: 'flex-start', marginRight: 8 },
    packageText: { fontSize: 14,  color: '#1a1a1a', fontFamily: 'Urbanist_700Bold' },
    cardStatusContainer: { flexDirection: 'row', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
    statusCompleted: { backgroundColor: '#1CAB4B' },
    statusPending: { backgroundColor: '#FFD700' },
    statusText: { fontSize: 12, fontFamily: 'Urbanist_600SemiBold' },
    statusTextWhite: { color: '#fff' },
    statusTextBlack: { color: '#1a1a1a' },
    chevron: { marginLeft: 4 },
});