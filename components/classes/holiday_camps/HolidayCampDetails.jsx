import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STUDENTS_DATA = [
    { id: 1, name: 'John Smith', age: '7 Years', status: 'attended' },
    { id: 2, name: 'John Smith', age: '7 Years', status: null },
    { id: 3, name: 'John Smith', age: '7 Years', status: null },
    { id: 4, name: 'John Smith', age: '7 Years', status: 'not_attended' },
];

export default function HolidayCampDetails({ onBack, onSyllabusClick, onStudentSelect }) {
    const [activeTab, setActiveTab] = useState('Day 1');
    const [students, setStudents] = useState(STUDENTS_DATA);

    const handleAttendance = (id, status) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    };

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
                <TouchableOpacity style={styles.syllabusButton} onPress={onSyllabusClick}>
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
                            <Text style={styles.infoValue}>Sat 3rd Apr</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="time-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Time</Text>
                            </View>
                            <Text style={styles.infoValue}>9:30am</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="person-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Students</Text>
                            </View>
                            <Text style={styles.infoValue}>24</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Pending</Text>
                            </View>
                        </View>
                    </View>

                    {/* Map Placeholder */}
                    <View style={styles.mapContainer}>
                        {/* Could replace with an actual MapView or Image */}
                        <Image source={{ uri: 'https://via.placeholder.com/400x150/EEEEEE/999999?text=Map+Image' }} style={styles.mapImage} resizeMode="cover" />
                    </View>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={18} color="#666" />
                        <Text style={styles.locationText}>Kings Cross, Grays Inn Road, London WC2H 9HE [Outdoor Park]</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {['Day 1', 'Day 2', 'Day 3'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Students List */}
                <View style={styles.studentsList}>
                    {students.map((student, index) => (
                        <TouchableOpacity
                            key={student.id}
                            style={styles.studentCard}
                            onPress={() => onStudentSelect && onStudentSelect(student.id)}
                        >
                            <Text style={styles.studentIndex}>{index + 1}</Text>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{student.name}</Text>
                                <Text style={styles.studentAge}>{student.age}</Text>
                            </View>
                            <View style={styles.attendanceButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.attendanceBtn,
                                        student.status === 'attended' ? styles.btnAttendedActive : styles.btnAttendedInactive
                                    ]}
                                    onPress={() => handleAttendance(student.id, 'attended')}
                                >
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color={student.status === 'attended' ? '#fff' : '#000'}
                                        style={styles.btnIcon}
                                    />
                                    <Text style={[
                                        styles.btnText,
                                        student.status === 'attended' ? styles.btnTextWhite : styles.btnTextBlack
                                    ]}>
                                        Attended
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.attendanceBtn,
                                        student.status === 'not_attended' ? styles.btnNotAttendedActive : styles.btnNotAttendedInactive
                                    ]}
                                    onPress={() => handleAttendance(student.id, 'not_attended')}
                                >
                                    <Ionicons
                                        name="close"
                                        size={18}
                                        color={student.status === 'not_attended' ? '#fff' : '#E53E3E'}
                                        style={styles.btnIcon}
                                    />
                                    <Text style={[
                                        styles.btnText,
                                        student.status === 'not_attended' ? styles.btnTextWhite : styles.btnTextRed
                                    ]}>
                                        Not Attended
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
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
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    syllabusButton: {
        backgroundColor: '#1CAB4B', // Green
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    syllabusText: {
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
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
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
    },
    locationText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
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
        backgroundColor: '#3B82F6', // Blue
    },
    tabText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4B5563',
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
    },
    studentInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    studentName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        width: 100,
    },
    studentAge: {
        fontSize: 13,
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
        fontSize: 13,
        fontWeight: 'bold',
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
});
