import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

export default function BirthdaySyllabus({ onBack, onSessionSelect }) {
    const [activePackage, setActivePackage] = useState('Silver package');
    const [activeAgeGroup, setActiveAgeGroup] = useState('4-6 years');

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
                
                {/* Package Pils */}
                <View style={styles.packageGroups}>
                    {['Gold package', 'Silver package'].map(pkg => (
                        <TouchableOpacity
                            key={pkg}
                            style={[styles.packagePill, activePackage === pkg ? styles.activePackagePill : styles.inactivePackagePill]}
                            onPress={() => setActivePackage(pkg)}
                        >
                            <Text style={[styles.packagePillText, activePackage === pkg ? styles.activePackagePillText : styles.inactivePackagePillText]}>{pkg}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Age Group Pils */}
                <View style={styles.ageGroups}>
                    {['4-6 years', '7-9 years', '10-12 years'].map(age => (
                        <TouchableOpacity
                            key={age}
                            style={[styles.agePill, activeAgeGroup === age ? styles.activeAgePill : styles.inactiveAgePill]}
                            onPress={() => setActiveAgeGroup(age)}
                        >
                            <Text style={[styles.agePillText, activeAgeGroup === age ? styles.activeAgePillText : styles.inactiveAgePillText]}>{age}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Session Plan Header */}
                <View style={styles.sessionPlanHeader}>
                    <Text style={styles.sessionPlanTitle}>Session Plan</Text>
                    <View style={styles.sessionPlanTimeContainer}>
                        <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 4 }} />
                        <Text style={styles.sessionPlanTimeText}>4 Hours</Text>
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
    packageGroups: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
        justifyContent: 'center',
    },
    packagePill: {
        flex: 1,
        maxWidth: 160,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1.5,
    },
    activePackagePill: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    inactivePackagePill: {
        backgroundColor: '#fff',
        borderColor: '#E5E7EB',
    },
    packagePillText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activePackagePillText: {
        color: '#fff',
    },
    inactivePackagePillText: {
        color: '#666',
    },
    ageGroups: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    agePill: {
        flex: 1,
        paddingVertical: 10,
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
        borderColor: '#3B82F6',
    },
    agePillText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    activeAgePillText: {
        color: '#fff',
    },
    inactiveAgePillText: {
        color: '#3B82F6',
    },
    sessionPlanHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sessionPlanTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginRight: 12,
    },
    sessionPlanTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 'auto',
    },
    sessionPlanTimeText: {
        fontSize: 14,
        color: '#666',
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
