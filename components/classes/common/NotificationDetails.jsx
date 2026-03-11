import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationDetails({ onBack }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>New Training Course Added</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Meta Info Row */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="calendar-outline" size={16} color="#4B5563" style={styles.metaIcon} />
                        <Text style={styles.metaText}>Saturday 2nd June 2023</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color="#4B5563" style={styles.metaIcon} />
                        <Text style={styles.metaText}>9:30</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={16} color="#4B5563" style={styles.metaIcon} />
                        <Text style={styles.metaText}>Ben Marcus</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Badge */}
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Ionicons name="alert-circle" size={14} color="#EF4444" style={styles.badgeIcon} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        fontWeight: 'bold',
        color: '#1a1a1a',
        flexShrink: 1,
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
        color: '#1a1a1a',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 20,
    },
    badgeContainer: {
        marginBottom: 24,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2', // Light Red
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    badgeIcon: {
        marginRight: 6,
    },
    badgeText: {
        color: '#EF4444', // Red
        fontSize: 12,
        fontWeight: '600',
    },
    bodyContainer: {
        paddingRight: 16,
    },
    paragraph: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 20,
    },
});
