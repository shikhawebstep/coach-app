import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = ['Equipment', 'Incident', 'Complaint', 'Coaches', 'Venue', 'Other'];

export default function ReportIssueForm({ onBack }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [reportText, setReportText] = useState('');

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

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
                <Text style={styles.headerTitle}>New report</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#a0a0a0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Select a venue..."
                        placeholderTextColor="#a0a0a0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filtersContainer}>
                    {CATEGORIES.map(category => (
                        <TouchableOpacity
                            key={category}
                            style={styles.checkboxItem}
                            onPress={() => toggleCategory(category)}
                        >
                            <Ionicons
                                name={selectedCategories.includes(category) ? "checkbox" : "square-outline"}
                                size={24}
                                color={selectedCategories.includes(category) ? "#3B82F6" : "#A1A1AA"}
                            />
                            <Text style={styles.checkboxText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Report Issue Textarea */}
                <Text style={styles.label}>Report issue</Text>
                <View style={styles.textAreaContainer}>
                    <TextInput
                        style={styles.textArea}
                        multiline={true}
                        value={reportText}
                        onChangeText={setReportText}
                        textAlignVertical="top"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <View style={{ height: 40 }} />
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
    content: {
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB', // Gray border matching the screenshot
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%', // 3 columns
        marginBottom: 16,
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4B5563',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280', // Dark gray
        marginBottom: 8,
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 24,
        height: 180,
    },
    textArea: {
        paddingHorizontal: 16,
        paddingTop: 14,
        fontSize: 16,
        color: '#1a1a1a',
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#2563EB', // Solid darker Blue
        paddingVertical: 16,
        borderRadius: 30, // Fully rounded like the screenshot
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
