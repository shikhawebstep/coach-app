import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import CustomLoader from '@/components/common/CustomLoader';

const { width } = Dimensions.get('window');

// ── Theme tokens ────────────────────────────────────────────────────────────
const palettes = {
    light: {
        background: '#fff',
        primary: '#3B82F6',
        textPrimary: '#1a1a1a',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        searchBg: '#F9FAFB',
        searchBorder: '#E5E7EB',
        rowBorder: '#F3F4F6',
        rowActiveBg: '#EFF6FF',
        thumbBg: '#E5E7EB',
        albumBg: '#E5E7EB',
        progressBg: '#D1D5DB',
        progressThumbBorder: '#fff',
        controlIcon: '#4B5563',
        error: '#EF4444',
    },
    dark: {
        background: '#0B0F14',
        primary: '#5B9CFF',
        textPrimary: '#F3F4F6',
        textSecondary: '#9CA3AF',
        textMuted: '#7D8590',
        searchBg: '#1A1F26',
        searchBorder: '#2A313B',
        rowBorder: '#242B33',
        rowActiveBg: '#16233A',
        thumbBg: '#242B33',
        albumBg: '#242B33',
        progressBg: '#2A313B',
        progressThumbBorder: '#0B0F14',
        controlIcon: '#C9CED6',
        error: '#F87171',
    },
};

export default function MusicPlayer({ onBack }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = isDark ? palettes.dark : palettes.light;
    const styles = getStyles(theme);

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
                    headers: { Authorization: `Bearer ${token || ""}` },
                    redirect: "follow",
                }
            );
            const result = await response.json().catch(() => ({}));
            if (response.ok) setMusicData(Array.isArray(result?.data) ? result.data : []);
        } catch (error) {
            console.error("Failed to fetch playlist:", error);
        } finally {
            setLoading(false);
        }
    };

    // ── load + play a track ────────────────────────────────────
    const handleTrackPress = async (track) => {
        if (!track?.uploadMusic) {
            console.warn("No audio URL for track:", track?.musicTitle);
            setAudioError("This track doesn't have any audio available.");
            return;
        }
        setSelectedTrack(track);
        setView('player');
        await loadAndPlay(track.uploadMusic);
    };

    const loadAndPlay = async (uri) => {
        if (!uri || typeof uri !== "string") {
            setAudioError("Could not load this track. Please try another.");
            return;
        }
        try {
            setIsBuffering(true);
            setAudioError(null);

            if (soundRef.current) {
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            const encodedUri = encodeURI(decodeURI(uri.trim()));

            const { sound } = await Audio.Sound.createAsync(
                { uri: encodedUri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            soundRef.current = sound;
            setIsPlaying(true);
        } catch (e) {
            console.error("Audio load error:", e?.message || e);
            setAudioError("Could not load this track. Please try another.");
            setIsPlaying(false);
        } finally {
            setIsBuffering(false);
        }
    };

    const onPlaybackStatusUpdate = (status) => {
        if (!status?.isLoaded) return;
        setPositionMs(status.positionMillis || 0);
        setDurationMs(status.durationMillis || 0);
        setIsPlaying(!!status.isPlaying);
        setIsBuffering(!!status.isBuffering);
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
        if (!musicData.length) return;
        const idx = musicData.findIndex(t => t?.id === selectedTrack?.id);
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
        if (!musicData.length) return;
        const idx = musicData.findIndex(t => t?.id === selectedTrack?.id);
        const prev = musicData[(idx - 1 + musicData.length) % musicData.length];
        if (prev) {
            setSelectedTrack(prev);
            await loadAndPlay(prev.uploadMusic);
        }
    };

    // ── helpers ────────────────────────────────────────────────
    const formatTime = (ms) => {
        const safeMs = Number(ms) || 0;
        const total = Math.floor(safeMs / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    const progressRatio = durationMs > 0 ? positionMs / durationMs : 0;

    const filteredMusic = musicData.filter(item =>
        (item?.musicTitle || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    );

    // ── LIST VIEW ──────────────────────────────────────────────
    if (view === 'list') {
        return (
            <View style={styles.container}>
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Find soundtracks</Text>
                </View>



                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color={theme.textMuted} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor={theme.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color={theme.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.musicLabel}>Music</Text>

                {loading ? (
                    <View style={styles.centered}>
                        <CustomLoader size={80} color={theme.primary} />
                    </View>
                ) : filteredMusic.length === 0 ? (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No tracks found</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                        {filteredMusic.map((item, index) => (
                            <TouchableOpacity
                                key={item?.id ?? index}
                                style={[
                                    styles.musicRow,
                                    selectedTrack?.id === item?.id && styles.musicRowActive,
                                ]}
                                onPress={() => handleTrackPress(item)}
                            >
                                <Text style={styles.musicIndex}>
                                    {String(index + 1).padStart(2, '0')}
                                </Text>
                                <Image
                                    source={item?.musicImage ? { uri: item.musicImage } : undefined}
                                    style={styles.musicThumb}
                                />
                                <View style={styles.musicInfo}>
                                    <Text style={styles.musicTitle}>{item?.musicTitle || 'Untitled track'}</Text>
                                    <Text style={styles.musicArtist}>{item?.durationFormatted || '-'}</Text>
                                </View>
                                {selectedTrack?.id === item?.id && isPlaying && (
                                    <Ionicons name="musical-notes" size={18} color={theme.primary} style={{ marginRight: 8 }} />
                                )}
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-horizontal" size={20} color={theme.textPrimary} />
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
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
            </View>
            {audioError && (
                <Text style={styles.errorText}>
                    {audioError}
                </Text>
            )}
            <View style={styles.albumContainer}>
                <Image
                    source={selectedTrack?.musicImage ? { uri: selectedTrack.musicImage } : undefined}
                    style={styles.albumArt}
                />
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
                        const locationX = e?.nativeEvent?.locationX || 0;
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
                    <Ionicons name="repeat-outline" size={24} color={theme.controlIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePrev}>
                    <Ionicons name="play-skip-back" size={28} color={theme.controlIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={togglePlayPause} disabled={isBuffering}>
                    {isBuffering
                        ? <CustomLoader size={20} color="#fff" />
                        : <Ionicons name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNext}>
                    <Ionicons name="play-skip-forward" size={28} color={theme.controlIcon} />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="shuffle-outline" size={24} color={theme.controlIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
    errorText: { color: theme.error, textAlign: 'center', marginBottom: 12, fontFamily: 'Urbanist_400Regular', fontSize: 13 },
    emptyText: { fontSize: 14, color: theme.textSecondary, fontFamily: 'Urbanist_400Regular' },

    /* List */
    listHeader: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20 },
    listTitle: { fontSize: 32, fontFamily: 'Urbanist_700Bold', color: theme.textPrimary },
    searchContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: theme.searchBg,
        marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 12,
        borderRadius: 16, borderWidth: 1, borderColor: theme.searchBorder, marginBottom: 24,
    },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 16, color: theme.textPrimary, fontFamily: 'Urbanist_400Regular' },
    musicLabel: { fontSize: 22, fontFamily: 'Urbanist_700Bold', color: theme.textPrimary, paddingHorizontal: 20, marginBottom: 16 },
    listContent: { paddingBottom: 30 },
    musicRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: theme.rowBorder,
    },
    musicRowActive: { backgroundColor: theme.rowActiveBg },
    musicIndex: { width: 30, fontSize: 16, fontFamily: 'Urbanist_600SemiBold', color: theme.textMuted },
    musicThumb: { width: 60, height: 60, borderRadius: 12, marginRight: 16, backgroundColor: theme.thumbBg },
    musicInfo: { flex: 1 },
    musicTitle: { fontSize: 15, fontFamily: 'Urbanist_700Bold', color: theme.textPrimary, marginBottom: 4 },
    musicArtist: { fontSize: 13, fontFamily: 'Urbanist_400Regular', color: theme.textMuted },

    /* Player */
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20,
    },
    albumContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 10, marginBottom: 30 },
    albumArt: { width: width * 0.8, height: width * 0.8, borderRadius: 20, backgroundColor: theme.albumBg },
    trackInfoContainer: { alignItems: 'center', marginBottom: 30 },
    trackTitle: { fontSize: 22, fontFamily: 'Urbanist_700Bold', color: theme.textPrimary, marginBottom: 8 },
    artistName: { fontSize: 16, fontFamily: 'Urbanist_400Regular', color: theme.textSecondary },
    progressContainer: { paddingHorizontal: 30, marginBottom: 40 },
    progressBarBg: {
        height: 6, backgroundColor: theme.progressBg, borderRadius: 3,
        position: 'relative', justifyContent: 'center',
    },
    progressBarFill: { height: '100%', backgroundColor: theme.primary, borderRadius: 3 },
    progressThumb: {
        position: 'absolute', width: 14, height: 14,
        backgroundColor: theme.primary, borderRadius: 7,
        marginLeft: -7, borderWidth: 2, borderColor: theme.progressThumbBorder,
    },
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    timeText: { fontSize: 12, fontFamily: 'Urbanist_400Regular', color: theme.textSecondary },
    controlsContainer: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', paddingHorizontal: 40,
    },
    playButton: {
        width: 70, height: 70, borderRadius: 35, backgroundColor: theme.primary,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: theme.primary, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
});