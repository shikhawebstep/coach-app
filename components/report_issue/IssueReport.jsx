import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import CustomLoader from '@/components/common/CustomLoader';

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        headerBorder: '#E0E0E0',
        solvedBg: '#1CAB4B',
        pendingBg: '#FBBF24',
        solvedText: '#fff',
        pendingText: '#1a1a1a',
        cardBackground: '#fff',
        cardBorder: '#F0F0F0',
        cardLabel: '#797A88',
        cardValue: '#1a1a1a',
        reportTitle: '#6B7280',
        reportDescription: '#1B1B1E',
        loadingText: '#6B7280',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        headerBorder: '#2A2A2A',
        solvedBg: '#1CAB4B',
        pendingBg: '#FBBF24',
        solvedText: '#fff',
        pendingText: '#1a1a1a',
        cardBackground: '#1E1E1E',
        cardBorder: '#2A2A2A',
        cardLabel: '#9CA3AF',
        cardValue: '#F5F5F5',
        reportTitle: '#9CA3AF',
        reportDescription: '#E5E5E5',
        loadingText: '#9CA3AF',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function IssueReport({ reportId, onBack }) {
    const { token } = useAuth();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);
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
                <CustomLoader size={80} color="#3B82F6" />
            </View>
        );
    }

    if (!report) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Text style={{ fontSize: 16, color: theme.loadingText }}>Report details not found.</Text>
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
                        <Ionicons name="arrow-back" size={24} color={theme.icon} />
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

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 20
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingBottom: 24,
        borderBottomColor: theme.headerBorder,
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
        color: theme.headerTitle,
    },
    statusButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    solvedButton: {
        backgroundColor: theme.solvedBg,
    },
    pendingButton: {
        backgroundColor: theme.pendingBg,
    },
    statusText: {
        fontFamily: 'Urbanist_700Bold',
        fontSize: 14,
    },
    solvedText: {
        color: theme.solvedText,
    },
    pendingText: {
        color: theme.pendingText,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        elevation: 1,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.shadowOpacity,
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
        color: theme.cardLabel,
    },
    cardValue: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.cardValue,
    },
    reportTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: theme.reportTitle,
        marginBottom: 12,
    },
    reportDescription: {
        fontSize: 14,
        fontFamily: 'Urbanist_500Medium',  // 'medium' invalid theme property, fix kiya
        color: theme.reportDescription,
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});