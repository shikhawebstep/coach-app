// WeeklyStudentClassDetails.jsx - only showing the relevant changes

import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function WeeklyStudentClassDetails({ onBack, onSave, onCancel, student }) {

    const raw = student?.rawStudent
    const booking = student?.booking
    const bookingId = student?.bookingId || booking?.id
    const { token } = useAuth();

    const fullName = student?.name || `${raw?.studentFirstName || ''} ${raw?.studentLastName || ''}`.trim() || '-'
    const age = raw?.age ? `${raw.age}` : student?.age || '-'
    const medical = raw?.medicalInformation || '-'
    const parent = raw?.parents?.[0]
    const parentName = parent ? `${parent.parentFirstName || ''} ${parent.parentLastName || ''}`.trim() : '-'
    const parentPhone = parent?.parentPhoneNumber || '-'

    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        if (!notes.trim()) {
            Alert.alert('Validation', 'Please enter a note before saving.')
            return
        }
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/${bookingId}/notes`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ additionalNote: notes.trim() }),
                }
            )
            const data = await response.json()
            if (!response.ok || data?.status === false) {
                throw new Error(data?.message || 'Failed to save note')
            }
            Alert.alert('Success', 'Note saved successfully.')
            onSave?.()
        } catch (error) {
            Alert.alert('Error', error?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{fullName} information</Text>
            </View>

            <View style={styles.divider} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <Text style={styles.sectionTitle}>Student Information</Text>
                <View style={styles.rowGroup}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>Full Name</Text>
                        <Text style={styles.fieldValue}>{fullName}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>Age</Text>
                        <Text style={styles.fieldValue}>{age}</Text>
                    </View>
                </View>
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Medical information</Text>
                    <Text style={styles.fieldValue}>{medical}</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Parent Information</Text>
                <View style={styles.rowGroup}>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>Full Name</Text>
                        <Text style={styles.fieldValue}>{parentName}</Text>
                    </View>
                    <View style={styles.col}>
                        <Text style={styles.fieldLabel}>Telephone number</Text>
                        <Text style={[styles.fieldValue, styles.phone]}>{parentPhone}</Text>
                    </View>
                </View>

                <Text style={styles.fieldLabel}>Notes</Text>
                <TextInput
                    style={styles.notesInput}
                    multiline
                    textAlignVertical="top"
                    placeholder="Add a note..."
                    value={notes}
                    onChangeText={setNotes}
                    scrollEnabled={false}   // add this
                />

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onBack} disabled={loading}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={styles.saveText}>Save</Text>
                        }
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
        gap: 8,
    },
    backButton: { marginRight: 4 },
    headerTitle: { fontSize: 20,  color: '#1a1a1a', fontFamily: 'Urbanist_700Bold' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 16 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
    sectionTitle: { fontSize: 15, color: '#1a1a1a', marginBottom: 12, marginTop: 4, fontFamily: 'Urbanist_600SemiBold' },
    rowGroup: { flexDirection: 'row', marginBottom: 16, gap: 32 },
    col: { flex: 1 },
    fieldGroup: { marginBottom: 16 },
    fieldLabel: { fontSize: 13, color: '#9CA3AF', marginBottom: 4, fontFamily: 'Urbanist_400Regular' },
    fieldValue: { fontSize: 14, color: '#1a1a1a', fontFamily: 'Urbanist_600SemiBold' },
    phone: { color: '#3B82F6' },
    notesInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 12,
        height: 120,
        fontSize: 14,
        color: '#1a1a1a',
        backgroundColor: '#FAFAFA',
        marginTop: 6,
        marginBottom: 32,
        fontFamily: 'Urbanist_400Regular',
    },
    buttonRow: { flexDirection: 'row', gap: 12 },
    cancelBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#3B82F6',
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelText: { color: '#3B82F6', fontSize: 15, fontFamily: 'Urbanist_600SemiBold' },
    saveBtn: {
        flex: 1,
        backgroundColor: '#3B82F6',
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveText: { color: '#fff', fontSize: 15, fontFamily: 'Urbanist_600SemiBold' },
})