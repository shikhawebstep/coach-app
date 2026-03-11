import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BirthdayPartyDetails({ onBack, onSyllabusClick, studentName = "John Smith" }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{studentName} birthday</Text>
                </View>
                <TouchableOpacity style={styles.syllabusButton} onPress={onSyllabusClick}>
                    <Text style={styles.syllabusText}>Syllabus</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="calendar-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Date</Text>
                            </View>
                            <Text style={styles.infoValue}>Sat 3rd Apr</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="time-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Time</Text>
                            </View>
                            <Text style={styles.infoValue}>9:30am</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <View style={styles.infoLabelContainer}>
                                <Ionicons name="person-outline" size={16} color="#666" style={styles.infoIcon} />
                                <Text style={styles.infoLabel}>Students</Text>
                            </View>
                            <Text style={styles.infoValue}>20</Text>
                        </View>
                        <View style={styles.infoItemSmall}>
                            <Text style={styles.statusLabel}>Status</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Pending</Text>
                            </View>
                        </View>
                    </View>

                    {/* Map Placeholder */}
                    <View style={styles.mapContainer}>
                        {/* Could replace with an actual MapView or Image */}
                        <Image source={{ uri: 'https://via.placeholder.com/400x150/EEEEEE/999999?text=Map+Image' }} style={styles.mapImage} resizeMode="cover" />
                    </View>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={18} color="#666" style={styles.locationIcon} />
                        <Text style={styles.locationText}>Kings Cross, Grays Inn Road, London WC2H 9HE [Outdoor Park]</Text>
                    </View>
                </View>

                {/* Student Information Section */}
                <Text style={styles.sectionTitle}>Student Information</Text>

                <View style={styles.formRow}>
                    <View style={[styles.formGroup, { flex: 2, marginRight: 16 }]}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value="John Smith"
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Age</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value="7"
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                {/* Parent Information Section */}
                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Parent Information</Text>

                <View style={styles.formRow}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 16 }]}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value="Bradley Smith"
                                editable={false}
                            />
                        </View>
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Telephone</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={[styles.input, styles.inputLink]}
                                value="0791042 3334"
                                editable={false}
                            />
                        </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    },
    syllabusButton: {
        backgroundColor: '#1CAB4B', // Green
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    syllabusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    infoItem: {
        flex: 1,
    },
    infoItemSmall: {
        marginLeft: 8,
        alignItems: 'flex-end',
    },
    infoLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    infoIcon: {
        marginRight: 4,
    },
    infoLabel: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '600',
        marginBottom: 4,
    },
    statusLabel: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '600',
        marginBottom: 8,
        marginRight: 4, // Align slightly right to match badge
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    statusBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    mapContainer: {
        height: 140,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#F3F4F6',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingRight: 16,
    },
    locationIcon: {
        marginTop: 2,
    },
    locationText: {
        marginLeft: 8,
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 16,
    },
    formRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    formGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 8,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#9CA3AF', // Gray border matching the screenshot
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1a1a1a',
    },
    inputLink: {
        color: '#3B82F6', // Blue link color 
    },
});
