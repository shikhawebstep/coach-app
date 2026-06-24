import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const SESSION_ITEMS = [
    {
        id: 1,
        title: 'Small-side games',
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

export default function Syllabus({ onBack, onSessionSelect }) {
    const [activePackage, setActivePackage] = useState('Silver package');
    const [activeAgeGroup, setActiveAgeGroup] = useState('4-6 years');

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
                    <View style={{ width: 24 }} /> {/* Spacer to center title */}
                </ImageBackground>
            </View>

            {/* Package Tabs */}
            <View style={styles.packageTabs}>
                <TouchableOpacity
                    style={[styles.packageTab, activePackage === 'Gold package' ? styles.activePackage : styles.inactivePackage]}
                    onPress={() => setActivePackage('Gold package')}
                >
                    <Text style={[styles.packageTabText, activePackage === 'Gold package' ? styles.activePackageText : styles.inactivePackageText]}>Gold package</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.packageTab, activePackage === 'Silver package' ? styles.activePackage : styles.inactivePackage]}
                    onPress={() => setActivePackage('Silver package')}
                >
                    <Text style={[styles.packageTabText, activePackage === 'Silver package' ? styles.activePackageText : styles.inactivePackageText]}>Silver package</Text>
                </TouchableOpacity>
            </View>

            {/* Age Group Pills */}
            <View style={styles.ageGroupsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.ageGroups}
                >
                    {['4-6 years', '7-9 years', '10-12 years'].map(age => (
                        <TouchableOpacity
                            key={age}
                            style={[styles.agePill, activeAgeGroup === age ? styles.activeAgePill : styles.inactiveAgePill]}
                            onPress={() => setActiveAgeGroup(age)}
                        >
                            <Text style={[styles.agePillText, activeAgeGroup === age ? styles.activeAgePillText : styles.inactiveAgePillText]}>{age}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Session Plan Header */}
                <View style={styles.sessionHeaderRow}>
                    <View style={styles.sessionHeaderLeft}>
                        <Text style={styles.sessionTitle}>Session Plan</Text>
                        <Ionicons name="time-outline" size={16} color="#9CA3AF" style={styles.timeIcon} />
                        <Text style={styles.totalTime}>4 Hours</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="download-outline" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>

                {/* Session List */}
                {SESSION_ITEMS.map(item => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.sessionCard}
                        onPress={() => onSessionSelect && onSessionSelect(item.id)}
                    >
                        <View style={styles.imagePlaceholder}>
                            <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
                        </View>
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
        marginBottom: 16,
    },
    greenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1CAB4B', // Green color from screenshot
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        // Assuming a pattern might be an image, but solid color for now
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    packageTabs: {
        flexDirection: 'row',
        marginHorizontal: 16,
        backgroundColor: '#F3F4F6', // Light gray 
        borderRadius: 8,
        padding: 4,
        marginBottom: 16,
    },
    packageTab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 6,
    },
    activePackage: {
        backgroundColor: '#3B82F6', // Blue
    },
    inactivePackage: {
        backgroundColor: 'transparent',
    },
    packageTabText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activePackageText: {
        color: '#fff',
    },
    inactivePackageText: {
        color: '#1a1a1a',
    },
    ageGroupsWrapper: {
        marginBottom: 24,
    },
    ageGroups: {
        paddingHorizontal: 16,
        gap: 12, // Spacing between pills
    },
    agePill: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30, // Fully rounded
        borderWidth: 1.5,
    },
    activeAgePill: {
        backgroundColor: '#3B82F6', // Blue background
        borderColor: '#3B82F6',
    },
    inactiveAgePill: {
        backgroundColor: '#fff',
        borderColor: '#3B82F6', // Blue border
    },
    agePillText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeAgePillText: {
        color: '#fff',
    },
    inactiveAgePillText: {
        color: '#3B82F6',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    sessionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sessionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sessionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 12,
    },
    timeIcon: {
        marginRight: 4,
        marginTop: 2,
    },
    totalTime: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600',
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
        backgroundColor: '#F3F4F6', // Placeholder color
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
