import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BirthdaySessionExercise({ onBack, onSearchSkillClick }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.greenHeaderContainer}>
                <View style={styles.greenHeader}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Small-sided games</Text>
                    <View style={{ width: 24 }} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Main Image Placeholder */}
                <View style={styles.imageContainer}>
                    <Image
                       source={require('../../../assets/images/skill.png')}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Duration and Search */}
                <View style={styles.durationRow}>
                    <View style={styles.durationTextContainer}>
                        <Text style={styles.durationLabel}>Time Duration: </Text>
                        <Text style={styles.durationValue}>10 mins</Text>
                    </View>
                </View>

                {/* Organisation */}
                <Text style={styles.sectionTitle}>Organisation</Text>
                <Text style={styles.paragraph}>Set up two small-sided games. You will need the following:</Text>
                <View style={styles.bulletList}>
                    <Text style={styles.bulletItem}>• 4 pop-up goals</Text>
                    <Text style={styles.bulletItem}>• Bibs to clearly divide teams</Text>
                    <Text style={styles.bulletItem}>• 4 blue cones to divide the two pitches</Text>
                    <Text style={styles.bulletItem}>• 5 footballs</Text>
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.paragraph}>
                    Begin the lesson with two small-sided games.
                    Organise players based on ability into four teams. If you do not have many students, use one pitch only. Keep an eye on both games unless you have a support coach working with you.
                </Text>

                {/* Rules */}
                <Text style={styles.sectionTitle}>Rules</Text>
                <Text style={styles.paragraph}>
                    Before you start the game, quickly reiterate the rules of the game:
                </Text>
                <Text style={styles.bulletItem}>{'>'} No slide tackles</Text>

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
        fontWeight: 'bold',
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
        fontWeight: 'bold',
        color: '#2563EB', // Blue
    },
    durationValue: {
        fontSize: 16,
        color: '#3B82F6', // Lighter Blue
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
        marginTop: 8,
    },
    paragraph: {
        fontSize: 14,
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
        color: '#6B7280',
        lineHeight: 24,
    },
});
