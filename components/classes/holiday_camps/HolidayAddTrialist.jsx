import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HolidayAddTrialist({ onBack }) {
    const [studentName, setStudentName] = useState('Donald Johnson');
    const [parentName, setParentName] = useState('Mark Johnson');
    const [phone, setPhone] = useState('123456789');
    const [notes, setNotes] = useState('');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add a walk by trialist</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Inputs */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Student Full Name"
                        placeholderTextColor="#a0a0a0"
                        value={studentName}
                        onChangeText={setStudentName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Parent Full Name"
                        placeholderTextColor="#a0a0a0"
                        value={parentName}
                        onChangeText={setParentName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor="#a0a0a0"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Text Area */}
                <View style={styles.textAreaContainer}>
                    <TextInput
                        style={styles.textArea}
                        multiline={true}
                        placeholder="Notes (optional)"
                        placeholderTextColor="#a0a0a0"
                        value={notes}
                        onChangeText={setNotes}
                        textAlignVertical="top"
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onBack}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add student</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 8,
        backgroundColor: '#F6F6F7',
        marginBottom: 16,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1a1a1a',
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 8,
        backgroundColor: '#F6F6F7',
        marginBottom: 24,
        height: 150,
    },
    textArea: {
        paddingHorizontal: 16,
        paddingTop: 14,
        fontSize: 16,
        color: '#1a1a1a',
        flex: 1,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    cancelButton: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        flex: 1,
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
