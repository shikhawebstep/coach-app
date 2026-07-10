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
import { LinearGradient } from 'expo-linear-gradient';

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

const LEVEL_FALLBACK_IMAGES = {
    beginner: require('@/assets/images/skill1.png'),
    intermediate: require('@/assets/images/skill2.png'),
    advanced: require('@/assets/images/skill3.png'),
    pro: require('@/assets/images/skill4.png'),
};

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        headerSubtitle: '#6B7280',
        searchBg: '#F5F5F7',
        searchBorder: '#E5E7EB',
        searchText: '#000',
        placeholderText: '#8E8E93',
        filterPillBg: 'transparent',
        filterPillBorder: '#3771E0',
        filterPillText: '#3771E0',
        activeFilterPillBg: '#3771E0',
        activeFilterPillBorder: '#3771E0',
        activeFilterText: '#fff',
        emptyText: '#9CA3AF',
        cardFallbackBg: '#F3F4F6',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        headerSubtitle: '#9CA3AF',
        searchBg: '#1C1C1E',
        searchBorder: '#2C2C2E',
        searchText: '#F5F5F5',
        placeholderText: '#8E8E93',
        filterPillBg: 'transparent',
        filterPillBorder: '#3771E0',
        filterPillText: '#3771E0',
        activeFilterPillBg: '#3771E0',
        activeFilterPillBorder: '#3771E0',
        activeFilterText: '#fff',
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
    }, [sessionPlan?.id]);

    // Build the video list straight from the session plan — only levels
    // that actually have a video attached show up. Memoized so it only
    // recomputes when sessionPlan actually changes, not on every render.
    const videos = useMemo(() => (
        LEVEL_KEYS
            .map((key) => {
                const levelData = sessionPlan?.levels?.[key]?.[0];
                return {
                    id: key,
                    level: LEVEL_META[key].label,
                    skillName: levelData?.skillOfTheDay || LEVEL_META[key].label,
                    color: LEVEL_META[key].color,
                    url: sessionPlan?.[`${key}_video`] || null,
                    banner: sessionPlan?.[`${key}_banner`] || null,
                };
            })
            .filter((v) => !!v.url)
    ), [sessionPlan]);

    const filters = useMemo(() => ['All', ...videos.map((v) => v.level)], [videos]);

    const filteredVideos = useMemo(() => (
        videos.filter((v) => {
            const matchesFilter = activeFilter === 'All' || v.level === activeFilter;
            const matchesSearch = 
                v.level.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                v.skillName.toLowerCase().includes(searchQuery.trim().toLowerCase());
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
                <Text style={styles.headerTitle}>Search a skill</Text>
            </View>

            {videos.length > 0 && (
                <>
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
                            <Image 
                                source={
                                    (video.banner && typeof video.banner === 'string' && video.banner.trim().length > 0)
                                        ? { uri: video.banner }
                                        : (LEVEL_FALLBACK_IMAGES[video.id] || LEVEL_FALLBACK_IMAGES.beginner)
                                } 
                                style={styles.skillImage} 
                                resizeMode="cover" 
                            />

                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.85)']}
                                style={styles.textOverlay}
                            >
                                <Text style={styles.skillName} numberOfLines={1}>{video.skillName}</Text>
                                <Text style={styles.skillLevel}>{video.level}</Text>
                            </LinearGradient>

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
        paddingTop: 20,
        paddingBottom: 15,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 28,
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
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
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
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: theme.filterPillBorder,
        backgroundColor: theme.filterPillBg,
    },
    activeFilterPill: {
        backgroundColor: theme.activeFilterPillBg,
        borderColor: theme.activeFilterPillBorder,
    },
    filterText: {
        color: theme.filterPillText,
        fontSize: 15,
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
        height: 220,
        borderRadius: 28,
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
        paddingTop: 45,
    },
    skillName: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 2,
    },
    skillLevel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontFamily: 'Urbanist_500Medium',
    },
    playButtonOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonCircle: {
        width: 50,
        height: 50,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    playIcon: {
        marginLeft: 3,
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