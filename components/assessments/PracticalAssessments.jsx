import CustomLoader from '@/components/common/CustomLoader';
import { Ionicons } from '@expo/vector-icons';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        let suffix = 'th';
        if (day === 1 || day === 21 || day === 31) suffix = 'st';
        else if (day === 2 || day === 22) suffix = 'nd';
        else if (day === 3 || day === 23) suffix = 'rd';

        return `${day}${suffix} ${month} ${year}`;
    } catch (e) {
        return dateStr;
    }
};

const COLORS = {
    light: {
        background: '#fff',
        cardBackground: '#fff',
        cardBorder: '#F9FAFB',
        headerTitle: '#1a1a1a',
        name: '#1a1a1a',
        dateTime: '#6B7280',
        venue: '#1a1a1a',
        icon: '#000',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        cardBackground: '#1E1E1E',
        cardBorder: '#2A2A2A',
        headerTitle: '#F5F5F5',
        name: '#F5F5F5',
        dateTime: '#9CA3AF',
        venue: '#F5F5F5',
        icon: '#F5F5F5',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

// onStart receives the full assessment record (id, name, date, time, venue)
// so downstream screens — and the final Results screen — can show the real
// candidate instead of nothing.
export default function PracticalAssessments({ onBack, onStart, onViewResults, assessments = [], isLoading = false, error = null, onRefresh }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    // Map API data to the format the view expects
    const mappedAssessments = (assessments || []).map(item => {
        const status = item.leadStatus === 'practical_assessment' ? 'Start' : 'Complete';
        const formattedDate = formatDate(item.date);


        // Utility: formats "10:30 AM" + "11:30 AM" => "10:30-11:30am"
        // Also handles cross-period case: "11:30 AM" + "12:30 PM" => "11:30am-12:30pm"
        const formatTimeRange = (start, end) => {
            if (!start || !end) return '-';

            const parseTime = (t) => {
                if (!t) return null;

                // Handles "HH:mm", "HH:mm:ss", "hh:mm AM/PM", "hh:mm:ss AM/PM"
                const match = t.trim().match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM|am|pm)?/);
                if (!match) return null;

                let hours = parseInt(match[1], 10);
                const minutes = match[2];
                const meridiemRaw = match[3];

                let period;
                if (meridiemRaw) {
                    period = meridiemRaw.toLowerCase();
                    if (period === 'pm' && hours !== 12) hours += 12;
                    if (period === 'am' && hours === 12) hours = 0;
                }

                // Derive 12-hour display + am/pm if not already given (24hr input case)
                const displayPeriod = hours >= 12 ? 'pm' : 'am';
                let displayHour = hours % 12;
                if (displayHour === 0) displayHour = 12;

                return {
                    display: `${displayHour}:${minutes}`,
                    period: displayPeriod,
                };
            };

            const startParsed = parseTime(start);
            const endParsed = parseTime(end);

            if (!startParsed || !endParsed) {
                return `${start} - ${end}`; // fallback, don't break UI
            }

            // Same period (both am or both pm) -> show suffix once at the end
            if (startParsed.period === endParsed.period) {
                return `${startParsed.display}-${endParsed.display}${endParsed.period}`;
            }

            // Different periods -> show suffix on both
            return `${startParsed.display}${startParsed.period}-${endParsed.display}${endParsed.period}`;
        };
        const formattedTime = (item.class?.startTime && item.class?.endTime)
            && `${formatTimeRange(item.class.startTime, item.class.endTime)}`

        return {
            id: item.recruitmentLeadId || item.id,
            name: item.candidateName || 'Unknown Candidate',
            date: formattedDate || item.date || '—',
            time: formattedTime,
            venue: item.venue?.area || item.venue?.name || '—',
            status: status,
            raw: item // Keep the raw data if needed downstream
        };
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Practical Assessments</Text>
            </View>

            {isLoading && mappedAssessments.length === 0 ? (
                <View style={styles.loaderContainer}>
                    <CustomLoader size={80} color="#3B82F6" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                    {onRefresh && (
                        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : mappedAssessments.length === 0 ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.content, styles.emptyContainer]}
                    refreshControl={onRefresh ? <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#3B82F6" /> : null}
                >
                    <Ionicons name="clipboard-outline" size={64} color={theme.dateTime} />
                    <Text style={[styles.emptyText, { color: theme.name }]}>No Practical Assessments Assigned</Text>
                    <Text style={[styles.emptySubText, { color: theme.dateTime }]}>Swipe down to refresh.</Text>
                </ScrollView>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                    refreshControl={onRefresh ? <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#3B82F6" /> : null}
                >
                    {mappedAssessments.map(assessment => (
                        <TouchableOpacity
                            key={assessment.id}
                            style={styles.card}
                            onPress={() => {
                                if (assessment.status === 'Start') {
                                    onStart?.(assessment);
                                } else {
                                    onViewResults?.(assessment);
                                }
                            }}
                        >
                            <View style={styles.infoCol}>
                                <Text style={styles.name}>{assessment.name}</Text>
                            </View>

                            <View style={styles.dateTimeCol}>
                                <Text style={styles.dateTime}>{assessment.date}</Text>
                                <Text style={styles.dateTime}>{assessment.time}</Text>
                            </View>

                            <View style={styles.venueCol}>
                                <Text style={styles.venue}>{assessment.venue}</Text>
                            </View>

                            <View style={styles.actionCol}>
                                <View
                                    style={[
                                        styles.actionBtn,
                                        assessment.status === 'Start' ? styles.btnStart : styles.btnComplete
                                    ]}
                                >
                                    <Text style={styles.actionBtnText}>{assessment.status}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={16} color={theme.icon} style={styles.chevron} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
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
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.cardBackground,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.cardBorder,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    infoCol: {
        flex: 0.7,
    },
    name: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: theme.name,
    },
    dateTimeCol: {
        flex: 1,
    },
    dateTime: {
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Urbanist_400Regular',
        color: theme.dateTime,
        lineHeight: 18,
    },
    venueCol: {
        flex: 1,
    },
    venue: {
        fontSize: 11.5,
        textAlign: 'center',

        fontFamily: 'Urbanist_700Bold',
        color: theme.venue,
    },
    actionCol: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.3,
        justifyContent: 'flex-end',
    },
    actionBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    btnStart: {
        backgroundColor: '#3B82F6',
    },
    btnComplete: {
        backgroundColor: '#1CAB4B',
    },
    actionBtnText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Urbanist_700Bold',
    },
    chevron: {
        marginLeft: 8,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#EF4444',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        fontFamily: 'Urbanist_500Medium',
    },
    retryButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubText: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        marginTop: 8,
        textAlign: 'center',
    },
});