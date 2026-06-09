import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BirthdaySyllabus({ booking, onBack, onSessionSelect }) {
    const syllabus = booking?.syllabus ?? [];
    const packageName = booking?.package?.packageName ?? '';
    const partyDuration = booking?.package?.partyDuration ?? null;

    // Derive unique group names from syllabus for package pills
    const packageGroups = [...new Set(syllabus.map(s => s.groupName))];

    // Derive unique levels (e.g. beginner, intermediate, advanced, pro) from syllabus
    const allLevels = [...new Set(
        syllabus.flatMap(s => Object.keys(s.levels ?? {}))
    )];

    console.log('bookingsyllabus',booking)

    const [activeGroup, setActiveGroup] = useState(packageGroups[0] ?? '');
    const [activeLevel, setActiveLevel] = useState(allLevels[0] ?? '');

    // Get exercises for active group + level
    const activeSyllabus = syllabus.find(s => s.groupName === activeGroup);
    const sessionItems = activeSyllabus?.levels?.[activeLevel]?.flatMap(entry =>
        (entry.sessionExercises ?? []).map(ex => ({
            ...ex,
            skillOfTheDay: entry.skillOfTheDay,
            levelDescription: entry.description,
        }))
    ) ?? [];

    const bannerUri = activeSyllabus?.banner ?? null;

    return (
        <View style={styles.container}>
            {/* Green Header */}
            <View style={styles.greenHeaderContainer}>
                <View style={styles.greenHeader}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Syllabus</Text>
                    <View style={{ width: 24 }} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Package Pills — from syllabus group names */}
                {packageGroups.length > 0 && (
                    <View style={styles.packageGroups}>
                        {packageGroups.map(pkg => (
                            <TouchableOpacity
                                key={pkg}
                                style={[styles.packagePill, activeGroup === pkg ? styles.activePackagePill : styles.inactivePackagePill]}
                                onPress={() => {
                                    setActiveGroup(pkg);
                                    // reset level to first available in this group
                                    const grp = syllabus.find(s => s.groupName === pkg);
                                    const levels = Object.keys(grp?.levels ?? {});
                                    setActiveLevel(levels[0] ?? '');
                                }}
                            >
                                <Text style={[styles.packagePillText, activeGroup === pkg ? styles.activePackagePillText : styles.inactivePackagePillText]}>
                                    {pkg}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Level Pills — beginner / intermediate / advanced / pro */}
                {allLevels.length > 0 && (
                    <View style={styles.ageGroups}>
                        {allLevels.map(level => (
                            <TouchableOpacity
                                key={level}
                                style={[styles.agePill, activeLevel === level ? styles.activeAgePill : styles.inactiveAgePill]}
                                onPress={() => setActiveLevel(level)}
                            >
                                <Text style={[styles.agePillText, activeLevel === level ? styles.activeAgePillText : styles.inactiveAgePillText]}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Session Plan Header */}
                <View style={styles.sessionPlanHeader}>
                    <Text style={styles.sessionPlanTitle}>Session Plan</Text>
                    {partyDuration && (
                        <View style={styles.sessionPlanTimeContainer}>
                            <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 4 }} />
                            <Text style={styles.sessionPlanTimeText}>{partyDuration} mins</Text>
                        </View>
                    )}
                    <TouchableOpacity>
                        <Ionicons name="download-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Session Exercise Cards */}
                {sessionItems.length === 0 ? (
                    <Text style={styles.emptyText}>No exercises available for this level.</Text>
                ) : (
                    sessionItems.map(item => {
                        // imageUrl is stored as a JSON string array e.g. '["https://..."]'
                        let imageUri = null;
                        try {
                            const parsed = JSON.parse(item.imageUrl);
                            imageUri = Array.isArray(parsed) ? parsed[0] : parsed;
                        } catch {
                            imageUri = item.imageUrl ?? null;
                        }

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.sessionCard}
                                onPress={() => onSessionSelect && onSessionSelect(item)}
                            >
                                <View style={styles.imagePlaceholder}>
                                    {imageUri ? (
                                        <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />
                                    ) : (
                                        <View style={[styles.cardImage, styles.imageFallback]}>
                                            <Ionicons name="image-outline" size={32} color="#ccc" />
                                        </View>
                                    )}
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardDesc} numberOfLines={3}>
                                        {item.description?.replace(/<[^>]+>/g, '') ?? ''}
                                    </Text>
                                    <Text style={styles.cardTime}>{item.duration}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    greenHeaderContainer: { paddingHorizontal: 16, paddingTop: 16, marginBottom: 16 },
    greenHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#1CAB4B', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    content: { paddingHorizontal: 16, paddingBottom: 40 },
    packageGroups: { flexDirection: 'row', gap: 12, marginBottom: 16, justifyContent: 'center' },
    packagePill: { flex: 1, maxWidth: 160, paddingVertical: 10, borderRadius: 20, alignItems: 'center', borderWidth: 1.5 },
    activePackagePill: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    inactivePackagePill: { backgroundColor: '#fff', borderColor: '#E5E7EB' },
    packagePillText: { fontSize: 14, fontWeight: 'bold' },
    activePackagePillText: { color: '#fff' },
    inactivePackagePillText: { color: '#666' },
    ageGroups: { flexDirection: 'row', gap: 8, marginBottom: 24 },
    agePill: { flex: 1, paddingVertical: 10, borderRadius: 20, alignItems: 'center', borderWidth: 1.5 },
    activeAgePill: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    inactiveAgePill: { backgroundColor: '#fff', borderColor: '#3B82F6' },
    agePillText: { fontSize: 13, fontWeight: 'bold' },
    activeAgePillText: { color: '#fff' },
    inactiveAgePillText: { color: '#3B82F6' },
    sessionPlanHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    sessionPlanTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginRight: 12 },
    sessionPlanTimeContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 'auto' },
    sessionPlanTimeText: { fontSize: 14, color: '#666' },
    sessionCard: { flexDirection: 'row', marginBottom: 20 },
    imagePlaceholder: { width: 140, height: 90, borderRadius: 8, overflow: 'hidden', backgroundColor: '#F3F4F6', marginRight: 16 },
    cardImage: { width: '100%', height: '100%' },
    imageFallback: { alignItems: 'center', justifyContent: 'center' },
    cardContent: { flex: 1, justifyContent: 'space-between', paddingVertical: 2 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 4 },
    cardDesc: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 8 },
    cardTime: { fontSize: 13, fontWeight: 'bold', color: '#1a1a1a' },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 32, fontSize: 14 },
});