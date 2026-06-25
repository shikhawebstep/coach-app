import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function MusicPlayer({ onBack }) {
    const [view, setView] = useState('list');
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [musicData, setMusicData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [audioError, setAudioError] = useState(null);

    // ── player state ───────────────────────────────────────────
    const soundRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [positionMs, setPositionMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);
    const [isBuffering, setIsBuffering] = useState(false);

    const { token } = useAuth();

    useEffect(() => {
        fetchPlaylist();
        Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,
        });
        return () => {
            // unload sound on unmount
            soundRef.current?.unloadAsync();
        };
    }, []);

    const fetchPlaylist = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/music/playlist`,
                {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                    redirect: "follow",
                }
            );
            const result = await response.json();
            if (response.ok) setMusicData(result?.data || []);
        } catch (error) {
            console.error("Failed to fetch playlist:", error);
        } finally {
            setLoading(false);
        }
    };

    // ── load + play a track ────────────────────────────────────
    const handleTrackPress = async (track) => {
        console.log("Track object:", JSON.stringify(track, null, 2)); // 👈 add this
        if (!track.uploadMusic) {
            console.warn("No audio URL for track:", track.musicTitle);
            return;
        }
        setSelectedTrack(track);
        setView('player');
        await loadAndPlay(track.uploadMusic);
    };
  const loadAndPlay = async (uri) => {
    try {
        setIsBuffering(true);
        setAudioError(null);

        if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
        }

        const encodedUri = encodeURI(decodeURI(uri.trim()));
        console.log("Attempting to load:", encodedUri);

        // Test if URL is reachable first
        const testFetch = await fetch(encodedUri, { method: 'HEAD' });
        console.log("URL status:", testFetch.status);
        console.log("Content-Type:", testFetch.headers.get('content-type'));

        const { sound } = await Audio.Sound.createAsync(
            { uri: encodedUri },
            { shouldPlay: true },
            onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
    } catch (e) {
        console.error("Audio load error:", e.message);
        console.error("Full error:", JSON.stringify(e));
        setAudioError("Could not load this track. Please try another.");
        setIsPlaying(false);
    } finally {
        setIsBuffering(false);
    }
};

    const onPlaybackStatusUpdate = (status) => {
        if (!status.isLoaded) return;
        setPositionMs(status.positionMillis || 0);
        setDurationMs(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);
        setIsBuffering(status.isBuffering);
        // auto-advance to next on finish
        if (status.didJustFinish) {
            handleNext();
        }
    };

    const togglePlayPause = async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
    };

    const handleSeek = async (ratio) => {
        if (!soundRef.current || !durationMs) return;
        await soundRef.current.setPositionAsync(ratio * durationMs);
    };

    const handleNext = async () => {
        const idx = musicData.findIndex(t => t.id === selectedTrack?.id);
        const next = musicData[(idx + 1) % musicData.length];
        if (next) {
            setSelectedTrack(next);
            await loadAndPlay(next.uploadMusic);
        }
    };

    const handlePrev = async () => {
        // if more than 3s in, restart; else go to previous
        if (positionMs > 3000) {
            await soundRef.current?.setPositionAsync(0);
            return;
        }
        const idx = musicData.findIndex(t => t.id === selectedTrack?.id);
        const prev = musicData[(idx - 1 + musicData.length) % musicData.length];
        if (prev) {
            setSelectedTrack(prev);
            await loadAndPlay(prev.uploadMusic);
        }
    };

    // ── helpers ────────────────────────────────────────────────
    const formatTime = (ms) => {
        const total = Math.floor(ms / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    const progressRatio = durationMs > 0 ? positionMs / durationMs : 0;

    const filteredMusic = musicData.filter(item =>
        item.musicTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── LIST VIEW ──────────────────────────────────────────────
    if (view === 'list') {
        return (
            <View style={styles.container}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Find soundtracks</Text>
                </View>

             

                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.musicLabel}>Music</Text>

                {loading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : filteredMusic.length === 0 ? (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No tracks found</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                        {filteredMusic.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.musicRow,
                                    selectedTrack?.id === item.id && styles.musicRowActive,
                                ]}
                                onPress={() => handleTrackPress(item)}
                            >
                                <Text style={styles.musicIndex}>
                                    {String(index + 1).padStart(2, '0')}
                                </Text>
                                <Image source={{ uri: item.musicImage }} style={styles.musicThumb} />
                                <View style={styles.musicInfo}>
                                    <Text style={styles.musicTitle}>{item.musicTitle}</Text>
                                    <Text style={styles.musicArtist}>{item.durationFormatted}</Text>
                                </View>
                                {selectedTrack?.id === item.id && isPlaying && (
                                    <Ionicons name="musical-notes" size={18} color="#3B82F6" style={{ marginRight: 8 }} />
                                )}
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#1a1a1a" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    }

    // ── PLAYER VIEW ────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setView('list')}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color="#1a1a1a" />
                </TouchableOpacity>
            </View>
   {audioError && (
                    <Text style={{ color: 'red', textAlign: 'center', marginBottom: 12 }}>
                        {audioError}
                    </Text>
                )}
            <View style={styles.albumContainer}>
                <Image source={{ uri: selectedTrack?.musicImage }} style={styles.albumArt} />
            </View>

            <View style={styles.trackInfoContainer}>
                <Text style={styles.trackTitle}>{selectedTrack?.musicTitle || 'Unknown Track'}</Text>
                <Text style={styles.artistName}>{selectedTrack?.durationFormatted || '0 seconds'}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View
                    style={styles.progressBarBg}
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={(e) => {
                        const { locationX } = e.nativeEvent;
                        const barWidth = width - 60;
                        handleSeek(Math.min(Math.max(locationX / barWidth, 0), 1));
                    }}
                >
                    <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
                    <View style={[styles.progressThumb, { left: `${progressRatio * 100}%` }]} />
                </View>
                <View style={styles.timeRow}>
                    <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
                    <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                <TouchableOpacity>
                    <Ionicons name="repeat-outline" size={24} color="#4B5563" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePrev}>
                    <Ionicons name="play-skip-back" size={28} color="#4B5563" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={togglePlayPause} disabled={isBuffering}>
                    {isBuffering
                        ? <ActivityIndicator color="#fff" />
                        : <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNext}>
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
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
    errorText: { color: 'red', textAlign: 'center', marginBottom: 12, fontFamily: 'Urbanist_400Regular', fontSize: 13 },
    emptyText: { fontSize: 14, color: '#6B7280', fontFamily: 'Urbanist_400Regular' },

    /* List */
    listHeader: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20 },
    listTitle: { fontSize: 32, fontFamily: 'Urbanist_700Bold', color: '#1a1a1a' },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
        marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 12,
        borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: '#1a1a1a', fontFamily: 'Urbanist_400Regular' },
    musicLabel: { fontSize: 22, fontFamily: 'Urbanist_700Bold', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 16 },
    listContent: { paddingBottom: 30 },
    musicRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    musicRowActive: { backgroundColor: '#EFF6FF' },
    musicIndex: { width: 30, fontSize: 16, fontFamily: 'Urbanist_600SemiBold', color: '#9CA3AF' },
    musicThumb: { width: 60, height: 60, borderRadius: 12, marginRight: 16, backgroundColor: '#E5E7EB' },
    musicInfo: { flex: 1 },
    musicTitle: { fontSize: 15, fontFamily: 'Urbanist_700Bold', color: '#1a1a1a', marginBottom: 4 },
    musicArtist: { fontSize: 13, fontFamily: 'Urbanist_400Regular', color: '#9CA3AF' },

    /* Player */
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20,
    },
    albumContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 30 },
    albumArt: { width: width * 0.8, height: width * 0.8, borderRadius: 20, backgroundColor: '#E5E7EB' },
    trackInfoContainer: { alignItems: 'center', marginBottom: 30 },
    trackTitle: { fontSize: 22, fontFamily: 'Urbanist_700Bold', color: '#1a1a1a', marginBottom: 8 },
    artistName: { fontSize: 16, fontFamily: 'Urbanist_400Regular', color: '#6B7280' },
    progressContainer: { paddingHorizontal: 30, marginBottom: 40 },
    progressBarBg: {
        height: 6, backgroundColor: '#D1D5DB', borderRadius: 3,
        position: 'relative', justifyContent: 'center',
    },
    progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 3 },
    progressThumb: {
        position: 'absolute', width: 14, height: 14,
        backgroundColor: '#3B82F6', borderRadius: 7,
        marginLeft: -7, borderWidth: 2, borderColor: '#fff',
    },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    timeText: { fontSize: 12, fontFamily: 'Urbanist_400Regular', color: '#6B7280' },
    controlsContainer: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingHorizontal: 40,
    },
    playButton: {
        width: 70, height: 70, borderRadius: 35, backgroundColor: '#3B82F6',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
});