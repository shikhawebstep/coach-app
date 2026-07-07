import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

const SESSION_ITEMS = [
    { id: 1, title: 'Small-side games', desc: 'This skills tutorial will help you understand how to perform the Pinguim.', time: '10 mins', image: 'https://via.placeholder.com/300x200/4ADE80/ffffff?text=Small-side+games' },
    { id: 2, title: 'Introduction (Head coach)', desc: 'This skills tutorial will help you understand how to perform the Pinguim.', time: '2 mins', image: 'https://via.placeholder.com/300x200/4ADE80/ffffff?text=Introduction' },
    { id: 3, title: 'Warm up activity', desc: 'This skills tutorial will help you understand how to perform the Pinguim.', time: '10 mins', image: 'https://via.placeholder.com/300x200/4ADE80/ffffff?text=Warm+up' },
    { id: 4, title: 'Technical exercise', desc: 'This skills tutorial will help you understand how to perform the Pinguim.', time: '12 mins', image: 'https://via.placeholder.com/300x200/4ADE80/ffffff?text=Technical+exercise' },
    { id: 5, title: 'Tactical exercise', desc: 'This skills tutorial will help you understand how to perform the Pinguim.', time: '12 mins', image: 'https://via.placeholder.com/300x200/4ADE80/ffffff?text=Tactical+exercise' },
];

const COLORS = {
    light: {
        background: '#fff',
        tabsBg: '#F3F4F6',
        inactiveTabText: '#6B7280',
        bannerBg: '#F3F4F6',
        skillTitle: '#1a1a1a',
        skillName: '#4B5563',
        skillDesc: '#6B7280',
        divider: '#E5E7EB',
        cardTitle: '#1a1a1a',
        cardDesc: '#6B7280',
        cardTime: '#1a1a1a',
        cardBg: '#F3F4F6',
    },
    dark: {
        background: '#121212',
        tabsBg: '#1E1E1E',
        inactiveTabText: '#9CA3AF',
        bannerBg: '#2A2A2A',
        skillTitle: '#F5F5F5',
        skillName: '#D1D5DB',
        skillDesc: '#9CA3AF',
        divider: '#2A2A2A',
        cardTitle: '#F5F5F5',
        cardDesc: '#9CA3AF',
        cardTime: '#F5F5F5',
        cardBg: '#2A2A2A',
    },
};

export default function SyllabusSkill({ onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [activeTab, setActiveTab] = useState('Beginners [4-5]');

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

            {/* Package Tabs */}
            <View style={styles.packageTabs}>
                {['Beginners [4-5]', 'Intermediate [6-7]'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.packageTab, activeTab === tab ? styles.activePackage : styles.inactivePackage]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.packageTabText, activeTab === tab ? styles.activePackageText : styles.inactivePackageText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Promo Banner */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/800x200/4ADE80/ffffff?text=PLAY+LIKE+PELE' }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Skill Of The Day */}
                <Text style={styles.skillTitle}>Skill Of The Day</Text>
                <View style={styles.skillSubTitleContainer}>
                    <Text style={styles.skillName}>The Pinguim</Text>
                    <Ionicons name="volume-medium-outline" size={20} color="#3B82F6" style={styles.volumeIcon} />
                </View>
                <Text style={styles.skillDesc}>In todays lesson, students will learn to perform the Pinguim.</Text>

                {/* Video Player Placeholder */}
                <View style={styles.videoContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/600x400/333333/ffffff?text=Video+Player' }}
                        style={styles.videoImage}
                        resizeMode="cover"
                    />
                    <View style={styles.videoControlsOverlay}>
                        <View style={styles.videoCenter}>
                            <Ionicons name="pause-circle" size={48} color="#fff" />
                        </View>
                        <View style={styles.videoBottomControls}>
                            <View style={styles.videoRow}>
                                <Ionicons name="play" size={20} color="#fff" style={styles.playIcon} />
                                <Text style={styles.videoTime}>0:10 / 0:41</Text>
                            </View>
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBarBackground}>
                                    <View style={styles.progressBarFill} />
                                    <View style={styles.progressDot} />
                                </View>
                            </View>
                            <View style={styles.videoRowRight}>
                                <Ionicons name="volume-high" size={20} color="#fff" style={styles.controlIcon} />
                                <Ionicons name="scan-outline" size={20} color="#fff" style={styles.controlIcon} />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Session List */}
                {SESSION_ITEMS.map(item => (
                    <View key={item.id} style={styles.sessionCard}>
                        <View style={styles.imagePlaceholder}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                            <Text style={styles.cardTime}>{item.time}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
        fontSize: 24,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    packageTabs: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: theme.tabsBg,
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    packageTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activePackage: { backgroundColor: '#3B82F6' },
    inactivePackage: { backgroundColor: 'transparent' },
    packageTabText: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
    },
    activePackageText: { color: '#fff' },
    inactivePackageText: { color: theme.inactiveTabText },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    bannerContainer: {
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: theme.bannerBg,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    skillTitle: {
        fontSize: 20,
        fontFamily: 'Urbanist_700Bold',
        color: theme.skillTitle,
        marginBottom: 4,
    },
    skillSubTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    skillName: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: theme.skillName,
    },
    volumeIcon: { marginLeft: 6 },
    skillDesc: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: theme.skillDesc,
        marginBottom: 16,
    },
    videoContainer: {
        height: 220,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 24,
        backgroundColor: '#000',
        position: 'relative',
    },
    videoImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    videoControlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 12,
    },
    videoCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoBottomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 8,
        borderRadius: 8,
    },
    videoRow: { flexDirection: 'row', alignItems: 'center' },
    playIcon: { marginRight: 8 },
    videoTime: { color: '#fff', fontSize: 12, fontFamily: 'Urbanist_400Regular' },
    progressBarContainer: { flex: 1, marginHorizontal: 12 },
    progressBarBackground: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarFill: {
        height: 4,
        backgroundColor: '#fff',
        width: '30%',
        borderRadius: 2,
    },
    progressDot: {
        width: 12,
        height: 12,
        backgroundColor: '#fff',
        borderRadius: 6,
        marginLeft: -6,
    },
    videoRowRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    controlIcon: { opacity: 0.9 },
    divider: {
        height: 1,
        backgroundColor: theme.divider,
        marginBottom: 20,
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
        backgroundColor: theme.cardBg,
        marginRight: 16,
    },
    cardImage: { width: '100%', height: '100%' },
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
