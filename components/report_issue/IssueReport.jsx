import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IssueReport({ reportId, onBack }) {
    const { token } = useAuth();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (reportId) {
            fetchReportDetail();
        }
    }, [reportId]);

    const fetchReportDetail = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/report-issue/listBy/${reportId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const result = await response.json();
            if (response.ok) {
                setReport(result.data || null);
            }
        } catch (error) {
            console.error('Failed to fetch report detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const formatHeaderDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if (!report) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={{ fontSize: 16, color: '#6B7280' }}>Report details not found.</Text>
                </View>
            </View>
        );
    }

    const isSolved = report.status?.toLowerCase() === 'solved';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{formatHeaderDate(report.createdAt)}</Text>
                </View>
                <View style={[styles.statusButton, isSolved ? styles.solvedButton : styles.pendingButton]}>
                    <Text style={[styles.statusText, isSolved ? styles.solvedText : styles.pendingText]}>
                        {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : ''}
                    </Text>
                </View>
            </View>

            <View>
                {/* Stats Card */}
                <View style={styles.card}>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                            <Image
                                source={require('@/assets/images/Calendar.png')}
                                resizeMode="contain"
                                style={{height:13,width:13,marginRight:5}} />
                            <Text style={styles.cardLabel}>Date</Text>
                        </View>
                        <Text style={styles.cardValue}>{formatDate(report.createdAt)}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                         <Image
                                source={require('@/assets/images/TimeCircle.png')}
                                resizeMode="contain"
                                style={{height:13,width:13,marginRight:5}} />
                            <Text style={styles.cardLabel}>Time</Text>
                        </View>
                        <Text style={styles.cardValue}>{formatTime(report.createdAt)}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                          <Image
                                source={require('@/assets/images/Document.png')}
                                resizeMode="contain"
                                style={{height:13,width:13,marginRight:5}} />
                            <Text style={styles.cardLabel}>Category</Text>
                        </View>
                        <Text style={styles.cardValue}>{report.category}</Text>
                    </View>
                    <View style={styles.cardItem}>
                        <View style={styles.cardIconRow}>
                          <Image
                                source={require('@/assets/images/Location.png')}
                                resizeMode="contain"
                                style={{height:13,width:13,marginRight:5}} />
                            <Text style={styles.cardLabel}>Venue</Text>
                        </View>
                        <Text style={styles.cardValue}>{report.venue?.area || 'Unknown'}</Text>
                    </View>
                </View>

                {/* Report Content */}
                {/* <Text style={styles.reportTitle}>{report.title || 'Report issue'}</Text> */}
                <Text style={styles.reportTitle}>Report issue</Text>
                <Text style={styles.reportDescription}>
                    {report.reportIssue}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingBottom: 24,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1,
        marginBottom: 20
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
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    statusButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    solvedButton: {
        backgroundColor: '#1CAB4B',
    },
    pendingButton: {
        backgroundColor: '#FBBF24',
    },
    statusText: {
        fontFamily: 'Urbanist_700Bold',
        fontSize: 14,
    },
    solvedText: {
        color: '#fff',
    },
    pendingText: {
        color: '#1a1a1a',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    cardItem: {
        flex: 1,
    },
    cardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardLabel: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: '#797A88',
    },
    cardValue: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    reportTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: '#6B7280',
        marginBottom: 12,
    },
    reportDescription: {
        fontSize: 14,
        fontFamily: 'Urbanist_500Medium',  // 'medium' invalid tha, fix kiya
        color: '#1B1B1E',
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});