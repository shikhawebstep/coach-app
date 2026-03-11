import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TRAINING_DATA = [
    { id: 1, session: 'Session 1', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 2, session: 'Session 2', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 3, session: 'Session 3', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 4, session: 'Session 4', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 5, session: 'Session 5', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 6, session: 'Session 6', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 7, session: 'Session 7', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 1', status: 'Completed' },
    { id: 8, session: 'Session 8', date: '3rd April 2023', time: '10:30-11:30am', block: 'Block 2', status: 'Pending' },
];

const MATCHES_DATA = [
    { id: 1, match: 'Match 8', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Pending' },
    { id: 2, match: 'Match 7', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
    { id: 3, match: 'Match 6', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
    { id: 4, match: 'Match 5', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
    { id: 5, match: 'Match 4', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
    { id: 6, match: 'Match 3', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
    { id: 7, match: 'Match 2', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
    { id: 8, match: 'Match 1', date: '3rd April 2023', time: '10:30-11:30am', vs: 'Vs. Dragons', status: 'Completed' },
];

export default function SelectATeam({ onBack, onSessionSelect }) {
    const [searchQuery, setSearchQuery] = useState('SS F.C. Under 11\'s (Kings Cross)');
    const [activeTab, setActiveTab] = useState('Training');

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const renderList = () => {
        if (!searchQuery) {
            return null;
        }

        const data = activeTab === 'Training' ? TRAINING_DATA : MATCHES_DATA;

        return (
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {data.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={activeTab === 'Training' ? () => onSessionSelect(item.id) : undefined}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>
                                {activeTab === 'Training' ? item.session : item.match}
                            </Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.cardText}>{item.date}</Text>
                            <Text style={styles.cardText}>{item.time}</Text>
                        </View>
                        <View style={styles.cardBlock}>
                            <Text style={styles.blockText}>
                                {activeTab === 'Training' ? item.block : item.vs}
                            </Text>
                        </View>
                        <View style={styles.cardStatusContainer}>
                            <View style={[
                                styles.statusBadge,
                                item.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    item.status === 'Completed' ? styles.statusTextWhite : styles.statusTextBlack
                                ]}>{item.status}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select a team</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, searchQuery ? styles.searchFocused : null]}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a team..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={handleClearSearch} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={20} color="#a0a0a0" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Tabs */}
            {searchQuery.length > 0 && (
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Training' ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab('Training')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Training' ? styles.activeTabText : styles.inactiveTabText]}>
                            Training
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Matches' ? styles.activeTab : styles.inactiveTab]}
                        onPress={() => setActiveTab('Matches')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Matches' ? styles.activeTabText : styles.inactiveTabText]}>
                            Matches
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* List */}
            {renderList()}
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
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#F8F9FB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    searchFocused: {
        borderColor: '#3B82F6',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    clearIcon: {
        padding: 4,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 16,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 30,
        borderWidth: 1.5,
    },
    activeTab: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    inactiveTab: {
        backgroundColor: '#fff',
        borderColor: '#3B82F6',
    },
    tabText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#fff',
    },
    inactiveTabText: {
        color: '#3B82F6',
    },
    listContainer: {
        flex: 1,
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
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardInfo: {
        width: 70,
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    cardDetails: {
        flex: 1,
        marginRight: 8,
    },
    cardText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    cardBlock: {
        width: 70,
        alignItems: 'center',
        marginRight: 8,
    },
    blockText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
    },
    cardStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 8,
    },
    statusCompleted: {
        backgroundColor: '#1CAB4B', // Green
    },
    statusPending: {
        backgroundColor: '#FFD700', // Yellow
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextWhite: {
        color: '#fff',
    },
    statusTextBlack: {
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 4,
    },
});
