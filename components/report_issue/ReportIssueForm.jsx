import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = ['Equipment', 'Incident', 'Complaint', 'Coaches', 'Venue', 'Other'];

export default function ReportIssueForm({ onBack }) {
    const { token } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [venues, setVenues] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [title, setTitle] = useState('');
    const [reportText, setReportText] = useState('');
    const [loadingVenues, setLoadingVenues] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            setLoadingVenues(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/classes/weekly-classes/venues`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            const result = await response.json();
            if (response.ok) {
                setVenues(result.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch venues:', error);
        } finally {
            setLoadingVenues(false);
        }
    };

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        setSelectedVenue(null);
        setIsDropdownVisible(true);
    };

    const handleSelectVenue = (venue) => {
        setSelectedVenue(venue);
        setSearchQuery(venue.name);
        setIsDropdownVisible(false);
    };

    const toggleCategory = (category) => {
        if (selectedCategory === category) {
            setSelectedCategory('');
        } else {
            setSelectedCategory(category);
        }
    };

    const filteredVenues = venues.filter((venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!selectedVenue) {
            alert('Please select a venue.');
            return;
        }
        if (!selectedCategory) {
            alert('Please select a category.');
            return;
        }
        if (!title.trim()) {
            alert('Please enter a title.');
            return;
        }
        if (!reportText.trim()) {
            alert('Please enter the issue details.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/coachpro/report-issue/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        venueId: selectedVenue.id,
                        category: selectedCategory,
                        title: title.trim(),
                        reportIssue: reportText.trim()
                    })
                }
            );

            const result = await response.json();
            if (response.ok) {
                alert('Issue reported successfully!');
                onBack();
            } else {
                alert(result.message || 'Failed to submit report.');
            }
        } catch (error) {
            console.error('Submit report error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
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

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                {/* Search Bar & Dropdown */}
                <View style={{ zIndex: 10, position: 'relative' }}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color="#797A88" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Select a venue..."
                            placeholderTextColor="#797A88"
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                            onFocus={() => setIsDropdownVisible(true)}
                        />
                        {loadingVenues && <ActivityIndicator size="small" color="#3B82F6" />}
                    </View>
                    {isDropdownVisible && filteredVenues.length > 0 && (
                        <View style={styles.dropdown}>
                            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
                                {filteredVenues.map(venue => (
                                    <TouchableOpacity
                                        key={venue.id}
                                        style={styles.dropdownItem}
                                        onPress={() => handleSelectVenue(venue)}
                                    >
                                        <Text style={styles.dropdownItemText}>{venue.name}</Text>
                                        <Text style={styles.dropdownItemSub}>{venue.area}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                {/* Filters */}
                <View style={styles.filtersContainer}>
                    {CATEGORIES.map(category => (
                        <TouchableOpacity
                            key={category}
                            style={styles.checkboxItem}
                            onPress={() => toggleCategory(category)}
                        >
                            <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                borderWidth: 2,
                                borderColor: selectedCategory === category ? "#3B82F6" : "#A1A1AA",
                                backgroundColor: selectedCategory === category ? "#3B82F6" : "transparent",
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {selectedCategory === category && (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                )}
                            </View>
                            <Text style={styles.checkboxText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Title Input */}
                {/* <Text style={styles.label}>Title</Text>
                <View style={styles.titleInputContainer}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Enter report title..."
                        placeholderTextColor="#a0a0a0"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View> */}

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
                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit</Text>
                    )}
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
        fontSize: 26,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    content: {
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F7',
        borderWidth: 1,
        borderColor: '#9E9FAA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#000',
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#9E9FAA',
        borderRadius: 10,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 50,
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: 'Urbanist_500Medium',
        color: '#1f2937',
    },
    dropdownItemSub: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: '#6b7280',
        marginTop: 2,
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%',
        marginBottom: 16,
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: '#5F5F6D',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: '#797A88',
        marginBottom: 8,
    },
    titleInputContainer: {
        borderWidth: 1,
        borderColor: '#9E9FAA',
        borderRadius: 12,
        backgroundColor: '#F6F6F7',
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    titleInput: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#1a1a1a',
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: '#9E9FAA',
        borderRadius: 12,
        backgroundColor: '#F6F6F7',
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        height: 180,
    },
    textArea: {
        paddingHorizontal: 16,
        paddingTop: 14,
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: '#1a1a1a',
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#2F5FE5',
        paddingVertical: 22,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#93C5FD',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
    },
});