import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image,ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const SESSION_ITEMS = [
    {
        id: 1,
        title: 'Small-sided games',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')
    },
    {
        id: 2,
        title: 'Introduction (Head coach)',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '2 mins',
        image: require('../../../assets/images/skill.png')
    },
    {
        id: 3,
        title: 'Warm up activity',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '10 mins',
        image: require('../../../assets/images/skill.png')
    },
    {
        id: 4,
        title: 'Technical exercise',
        desc: 'This skills tutorial will help you understand how to perform the Penguin.',
        time: '12 mins',
        image: require('../../../assets/images/skill.png')
    },
];

export default function HolidaySyllabus({ onBack, onSessionSelect }) {
    const [activeAgeGroup, setActiveAgeGroup] = useState('Beginners (4-5)');
    const [activeDay, setActiveDay] = useState('Day 1');

    return (
        <View style={styles.container}>
            {/* Green Header */}
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
                    <View style={{ width: 24 }} />
                </ImageBackground>
            </View>

            {/* Age Group Pils */}
            <View style={styles.ageGroupsWrapper}>
                <View style={styles.ageGroups}>
                    {['Beginners (4-5)', 'Intermediate (6-7)'].map(age => (
                        <TouchableOpacity
                            key={age}
                            style={[styles.agePill, activeAgeGroup === age ? styles.activeAgePill : styles.inactiveAgePill]}
                            onPress={() => setActiveAgeGroup(age)}
                        >
                            <Text style={[styles.agePillText, activeAgeGroup === age ? styles.activeAgePillText : styles.inactiveAgePillText]}>{age}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Day Tabs */}
            <View style={styles.tabsContainer}>
                {['Day 1', 'Day 2', 'Day 3'].map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeDay === tab && styles.activeTab]}
                        onPress={() => setActiveDay(tab)}
                    >
                        <Text style={[styles.tabText, activeDay === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Banner Section */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={require('../../../assets/images/pele.png')}
                        style={styles.bannerImage}
                    />                </View>

                {/* Skill of the Day */}
                <View style={styles.skillSection}>
                    <Text style={styles.skillTitle}>Skill Of The Day</Text>
                    <View style={styles.skillHeader}>
                        <Text style={styles.skillName}>The Penguin</Text>
                        <TouchableOpacity>
                            <Ionicons name="volume-medium-outline" size={20} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.skillDesc}>In todays lesson, students will learn to perform the Penguin.</Text>
                </View>

                {/* Video Placeholder */}
                <View style={styles.videoPlaceholder}>
                    <Image
                        source={require('../../../assets/images/session.png')}
                        style={styles.videoImage}
                    />                   
                     <View style={styles.playOverlay}>
                        <Ionicons name="play" size={40} color="#fff" />
                    </View>
                </View>

                {/* Session List */}
                {SESSION_ITEMS.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.sessionCard}
                        onPress={() => onSessionSelect && onSessionSelect(item.id)}
                    >
                        <View style={styles.imagePlaceholder}>
                            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc} numberOfLines={3}>{item.desc}</Text>
                            <Text style={styles.cardTime}>{item.time}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
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
        fontWeight: 'bold',
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
        backgroundColor: '#fff',
        borderColor: '#F3F4F6',
    },
    agePillText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeAgePillText: {
        color: '#fff',
    },
    inactiveAgePillText: {
        color: '#666',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
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
        backgroundColor: '#fff',
    },
    tabText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4B5563',
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
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    skillName: {
        fontSize: 16,
        color: '#666',
        marginRight: 8,
    },
    skillDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    videoPlaceholder: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
        marginBottom:30,
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
        backgroundColor: '#F3F4F6',
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
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 8,
    },
    cardTime: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
});
