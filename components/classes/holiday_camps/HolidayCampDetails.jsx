import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import AddTrialist from '../common/AddTrialist';

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        infoCardBg: '#fff',
        infoCardBorder: '#F0F0F0',
        infoIcon: '#666',
        infoLabel: '#989898',
        infoValue: '#1a1a1a',
        statusBadgeBg: '#FFD700',
        statusText: '#1a1a1a',
        mapBg: '#F3F4F6',
        locationText: '#4B5563',
        tabsBg: '#F3F4F6',
        tabText: '#4B5563',
        studentIndex: '#666',
        studentName: '#1a1a1a',
        studentAge: '#666',
        emptyText: '#9CA3AF',
        btnAttendedInactiveBg: '#fff',
        btnNotAttendedInactiveBg: '#fff',
        btnTextBlack: '#1a1a1a',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        loaderTint: '#3B82F6',
        loaderText: '#666',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        infoCardBg: '#1E1E1E',
        infoCardBorder: '#2A2A2A',
        infoIcon: '#9CA3AF',
        infoLabel: '#9CA3AF',
        infoValue: '#F5F5F5',
        statusBadgeBg: '#7A6A00',
        statusText: '#F5F5F5',
        mapBg: '#1E1E1E',
        locationText: '#D1D5DB',
        tabsBg: '#1E1E1E',
        tabText: '#D1D5DB',
        studentIndex: '#9CA3AF',
        studentName: '#F5F5F5',
        studentAge: '#9CA3AF',
        emptyText: '#6B7280',
        btnAttendedInactiveBg: '#1E1E1E',
        btnNotAttendedInactiveBg: '#1E1E1E',
        btnTextBlack: '#F5F5F5',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        loaderTint: '#3B82F6',
        loaderText: '#9CA3AF',
    },
};

export default function HolidayCampDetails({ sessionId, onBack, onSyllabusClick, onStudentSelect }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [students, setStudents] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(sessionId);
    const [showAddTrialist, setShowAddTrialist] = useState(false);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        if (currentSessionId) {
            fetchData(currentSessionId);
        }
    }, [currentSessionId]);

    const fetchData = async (idToFetch) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/holiday-camp/session/${idToFetch}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (response.ok) {
                setData(result?.data || {});
                const bookingsMembers = result?.data?.bookings?.members || [];
                const flattened = [];
                bookingsMembers.forEach((booking) => {
                    (booking.students || []).forEach((student) => {
                        const getValid = (v) => (v && String(v).toLowerCase() !== 'undefined' && String(v).toLowerCase() !== 'null') ? String(v) : '';
                        const fName = getValid(student.studentFirstName) || getValid(student.firstName) || getValid(student?.user?.firstName) || '';
                        const lName = getValid(student.studentLastName) || getValid(student.lastName) || getValid(student?.user?.lastName) || '';
                        const fullName = `${fName} ${lName}`.trim() || 'Unknown Student';

                        flattened.push({
                            bookingId: booking.id,
                            studentId: student.id,
                            name: fullName,
                            age: `${student.age || 'N/A'} Years`,
                            status: student.attendance,
                            rawStudent: student,
                            booking: booking,
                        });
                    });
                });
                setStudents(flattened);
            }
        } catch (error) {
            console.error('Failed to fetch venue detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async (studentId, status) => {
        try {
            const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/holiday-camp/session/${currentSessionId}/attendance/${studentId}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendance: status }),
            });

            if (response.ok) {
                fetchData(currentSessionId);
            } else {
                const errorText = await response.text();
                console.error('Server error response:', { status: response.status, errorText });
            }
        } catch (error) {
            console.error('Network error updating attendance:', error.message);
        }
    };

    // Derived values
    const campDates = data?.campDate;
    const schedule = data?.classSchedule;
    const sessionsMap = data?.sessionsMap || [];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        
        const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                       (day % 10 === 2 && day !== 12) ? 'nd' :
                       (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
                       
        return `${dayName} ${day}${suffix} ${month}`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? '' : '';
        h = h % 12 || 12;
        return `${h}:${minutes}${ampm}`;
    };

    const displayDate = formatDate(campDates?.startDate);
    const displayTime = schedule?.startTime ? formatTime(schedule.startTime) : 'N/A';
    const displayStudents = students.length.toString();
    const displayStatus = schedule?.status ? schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1) : 'Pending';

    if (showAddTrialist) {
        return <AddTrialist onBack={() => setShowAddTrialist(false)} />;
    }

    // Header stays visible always so back button works even while loading
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Holiday camps</Text>
                  
                </View>
                {!loading && (
                    <TouchableOpacity style={styles.syllabusButton} onPress={() => onSyllabusClick(data)}>
                        <Text style={styles.syllabusText}>Syllabus</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={[styles.loaderContainer, { flex: 1 }]}>
                    <CustomLoader size={80} color={theme.loaderTint} />
                    <Text style={styles.loaderText}>Loading camp details...</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelContainer}>
                                    <Ionicons name="calendar-outline" size={16} color={theme.infoIcon} style={styles.infoIcon} />
                                    <Text style={styles.infoLabel}>Date</Text>
                                </View>
                                <Text style={styles.infoValue}>{displayDate}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelContainer}>
                                    <Ionicons name="time-outline" size={16} color={theme.infoIcon} style={styles.infoIcon} />
                                    <Text style={styles.infoLabel}>Time</Text>
                                </View>
                                <Text style={styles.infoValue}>{displayTime}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelContainer}>
                                    <Ionicons name="person-outline" size={16} color={theme.infoIcon} style={styles.infoIcon} />
                                    <Text style={styles.infoLabel}>Students</Text>
                                </View>
                                <Text style={styles.infoValue}>{displayStudents}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <View style={styles.infoLabelContainer}>
                                    <Text style={[styles.infoLabel, { marginLeft: 0 }]}>Status</Text>
                                </View>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{displayStatus}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Map */}
                    <View style={styles.mapContainer}>
                        <Image
                            source={require('../../../assets/images/map.png')}
                            style={styles.mapImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={18} color={theme.infoIcon} />
                        <Text style={styles.locationText}>{data?.venue?.address ?? 'N/A'}</Text>
                    </View>

                    {/* Day Tabs */}
                    {sessionsMap.length > 0 && (
                        <View style={styles.tabsContainer}>
                            {sessionsMap.map(tab => (
                                <TouchableOpacity
                                    key={tab.mapId}
                                    style={[styles.tab, currentSessionId === tab.mapId && styles.activeTab]}
                                    onPress={() => setCurrentSessionId(tab.mapId)}
                                >
                                    <Text style={[styles.tabText, currentSessionId === tab.mapId && styles.activeTabText]}>
                                        {tab.dayLabel || `Day ${sessionsMap.indexOf(tab) + 1}`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Students List */}
                    <View style={styles.studentsList}>
                        {students.length === 0 ? (
                            <Text style={styles.emptyText}>
                                No students for this session.
                            </Text>
                        ) : (
                            students.map((student, index) => {
                                return (
                                    <TouchableOpacity
                                        key={`${student.studentId}-${index}`}
                                        style={styles.studentCard}
                                        onPress={() => onStudentSelect && onStudentSelect(student)}
                                    >
                                        <Text style={styles.studentIndex}>{index + 1}</Text>
                                        <View style={styles.studentInfo}>
                                            <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                                            <Text style={styles.studentAge}>{student.age}</Text>
                                        </View>
                                        <View style={styles.attendanceButtons}>
                                            <TouchableOpacity
                                                style={[styles.attendanceBtn, student.status === 'attended' ? styles.btnAttendedActive : styles.btnAttendedInactive]}
                                                onPress={() => handleAttendance(student.studentId, 'attended')}
                                            >
                                                <Ionicons
                                                    name="checkmark"
                                                    size={18}
                                                    color={student.status === 'attended' ? '#fff' : theme.btnTextBlack}
                                                    style={styles.btnIcon}
                                                />
                                                <Text style={[styles.btnText, student.status === 'attended' ? styles.btnTextWhite : styles.btnTextBlack]}>
                                                    Attended
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[styles.attendanceBtn, student.status === 'not attended' ? styles.btnNotAttendedActive : styles.btnNotAttendedInactive]}
                                                onPress={() => handleAttendance(student.studentId, 'not attended')}
                                            >
                                                <Ionicons
                                                    name="close"
                                                    size={18}
                                                    color={student.status === 'not attended' ? '#fff' : '#000'}
                                                    style={styles.btnIcon}
                                                />
                                                <Text style={[styles.btnText, student.status === 'not attended' ? styles.btnTextWhite : styles.btnTextBlack]}>
                                                    Not Attended
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        borderBottomColor: theme.infoCardBorder,
        borderBottomWidth: 1,
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        color: theme.headerTitle,
        fontFamily: 'Urbanist_700Bold',
    },
    syllabusButton: {
        backgroundColor: '#1CAB4B',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    syllabusText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loaderText: {
        fontSize: 14,
        fontFamily: 'Urbanist_500Medium',
        color: theme.loaderText,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: theme.infoCardBg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.infoCardBorder,
        padding: 16,
        marginBottom: 24,
        shadowColor: theme.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme.shadowOpacity,
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
    },
    infoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoIcon: {
        marginRight: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: theme.infoLabel,
        marginBottom: 4,
        fontFamily: 'Urbanist_700Bold',
    },
    infoValue: {
        fontSize: 14,
        color: theme.infoValue,
        fontFamily: 'Urbanist_700Bold',
    },
    statusBadge: {
        backgroundColor: '#FACC15',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 13,
        color: '#1a1a1a',
        fontFamily: 'Urbanist_600SemiBold',
    },
    mapContainer: {
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: theme.mapBg,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
        marginBottom: 20,
    },
    locationText: {
        marginLeft: 8,
        fontSize: 13,
        color: theme.locationText,
        lineHeight: 18,
        fontFamily: 'Urbanist_500Medium',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.tabsBg,
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    tabText: {
        fontSize: 15,
        color: theme.tabText,
        fontFamily: 'Urbanist_700Bold',
    },
    activeTabText: {
        color: '#fff',
    },
    studentsList: {
        gap: 16,
    },
    emptyText: {
        color: theme.emptyText,
        textAlign: 'center',
        marginTop: 16,
        fontFamily: 'Urbanist_400Regular',
    },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    studentIndex: {
        width: 24,
        fontSize: 14,
        color: theme.studentIndex,
        fontFamily: 'Urbanist_400Regular',
    },
    studentInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentName: {
        fontSize: 12,
        textTransform: 'capitalize',
        color: theme.studentName,
        width: 80,
        fontFamily: 'Urbanist_700Bold',
    },
    studentAge: {
        fontSize: 12,
        color: theme.studentAge,
        marginLeft: 8,
        fontFamily: 'Urbanist_400Regular',
    },
    attendanceButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    attendanceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    btnAttendedActive: {
        backgroundColor: '#1CAB4B',
        borderColor: '#1CAB4B',
    },
    btnAttendedInactive: {
        backgroundColor: theme.btnAttendedInactiveBg,
        borderColor: '#1CAB4B',
    },
    btnNotAttendedActive: {
        backgroundColor: '#E53E3E',
        borderColor: '#E53E3E',
    },
    btnNotAttendedInactive: {
        backgroundColor: theme.btnNotAttendedInactiveBg,
        borderColor: '#E53E3E',
    },
    btnIcon: {
        marginRight: 4,
    },
    btnText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
    },
    btnTextWhite: {
        color: '#fff',
    },
    btnTextBlack: {
        color: theme.btnTextBlack,
    },
    btnTextBlack: {
        color: '#000',
    },
    addTrialistButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#3B82F6',
        backgroundColor: theme.background,
        marginTop: 24,
        marginBottom: 16,
    },
    addIcon: {
        marginRight: 8,
    },
    addTrialistText: {
        fontSize: 16,
        color: '#3B82F6',
        fontFamily: 'Urbanist_700Bold',
    },
    confirmButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 24,
    },
    confirmButtonText: {
        fontSize: 16,
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
    },
});