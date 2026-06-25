import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HolidayStudentClassDetails({ onBack, onNotesClick, studentName = "John Smith" }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{studentName} class</Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.progressBadge}>
                        <Text style={styles.progressText}>1/5</Text>
                    </View>
                    <View style={styles.statusBadgeCompleted}>
                        <Text style={styles.statusTextWhite}>Completed</Text>
                    </View>
                </View>
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
                            <Text style={styles.infoValue}>3-to-1</Text>
                        </View>
                        <TouchableOpacity style={styles.changeDateBtn}>
                            <Text style={styles.changeDateText}>Change date</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Map Placeholder */}
                  <View style={styles.mapContainer}>
                    <Image
                        source={require('../../../assets/images/map.png')}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                    </View>

                    {/* Location */}
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={18} color="#666" />
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

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Medical information</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value="Mild asthma"
                            editable={false}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Ability level</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value="Beginner"
                            editable={false}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Areas to work on</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value="Beginner students, needs help on dribbling technique and basics of the game."
                            multiline={true}
                            editable={false}
                        />
                    </View>
                </View>

                {/* View Notes Button */}
                <TouchableOpacity style={styles.viewNotesBtn} onPress={onNotesClick}>
                    <Text style={styles.viewNotesBtnText}>View Notes</Text>
                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                </TouchableOpacity>

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
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBadge: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    progressText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 12,
    },
    statusBadgeCompleted: {
        backgroundColor: '#1CAB4B',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    statusTextWhite: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 12,
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
        fontFamily: 'Urbanist_400Regular',
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    changeDateBtn: {
        backgroundColor: '#FF4C4C',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    changeDateText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 13,
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
        alignItems: 'center',
        paddingRight: 16,
    },
    locationText: {
        marginLeft: 8,
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
        color: '#4B5563',
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
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
        fontFamily: 'Urbanist_700Bold',
        color: '#4B5563',
        marginBottom: 8,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 8,
        backgroundColor: '#FAFAFA',
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#1a1a1a',
    },
    textAreaContainer: {
        height: 100,
    },
    textArea: {
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    viewNotesBtn: {
        backgroundColor: '#3B82F6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 16,
    },
    viewNotesBtnText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 16,
        marginRight: 8,
    },
});
