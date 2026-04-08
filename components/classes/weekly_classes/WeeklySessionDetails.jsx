import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MEMBERS_DATA = [
    { id: 1, name: 'John Smith', age: '7 Years', status: 'attended' },
    { id: 2, name: 'John Smith', age: '7 Years', status: null },
    { id: 3, name: 'Donald Johnson', age: '7 Years', status: 'attended' },
];

export default function WeeklySessionDetails({ onBack, onSessionPlanClick, onStudentSelect, sessionTitle = "Session 1" }) {
    const [activeTab, setActiveTab] = useState('Trials');
    const [members, setMembers] = useState(MEMBERS_DATA);

    const handleAttendance = (id, status) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{sessionTitle}</Text>
                </View>
                <TouchableOpacity style={styles.sessionPlanButton} onPress={onSessionPlanClick}>
                    <Text style={styles.sessionPlanText}>Session Plan</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Date</Text>
                            <Text style={styles.infoValue}>Sat 3rd April 2023, 10:30-11:30am</Text>
                        </View>
                        <View style={styles.infoItemSmall}>
                            <Text style={styles.infoLabel}>Years</Text>
                            <Text style={styles.infoValue}>4-7</Text>
                        </View>
                        <View style={styles.infoItemSmall}>
                            <Text style={styles.infoLabel}>Status</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Pending</Text>
                            </View>
                        </View>
                    </View>

                    {/* Map Placeholder */}
                    <View style={styles.mapContainer}>
                        <Image source={{ uri: 'https://via.placeholder.com/400x150/EEEEEE/999999?text=Map+Image' }} style={styles.mapImage} resizeMode="cover" />
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {['Members', 'Trials', 'Coaches'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.membersList}>
                    {members.map((member, index) => (
                        <TouchableOpacity
                            key={member.id}
                            style={styles.memberCard}
                            onPress={() => onStudentSelect && onStudentSelect(member.id)}
                        >
                            <Text style={styles.memberIndex}>{index + 1}</Text>
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>{member.name}</Text>
                                <Text style={styles.memberAge}>{member.age}</Text>
                            </View>
                            <View style={styles.attendanceButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.attendanceBtn,
                                        member.status === 'attended' ? styles.btnAttendedActive : styles.btnAttendedInactive
                                    ]}
                                    onPress={() => handleAttendance(member.id, 'attended')}
                                >
                                    <Ionicons
                                        name="checkmark"
                                        size={18}
                                        color={member.status === 'attended' ? '#fff' : '#000'}
                                        style={styles.btnIcon}
                                    />
                                    <Text style={[
                                        styles.btnText,
                                        member.status === 'attended' ? styles.btnTextWhite : styles.btnTextBlack
                                    ]}>
                                        Attended
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.attendanceBtn,
                                        member.status === 'not_attended' ? styles.btnNotAttendedActive : styles.btnNotAttendedInactive
                                    ]}
                                    onPress={() => handleAttendance(member.id, 'not_attended')}
                                >
                                    <Ionicons
                                        name="close"
                                        size={18}
                                        color={member.status === 'not_attended' ? '#fff' : '#E53E3E'}
                                        style={styles.btnIcon}
                                    />
                                    <Text style={[
                                        styles.btnText,
                                        member.status === 'not_attended' ? styles.btnTextWhite : styles.btnTextRed
                                    ]}>
                                        Not Attended
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Add Trialist Button */}
                <TouchableOpacity style={styles.addTrialistButton}>
                    <Ionicons name="add" size={24} color="#3B82F6" style={styles.addIcon} />
                    <Text style={styles.addTrialistText}>Add walk by trialist</Text>
                </TouchableOpacity>

                {/* Confirm Button */}
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
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
        marginBottom: 16,
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
        gap: 0,
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        width: 110,
    },
    memberAge: {
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
