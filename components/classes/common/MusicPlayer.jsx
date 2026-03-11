import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MUSIC_DATA = [
    { id: '1', number: '01', title: 'Different music soccer', artist: 'Artist name', image: 'https://via.placeholder.com/150/34D399/ffffff?text=Music+1' },
    { id: '2', number: '02', title: 'Different music soccer', artist: 'Artist name', image: 'https://via.placeholder.com/150/3B82F6/ffffff?text=Music+2' },
    { id: '3', number: '03', title: 'Different music soccer', artist: 'Artist name', image: 'https://via.placeholder.com/150/FCD34D/ffffff?text=Music+3' },
    { id: '4', number: '04', title: 'Different music soccer', artist: 'Artist name', image: 'https://via.placeholder.com/150/F87171/ffffff?text=Music+4' },
    { id: '5', number: '05', title: 'Different music soccer', artist: 'Artist name', image: 'https://via.placeholder.com/150/A78BFA/ffffff?text=Music+5' },
    { id: '6', number: '06', title: 'Different music soccer', artist: 'Artist name', image: 'https://via.placeholder.com/150/F472B6/ffffff?text=Music+6' },
];

export default function MusicPlayer({ onBack }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMusic = MUSIC_DATA.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" si
                    ze={24} color="#1a1a1a" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.pageTitle}>Find soundtracks</Text>
                
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Section Title */}
                <Text style={styles.sectionTitle}>Music</Text>

                {/* List */}
                <View style={styles.listContainer}>
                    {filteredMusic.map((track, index) => (
                        <TouchableOpacity key={track.id} style={styles.trackItem}>
                            <Text style={styles.trackNumber}>{track.number}</Text>
                            <Image source={{ uri: track.image }} style={styles.trackImage} />
                            <View style={styles.trackInfo}>
                                <Text style={styles.trackTitle}>{track.title}</Text>
                                <Text style={styles.trackArtist}>{track.artist}</Text>
                            </View>
                            <TouchableOpacity style={styles.moreButton}>
                                <Ionicons name="ellipsis-horizontal" size={20} color="#4B5563" />
                            </TouchableOpacity>
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
        paddingBottom: 8,
    },
    backButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
        marginTop: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    listContainer: {
        marginTop: 8,
    },
    trackItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    trackNumber: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
        width: 30, // fixed width for alignment
    },
    trackImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    trackInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    trackTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    trackArtist: {
        fontSize: 13,
        color: '#6B7280',
    },
    moreButton: {
        padding: 8,
    },
});
