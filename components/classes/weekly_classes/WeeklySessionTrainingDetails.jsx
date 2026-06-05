import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WeeklyAddTrialist from './WeeklyAddTrialist';

export default function WeeklySessionTrainingDetails({ sessionId, onBack, onStudentSelect, sessionTitle, onSessionPlanClick, onSessionClick, sessionDate }) {
    const { token } = useAuth();
    const [activeTab, setActiveTab] = useState('Members');
    const [members, setMembers] = useState([]);
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddTrialist, setShowAddTrialist] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetchSessionDetails();
        }
    }, [sessionId]);

    const fetchSessionDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/session/${sessionId}`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (response.ok) {
                setSessionData(result.data);
                const bookingsMembers = result?.data?.bookings?.members || [];
                const flattened = [];
                bookingsMembers.forEach(booking => {
                    booking.students.forEach(student => {
                        flattened.push({
                            bookingId: booking.id,
                            studentId: student.id,
                            name: `${student.studentFirstName || ''} ${student.studentLastName || ''}`.trim(),
                            age: `${student.age} Years`,
                            status: student.attendance,
                            rawStudent: student,
                        });
                    });
                });
                setMembers(flattened);
            } else {
                console.error('Failed to fetch session details:', result);
            }
        } catch (error) {
            console.error('Failed to fetch session details:', error);
        } finally {
            setLoading(false);
        }
    };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st'
        : day % 10 === 2 && day !== 12 ? 'nd'
        : day % 10 === 3 && day !== 13 ? 'rd'
        : 'th';
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
};

    const handleAttendance = async (studentId, status) => {
        // Save previous state for rollback
        const previousMembers = members;

        // Optimistic UI update
        setMembers(prev => prev.map(m => m.studentId === studentId ? { ...m, status } : m));

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/session/${sessionId}/attendance/${studentId}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ attendance: status }),
                }
            );

            if (response.ok) {
                console.log('✅ Attendance updated successfully');
            } else {
                const errorText = await response.text();
                console.error(`❌ Failed to update attendance (${response.status}):`, errorText);
                // Revert optimistic update on failure
                setMembers(previousMembers);
            }
        } catch (error) {
            console.error('❌ Network error updating attendance:', error.message);
            // Revert optimistic update on network error
            setMembers(previousMembers);
        }
    };

    if (showAddTrialist) {
        return <WeeklyAddTrialist onBack={() => setShowAddTrialist(false)} />;
    }

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onSessionClick('weeklySession')}>
                        <Text style={styles.headerTitle}>{sessionTitle}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.sessionPlanButton}
                    onPress={() => onSessionPlanClick(sessionData)}
                >
                    <Text style={styles.sessionPlanText}>Session Plan</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Info Card */}
                <TouchableOpacity style={styles.infoCard} onPress={() => onSessionClick('weeklySession')}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Date</Text>
                            {/* FIX: wrapped both values in a single Text, added space/newline between date and time */}
                            <Text style={styles.infoValue}>
                                {formatDate(sessionData?.sessionDate)}{'\n'}
                                {sessionData?.classSchedule?.startTime} - {sessionData?.classSchedule?.endTime}
                            </Text>
                        </View>
                        <View style={styles.infoItemSmall}>
                            <Text style={styles.infoLabel}>Years</Text>
                            <Text style={styles.infoValue}>{sessionData?.classSchedule?.className || '—'}</Text>
                        </View>
                        <View style={styles.infoItemSmall}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{sessionData?.status || 'Pending'}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Map */}
                <View style={styles.mapContainer}>
                    <Image
                        source={require('../../../assets/images/map.png')}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {['Members', 'Trials', 'Coaches'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Members Tab */}
                {activeTab === 'Members' && (
                    <View style={styles.membersList}>
                        {members.length === 0 ? (
                            <Text style={styles.emptyText}>No members found.</Text>
                        ) : (
                            members.map((member, index) => (
                                <TouchableOpacity
                                    key={member.studentId}
                                    style={styles.memberCard}
                                    onPress={() => onStudentSelect && onStudentSelect(member)}
                                >
                                    <Text style={styles.memberIndex}>{index + 1}</Text>
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
                                        <Text style={styles.memberAge}>{member.age}</Text>
                                    </View>
                                    <View style={styles.attendanceButtons}>
                                        <TouchableOpacity
                                            style={[
                                                styles.attendanceBtn,
                                                member.status === 'attended' ? styles.btnAttendedActive : styles.btnAttendedInactive,
                                            ]}
                                            onPress={() => handleAttendance(member.studentId, 'attended')}
                                        >
                                            <Ionicons
                                                name="checkmark"
                                                size={18}
                                                color={member.status === 'attended' ? '#fff' : '#1CAB4B'}
                                                style={styles.btnIcon}
                                            />
                                            <Text style={[
                                                styles.btnText,
                                                member.status === 'attended' ? styles.btnTextWhite : styles.btnTextGreen,
                                            ]}>
                                                Attended
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[
                                                styles.attendanceBtn,
                                                member.status === 'not attended' ? styles.btnNotAttendedActive : styles.btnNotAttendedInactive,
                                            ]}
                                            onPress={() => handleAttendance(member.studentId, 'not attended')}
                                        >
                                            <Ionicons
                                                name="close"
                                                size={18}
                                                color={member.status === 'not attended' ? '#fff' : '#E53E3E'}
                                                style={styles.btnIcon}
                                            />
                                            <Text style={[
                                                styles.btnText,
                                                member.status === 'not attended' ? styles.btnTextWhite : styles.btnTextRed,
                                            ]}>
                                                Not Attended
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                )}

                {/* Trials Tab */}
                {activeTab === 'Trials' && (
                    <>
                        <TouchableOpacity
                            style={styles.addTrialistButton}
                            onPress={() => setShowAddTrialist(true)}
                        >
                            <Ionicons name="add" size={24} color="#3B82F6" style={styles.addIcon} />
                            <Text style={styles.addTrialistText}>Add walk by trialist</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Coaches Tab — placeholder */}
                {activeTab === 'Coaches' && (
                    <Text style={styles.emptyText}>No coaches assigned.</Text>
                )}

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
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    sessionPlanButton: {
        backgroundColor: '#1CAB4B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    sessionPlanText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
    },
    infoItem: {
        flex: 2,
        paddingRight: 8,
    },
    infoItemSmall: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#1a1a1a',
        lineHeight: 20,
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
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    mapContainer: {
        height: 140,
        marginBottom: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#3B82F6',
    },
    inactiveTab: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    inactiveTabText: {
        color: '#1a1a1a',
    },
    membersList: {
        marginBottom: 24,
    },
    memberCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    memberIndex: {
        width: 24,
        fontSize: 14,
        color: '#666',
    },
    memberInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a1a1a',
        width: 100,
    },
    memberAge: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    attendanceButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    attendanceBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
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
        color:'#fff',
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
        fontWeight: '600',
    },
    btnTextWhite: {
        color: '#fff',
    },
    btnTextGreen: {
        color: '#1CAB4B',
    },
    btnTextRed: {
        color: '#E53E3E',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 24,
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
        marginBottom: 24,
    },
    addIcon: {
        marginRight: 8,
    },
    addTrialistText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3B82F6',
    },
    confirmButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});