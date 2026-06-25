import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HolidaySessionExercise({ onBack, onSearchSkillClick, exercise }) {
    const imageUrls = (() => {
        try { return JSON.parse(exercise?.imageUrl || '[]'); } catch { return []; }
    })();
    const imageUri = imageUrls[0];

    // Parse HTML into sections
    const parseHtmlSections = (html) => {
        if (!html) return [];
        // Strip tags, decode entities
        return html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<li[^>]*>/gi, '• ')
            .replace(/<\/li>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&nbsp;/g, ' ')
            .trim();
    };

    const cleanDescription = parseHtmlSections(exercise?.description);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.greenHeaderContainer}>
                <ImageBackground
                    source={require('@/assets/images/greenoverlay.png')}
                    style={styles.greenHeader}
                    imageStyle={{ borderRadius: 20 }}
                >
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>{exercise?.title ?? 'Exercise'}</Text>
                    <View style={{ width: 24 }} />
                </ImageBackground>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Main Image */}
                <View style={styles.imageContainer}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.mainImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.mainImage, { backgroundColor: '#E5E7EB' }]} />
                    )}
                </View>

                {/* Duration and Search */}
                <View style={styles.durationRow}>
                    <View style={styles.durationTextContainer}>
                        <Text style={styles.durationLabel}>Time Duration: </Text>
                        <Text style={styles.durationValue}>{exercise?.duration ?? '-'}</Text>
                    </View>
                    <TouchableOpacity style={styles.searchButton} onPress={onSearchSkillClick}>
                        <Text style={styles.searchButtonText}>Search a skill</Text>
                    </TouchableOpacity>
                </View>

                {/* Description — rendered as plain text from HTML */}
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.paragraph}>{cleanDescription}</Text>

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
    greenHeaderContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        marginBottom: 16,
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
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    imageContainer: {
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#F3F4F6',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    durationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    durationTextContainer: {
        flexDirection: 'row',
    },
    durationLabel: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: '#2563EB', // Blue
    },
    durationValue: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#3B82F6', // Lighter Blue
    },
    searchButton: {
        borderWidth: 1.5,
        borderColor: '#2563EB',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    searchButtonText: {
        color: '#2563EB',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
        marginBottom: 12,
        marginTop: 8,
    },
    paragraph: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 12,
    },
    bulletList: {
        marginLeft: 8,
        marginBottom: 20,
    },
    bulletItem: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: '#6B7280',
        lineHeight: 24,
    },
    numberedItem: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: '#6B7280',
        lineHeight: 24,
        marginLeft: 8,
    },
});