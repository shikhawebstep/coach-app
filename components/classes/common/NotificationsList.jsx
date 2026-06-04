import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NOTIFICATIONS_DATA = [
    {
        id: 1,
        section: 'Today',
        data: [
            {
                id: 'n1',
                title: 'New Training Course Added',
                subtitle: 'Health and Safety video now released',
                image: require('@/assets/images/add.png'),
                unread: true,
            }
        ]
    },
    {
        id: 2,
        section: 'Yesterday',
        data: [
            {
                id: 'n2',
                title: 'Class Cancelled',
                subtitle: 'Your class on Saturday 18th May has been cancelled.',
                image: require('@/assets/images/cancel.png'),
                unread: false,
            }
        ]
    },
    {
        id: 3,
        section: 'December 11, 2024',
        data: [
            {
                id: 'n3',
                title: 'Annual Training Dates',
                subtitle: 'Our Annual Training is on 18th Sept',
                image: require('@/assets/images/annual.png'),
                unread: false,
            },
            {
                id: 'n4',
                title: 'Birthday Party Booking',
                subtitle: "You've been booked on Sat 19th May",
                image: require('@/assets/images/birthdayn.png'),
                unread: false,
            }
        ]
    }
];

export default function NotificationsList({ onNotificationSelect }) {
    const [hideRead, setHideRead] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity
                    style={styles.hideReadContainer}
                    onPress={() => setHideRead(!hideRead)}
                >
                    <Ionicons
                        name={hideRead ? "checkbox" : "square-outline"}
                        size={20}
                        color={hideRead ? "#000" : "#a0a0a0"}
                    />
                    <Text style={styles.hideReadText}>Hide read notifications</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {NOTIFICATIONS_DATA.map((section) => (
                    <View key={section.id} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.section}</Text>

                        {section.data.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.notificationCard}
                                onPress={() => onNotificationSelect && onNotificationSelect(item.id)}
                            >
                                <View style={styles.iconContainer}>
                                    <Image source={item.image} style={styles.avatarImage} />
                                </View>

                                <View style={styles.contentContainer}>
                                    <Text style={styles.notificationTitle}>{item.title}</Text>
                                    <Text style={styles.notificationSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                                </View>

                                {/* Unread indicator on the top-right corner of the card */}
                                {item.unread && <View style={styles.unreadDot} />}
                            </TouchableOpacity>
                        ))}
                    </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        color: '#1a1a1a',
        fontFamily: 'Urbanist_700Bold',
    },
    hideReadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hideReadText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 6,
        fontFamily: 'Urbanist_400Regular',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 16,
        fontFamily: 'Urbanist_700Bold',
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        position: 'relative',
    },
    iconContainer: {
        marginRight: 16,
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    unreadDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 12,
        height: 12,
        backgroundColor: '#FF4D4D',
        borderRadius: 6,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    notificationTitle: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 4,
        fontFamily: 'Urbanist_700Bold',
    },
    notificationSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        fontFamily: 'Urbanist_400Regular',
    },
});
