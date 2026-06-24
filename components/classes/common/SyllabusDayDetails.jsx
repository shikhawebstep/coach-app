import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image,ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SESSION_ITEMS = [
    {
        id: 1,
        title: 'Small-side games',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')

    },
    {
        id: 2,
        title: 'Introduction (Head coach)',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '2 mins',
        image: require('../../../assets/images/skill.png')

    },
    {
        id: 3,
        title: 'Warm up activity',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')

    },
    {
        id: 4,
        title: 'Technical exercise',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '12 mins',
        image: require('../../../assets/images/skill.png')
    },
    {
        id: 5,
        title: 'Tactical exercise',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '12 mins',
        image: require('../../../assets/images/skill.png')
    },
    {
        id: 6,
        title: 'Small-side games',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')
    },
    {
        id: 7,
        title: 'Lesson debrief',
        desc: 'This skills tutorial will help you understand how to perform the Pinguim.',
        time: '2 mins',
        image: require('../../../assets/images/skill.png')
    },
];

export default function SyllabusDayDetails({ onBack, onSessionItemSelect }) {
    const [activeTab, setActiveTab] = useState('Beginners [4-5]');

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Green Header Wrapper */}
                <View style={styles.greenHeaderContainer}>
                 <ImageBackground
                    source={require('@/assets/images/greenoverlay.png')}
                    style={styles.greenHeader}
                    imageStyle={{ borderRadius: 20, }}
                >
                        <TouchableOpacity onPress={onBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Syllabus</Text>
                        <View style={{ width: 24 }} /> {/* Spacer */}
                    </ImageBackground>
                </View>

                {/* Level Tabs */}
                <View style={styles.levelTabs}>
                    <TouchableOpacity
                        style={[styles.levelTab, activeTab === 'Beginners [4-5]' ? styles.activeLevelTab : styles.inactiveLevelTab]}
                        onPress={() => setActiveTab('Beginners [4-5]')}
                    >
                        <Text style={[styles.levelTabText, activeTab === 'Beginners [4-5]' ? styles.activeLevelTabText : styles.inactiveLevelTabText]}>
                            Beginners [4-5]
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.levelTab, activeTab === 'Intermediate [6-7]' ? styles.activeLevelTab : styles.inactiveLevelTab]}
                        onPress={() => setActiveTab('Intermediate [6-7]')}
                    >
                        <Text style={[styles.levelTabText, activeTab === 'Intermediate [6-7]' ? styles.activeLevelTabText : styles.inactiveLevelTabText]}>
                            Intermediate [6-7]
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Banner Image */}
                    <View style={styles.bannerContainer}>
                        <Image
                            source={require('../../../assets/images/pele.png')}
                            style={styles.bannerImage}
                        />
                    </View>

                    {/* Skill Info */}
                    <View style={styles.skillHeaderRow}>
                        <Text style={styles.skillTitle}>Skill Of The Day</Text>
                    </View>
                    <View style={styles.skillSubtitleRow}>
                        <Text style={styles.skillSubtitle}>The Pinguim</Text>
                        <TouchableOpacity style={styles.soundIconBtn}>
                            <Ionicons name="volume-medium" size={18} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.skillDesc}>In todays lesson, students will learn to perform the Pinguim.</Text>

                    {/* Video Player Placeholder */}
                    <View style={styles.videoPlayerContainer}>
                        <Image
                            source={require('../../../assets/images/session.png')}
                            style={styles.videoImage}
                        />
                        {/* Overlay Controls */}
                        <View style={styles.videoOverlay}>
                            <TouchableOpacity style={styles.centerPauseBtn}>
                                <Ionicons name="pause" size={32} color="#fff" />
                            </TouchableOpacity>

                            <View style={styles.videoBottomControls}>
                                <TouchableOpacity>
                                    <Ionicons name="play" size={20} color="#fff" style={styles.controlIcon} />
                                </TouchableOpacity>
                                <Text style={styles.videoTime}>0:10 / 0:41</Text>

                                <View style={styles.videoRightControls}>
                                    <TouchableOpacity>
                                        <Ionicons name="volume-high" size={20} color="#fff" style={styles.controlIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons name="scan-outline" size={20} color="#fff" style={styles.controlIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Session List */}
                    <View style={styles.sessionList}>
                        {SESSION_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={`${item.id}-${index}`}
                                style={styles.sessionCard}
                                onPress={() => onSessionItemSelect && onSessionItemSelect(item.id)}
                            >
                                <View style={styles.imagePlaceholder}>
                                    <Image source={item.image} style={styles.cardImage} resizeMode="cover
" />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                                    <Text style={styles.cardTime}>{item.time}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
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
        backgroundColor: '#22c55e', // Bright green from screenshot
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 18,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    levelTabs: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: '#F3F4F6', // Light gray 
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    levelTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeLevelTab: {
        backgroundColor: '#3B82F6', // Blue
    },
    inactiveLevelTab: {
        backgroundColor: 'transparent',
    },
    levelTabText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    activeLevelTabText: {
        color: '#fff',
    },
    inactiveLevelTabText: {
        color: '#1a1a1a',
    },
    daysWrapper: {
        marginBottom: 20,
    },
    daysList: {
        paddingHorizontal: 16,
        gap: 12,
    },
    dayPill: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    activeDayPill: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    inactiveDayPill: {
        backgroundColor: '#fff',
        borderColor: '#3B82F6',
    },
    dayPillText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeDayPillText: {
        color: '#fff',
    },
    inactiveDayPillText: {
        color: '#3B82F6',
    },
    content: {
        paddingHorizontal: 16,
    },
    bannerContainer: {
        width: '100%',
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    skillHeaderRow: {
        marginBottom: 4,
    },
    skillTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    skillSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    skillSubtitle: {
        fontSize: 16,
        color: '#4B5563',
    },
    soundIconBtn: {
        marginLeft: 6,
    },
    skillDesc: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    videoPlayerContainer: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 24,
    },
    videoImage: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerPauseBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoBottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)', // Gradient mock
    },
    controlIcon: {
        marginHorizontal: 8,
    },
    videoTime: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    videoRightControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionList: {
        marginTop: 10,
    },
    sessionCard: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: 130, // Make image slightly wider matching design
        height: 85,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        marginRight: 12,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        paddingVertical: 2,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 11,
        color: '#6B7280',
        lineHeight: 16,
        marginBottom: 8,
    },
    cardTime: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
});
