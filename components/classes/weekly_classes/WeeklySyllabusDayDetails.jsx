import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LEVEL_KEYS = ['beginner', 'intermediate', 'advanced', 'pro'];

const LEVEL_LABELS = {
    beginner: 'Beginners (4–5)',
    intermediate: 'Intermediate (6–7)',
    advanced: 'Advanced (8-9)',
    pro: 'Pro (10-12)',
};

export default function WeeklySyllabusDayDetails({ onBack, onSessionItemSelect, sessionPlan }) {
    const levels = sessionPlan?.levels || {};

    const availableLevels = LEVEL_KEYS.filter(key => levels[key]?.length > 0);
    const [activeTab, setActiveTab] = useState(availableLevels[0] || 'beginner');

    const activeLevelData = levels[activeTab]?.[0];
    const exercises = activeLevelData?.sessionExercises || [];

    const bannerKey = `${activeTab}_banner`;
    const videoKey = `${activeTab}_video`;
    const bannerUrl = sessionPlan?.[bannerKey];
    const videoUrl = sessionPlan?.[videoKey];

    const parseImageUrls = (imageUrlStr) => {
        try {
            return JSON.parse(imageUrlStr) || [];
        } catch {
            return [];
        }
    };

    const totalDuration = exercises.reduce((sum, ex) => {
        const match = ex.duration?.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

    const displayDuration = totalDuration >= 60
        ? `${Math.floor(totalDuration / 60)} ${Math.floor(totalDuration / 60) === 1 ? 'Hour' : 'Hours'}`
        : `${totalDuration} mins`;

    if (!sessionPlan) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#666' }}>No session plan available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* ── Green Full-Width Header ── */}
                <View style={{ padding: 20 }}>

                    <ImageBackground
                        source={require('@/assets/images/greenoverlay.png')}
                        style={styles.greenHeader}
                        imageStyle={{ borderRadius: 20, }}
                    >
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={22} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Syllabus</Text>
                        <View style={{ width: 22 }} />
                    </ImageBackground>
                </View>

                {/* ── Level Pill Tabs ── */}
                {availableLevels.length > 0 && (
                    <View style={styles.tabsContainer}>
                        {availableLevels.map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.tab, activeTab === level ? styles.tabActive : styles.tabInactive]}
                                onPress={() => setActiveTab(level)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.tabText, activeTab === level ? styles.tabTextActive : styles.tabTextInactive]}>
                                    {LEVEL_LABELS[level]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.body}>

                    {/* ── Banner Image / Video ── */}
                    <View style={styles.bannerWrap}>
                        {bannerUrl ? (
                            <Image source={{ uri: bannerUrl }} style={styles.bannerImg} resizeMode="cover" />
                        ) : videoUrl ? (
                            <Video
                                source={{ uri: videoUrl }}
                                style={styles.bannerImg}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay={false}
                                useNativeControls
                            />
                        ) : (
                            <View style={styles.bannerPlaceholder}>
                                <Text style={styles.bannerPlaceholderText}>PLAY LIKE PELÉ</Text>
                            </View>
                        )}
                    </View>

                    {/* ── Skill Of The Day ── */}
                    {activeLevelData && (
                        <View style={styles.skillSection}>
                            <Text style={styles.skillOfDayLabel}>Skill Of The Day</Text>
                            <View style={styles.skillNameRow}>
                                <Text style={styles.skillName}>{activeLevelData.skillOfTheDay}</Text>
                                <TouchableOpacity style={styles.soundBtn}>
                                    <Ionicons name="volume-medium" size={18} color="#22c55e" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.skillDesc}>{activeLevelData.description}</Text>
                        </View>
                    )}

                    {/* ── Player Video / Photo ── */}
                    {videoUrl ? (
                        <View style={styles.playerPhotoWrap}>
                            <Video
                                source={{ uri: videoUrl }}
                                style={styles.playerPhoto}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay={false}
                                useNativeControls
                            />
                        </View>
                    ) : activeLevelData?.player ? (
                        <View style={styles.playerPhotoWrap}>
                            <View style={styles.playerPhotoPlaceholder}>
                                <Ionicons name="person" size={60} color="#ccc" />
                                <Text style={styles.playerName}>{activeLevelData.player}</Text>
                            </View>
                        </View>
                    ) : null}

                    {/* ── Session Plan Header ── */}
                    {exercises.length > 0 && (
                        <View style={styles.sessionHeader}>
                            <View style={styles.sessionTitleRow}>
                                <Text style={styles.sessionTitle}>Session Plan</Text>
                                <View style={styles.durationPill}>
                                    <Ionicons name="time-outline" size={13} color="#6B7280" />
                                    <Text style={styles.durationText}>{displayDuration}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.downloadBtn}>
                                <Ionicons name="download-outline" size={20} color="#22c55e" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* ── Exercise Cards ── */}
                    <View style={styles.exerciseList}>
                        {exercises.map((exercise) => {
                            const images = parseImageUrls(exercise.imageUrl);
                            const imageUri = images[0];
                            return (
                                <TouchableOpacity
                                    key={exercise.id}
                                    style={styles.exerciseCard}
                                    onPress={() => onSessionItemSelect && onSessionItemSelect(exercise)}
                                    activeOpacity={0.85}
                                >
                                    {/* Thumbnail */}
                                    <View style={styles.thumbWrap}>
                                        {imageUri ? (
                                            <Image source={{ uri: imageUri }} style={styles.thumbImg} resizeMode="cover" />
                                        ) : (
                                            <View style={styles.fieldThumb}>
                                                <View style={styles.fieldCenter}>
                                                    <View style={styles.fieldCircle} />
                                                    <View style={styles.fieldLine} />
                                                </View>
                                                <View style={styles.fieldGoalLeft} />
                                                <View style={styles.fieldGoalRight} />
                                            </View>
                                        )}
                                    </View>

                                    {/* Text */}
                                    <View style={styles.exerciseInfo}>
                                        <Text style={styles.exTitle}>{exercise.title}</Text>
                                        <Text style={styles.exDesc} numberOfLines={3}>
                                            {exercise.description?.replace(/<[^>]+>/g, '') || ''}
                                        </Text>
                                        <Text style={styles.exDuration}>{exercise.duration}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={{ height: 48 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    /* ── Header ── */
    greenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#22c55e',
        borderRadius: 15,
        paddingHorizontal: 16,
        padding: 18,
    },
    backButton: {
        padding: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.3,
    },

    /* ── Level Tabs ── */
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        gap: 10,
        marginHorizontal: 14,
        marginTop: 16,
        marginBottom: 18,
        padding: 8,
        overflow: 'scroll',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#3B82F6',
    },
    tabInactive: {
        backgroundColor: 'transparent',
    },
    tabText: {
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '600',

    },
    tabTextActive: {
        color: '#fff',
    },
    tabTextInactive: {
        color: '#1a1a1a',
    },

    /* ── Body ── */
    body: {
        paddingHorizontal: 14,
    },

    /* ── Banner ── */
    bannerWrap: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    bannerImg: {
        width: '100%',
        height: '100%',
    },
    bannerPlaceholder: {
        flex: 1,
        backgroundColor: '#f0fdf4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        borderRadius: 12,
    },
    bannerPlaceholderText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#15803d',
        letterSpacing: 1,
    },

    /* ── Skill Section ── */
    skillSection: {
        marginBottom: 18,
    },
    skillOfDayLabel: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    skillNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    skillName: {
        fontSize: 15,
        color: '#374151',
        fontWeight: '500',
    },
    soundBtn: {
        padding: 2,
    },
    skillDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 19,
    },

    /* ── Player Photo ── */
    playerPhotoWrap: {
        width: '100%',
        height: 280,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 22,
    },
    playerPhoto: {
        width: '100%',
        height: '100%',
    },
    playerPhotoPlaceholder: {
        flex: 1,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    playerName: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },

    /* ── Session Plan Header ── */
    sessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    sessionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sessionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
    },
    durationPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    durationText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    downloadBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#f0fdf4',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* ── Exercise Cards ── */
    exerciseList: {
        gap: 0,
    },
    exerciseCard: {
        flexDirection: 'row',
        marginBottom: 18,
        alignItems: 'flex-start',
    },
    thumbWrap: {
        width: 120,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 12,
        flexShrink: 0,
    },
    thumbImg: {
        width: '100%',
        height: '100%',
    },
    fieldThumb: {
        flex: 1,
        backgroundColor: '#4ade80',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    fieldCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.7)',
        position: 'absolute',
    },
    fieldLine: {
        width: 1.5,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: 'absolute',
    },
    fieldGoalLeft: {
        position: 'absolute',
        left: 0,
        top: '30%',
        width: 8,
        height: '40%',
        borderRightWidth: 1.5,
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.7)',
    },
    fieldGoalRight: {
        position: 'absolute',
        right: 0,
        top: '30%',
        width: 8,
        height: '40%',
        borderLeftWidth: 1.5,
        borderTopWidth: 1.5,
        borderBottomWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.7)',
    },
    exerciseInfo: {
        flex: 1,
        paddingTop: 2,
    },
    exTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
        lineHeight: 18,
    },
    exDesc: {
        fontSize: 11.5,
        color: '#6B7280',
        lineHeight: 16,
        marginBottom: 6,
    },
    exDuration: {
        fontSize: 11.5,
        fontWeight: '700',
        color: '#374151',
    },
});