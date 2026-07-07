import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useEffect, useMemo, useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

// ─────────────────────────────────────────────
// LEVEL META — maps sessionPlan's `${level}_video` / `${level}_banner`
// fields to a display label + accent color
// ─────────────────────────────────────────────

const LEVEL_META = {
    beginner: { label: 'Beginner', color: '#1CAB4B' },
    intermediate: { label: 'Intermediate', color: '#F59E0B' },
    advanced: { label: 'Advanced', color: '#3B82F6' },
    pro: { label: 'Pro', color: '#8B5CF6' },
};

const LEVEL_KEYS = Object.keys(LEVEL_META);

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        headerSubtitle: '#6B7280',
        searchBg: '#fff',
        searchBorder: '#E5E7EB',
        searchText: '#000',
        placeholderText: '#a0a0a0',
        filterPillBg: '#fff',
        filterPillBorder: '#3B82F6',
        filterPillText: '#3B82F6',
        activeFilterPillBg: '#EBF5FF',
        activeFilterText: '#2563EB',
        emptyText: '#9CA3AF',
        cardFallbackBg: '#F3F4F6',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        headerSubtitle: '#9CA3AF',
        searchBg: '#1E1E1E',
        searchBorder: '#2A2A2A',
        searchText: '#F5F5F5',
        placeholderText: '#9CA3AF',
        filterPillBg: '#1E1E1E',
        filterPillBorder: '#3B82F6',
        filterPillText: '#3B82F6',
        activeFilterPillBg: '#1E3A8A',
        activeFilterText: '#60A5FA',
        emptyText: '#6B7280',
        cardFallbackBg: '#1E1E1E',
    },
};

// Props:
//   sessionPlan — the API's `sessionPlan` object, expected to carry
//                 beginner_video / intermediate_video / advanced_video / pro_video
//                 (and optionally matching *_banner thumbnail URLs)
//   onBack       — back button handler
export default function SearchSkill({ sessionPlan, onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [playingVideo, setPlayingVideo] = useState(null);

    // Logs once per actual sessionPlan change (by id), not once per render
    useEffect(() => {
        if (__DEV__) console.log('SearchSkill.jsx: sessionPlan:', sessionPlan);
    }, [sessionPlan?.id]);

    // Build the video list straight from the session plan — only levels
    // that actually have a video attached show up. Memoized so it only
    // recomputes when sessionPlan actually changes, not on every render.
    const videos = useMemo(() => (
        LEVEL_KEYS
            .map((key) => ({
                id: key,
                level: LEVEL_META[key].label,
                color: LEVEL_META[key].color,
                url: sessionPlan?.[`${key}_video`] || null,
                banner: sessionPlan?.[`${key}_banner`] || null,
            }))
            .filter((v) => !!v.url)
    ), [sessionPlan]);

    const filters = useMemo(() => ['All', ...videos.map((v) => v.level)], [videos]);

    const filteredVideos = useMemo(() => (
        videos.filter((v) => {
            const matchesFilter = activeFilter === 'All' || v.level === activeFilter;
            const matchesSearch = v.level.toLowerCase().includes(searchQuery.trim().toLowerCase());
            return matchesFilter && matchesSearch;
        })
    ), [videos, activeFilter, searchQuery]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Session Videos</Text>
                    {!!sessionPlan?.groupName && (
                        <Text style={styles.headerSubtitle}>{sessionPlan.groupName}</Text>
                    )}
                </View>
            </View>

            {videos.length > 0 && (
                <>
                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color={theme.placeholderText} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search a level..."
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
                            {filters.map((filter) => (
                                <TouchableOpacity
                                    key={filter}
                                    style={[
                                        styles.filterPill,
                                        activeFilter === filter ? styles.activeFilterPill : null,
                                    ]}
                                    onPress={() => setActiveFilter(filter)}
                                >
                                    <Text style={[
                                        styles.filterText,
                                        activeFilter === filter ? styles.activeFilterText : null,
                                    ]}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </>
            )}

            {/* Videos Grid */}
            {videos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="videocam-off-outline" size={40} color={theme.emptyText} />
                    <Text style={[styles.emptyText, { marginTop: 12 }]}>No videos available for this session yet.</Text>
                </View>
            ) : filteredVideos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={40} color={theme.emptyText} />
                    <Text style={[styles.emptyText, { marginTop: 12 }]}>No videos match your search.</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
                    {filteredVideos.map((video) => (
                        <TouchableOpacity
                            key={video.id}
                            style={styles.gridItem}
                            onPress={() => setPlayingVideo(video)}
                            activeOpacity={0.85}
                        >
                            {video.banner ? (
                                <Image source={{ uri: video.banner }} style={styles.skillImage} resizeMode="cover" />
                            ) : (
                                <View style={[styles.skillImage, styles.cardFallback, { backgroundColor: video.color }]}>
                                    <Ionicons name="football-outline" size={36} color="rgba(255,255,255,0.35)" />
                                </View>
                            )}

                            <View style={styles.videoBadge}>
                                <Ionicons name="videocam" size={12} color="#fff" />
                            </View>

                            <View style={styles.textOverlay}>
                                <Text style={styles.skillName}>{video.level}</Text>
                                <Text style={styles.skillLevel}>Tap to watch</Text>
                            </View>

                            <View style={styles.playButtonOverlay}>
                                <View style={styles.playButtonCircle}>
                                    <Ionicons name="play" size={24} color="#fff" style={styles.playIcon} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Video Player Modal */}
            <Modal
                visible={!!playingVideo}
                animationType="fade"
                onRequestClose={() => setPlayingVideo(null)}
            >
                <View style={styles.playerContainer}>
                    <TouchableOpacity
                        onPress={() => setPlayingVideo(null)}
                        style={styles.playerCloseButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>

                    {playingVideo && (
                        <Video
                            source={{ uri: playingVideo.url }}
                            style={styles.playerVideo}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay
                        />
                    )}

                    <Text style={styles.playerTitle}>{playingVideo?.level} Level</Text>
                </View>
            </Modal>
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
    headerSubtitle: {
        fontSize: 13,
        fontFamily: 'Urbanist_500Medium',
        color: theme.headerSubtitle,
        marginTop: 2,
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
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingBottom: 80,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Urbanist_500Medium',
        color: theme.emptyText,
        textAlign: 'center',
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
    cardFallback: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
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

    // Video player modal
    playerContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerCloseButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerVideo: {
        width: '100%',
        height: 260,
    },
    playerTitle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Urbanist_600SemiBold',
        marginTop: 20,
    },
});