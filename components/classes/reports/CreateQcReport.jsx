import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateQcReport({ onBack }) {
    const [coach, setCoach] = useState('');
    const [venue, setVenue] = useState('');
    const [classSelected, setClassSelected] = useState('');

    const isFormFilled = coach && venue && classSelected;

    return (
        <View style={styles.container}>
            {/* Header placeholder - usually handled by navigator, but building structural view */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Create a QC Report</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Select Coach Dropdown */}
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setCoach('Daniel Marcus')} // Mocking selection for preview
                >
                    <Text style={[styles.dropdownText, !coach && styles.placeholderText]}>
                        {coach || 'Select a coach'}
                    </Text>
                    <View style={styles.iconCircle}>
                        <Ionicons name="chevron-down" size={16} color="#1a1a1a" />
                    </View>
                </TouchableOpacity>

                {/* Select Venue Dropdown */}
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setVenue('Chelsea')}
                >
                    <Text style={[styles.dropdownText, !venue && styles.placeholderText]}>
                        {venue || 'Select a venue'}
                    </Text>
                    <View style={styles.iconCircle}>
                        <Ionicons name="chevron-down" size={16} color="#1a1a1a" />
                    </View>
                </TouchableOpacity>

                {/* Select Class Dropdown */}
                <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setClassSelected('Class 1')}
                >
                    <Text style={[styles.dropdownText, !classSelected && styles.placeholderText]}>
                        {classSelected || 'Select a class'}
                    </Text>
                    <View style={styles.iconCircle}>
                        <Ionicons name="chevron-down" size={16} color="#1a1a1a" />
                    </View>
                </TouchableOpacity>

            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={[styles.startButton, isFormFilled ? styles.startButtonActive : styles.startButtonInactive]}
                    disabled={!isFormFilled}
                >
                    <Text style={styles.startButtonText}>Start report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#6B7280', // Darker gray boundary
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 18,
        marginBottom: 20,
    },
    dropdownText: {
        fontSize: 16,
        color: '#1a1a1a',
        fontWeight: '500',
    },
    placeholderText: {
        color: '#6B7280',
        fontWeight: 'normal',
    },
    iconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        paddingBottom: 40,
        backgroundColor: '#fff', // Solid area
    },
    startButton: {
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    startButtonActive: {
        backgroundColor: '#3B82F6', // Blue enabled
    },
    startButtonInactive: {
        backgroundColor: '#93C5FD', // Light blue disabled
    },
    startButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
