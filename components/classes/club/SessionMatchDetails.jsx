import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const STUDENTS = [
    { id: '1', name: 'John Smith', age: '7 Years', attended: true },
    { id: '2', name: 'John Smith', age: '7 Years', attended: false },
    { id: '3', name: 'John Smith', age: '7 Years', attended: false },
];

const COLORS = {
    light: {
        background: '#fff',
        icon: '#1a1a1a',
        headerTitle: '#1a1a1a',
        infoCardBg: '#fff',
        infoCardBorder: '#E5E7EB',
        infoValue: '#1a1a1a',
        tabsBg: '#F3F4F6',
        inactiveTabText: '#1a1a1a',
        listBorder: '#F3F4F6',
        listItemBorder: '#F3F4F6',
        listNum: '#6B7280',
        listName: '#1a1a1a',
        listAge: '#6B7280',
        attendedInactiveBg: '#fff',
        notAttendedInactiveBg: '#fff',
        inactiveCheckColor: '#1a1a1a',
        inactiveXColor: '#1a1a1a',
        attendedInactiveText: '#1a1a1a',
        notAttendedInactiveText: '#1a1a1a',
        mapBorder: '#E5E7EB',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        infoCardBg: '#1E1E1E',
        infoCardBorder: '#2A2A2A',
        infoValue: '#F5F5F5',
        tabsBg: '#1E1E1E',
        inactiveTabText: '#F5F5F5',
        listBorder: '#2A2A2A',
        listItemBorder: '#2A2A2A',
        listNum: '#9CA3AF',
        listName: '#F5F5F5',
        listAge: '#9CA3AF',
        attendedInactiveBg: '#1E1E1E',
        notAttendedInactiveBg: '#1E1E1E',
        inactiveCheckColor: '#F5F5F5',
        inactiveXColor: '#F5F5F5',
        attendedInactiveText: '#F5F5F5',
        notAttendedInactiveText: '#F5F5F5',
        mapBorder: '#2A2A2A',
    },
};

export default function SessionMatchDetails({ onBack, onStudentSelect }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [activeTab, setActiveTab] = useState('Members');
    const [students, setStudents] = useState(STUDENTS);

    const handleAttendance = (id, attended) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, attended } : s));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Session 1</Text>
                <TouchableOpacity style={styles.addResultBtn}>
                    <Text style={styles.addResultText}>Add result</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>Sat 3rd April 2023, 10:30-11:30am</Text>
                    </View>
                    <View style={styles.infoColCenter}>
                        <Text style={styles.infoLabel}>Vs</Text>
                        <Text style={styles.infoValue}>Dragons</Text>
                    </View>
                    <View style={styles.infoColRight}>
                        <Text style={styles.infoLabel}>Status</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>Pending</Text>
                        </View>
                    </View>
                </View>

                {/* Map Area */}
                <View style={styles.mapContainer}>
                    <Image
                        source={require('../../../assets/images/map.png')}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Tab Controls */}
                <View style={styles.tabsContainer}>
                    {['Members', 'Coaches'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tabBtn, activeTab === tab ? styles.activeTab : styles.inactiveTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : styles.inactiveTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Attendance List */}
                <View style={styles.listContainer}>
                    {students.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.listItem}
                            onPress={() => onStudentSelect && onStudentSelect(item.id)}
                        >
                            <Text style={styles.listNum}>{item.id}</Text>
                            <Text style={styles.listName}>{item.name}</Text>
                            <Text style={styles.listAge}>{item.age}</Text>

                            <View style={styles.actionBtns}>
                                {/* Attended Button */}
                                <TouchableOpacity
                                    style={[styles.actionBtn, item.attended ? styles.attendedActive : styles.attendedInactive]}
                                    onPress={() => handleAttendance(item.id, true)}
                                >
                                    <Ionicons name="checkmark" size={16} color={item.attended ? '#fff' : theme.inactiveCheckColor} style={{ marginRight: 4 }} />
                                    <Text style={item.attended ? styles.attendedActiveText : styles.attendedInactiveText}>Attended</Text>
                                </TouchableOpacity>

                                {/* Not Attended Button */}
                                <TouchableOpacity
                                    style={[styles.actionBtn, !item.attended ? styles.notAttendedActive : styles.notAttendedInactive]}
                                    onPress={() => handleAttendance(item.id, false)}
                                >
                                    <Ionicons name="close" size={16} color={!item.attended ? '#fff' : theme.inactiveXColor} style={{ marginRight: 4 }} />
                                    <Text style={!item.attended ? styles.notAttendedActiveText : styles.notAttendedInactiveText}>Not Attended</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 40 }} />
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
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 24,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
    },
    addResultBtn: {
        backgroundColor: '#1CAB4B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addResultText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    infoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1,
        borderColor: theme.infoCardBorder,
        borderRadius: 12,
        backgroundColor: theme.infoCardBg,
        marginBottom: 20,
    },
    infoCol: { flex: 2 },
    infoColCenter: { flex: 1, marginHorizontal: 10 },
    infoColRight: { flex: 1, alignItems: 'flex-end' },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 13,
        color: theme.infoValue,
        fontFamily: 'Urbanist_400Regular',
    },
    statusBadge: {
        backgroundColor: '#FCD34D',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    mapContainer: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.mapBorder,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.tabsBg,
        borderRadius: 8,
        padding: 4,
        marginHorizontal: 40,
        marginBottom: 20,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: { backgroundColor: '#3B82F6' },
    inactiveTab: { backgroundColor: 'transparent' },
    tabText: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
    },
    activeTabText: { color: '#fff' },
    inactiveTabText: { color: theme.inactiveTabText },
    listContainer: {
        borderWidth: 1,
        borderColor: theme.listBorder,
        borderRadius: 12,
        overflow: 'hidden',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.listItemBorder,
    },
    listNum: {
        width: 20,
        fontSize: 13,
        color: theme.listNum,
        fontFamily: 'Urbanist_400Regular',
    },
    listName: {
        flex: 1.5,
        fontSize: 14,
        color: theme.listName,
        fontFamily: 'Urbanist_700Bold',
    },
    listAge: {
        flex: 1,
        fontSize: 13,
        color: theme.listAge,
        fontFamily: 'Urbanist_400Regular',
    },
    actionBtns: {
        flexDirection: 'row',
        gap: 6,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    attendedActive: { backgroundColor: '#1CAB4B', borderColor: '#1CAB4B' },
    attendedInactive: { backgroundColor: theme.attendedInactiveBg, borderColor: '#1CAB4B' },
    attendedActiveText: { color: '#fff', fontSize: 12, fontFamily: 'Urbanist_700Bold' },
    attendedInactiveText: { color: theme.attendedInactiveText, fontSize: 12, fontFamily: 'Urbanist_700Bold' },
    notAttendedActive: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
    notAttendedInactive: { backgroundColor: theme.notAttendedInactiveBg, borderColor: '#EF4444' },
    notAttendedActiveText: { color: '#fff', fontSize: 12, fontFamily: 'Urbanist_700Bold' },
    notAttendedInactiveText: { color: theme.notAttendedInactiveText, fontSize: 12, fontFamily: 'Urbanist_700Bold' },
});
