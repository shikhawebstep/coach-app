import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Notes({ onBack, onClassClick }) {
    const [note, setNote] = useState('John Smith is not on the system');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.darkHeader}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>Notes</Text>
                    <TouchableOpacity style={styles.doneButton} onPress={onBack}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <TextInput
                        style={styles.textArea}
                        multiline={true}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Type to view notes..."
                        textAlignVertical="top"
                        autoFocus={true}
                    />

                    {/* Go to Class Data */}
                    <TouchableOpacity style={styles.classDataBtn} onPress={onClassClick}>
                        <Text style={styles.classDataText}>View Class Data</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#4B4B4B', // Matches the dark top area
    },
    darkHeader: {
        backgroundColor: '#4B4B4B',
        height: 56,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    titleBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    doneButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
    },
    doneText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    textArea: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    classDataBtn: {
        backgroundColor: '#1CAB4B', // Green to differentiate
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    classDataText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 8,
    },
});
