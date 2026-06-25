import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = ['Equipment', 'Incident', 'Complaint', 'Coaches', 'Venue', 'Other'];

export default function ReportIssueList({ onNewReport, onReportSelect, onBack }) {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['Equipment']);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchReports(); }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/report-issue/list`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const result = await response.json();
            if (response.ok) setReports(result.data || []);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const filteredReports = reports.filter(report => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(report.category);
        const matchesSearch = (report.venue?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Report an issue</Text>
                </View>
                <TouchableOpacity style={styles.newReportBtn} onPress={onNewReport}>
                    <Text style={styles.newReportBtnText}>New report</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#797A88" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a venue..."
                    placeholderTextColor="#797A88"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                {CATEGORIES.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={styles.checkboxItem}
                        onPress={() => toggleCategory(category)}
                    >
                        <View style={[
                            styles.checkbox,
                            selectedCategories.includes(category) && styles.checkboxChecked,
                        ]}>
                            {selectedCategories.includes(category) && (
                                <Ionicons name="checkmark" size={16} color="#fff" />
                            )}
                        </View>
                        <Text style={styles.checkboxText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {filteredReports.map(report => (
                        <TouchableOpacity
                            key={report.id}
                            style={styles.card}
                            onPress={() => onReportSelect && onReportSelect(report.id)}
                        >
                            <View style={styles.col1}>
                                <Text style={styles.venue}>{report.venue?.area || 'Unknown'}</Text>
                            </View>

                            <View style={styles.col2}>
                                <Text style={styles.dateTime}>{formatDate(report.createdAt)}</Text>
                                <Text style={styles.dateTime}>{formatTime(report.createdAt)}</Text>
                            </View>

                            <View style={styles.col3}>
                                <Text style={styles.category}>{report.category}</Text>
                            </View>

                            <View style={styles.col4}>
                                <View style={[
                                    styles.statusBadge,
                                    report.status?.toLowerCase() === 'solved' ? styles.solvedBadge : styles.pendingBadge,
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        report.status?.toLowerCase() === 'solved' ? styles.solvedText : styles.pendingText,
                                    ]}>
                                        {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : ''}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron} />
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 26,
        fontFamily: 'Urbanist_700Bold',
        color: '#353535',
    },
    newReportBtn: {
        backgroundColor: '#2F5FE5',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
    },
    newReportBtnText: {
        color: '#fff',
        fontFamily: 'Urbanist_600SemiBold',
        fontSize: 14,
    },

    /* Search */
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#F6F6F7',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 20,
    },
    searchIcon: { marginRight: 10 },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#000',
    },

    /* Filters */
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%',
        marginBottom: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#A1A1AA',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: '#5F5F6D',
    },

    /* List */
    listContent: { paddingHorizontal: 16 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    /* Card */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    col1: { flex: 1.4 },
    venue: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: '#212121',
    },
    col2: { flex: 1.2 },
    dateTime: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: '#6B7280',
        lineHeight: 18,
    },
    col3: { flex: 1.2 },
    category: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: '#212121',
    },
    col4: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    solvedBadge: { backgroundColor: '#1CAB4B' },
    pendingBadge: { backgroundColor: '#F7D02A' },
    statusText: { fontSize: 12, fontFamily: 'Urbanist_700Bold' },
    solvedText: { color: '#fff' },
    pendingText: { color: '#1a1a1a' },
    chevron: { marginLeft: 6 },
});