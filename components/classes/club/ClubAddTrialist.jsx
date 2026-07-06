import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        inputBorder: '#9CA3AF',
        inputBg: '#F6F6F7',
        inputText: '#1a1a1a',
        placeholder: '#a0a0a0',
        cancelButtonBg: '#fff',
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        inputBorder: '#3A3A3A',
        inputBg: '#1E1E1E',
        inputText: '#F5F5F5',
        placeholder: '#9CA3AF',
        cancelButtonBg: '#121212',
    },
};

export default function ClubAddTrialist({ onBack }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

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
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add a walk by trialist</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Inputs */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Student Full Name"
                        placeholderTextColor={theme.placeholder}
                        value={studentName}
                        onChangeText={setStudentName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Parent Full Name"
                        placeholderTextColor={theme.placeholder}
                        value={parentName}
                        onChangeText={setParentName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        placeholderTextColor={theme.placeholder}
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
                        placeholderTextColor={theme.placeholder}
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

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
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
        color: theme.headerTitle,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: theme.inputBorder,
        borderRadius: 8,
        backgroundColor: theme.inputBg,
        marginBottom: 16,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: theme.inputText,
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: theme.inputBorder,
        borderRadius: 8,
        backgroundColor: theme.inputBg,
        marginBottom: 24,
        height: 150,
    },
    textArea: {
        paddingHorizontal: 16,
        paddingTop: 14,
        fontSize: 16,
        color: theme.inputText,
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
        backgroundColor: theme.cancelButtonBg,
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