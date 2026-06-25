import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HolidayCampsList({ onBack, onCampSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/holiday-camp/venues`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (response.ok) setData(result?.data || []);
        } catch (error) {
            console.error('Failed to fetch venues:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVenues = data.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.area.toLowerCase().includes(searchQuery.toLowerCase())
    );


    console.log('data', data)
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Holiday Camps</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by venue or area..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color="#a0a0a0" />
                    </TouchableOpacity>
                )}
            </View>

            {/* List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.listTitle}>Venues</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#1CAB4B" style={{ marginTop: 40 }} />
                ) : filteredVenues.length === 0 ? (
                    <Text style={styles.emptyText}>No venues found.</Text>
                ) : (
                    filteredVenues.map((venue) => {
                        const campDate = venue.holidayCamps?.[0]?.holidayCampDates?.[0];
                        const schedule = venue.classSchedules?.[0];
                        const totalDays = campDate?.totalDays;

                        const formatDate = (dateStr) => {
                            if (!dateStr) return '-';
                            const date = new Date(dateStr);
                            return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                        };

                        const timeRange = schedule
                            ? `${schedule.startTime} - ${schedule.endTime}`
                            : '-';

                        return (
                            <TouchableOpacity
                                key={venue.id}
                                style={styles.card}
                                onPress={() => onCampSelect(venue.id)}
                            >
                                <View style={styles.cardInfo}>
                                    <Text style={styles.cardTitle}>{venue.name}</Text>
                                </View>
                                <View style={styles.cardDetails}>
                                    <Text style={styles.cardText}>{formatDate(campDate?.startDate)}</Text>
                                    <Text style={styles.cardText}>{timeRange}</Text>
                                </View>
                                <View style={styles.cardDuration}>
                                    <Text style={styles.durationText}>{totalDays ? `${totalDays} Days` : '-'}</Text>
                                </View>
                                <View style={styles.cardStatusContainer}>
                                    <View style={[styles.statusBadge, styles.statusPending]}>
                                        <Text style={styles.statusText}>Pending</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}

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
        fontFamily: 'Urbanist_700Bold',
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
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#000',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
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
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
        lineHeight: 20,
    },
    cardDetails: {
        flex: 1,
        marginRight: 8,
    },
    cardText: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: '#666',
        lineHeight: 18,
    },
    cardDuration: {
        width: 60,
        alignItems: 'center',
        marginRight: 8,
    },
    durationText: {
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
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
    statusPending: {
        backgroundColor: '#FFD700',
    },
    statusText: {
        fontSize: 13,
        fontFamily: 'Urbanist_600SemiBold',
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 4,
    },
});