import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CAMPS_DATA = [
    { id: 1, title: 'Chelsea Summer camp', date: '3rd April 2023', time: '10:30-11:30am', duration: '4 days', status: 'Pending' },
    { id: 2, title: 'Chelsea Summer camp', date: '3rd April 2023', time: '10:30-11:30am', duration: '4 days', status: 'Pending' },
    { id: 3, title: 'Acton Summer camp', date: '3rd April 2023', time: '10:30-11:30am', duration: '4 days', status: 'Pending' },
    { id: 4, title: 'Acton Summer camp', date: '3rd April 2023', time: '10:30-11:30am', duration: '4 days', status: 'Pending' },
];

export default function HolidayCampsList({ onBack, onCampSelect }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCamps = CAMPS_DATA.filter((camp) =>
        camp.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Holiday camps</Text>
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

            {/* List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.listTitle}>Camps</Text>
                {filteredCamps.map((camp) => (
                    <TouchableOpacity
                        key={camp.id}
                        style={styles.card}
                        onPress={() => onCampSelect(camp.id)}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{camp.title}</Text>
                        </View>
                        <View style={styles.cardDetails}>
                            <Text style={styles.cardText}>{camp.date}</Text>
                            <Text style={styles.cardText}>{camp.time}</Text>
                        </View>
                        <View style={styles.cardDuration}>
                            <Text style={styles.durationText}>{camp.duration}</Text>
                        </View>
                        <View style={styles.cardStatusContainer}>
                            <View style={[styles.statusBadge, camp.status === 'Pending' ? styles.statusPending : {}]}>
                                <Text style={styles.statusText}>{camp.status}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#000" style={styles.chevron} />
                        </View>
                    </TouchableOpacity>
                ))}
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
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1a1a1a',
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
        width: 80,
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
        lineHeight: 20,
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
    cardDuration: {
        width: 60,
        alignItems: 'center',
        marginRight: 8,
    },
    durationText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
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
    statusPending: {
        backgroundColor: '#FFD700',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    chevron: {
        marginLeft: 4,
    },
});
