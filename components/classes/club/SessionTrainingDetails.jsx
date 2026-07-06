import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import ClubAddTrialist from './ClubAddTrialist';

const MEMBERS_DATA = [
    { id: 1, name: 'John Smith', age: '7 Years', status: 'attended' },
    { id: 2, name: 'John Smith', age: '7 Years', status: null },
    { id: 3, name: 'Donald Johnson', age: '7 Years', status: 'attended' },
];

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        infoCardBg: '#fff',
        infoCardBorder: '#F0F0F0',
        infoLabel: '#9CA3AF',
        infoValue: '#1a1a1a',
        statusBadgeBg: '#FFD700',
        statusText: '#1a1a1a',
        tabsBg: '#F3F4F6',
        inactiveTabText: '#1a1a1a',
        memberIndex: '#666',
        memberName: '#1a1a1a',
        memberAge: '#666',
        memberBorder: '#F3F4F6',
        btnAttendedInactiveBg: '#fff',
        btnNotAttendedInactiveBg: '#fff',
        btnTextBlack: '#1a1a1a',
        addTrialistBg: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.05,
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        infoCardBg: '#1E1E1E',
        infoCardBorder: '#2A2A2A',
        infoLabel: '#9CA3AF',
        infoValue: '#F5F5F5',
        statusBadgeBg: '#7A6A00',
        statusText: '#F5F5F5',
        tabsBg: '#1E1E1E',
        inactiveTabText: '#F5F5F5',
        memberIndex: '#9CA3AF',
        memberName: '#F5F5F5',
        memberAge: '#9CA3AF',
        memberBorder: '#2A2A2A',
        btnAttendedInactiveBg: '#1E1E1E',
        btnNotAttendedInactiveBg: '#1E1E1E',
        btnTextBlack: '#F5F5F5',
        addTrialistBg: '#1E1E1E',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function SessionTrainingDetails({ onBack, onStudentSelect, sessionTitle, onSessionPlanClick, onSessionClick }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [activeTab, setActiveTab] = useState('Trials');
    const [members, setMembers] = useState(MEMBERS_DATA);
    const [showAddTrialist, setShowAddTrialist] = useState(false);

    const handleAttendance = (id, status) => {
        setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    };

    if (showAddTrialist) {
        return <ClubAddTrialist onBack={() => setShowAddTrialist(false)} />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={theme.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSessionClick}>
                        <Text style={styles.headerTitle}>{sessionTitle}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.sessionPlanButton} onPress={onSessionPlanClick}>
                    <Text style={styles.sessionPlanText}>Session Plan</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Info Card */}
                <TouchableOpacity style={styles.infoCard} onPress={onSessionClick}>
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

                </TouchableOpacity>
                <View style={styles.mapContainer}>
                    <Image
                        source={require('../../../assets/images/map.png')}
                        style={styles.mapImage}
                        resizeMode="contain"
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
                            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Members List */}
                <View style={styles.membersList}>
                    {members.map((member, index) => (
                        <TouchableOpacity key={member.id} style={styles.memberCard}
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
                                        color={member.status === 'attended' ? '#fff' : theme.btnTextBlack}
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

                {activeTab === 'Trials' && (
                    <>
                        <TouchableOpacity
                            style={styles.addTrialistButton}
                            onPress={() => setShowAddTrialist(true)}
                        >
                            <Ionicons name="add" size={24} color="#3B82F6" style={styles.addIcon} />
                            <Text style={styles.addTrialistText}>Add walk by trialist</Text>
                        </TouchableOpacity>
                        {/* Confirm Button */}
                        <TouchableOpacity style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </>
                )}

            </ScrollView>

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
        color: theme.headerTitle,
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
        color: theme.infoLabel,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: theme.infoValue,
        lineHeight: 20,
    },
    statusBadge: {
        backgroundColor: theme.statusBadgeBg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.statusText,
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
        backgroundColor: theme.tabsBg,
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
        color: theme.inactiveTabText,
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
        borderBottomColor: theme.memberBorder,
    },
    memberIndex: {
        width: 24,
        fontSize: 14,
        color: theme.memberIndex,
    },
    memberInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.memberName,
        width: 100,
    },
    memberAge: {
        fontSize: 12,
        color: theme.memberAge,
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
        fontWeight: '600',
    },
    btnTextWhite: {
        color: '#fff',
    },
    btnTextBlack: {
        color: theme.btnTextBlack,
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
        backgroundColor: theme.addTrialistBg,
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