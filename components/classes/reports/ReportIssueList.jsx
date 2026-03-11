import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = ['Equipment', 'Incident', 'Complaint', 'Coaches', 'Venue', 'Other'];

const REPORTS_DATA = [
    { id: 1, venue: 'Chelsea', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Solved' },
    { id: 2, venue: 'Chelsea', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Solved' },
    { id: 3, venue: 'Acton', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Pending' },
    { id: 4, venue: 'Chelsea', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Solved' },
    { id: 5, venue: 'Acton', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Pending' },
    { id: 6, venue: 'Tottenham', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Solved' },
    { id: 7, venue: 'Tottenham', date: '3rd April 2023', time: '10:30-11:30am', category: 'Equipment', status: 'Solved' },
];

export default function ReportIssueList({ onNewReport }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(['Equipment']);

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Report an issue</Text>
                <TouchableOpacity style={styles.newReportBtn} onPress={onNewReport}>
                    <Text style={styles.newReportBtnText}>New report</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a venue..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                {CATEGORIES.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={styles.checkboxItem}
                        onPress={() => toggleCategory(category)}
                    >
                        <Ionicons
                            name={selectedCategories.includes(category) ? "checkbox" : "square-outline"}
                            size={24}
                            color={selectedCategories.includes(category) ? "#3B82F6" : "#A1A1AA"}
                        />
                        <Text style={styles.checkboxText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {REPORTS_DATA.map(report => (
                    <TouchableOpacity key={report.id} style={styles.card}>
                        <View style={styles.col1}>
                            <Text style={styles.venue}>{report.venue}</Text>
                        </View>

                        <View style={styles.col2}>
                            <Text style={styles.dateTime}>{report.date}</Text>
                            <Text style={styles.dateTime}>{report.time}</Text>
                        </View>

                        <View style={styles.col3}>
                            <Text style={styles.category}>{report.category}</Text>
                        </View>

                        <View style={styles.col4}>
                            <View style={[styles.statusBadge, report.status === 'Solved' ? styles.solvedBadge : styles.pendingBadge]}>
                                <Text style={[styles.statusText, report.status === 'Solved' ? styles.solvedText : styles.pendingText]}>{report.status}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#000" style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    newReportBtn: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    newReportBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%', // 3 columns
        marginBottom: 16,
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4B5563',
    },
    listContent: {
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    col1: {
        flex: 1.2,
    },
    venue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    col2: {
        flex: 1.5,
    },
    dateTime: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    col3: {
        flex: 1.2,
    },
    category: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    col4: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    solvedBadge: {
        backgroundColor: '#1CAB4B', // Green
    },
    pendingBadge: {
        backgroundColor: '#FBBF24', // Yellow
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    solvedText: {
        color: '#fff',
    },
    pendingText: {
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 6,
    },
});
