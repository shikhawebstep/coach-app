import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function NotificationDetails({ onBack }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = getStyles(isDark);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>New Training Course Added</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Meta Info Row */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color={isDark ? '#9CA3AF' : '#4B5563'} style={styles.metaIcon} />
                        <Text style={styles.metaText}>Saturday 2nd June 2023</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={isDark ? '#9CA3AF' : '#4B5563'} style={styles.metaIcon} />
                        <Text style={styles.metaText}>9:30</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={16} color={isDark ? '#9CA3AF' : '#4B5563'} style={styles.metaIcon} />
                        <Text style={styles.metaText}>Ben Marcus</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Badge */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Ionicons name="alert-circle" size={14} color={isDark ? '#F87171' : '#EF4444'} style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>Action Required</Text>
                    </View>
                </View>

                {/* Body Text */}
                <View style={styles.bodyContainer}>
                    <Text style={styles.paragraph}>Hey Coach,</Text>

                    <Text style={styles.paragraph}>
                        We wanted to let you know that we've now added a new training course to improve your knoweldge of health and safety.
                    </Text>

                    <Text style={styles.paragraph}>
                        Please watch the course and take the short quiz after to pass this module.
                    </Text>

                    <Text style={styles.paragraph}>Thanks</Text>

                    <Text style={styles.paragraph}>Ben</Text>
                </View>

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        color: isDark ? '#F5F5F5' : '#1a1a1a',
        flexShrink: 1,
        fontFamily: 'Urbanist_700Bold',
    },
    content: {
        paddingHorizontal: 16,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        marginRight: 4,
    },
    metaText: {
        fontSize: 14,
        color: isDark ? '#D1D5DB' : '#1a1a1a',
        fontFamily: 'Urbanist_500Medium',
    },
    divider: {
        height: 1,
        backgroundColor: isDark ? '#2A2A2A' : '#E5E7EB',
        marginBottom: 20,
    },
    badgeContainer: {
        marginBottom: 24,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#3B1818' : '#FEE2E2', // Red bg
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    badgeIcon: {
        marginRight: 6,
    },
    badgeText: {
        color: isDark ? '#F87171' : '#EF4444', // Red
        fontSize: 12,
        fontFamily: 'Urbanist_600SemiBold',
    },
    bodyContainer: {
        paddingRight: 16,
    },
    paragraph: {
        fontSize: 15,
        color: isDark ? '#B0B0B0' : '#4B5563',
        lineHeight: 24,
        marginBottom: 20,
        fontFamily: 'Urbanist_400Regular',
    },
});