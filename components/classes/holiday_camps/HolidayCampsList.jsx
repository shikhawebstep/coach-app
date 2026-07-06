import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        searchBg: '#F8F9FB',
        searchBorder: '#E5E7EB',
        searchText: '#000',
        searchPlaceholder: '#a0a0a0',
        listTitle: '#1a1a1a',
        emptyText: '#666',
        cardBg: '#fff',
        cardBorder: '#F0F0F0',
        cardTitle: '#1a1a1a',
        cardText: '#666',
        durationText: '#1a1a1a',
        statusPendingBg: '#FFD700',
        statusText: '#1a1a1a',
        chevron: '#000',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        searchBg: '#1E1E1E',
        searchBorder: '#3A3A3A',
        searchText: '#F5F5F5',
        searchPlaceholder: '#9CA3AF',
        listTitle: '#F5F5F5',
        emptyText: '#9CA3AF',
        cardBg: '#1E1E1E',
        cardBorder: '#2A2A2A',
        cardTitle: '#F5F5F5',
        cardText: '#9CA3AF',
        durationText: '#F5F5F5',
        statusPendingBg: '#7A6A00',
        statusText: '#F5F5F5',
        chevron: '#F5F5F5',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function HolidayCampsList({ onBack, onCampSelect }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

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

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Holiday Camps</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={theme.searchPlaceholder} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by venue or area..."
                    placeholderTextColor={theme.searchPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={theme.searchPlaceholder} />
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
                                    <Ionicons name="chevron-forward" size={20} color={theme.chevron} style={styles.chevron} />
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

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
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
        color: theme.headerTitle,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: theme.searchBg,
        borderWidth: 1,
        borderColor: theme.searchBorder,
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
        color: theme.searchText,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 16,
        color: theme.listTitle,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.emptyText,
        textAlign: 'center',
        marginTop: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBg,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
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
        color: theme.cardTitle,
        lineHeight: 20,
    },
    cardDetails: {
        flex: 1,
        marginRight: 8,
    },
    cardText: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: theme.cardText,
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
        color: theme.durationText,
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
        backgroundColor: theme.statusPendingBg,
    },
    statusText: {
        fontSize: 13,
        fontFamily: 'Urbanist_600SemiBold',
        color: theme.statusText,
    },
    chevron: {
        marginLeft: 4,
    },
});