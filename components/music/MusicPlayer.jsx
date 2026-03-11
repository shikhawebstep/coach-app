import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MUSIC_DATA = [
    { id: '01', title: 'Different music soccer', artist: 'Artist name', image: require('../../assets/images/music1.png') },
    { id: '02', title: 'Different music soccer', artist: 'Artist name', image: require('../../assets/images/music2.png') },
    { id: '03', title: 'Different music soccer', artist: 'Artist name', image: require('../../assets/images/music3.png') },
    { id: '04', title: 'Different music soccer', artist: 'Artist name', image: require('../../assets/images/music4.png') },
    { id: '05', title: 'Different music soccer', artist: 'Artist name', image: require('../../assets/images/music5.png') },
    { id: '06', title: 'Different music soccer', artist: 'Artist name', image: require('../../assets/images/music6.png') },
];
const { width } = Dimensions.get('window');

export default function MusicPlayer({ onBack }) {
    const [view, setView] = useState('list'); // 'list' or 'player'
    const [selectedTrack, setSelectedTrack] = useState(null);

    const handleTrackPress = (track) => {
        setSelectedTrack(track);
        setView('player');
    };

    if (view === 'list') {
        return (
            <View style={styles.container}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Find soundtracks</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <Text style={styles.musicLabel}>Music</Text>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {MUSIC_DATA.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.musicRow}
                            onPress={() => handleTrackPress(item)}
                        >
                            <Text style={styles.musicIndex}>{item.id}</Text>
<Image source={item.image} style={styles.musicThumb} />                            <View style={styles.musicInfo}>
                                <Text style={styles.musicTitle}>{item.title}</Text>
                                <Text style={styles.musicArtist}>{item.artist}</Text>
                            </View>
                            <TouchableOpacity>
                                <Ionicons name="ellipsis-horizontal" size={20} color="#1a1a1a" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setView('list')}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#1a1a1a" />
                </TouchableOpacity>
            </View>

            {/* Album Art */}
            <View style={styles.albumContainer}>
                <Image
                    source={selectedTrack?.image|| 'https://via.placeholder.com/400x400/FCD34D/333333?text=Album+Cover' }
                    style={styles.albumArt}
                />
            </View>

            {/* Track Info */}
            <View style={styles.trackInfoContainer}>
                <Text style={styles.trackTitle}>{selectedTrack?.title || 'Samba Soccer Schools'}</Text>
                <Text style={styles.artistName}>{selectedTrack?.artist || 'Artist name'}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBg}>
                    <View style={styles.progressBarFill} />
                    <View style={styles.progressThumb} />
                </View>
                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>1:25</Text>
                    <Text style={styles.timeText}>3:15</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity>
                    <Ionicons name="repeat-outline" size={24} color="#4B5563" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="play-skip-back" size={28} color="#4B5563" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton}>
                    <Ionicons name="pause" size={32} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="play-skip-forward" size={28} color="#4B5563" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="shuffle-outline" size={24} color="#4B5563" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listHeader: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    listTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        marginHorizontal: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1a1a1a',
    },
    musicLabel: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 30,
    },
    musicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    musicIndex: {
        width: 30,
        fontSize: 16,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    musicThumb: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 16,
    },
    musicInfo: {
        flex: 1,
    },
    musicTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    musicArtist: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    // Player Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    albumContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    albumArt: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
    },
    trackInfoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    trackTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    artistName: {
        fontSize: 16,
        color: '#6B7280',
    },
    progressContainer: {
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarFill: {
        width: '40%',
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 3,
    },
    progressThumb: {
        position: 'absolute',
        left: '40%',
        width: 14,
        height: 14,
        backgroundColor: '#3B82F6',
        borderRadius: 7,
        marginLeft: -7,
        borderWidth: 2,
        borderColor: '#fff',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
    },
    controlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});
