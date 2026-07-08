// MyReports.js
import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import ObservationDetail from './ObservationDetail';

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
    textSecondary: '#6B7280',
    primary: '#3B82F6',
    error: '#EF4444',
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
    textSecondary: '#9CA3AF',
    primary: '#5B9CFF',
    error: '#F87171',
};

// score >= threshold -> green badge, else red
const SCORE_PASS_THRESHOLD = 50;

const formatDate = (isoString) => {
    if (!isoString) return '-';
    try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return '-';
    }
};

export default function MyReports({ onBack, title = "My reports" }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [reportsData, setReportsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Tracks which report's issue detail is currently open
const [selectedObservationId, setSelectedObservationId] = useState(null);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const colors = isDark ? DARK : LIGHT;
    const styles = createStyles(colors);

    const { token } = useAuth();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/observation/list`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token || ""}` },
                    redirect: "follow",
                }
            );

            const result = await response.json().catch(() => ({}));

            if (response.ok) {
                const list = Array.isArray(result?.data) ? result.data : [];
                setReportsData(list);
            } else {
                setError(result?.message || "Failed to load reports.");
            }
        } catch (err) {
            console.error("Failed to fetch reports:", err);
            setError("Something went wrong while loading reports.");
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        // score aata hai as string "76%" — % hata ke number nikaalo
        const numericScore = parseFloat(String(score).replace('%', '')) || 0;
        return numericScore >= SCORE_PASS_THRESHOLD ? '#1CAB4B' : '#EF4444';
    };

    const filteredReports = reportsData.filter(item => {
        const name = item?.coachName || '';
        return name.toLowerCase().includes((searchQuery || '').toLowerCase());
    });

    // Agar koi report select ho chuki hai, uska issue detail screen dikhao
 if (selectedObservationId) {
    return (
        <ObservationDetail
            observationId={selectedObservationId}
            onBack={() => setSelectedObservationId(null)}
        />
    );
}

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
                    placeholder="Search by coach name..."
                    placeholderTextColor={colors.searchIcon}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={colors.searchIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}

            {loading ? (
                <View style={styles.centered}>
                    <CustomLoader size={80} color={colors.primary} />
                </View>
            ) : filteredReports.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No reports found</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {filteredReports.map((item, index) => (
                        <TouchableOpacity
                            key={item?.id ?? index}
                            style={styles.card}
                            onPress={() => setSelectedObservationId(item.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.colName}>
                                <Text style={styles.nameText}>{item?.coachName || 'Unknown'}</Text>
                            </View>

                            <View style={styles.colDateTime}>
                                <Text style={styles.dateTimeText}>{formatDate(item?.observationDate)}</Text>
                                <Text style={styles.dateTimeText}>{item?.observationTime || '-'}</Text>
                            </View>

                            <View style={styles.colVenue}>
                                <Text style={styles.venueText}>{item?.venue || '-'}</Text>
                            </View>

                            <View style={styles.colScore}>
                                <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(item?.score) }]}>
                                    <Text style={styles.scoreText}>
                                        {item?.score ? String(item.score) : '0%'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={colors.chevron} style={styles.chevron} />
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 14,
        color: colors.textSecondary,
        fontFamily: 'Urbanist_400Regular',
    },
    errorText: {
        color: colors.error,
        textAlign: 'center',
        marginBottom: 12,
        marginHorizontal: 16,
        fontFamily: 'Urbanist_400Regular',
        fontSize: 13,
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
        flex: 1,
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