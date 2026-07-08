import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { getNotificationVisual } from '@/utils/notificationVisuals';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

// Group flat notifications array into sections by category
function groupByCategory(notifications = []) {
    const map = {};
    for (const n of notifications) {
        const cat = n.category || 'Other';
        if (!map[cat]) map[cat] = [];
        map[cat].push(n);
    }
    return Object.entries(map).map(([category, items]) => ({ category, items }));
}

// Format ISO date → "4 Jun 2026, 07:16"
function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function NotificationsList({ onNotificationSelect }) {
    const [hideRead, setHideRead] = useState(false);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = getStyles(isDark);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/notifications/list`,
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (response.ok) {
                const flat = result?.data?.customNotifications || [];
                setSections(groupByCategory(flat));
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // isRead lives inside recipients[0].isRead
    const isRead = (item) => item.recipients?.[0]?.isRead ?? true;

    const visibleSections = hideRead
        ? sections
            .map(s => ({ ...s, items: s.items.filter(n => !isRead(n)) }))
            .filter(s => s.items.length > 0)
        : sections;

    if (loading) {
        return (
            <View style={styles.centered}>
                <CustomLoader size={80} color={isDark ? '#fff' : '#000'} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <TouchableOpacity
                    style={styles.hideReadContainer}
                    onPress={() => setHideRead(!hideRead)}
                >
                    <Ionicons
                        name={hideRead ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={hideRead ? (isDark ? '#fff' : '#000') : '#a0a0a0'}
                    />
                    <Text style={styles.hideReadText}>Hide read</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {visibleSections.length === 0 ? (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>No notifications</Text>
                    </View>
                ) : (
                    visibleSections.map((section) => (
                        <View key={section.category} style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{section.category}</Text>
                            {section.items.map(item => {
                                const typeImage = getNotificationVisual(item);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={styles.notificationCard}
                                        onPress={() => onNotificationSelect?.(item)}
                                    >
                                        {/* Sender avatar with notification-type badge */}
                                        <View style={styles.avatarWrapper}>

                                            <Image style={styles.avatarImage} source={typeImage}  resizeMode="contain" />

                                        </View>

                                        {/* Content */}
                                        <View style={styles.contentContainer}>
                                            <Text style={styles.notificationTitle} numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Text style={styles.notificationSubtitle} numberOfLines={2}>
                                                {item.description}
                                            </Text>
                                            <Text style={styles.notificationDate}>
                                                {formatDate(item.createdAt)}
                                            </Text>
                                        </View>

                                        {/* Unread dot — shown when isRead is false */}
                                        {!isRead(item) && <View style={styles.unreadDot} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const getStyles = (isDark) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: isDark ? '#9CA3AF' : '#6B7280',
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
        fontFamily: 'Urbanist_700Bold',
        color: isDark ? '#F5F5F5' : '#1a1a1a',
    },
    hideReadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    hideReadText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: isDark ? '#9CA3AF' : '#666',
        marginLeft: 6,
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
        fontFamily: 'Urbanist_700Bold',
        color: isDark ? '#F5F5F5' : '#1a1a1a',
        marginBottom: 16,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: isDark ? '#2A2A2A' : '#F9FAFB',
        position: 'relative',
    },
    avatarWrapper: {
        width: 48,
        height: 48,
        marginRight: 12,
        position: 'relative',
    },
    avatarImage: {
        width: 55,
        height: 55,
    },
    typeBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        borderWidth: 1.5,
        borderColor: isDark ? '#1E1E1E' : '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    typeBadgeImage: {
        width: 14,
        height: 14,
    },
    contentContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 15,
        fontFamily: 'Urbanist_700Bold',
        color: isDark ? '#F5F5F5' : '#1a1a1a',
        marginBottom: 4,
    },
    notificationSubtitle: {
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: isDark ? '#B0B0B0' : '#6B7280',
        lineHeight: 18,
        marginBottom: 4,
    },
    notificationDate: {
        fontSize: 11,
        fontFamily: 'Urbanist_400Regular',
        color: isDark ? '#777' : '#9CA3AF',
    },
    unreadDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 10,
        height: 10,
        backgroundColor: '#FF4D4D',
        borderRadius: 5,
    },
});