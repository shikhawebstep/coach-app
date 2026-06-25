import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HolidayStudentInformation({ onBack }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>John Smith information</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Student Information Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Student Information</Text>
                </View>

                <View style={styles.rowWrapper}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Full Name</Text>
                        <Text style={styles.value}>John Smith</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Age</Text>
                        <Text style={styles.value}>7</Text>
                    </View>
                </View>

                <View style={styles.rowWrapper}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Medical information</Text>
                        <Text style={styles.value}>Mild asthma</Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Parent Information Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Parent Information</Text>
                </View>

                <View style={styles.rowWrapper}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Full Name</Text>
                        <Text style={styles.value}>Daryl Smith</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.label}>Telephone number</Text>
                        <TouchableOpacity>
                            <Text style={styles.linkValue}>0791042 3334</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notes Input Area */}
                <View style={styles.notesContainer}>
                    <Text style={styles.label}>Notes</Text>
                    <TextInput
                        style={styles.notesInput}
                        multiline={true}
                        numberOfLines={8}
                        textAlignVertical="top"
                    />
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveBtnText}>Save</Text>
                    </TouchableOpacity>
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
        paddingTop: 20,
        paddingBottom: 16,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    content: {
        paddingHorizontal: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 20,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#4B5563',
        fontFamily: 'Urbanist_600SemiBold',
    },
    rowWrapper: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    col: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 6,
    },
    value: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#1a1a1a',
    },
    linkValue: {
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
        color: '#3B82F6',
    },
    notesContainer: {
        marginTop: 10,
        marginBottom: 40,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        padding: 16,
        height: 180,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#1a1a1a',
        backgroundColor: '#FCFCFD',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    cancelBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#3B82F6',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 16,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        fontSize: 16,
    },
});