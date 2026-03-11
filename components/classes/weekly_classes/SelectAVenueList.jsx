import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SESSION_DATA = [
    { id: 1, session: 'Session 1', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Completed' },
    { id: 2, session: 'Session 2', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Completed' },
    { id: 3, session: 'Session 3', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Completed' },
    { id: 4, session: 'Session 4', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Completed' },
    { id: 5, session: 'Session 5', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Pending' },
    { id: 6, session: 'Session 6', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Pending' },
    { id: 7, session: 'Session 7', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Pele', status: 'Pending' },
    { id: 8, session: 'Session 8', date: '3rd April 2023', time: '10:30-11:30am', coach: 'Ronaldo', status: 'Pending' },
];

export default function SelectAVenueList({ onBack, onSessionSelect }) {
    const [searchQuery, setSearchQuery] = useState('Chelsea');
    const [activeTab, setActiveTab] = useState('Class 1: 4-7');

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const renderList = () => {
        if (!searchQuery) {
            return null;
        }

        return (
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                {SESSION_DATA.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        onPress={() => onSessionSelect(item.id)}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{item.session}</Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.cardText}>{item.date}</Text>
                            <Text style={styles.cardText}>{item.time}</Text>
                        </View>
                        <View style={styles.cardBlock}>
                            <Text style={styles.blockText}>{item.coach}</Text>
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
                <Text style={styles.headerTitle}>Select a venue</Text>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchContainer, searchQuery ? styles.searchFocused : null]}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a venue..."
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

            {/* Horizontal Tabs */}
            {searchQuery.length > 0 && (
                <View style={styles.tabsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsContainer}
                    >
                        {['Class 1: 4-7', 'Class 2: 8-12', 'Class 3: 4-7'].map((tab) => (
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
                    </ScrollView>
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
        marginBottom: 20,
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
    tabsWrapper: {
        marginBottom: 20,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1.5,
    },
    activeTab: {
        backgroundColor: '#fff',
        borderColor: '#1D4ED8', // Darker blue
    },
    inactiveTab: {
        backgroundColor: '#3B82F6', // Lighter blue back
        borderColor: '#3B82F6',
    },
    tabText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: '#1D4ED8',
    },
    inactiveTabText: {
        color: '#fff',
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
        width: 50,
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
