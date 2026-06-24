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

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/report-issue/list`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const result = await response.json();
            if (response.ok) {
                setReports(result.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const filteredReports = reports.filter(report => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(report.category);
        const venueName = report.venue?.name || '';
        const matchesSearch = venueName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {onBack && (
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                    )}
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
                    placeholderTextColor="#a0a0a0"
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
                        <Ionicons
                            name={selectedCategories.includes(category) ? "checkbox" : "square-outline"}
                            size={24}
                            color={selectedCategories.includes(category) ? "#3B82F6" : "#A1A1AA"}
                        />
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
                        <TouchableOpacity key={report.id} style={styles.card} onPress={() => onReportSelect && onReportSelect(report.id)}>
                            <View style={styles.col1}>
                                <Text style={styles.venue}>{report.venue?.name || 'Unknown'}</Text>
                            </View>

                            <View style={styles.col2}>
                                <Text style={styles.dateTime}>{formatDate(report.createdAt)}</Text>
                                <Text style={styles.dateTime}>{formatTime(report.createdAt)}</Text>
                            </View>

                            <View style={styles.col3}>
                                <Text style={styles.category}>{report.category}</Text>
                            </View>

                            <View style={styles.col4}>
                                <View style={[styles.statusBadge, report.status?.toLowerCase() === 'solved' ? styles.solvedBadge : styles.pendingBadge]}>
                                    <Text style={[styles.statusText, report.status?.toLowerCase() === 'solved' ? styles.solvedText : styles.pendingText]}>
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
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    newReportBtn: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    newReportBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#F6F6F7',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%', // 3 columns
        marginBottom: 16,
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4B5563',
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
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    col1: {
        flex: 1.2,
    },
    venue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    col2: {
        flex: 1.5,
    },
    dateTime: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    col3: {
        flex: 1.2,
    },
    category: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
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
    solvedBadge: {
        backgroundColor: '#1CAB4B', // Green
    },
    pendingBadge: {
        backgroundColor: '#FBBF24', // Yellow
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    solvedText: {
        color: '#fff',
    },
    pendingText: {
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
