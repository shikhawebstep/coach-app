import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HolidayAddTrialist from './HolidayAddTrialist';

export default function HolidayCampDetails({ id, onBack, onSyllabusClick, onStudentSelect }) {
    const [activeTab, setActiveTab] = useState('Day 1');
    const [students, setStudents] = useState([]);
    const [showAddTrialist, setShowAddTrialist] = useState(false);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/holiday-camp/${id}/detail`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (response.ok) setData(result?.data || {});
        } catch (error) {
            console.error('Failed to fetch venue detail:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleAttendance = async (studentId, status) => {
        console.log('🟡 handleAttendance called', { studentId, status });

        try {
            const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/holiday-camp/session/${id}/attendance/${studentId}`;
            console.log('📡 Making PATCH request to:', url);
            console.log('📦 Request body:', { attendance: status });

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ attendance: status }),
            });

            console.log('📬 Response received:', { status: response.status, ok: response.ok });

            if (response.ok) {
                console.log('✅ Attendance updated successfully, calling fetchData()');
                fetchData();
            } else {
                const errorText = await response.text();
                console.error('❌ Server error response:', { status: response.status, errorText });
            }
        } catch (error) {
            console.error('❌ Network error updating attendance:', error.message);
            console.error('🔍 Full error:', error);
        }

        console.log('🏁 handleAttendance complete');
    };
    // Derived values
    const camp = data?.holidayCamps?.[0];
    const campDates = camp?.holidayCampDates?.[0];
    const sessionsMap = campDates?.sessionsMap ?? [];
    const schedule = data?.classSchedules?.[0];

    const dayTabs = sessionsMap.map((s, i) => ({
        label: `Day ${i + 1}`,
        sessionDate: s.sessionDate,
        sessionPlan: s.sessionPlan,
    }));

    const activeSession = dayTabs.find(d => d.label === activeTab);

    const activeExercises = activeSession?.sessionPlan
        ? Object.values(activeSession.sessionPlan.levels).flat().flatMap(entry => entry.sessionExercises ?? [])
        : [];

    if (showAddTrialist) {
        return <HolidayAddTrialist onBack={() => setShowAddTrialist(false)} />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Holiday camps</Text>
                </View>
                <TouchableOpacity style={styles.syllabusButton} onPress={() => onSyllabusClick(data)}>
                    <Text style={styles.syllabusText}>Syllabus</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="calendar-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Date</Text>
                            </View>
                            <Text style={styles.infoValue}>{campDates?.startDate ?? 'N/A'}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="time-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Time</Text>
                            </View>
                            <Text style={styles.infoValue}>
                                {schedule ? `${schedule.startTime} - ${schedule.endTime}` : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="person-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Students</Text>
                            </View>
                            <Text style={styles.infoValue}>
                                {schedule ? `${schedule.capacity}/${schedule.totalCapacity}` : 'N/A'}
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{schedule?.status ?? 'N/A'}</Text>
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
                    <Ionicons name="location-outline" size={18} color="#666" />
                    <Text style={styles.locationText}>{data?.address ?? 'N/A'}</Text>
                </View>

                {/* Day Tabs */}
                <View style={styles.tabsContainer}>
                    {dayTabs.map(tab => (
                        <TouchableOpacity
                            key={tab.label}
                            style={[styles.tab, activeTab === tab.label && styles.activeTab]}
                            onPress={() => setActiveTab(tab.label)}
                        >
                            <Text style={[styles.tabText, activeTab === tab.label && styles.activeTabText]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Exercises List */}
                <View style={styles.studentsList}>
                    {activeExercises.length === 0 ? (
                        <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 16 }}>
                            No exercises for this day.
                        </Text>
                    ) : (
                        activeExercises.map((exercise, index) => {
                            const attendance = students.find(s => s.id === exercise.id);
                            return (
                                <TouchableOpacity
                                    key={`${exercise.id}-${index}`}
                                    style={styles.studentCard}
                                    onPress={() => onStudentSelect && onStudentSelect(exercise)}
                                >
                                    <Text style={styles.studentIndex}>{index + 1}</Text>
                                    <View style={styles.studentInfo}>
                                        <Text style={styles.studentName}>{exercise.title}</Text>
                                        <Text style={styles.studentAge}>{exercise.duration}</Text>
                                    </View>
                                    <View style={styles.attendanceButtons}>
                                        <TouchableOpacity
                                            style={[styles.attendanceBtn, attendance?.status === 'attended' ? styles.btnAttendedActive : styles.btnAttendedInactive]}
                                            onPress={() => handleAttendance(exercise.id, 'attended')}
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={18}
                                                color={attendance?.status === 'attended' ? '#fff' : '#000'}
                                                style={styles.btnIcon}
                                            />
                                            <Text style={[styles.btnText, attendance?.status === 'attended' ? styles.btnTextWhite : styles.btnTextBlack]}>
                                                Attended
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.attendanceBtn, attendance?.status === 'not attended' ? styles.btnNotAttendedActive : styles.btnNotAttendedInactive]}
                                            onPress={() => handleAttendance(exercise.id, 'not attended')}
                                        >
                                            <Ionicons
                                                name="close"
                                                size={18}
                                                color={attendance?.status === 'not attended' ? '#fff' : '#E53E3E'}
                                                style={styles.btnIcon}
                                            />
                                            <Text style={[styles.btnText, attendance?.status === 'not attended' ? styles.btnTextWhite : styles.btnTextRed]}>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
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
        
        color: '#1a1a1a',
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
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    infoItem: {
        flex: 1,
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
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'Urbanist_400Regular',
    },
    infoValue: {
        fontSize: 14,
        
        color: '#1a1a1a',
        fontFamily: 'Urbanist_700Bold',
    },
    statusBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        
        color: '#1a1a1a',
        fontFamily: 'Urbanist_700Bold',
    },
    mapContainer: {
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
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
        color: '#4B5563',
        lineHeight: 18,
        fontFamily: 'Urbanist_400Regular',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
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
        
        color: '#4B5563',
        fontFamily: 'Urbanist_700Bold',
    },
    activeTabText: {
        color: '#fff',
    },
    studentsList: {
        gap: 16,
    },
    studentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    studentIndex: {
        width: 24,
        fontSize: 14,
        color: '#666',
        fontFamily: 'Urbanist_400Regular',
    },
    studentInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentName: {
        fontSize: 12,
        
        color: '#1a1a1a',
        width: 80,
        fontFamily: 'Urbanist_700Bold',
    },
    studentAge: {
        fontSize: 12,
        color: '#666',
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
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    btnAttendedActive: {
        backgroundColor: '#1CAB4B',
        borderColor: '#1CAB4B',
    },
    btnAttendedInactive: {
        backgroundColor: '#fff',
        borderColor: '#1CAB4B',
    },
    btnNotAttendedActive: {
        backgroundColor: '#E53E3E',
        borderColor: '#E53E3E',
    },
    btnNotAttendedInactive: {
        backgroundColor: '#fff',
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
        color: '#1a1a1a',
    },
    btnTextRed: {
        color: '#E53E3E',
    },
    addTrialistButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#3B82F6',
        backgroundColor: '#fff',
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
