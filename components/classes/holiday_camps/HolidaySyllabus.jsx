import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const COLORS = {
    light: {
        background: '#fff',
        agePillBg: '#fff',
        agePillBorder: '#F3F4F6',
        inactiveAgePillText: '#666',
        tabsBg: '#F3F4F6',
        activeTabBg: '#fff',
        tabText: '#4B5563',
        skillTitle: '#1a1a1a',
        skillName: '#666',
        skillDesc: '#666',
        imagePlaceholderBg: '#F3F4F6',
        cardTitle: '#1a1a1a',
        cardDesc: '#6B7280',
        cardTime: '#1a1a1a',
    },
    dark: {
        background: '#121212',
        agePillBg: '#1E1E1E',
        agePillBorder: '#2A2A2A',
        inactiveAgePillText: '#9CA3AF',
        tabsBg: '#1E1E1E',
        activeTabBg: '#2A2A2A',
        tabText: '#D1D5DB',
        skillTitle: '#F5F5F5',
        skillName: '#D1D5DB',
        skillDesc: '#9CA3AF',
        imagePlaceholderBg: '#2A2A2A',
        cardTitle: '#F5F5F5',
        cardDesc: '#9CA3AF',
        cardTime: '#F5F5F5',
    },
};

export default function HolidaySyllabus({ venueId, onBack, onSessionSelect }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const { token } = useAuth();
    const [syllabusData, setSyllabusData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (venueId) {
            fetchSyllabus();
        }
    }, [venueId]);

    const fetchSyllabus = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/holiday-camp/${venueId}/detail`,
                { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
            );
            const result = await response.json();
            if (response.ok) {
                setSyllabusData(result?.data);
            }
        } catch (error) {
            console.error('Failed to fetch syllabus data:', error);
        } finally {
            setLoading(false);
        }
    };

    const camp = syllabusData?.holidayCamps?.[0];
    const campDates = camp?.holidayCampDates?.[0];
    const sessionsMap = campDates?.sessionsMap ?? [];

    const dayTabs = sessionsMap.map((s, i) => `Day ${i + 1}`);
    const [activeDay, setActiveDay] = useState('Day 1');

    const activeSession = sessionsMap.find((s, i) => `Day ${i + 1}` === activeDay) || sessionsMap[0];
    const sessionPlan = activeSession?.sessionPlan;

    const levelKeys = sessionPlan ? Object.keys(sessionPlan.levels) : [];
    const [activeAgeGroup, setActiveAgeGroup] = useState('');

    // Ensure activeAgeGroup is valid when levelKeys change
    useEffect(() => {
        if (levelKeys.length > 0 && !levelKeys.includes(activeAgeGroup)) {
            setActiveAgeGroup(levelKeys[0]);
        }
    }, [levelKeys]);

    const activeLevelData = sessionPlan?.levels?.[activeAgeGroup]?.[0] || sessionPlan?.levels?.[levelKeys[0]]?.[0];
    const exercises = activeLevelData?.sessionExercises ?? [];

    const videoKey = `${activeAgeGroup || levelKeys[0]}_video`;
    const videoUrl = sessionPlan?.[videoKey];

    const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    return (
        <View style={styles.container}>
            {/* Green Header */}
            <View style={styles.greenHeaderContainer}>
                <ImageBackground
                    source={require('@/assets/images/greenoverlay.png')}
                    style={styles.greenHeader}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Syllabus</Text>
                    <View style={{ width: 24 }} />
                </ImageBackground>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <>
                    {/* Age Group Pills */}
                    <View style={styles.ageGroupsWrapper}>
                        <View style={styles.ageGroups}>
                            {levelKeys.map(level => (
                                <TouchableOpacity
                                    key={level}
                                    style={[styles.agePill, activeAgeGroup === level ? styles.activeAgePill : styles.inactiveAgePill]}
                                    onPress={() => setActiveAgeGroup(level)}
                                >
                                    <Text style={[styles.agePillText, activeAgeGroup === level ? styles.activeAgePillText : styles.inactiveAgePillText]}>
                                        {capitalize(level)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

            {/* Day Tabs */}
            <View style={styles.tabsContainer}>
                {dayTabs.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeDay === tab && styles.activeTab]}
                        onPress={() => {
                            setActiveDay(tab);
                            const newSession = sessionsMap[dayTabs.indexOf(tab)];
                            const newLevels = newSession?.sessionPlan ? Object.keys(newSession.sessionPlan.levels) : [];
                            if (newLevels.length) setActiveAgeGroup(newLevels[0]);
                        }}
                    >
                        <Text style={[styles.tabText, activeDay === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Banner */}
                {sessionPlan?.banner ? (
                    <View style={styles.bannerContainer}>
                        <Image source={{ uri: sessionPlan.banner }} style={styles.bannerImage} />
                    </View>
                ) : null}

                {/* Skill of the Day */}
                {activeLevelData && (
                    <View style={styles.skillSection}>
                        <Text style={styles.skillTitle}>Skill Of The Day</Text>
                        <View style={styles.skillHeader}>
                            <Text style={styles.skillName}>{activeLevelData.skillOfTheDay}</Text>
                            <TouchableOpacity>
                                <Ionicons name="volume-medium-outline" size={20} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.skillDesc}>{activeLevelData.description}</Text>
                    </View>
                )}

                {/* Video */}
                {videoUrl && (
                    <View style={styles.videoPlaceholder}>
                        <View style={styles.playOverlay}>
                            <Ionicons name="play-circle" size={60} color="#fff" />
                        </View>
                    </View>
                )}

                {/* Session Exercises */}
                {exercises.map((exercise, index) => {
                    const imageUrls = (() => {
                        try { return JSON.parse(exercise.imageUrl); } catch { return []; }
                    })();
                    const imageUri = imageUrls[0];

                    return (
                        <TouchableOpacity
                            key={`${exercise.id}-${index}`}
                            style={styles.sessionCard}
                            onPress={() => onSessionSelect && onSessionSelect(exercise)}
                        >
                            <View style={styles.imagePlaceholder}>
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />
                                ) : (
                                    <View style={[styles.cardImage, { backgroundColor: theme.imagePlaceholderBg }]} />
                                )}
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>{exercise.title}</Text>
                                <Text style={styles.cardDesc} numberOfLines={3}>
                                    {exercise.description?.replace(/<[^>]+>/g, '') ?? ''}
                                </Text>
                                <Text style={styles.cardTime}>{exercise.duration}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            </>
            )}
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    greenHeaderContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 8,
    },
    greenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1CAB4B',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
    },
    ageGroupsWrapper: {
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    ageGroups: {
        flexDirection: 'row',
        gap: 12,
    },
    agePill: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    activeAgePill: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    inactiveAgePill: {
        backgroundColor: theme.agePillBg,
        borderColor: theme.agePillBorder,
    },
    agePillText: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
    },
    activeAgePillText: {
        color: '#fff',
    },
    inactiveAgePillText: {
        color: theme.inactiveAgePillText,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: theme.tabsBg,
        borderRadius: 12,
        padding: 4,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: theme.activeTabBg,
    },
    tabText: {
        fontSize: 15,
        fontFamily: 'Urbanist_700Bold',
        color: theme.tabText,
    },
    activeTabText: {
        color: '#3B82F6',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    bannerContainer: {
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    skillSection: {
        marginBottom: 20,
    },
    skillTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        color: theme.skillTitle,
        marginBottom: 8,
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    skillName: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: theme.skillName,
        marginRight: 8,
    },
    skillDesc: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.skillDesc,
        lineHeight: 20,
    },
    videoPlaceholder: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
        marginBottom: 30,
    },
    videoImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    playOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionCard: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 140,
        height: 90,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: theme.imagePlaceholderBg,
        marginRight: 16,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    cardTitle: {
        fontSize: 15,
        fontFamily: 'Urbanist_700Bold',
        color: theme.cardTitle,
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: theme.cardDesc,
        lineHeight: 18,
        marginBottom: 8,
    },
    cardTime: {
        fontSize: 13,
        fontFamily: 'Urbanist_700Bold',
        color: theme.cardTime,
    },
});