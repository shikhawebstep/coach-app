import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// ─── HTML Parser ────────────────────────────────────────────────────────────
// Extracts named sections and their content from the HTML description.
// Sections are detected by heading keywords in <p> or plain text nodes.
function parseDescriptionHTML(html = '') {
    if (!html) return [];

    const SECTION_KEYWORDS = [
        'Time Duration',
        'Organisation',
        'Description',
        'Rules',
        'Conditions',
        'How to maintain the tone',
    ];

    // 1. Normalize <br> to newline, strip all other tags
    const withNewlines = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<li[^>]*>/gi, '\n• ')
        .replace(/<\/li>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');

    const lines = withNewlines
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

    const sections = [];
    let current = null;

    for (const line of lines) {
        const matchedKeyword = SECTION_KEYWORDS.find(k =>
            line.toLowerCase().startsWith(k.toLowerCase())
        );

        if (matchedKeyword) {
            if (current) sections.push(current);
            // Inline value after keyword (e.g. "Time Duration: 10 mins")
            const inlineValue = line.slice(matchedKeyword.length).replace(/^[:\s]+/, '').trim();
            current = { title: matchedKeyword, lines: inlineValue ? [inlineValue] : [] };
        } else if (current) {
            current.lines.push(line);
        } else {
            // Content before any section keyword
            sections.push({ title: null, lines: [line] });
        }
    }
    if (current) sections.push(current);

    return sections;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function WeeklySessionExercise({ excercise, onBack, onSearchSkillClick }) {

    console.log('excercise', excercise);

    // Parse imageUrl JSON string array
    let imageUri = null;
    try {
        const parsed = JSON.parse(excercise?.imageUrl);
        imageUri = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
        imageUri = excercise?.imageUrl ?? null;
    }

    const sections = parseDescriptionHTML(excercise?.description);

    // Pull "Time Duration" section out to show in the duration row
    const durationSection = sections.find(s => s.title === 'Time Duration');
    const durationValue = durationSection?.lines?.[0] ?? excercise?.duration ?? 'N/A';
    const contentSections = sections.filter(s => s.title !== 'Time Duration' && s.title !== null);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.greenHeaderContainer}>
                <ImageBackground
                    source={require('@/assets/images/greenoverlay.png')}
                    style={styles.greenHeader}
                    imageStyle={{ borderRadius: 20, }}
                >
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {excercise?.title ?? 'Exercise'}
                    </Text>
                    <View style={{ width: 24 }} />
                </ImageBackground>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Main Image */}
                <View style={styles.imageContainer}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.mainImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.mainImage, styles.imageFallback]}>
                            <Ionicons name="image-outline" size={48} color="#ccc" />
                        </View>
                    )}
                </View>

                {/* Duration + Search Skill */}
                <View style={styles.durationRow}>
                    <View style={styles.durationTextContainer}>
                        <Text style={styles.durationLabel}>Time Duration: </Text>
                        <Text style={styles.durationValue}>{durationValue}</Text>
                    </View>
                    <TouchableOpacity style={styles.searchButton} onPress={onSearchSkillClick}>
                        <Text style={styles.searchButtonText}>Search a skill</Text>
                    </TouchableOpacity>
                </View>

                {/* Dynamic Sections */}
                {contentSections.map((section, idx) => (
                    <View key={idx}>
                        {section.title && (
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        )}
                        {section.lines.map((line, lineIdx) =>
                            line.startsWith('•') ? (
                                <Text key={lineIdx} style={styles.bulletItem}>{line}</Text>
                            ) : /^\d+[-.]/.test(line) ? (
                                <Text key={lineIdx} style={styles.numberedItem}>{line}</Text>
                            ) : (
                                <Text key={lineIdx} style={styles.paragraph}>{line}</Text>
                            )
                        )}
                        <View style={{ height: 8 }} />
                    </View>
                ))}

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
    backButton: { padding: 4 },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
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
    imageFallback: {
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: 'bold',
        color: '#2563EB',
    },
    durationValue: {
        fontSize: 16,
        color: '#3B82F6',
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
        fontWeight: 'bold',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
        marginTop: 8,
    },
    paragraph: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 4,
    },
    bulletItem: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 24,
        marginLeft: 8,
    },
    numberedItem: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 24,
        marginLeft: 8,
    },
});