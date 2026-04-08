import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SKILLS_DATA = [
    { id: 1, name: 'Fatia', level: 'Beginner', image: require('../../../assets/images/skill1.png') },
    { id: 2, name: 'Macaw', level: 'Beginner', image: require('../../../assets/images/skill2.png') },
    { id: 3, name: 'Dedinho', level: 'Beginner', image: require('../../../assets/images/skill3.png') },
    { id: 4, name: 'Gancho', level: 'Intermediate', image: require('../../../assets/images/skill4.png') },
];

export default function WeeklySearchSkill({ onBack }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search a skill</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search a skill..."
                    placeholderTextColor="#a0a0a0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filters */}
            <View style={styles.filtersWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersScroll}
                >
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterPill, activeFilter === filter ? styles.activeFilterPill : null]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter ? styles.activeFilterText : null]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Skills Grid */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
                {SKILLS_DATA.map(skill => (
                    <TouchableOpacity key={skill.id} style={styles.gridItem}>
                        <Image source={skill.image} style={styles.skillImage} resizeMode="cover" />

                        <View style={styles.textOverlay}>
                            <Text style={styles.skillName}>{skill.name}</Text>
                            <Text style={styles.skillLevel}>{skill.level}</Text>
                        </View>

                        <View style={styles.playButtonOverlay}>
                            <View style={styles.playButtonCircle}>
                                <Ionicons name="play" size={24} color="#fff" />
                            </View>
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
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB', // Gray border
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    filtersWrapper: {
        marginBottom: 24,
    },
    filtersScroll: {
        paddingHorizontal: 16,
        gap: 12,
    },
    filterPill: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20, // Rounded outline
        borderWidth: 1.5,
        borderColor: '#3B82F6', // Blue Border
        backgroundColor: '#fff',
    },
    activeFilterPill: {
        backgroundColor: '#EBF5FF',
    },
    filterText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeFilterText: {
        color: '#2563EB',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    gridItem: {
        width: '48%', // Approx 2 columns
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#333',
        position: 'relative',
    },
    skillImage: {
        width: '100%',
        height: '100%',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    skillName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    skillLevel: {
        color: '#fff',
        fontSize: 12,
    },
    playButtonOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonCircle: {
        width: 48,
        height: 48,
        backgroundColor: 'rgba(0,0,0,0.4)', // semi-transparent black
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
