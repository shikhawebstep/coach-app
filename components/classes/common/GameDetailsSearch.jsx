import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView,ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameDetailsSearch({ onBack }) {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Green Header Area */}
                <View style={styles.greenHeaderContainer}>
                 <ImageBackground
                    source={require('@/assets/images/greenoverlay.png')}
                    style={styles.greenHeader}
                    imageStyle={{ borderRadius: 20, }}
                >
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Small-sided games</Text>
                        <View style={{ width: 24 }} /> {/* Spacer */}
                    </ImageBackground>
                </View>

                {/* Banner Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/800x450/4ade80/ffffff?text=Tactical+Board' }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Top Action Row */}
                <View style={styles.actionRow}>
                    <View style={styles.durationBlock}>
                        <Text style={styles.durationLabel}>Time Duration: </Text>
                        <Text style={styles.durationValue}>10 mins</Text>
                    </View>
                    <TouchableOpacity style={styles.searchSkillBtn}>
                        <Text style={styles.searchSkillBtnText}>Search a skill</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Text Content */}
                <View style={styles.textContent}>
                    {/* Organisation */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>Organisation</Text>
                        <Text style={styles.bodyText}>Set up two small-sided games. You will need the following:</Text>

                        <View style={styles.bulletList}>
                            <View style={styles.bulletRow}>
                                <Text style={styles.bulletDot}>·</Text>
                                <Text style={styles.bulletText}>4 pop-up goals</Text>
                            </View>
                            <View style={styles.bulletRow}>
                                <Text style={styles.bulletDot}>·</Text>
                                <Text style={styles.bulletText}>Bibs to clearly divide teams</Text>
                            </View>
                            <View style={styles.bulletRow}>
                                <Text style={styles.bulletDot}>·</Text>
                                <Text style={styles.bulletText}>4 blue cones to divide the two pitches</Text>
                            </View>
                            <View style={styles.bulletRow}>
                                <Text style={styles.bulletDot}>·</Text>
                                <Text style={styles.bulletText}>5 footballs</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.bodyText}>
                            Begin the lesson with two small-sided games.
                            Organise players based on ability into four teams. If you do not have many
                            students, use one pitch only. Keep an eye on both games, unless you have a
                            support coach working with you.
                        </Text>
                    </View>

                    {/* Rules */}
                    <View style={styles.sectionBlock}>
                        <Text style={styles.sectionTitle}>Rules</Text>
                        <Text style={styles.bodyText}>Before you start the game, quickly reiterate the rules of the game:</Text>

                        <View style={styles.bulletList}>
                            <View style={styles.bulletRow}>
                                <Text style={styles.listNum}>1- </Text>
                                <Text style={styles.bulletText}>No slide tackles</Text>
                            </View>
                            <View style={styles.bulletRow}>
                                <Text style={styles.listNum}>2- </Text>
                                <Text style={styles.bulletText}>No hands whatsoever</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    greenHeaderContainer: {
        marginBottom: 16,
    },
    greenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#22c55e', // Solid Green
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    imageContainer: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginBottom: 24,
    },
    durationBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    durationLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3B82F6', // Blue styling
    },
    durationValue: {
        fontSize: 16,
        color: '#3B82F6',
    },
    searchSkillBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#3B82F6',
    },
    searchSkillBtnText: {
        color: '#3B82F6',
        fontWeight: 'bold',
        fontSize: 14,
    },
    textContent: {
        paddingHorizontal: 4,
    },
    sectionBlock: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 8,
    },
    bulletList: {
        paddingLeft: 4,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    bulletDot: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: 'bold',
        marginRight: 8,
        lineHeight: 20,
    },
    listNum: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 4,
        lineHeight: 20,
    },
    bulletText: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
});
