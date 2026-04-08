import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STUDENTS = [
    { id: '1', name: 'John Smith', age: '7 Years', attended: true },
    { id: '2', name: 'John Smith', age: '7 Years', attended: false },
    { id: '3', name: 'John Smith', age: '7 Years', attended: false },
    { id: '4', name: 'John Smith', age: '7 Years', attended: false },
    { id: '5', name: 'John Smith', age: '7 Years', attended: false },
];

export default function SessionMatchDetails({ onBack, onStudentSelect }) {
    const [activeTab, setActiveTab] = useState('Members');

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
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
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'Members' ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab('Members')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Members' ? styles.activeTabText : styles.inactiveTabText]}>Members</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tabBtn, activeTab === 'Coaches' ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab('Coaches')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Coaches' ? styles.activeTabText : styles.inactiveTabText]}>Coaches</Text>
                    </TouchableOpacity>
                </View>

                {/* Attendance List */}
                <View style={styles.listContainer}>
                    {STUDENTS.map((item) => (
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
                                <TouchableOpacity style={[styles.actionBtn, item.attended ? styles.attendedActive : styles.attendedInactive]}>
                                    <Ionicons name="checkmark" size={16} color={item.attended ? "#fff" : "#1a1a1a"} style={{ marginRight: 4 }} />
                                    <Text style={item.attended ? styles.attendedActiveText : styles.attendedInactiveText}>Attended</Text>
                                </TouchableOpacity>

                                {/* Not Attended Button */}
                                <TouchableOpacity style={[styles.actionBtn, !item.attended ? styles.notAttendedActive : styles.notAttendedInactive]}>
                                    <Ionicons name="close" size={16} color={!item.attended ? "#fff" : "#1a1a1a"} style={{ marginRight: 4 }} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    addResultBtn: {
        backgroundColor: '#1CAB4B', // Green button
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addResultText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 16,
    },
    infoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 20,
    },
    infoCol: {
        flex: 2,
    },
    infoColCenter: {
        flex: 1,
        marginHorizontal: 10,
    },
    infoColRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    infoLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 13,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    statusBadge: {
        backgroundColor: '#FCD34D', // Yellow bg
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    mapContainer: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
        marginHorizontal: 40, // Match mockup width
        marginBottom: 20,
    },
    tabBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#3B82F6', // Blue
    },
    inactiveTab: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    inactiveTabText: {
        color: '#1a1a1a',
    },
    listContainer: {
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        overflow: 'hidden',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    listNum: {
        width: 20,
        fontSize: 13,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    listName: {
        flex: 1.5,
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: 'bold',
    },
    listAge: {
        flex: 1,
        fontSize: 13,
        color: '#6B7280',
    },
    actionBtns: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    attendedActive: {
        backgroundColor: '#1CAB4B', // Green solid
        borderColor: '#1CAB4B',
    },
    attendedInactive: {
        backgroundColor: '#fff',
        borderColor: '#1CAB4B', // Green outline
    },
    attendedActiveText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    attendedInactiveText: {
        color: '#1a1a1a',
        fontSize: 12,
        fontWeight: 'bold',
    },
    notAttendedActive: {
        backgroundColor: '#EF4444', // Red solid
        borderColor: '#EF4444',
    },
    notAttendedInactive: {
        backgroundColor: '#fff',
        borderColor: '#EF4444', // Red outline
    },
    notAttendedActiveText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    notAttendedInactiveText: {
        color: '#1a1a1a',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
