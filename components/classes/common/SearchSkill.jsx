import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

const SKILLS_DATA = [
    { id: 1, name: 'Fatia', level: 'Beginner', image: require('../../../assets/images/skill1.png') },
    { id: 2, name: 'Macaw', level: 'Beginner', image: require('../../../assets/images/skill2.png') },
    { id: 3, name: 'Dedinho', level: 'Beginner', image: require('../../../assets/images/skill3.png') },
    { id: 4, name: 'Gancho', level: 'Intermediate', image: require('../../../assets/images/skill4.png') },
];

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        searchBg: '#fff',
        searchBorder: '#E5E7EB',
        searchText: '#000',
        placeholderText: '#a0a0a0',
        filterPillBg: '#fff',
        filterPillBorder: '#3B82F6',
        filterPillText: '#3B82F6',
        activeFilterPillBg: '#EBF5FF',
        activeFilterText: '#2563EB',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        searchBg: '#1E1E1E',
        searchBorder: '#2A2A2A',
        searchText: '#F5F5F5',
        placeholderText: '#9CA3AF',
        filterPillBg: '#1E1E1E',
        filterPillBorder: '#3B82F6',
        filterPillText: '#3B82F6',
        activeFilterPillBg: '#1E3A8A',
        activeFilterText: '#60A5FA',
    },
};

export default function SearchSkill({ onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Search a skill</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={theme.placeholderText} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search a skill..."
                    placeholderTextColor={theme.placeholderText}
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
                            style={[
                                styles.filterPill,
                                activeFilter === filter ? styles.activeFilterPill : null
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter ? styles.activeFilterText : null
                            ]}>
                                {filter}
                            </Text>
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
                                <Ionicons name="play" size={24} color="#fff" style={styles.playIcon} />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
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
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: theme.searchBg,
        borderWidth: 1,
        borderColor: theme.searchBorder,
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
        color: theme.searchText,
        fontFamily: 'Urbanist_400Regular',
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
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: theme.filterPillBorder,
        backgroundColor: theme.filterPillBg,
    },
    activeFilterPill: {
        backgroundColor: theme.activeFilterPillBg,
    },
    filterText: {
        color: theme.filterPillText,
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
    },
    activeFilterText: {
        color: theme.activeFilterText,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    gridItem: {
        width: '48%',
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
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 4,
    },
    skillLevel: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
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
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        marginLeft: 4,
    },
});
