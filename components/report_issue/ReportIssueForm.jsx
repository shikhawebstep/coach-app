import CustomLoader from '@/components/common/CustomLoader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/common/Toast';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
const CATEGORIES = ['Equipment', 'Incident', 'Complaint', 'Coaches', 'Venue', 'Other'];

const COLORS = {
    light: {
        background: '#fff',
        icon: '#000',
        headerTitle: '#1a1a1a',
        searchBg: '#F6F6F7',
        searchBorder: '#9E9FAA',
        searchText: '#000',
        searchPlaceholder: '#797A88',
        dropdownBg: '#fff',
        dropdownBorder: '#9E9FAA',
        dropdownItemBorder: '#F3F4F6',
        dropdownItemText: '#1f2937',
        dropdownItemSub: '#6b7280',
        checkboxBorderInactive: '#A1A1AA',
        checkboxText: '#5F5F6D',
        label: '#797A88',
        textAreaBg: '#F6F6F7',
        textAreaBorder: '#9E9FAA',
        textAreaText: '#1a1a1a',
        submitButtonDisabled: '#93C5FD',
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    dark: {
        background: '#121212',
        icon: '#F5F5F5',
        headerTitle: '#F5F5F5',
        searchBg: '#1E1E1E',
        searchBorder: '#3A3A3A',
        searchText: '#F5F5F5',
        searchPlaceholder: '#9CA3AF',
        dropdownBg: '#1E1E1E',
        dropdownBorder: '#3A3A3A',
        dropdownItemBorder: '#2A2A2A',
        dropdownItemText: '#F5F5F5',
        dropdownItemSub: '#9CA3AF',
        checkboxBorderInactive: '#5A5A5A',
        checkboxText: '#D1D5DB',
        label: '#9CA3AF',
        textAreaBg: '#1E1E1E',
        textAreaBorder: '#3A3A3A',
        textAreaText: '#F5F5F5',
        submitButtonDisabled: '#1E3A5F',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
};

export default function ReportIssueForm({ onBack }) {
    const { token } = useAuth();
    const toast = useToast();
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

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
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/venues`,
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
            toast.error('Please select a venue.');
            return;
        }
        if (!selectedCategory) {
            toast.error('Please select a category.');
            return;
        }
      
        if (!title.trim()) {
            toast.error('Please enter a title.');
            return;
        }
        if (!reportText.trim()) {
            toast.error('Please enter the issue details.');
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/report-issue/create`,
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
                toast.success('Issue reported successfully!');
                onBack();
            } else {
                toast.error(result.message || 'Failed to submit report.');
            }
        } catch (error) {
            console.error('Submit report error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.icon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New report</Text>
        </View>

        {/* Search Bar only — dropdown moved out */}
        <View style={[styles.content, { position: 'relative' }]}>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={theme.searchPlaceholder} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Select a venue..."
                    placeholderTextColor={theme.searchPlaceholder}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    onFocus={() => setIsDropdownVisible(true)}
                />
                {loadingVenues && <CustomLoader size={20} color="#3B82F6" />}
            </View>
        </View>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
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
                            borderColor: selectedCategory === category ? "#3B82F6" : theme.checkboxBorderInactive,
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
            <Text style={styles.label}>Title</Text>
            <View style={styles.titleInputContainer}>
                <TextInput
                    style={styles.titleInput}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter issue title"
                    placeholderTextColor={theme.searchPlaceholder}
                />
            </View>

            {/* Report Issue Textarea */}
            <Text style={styles.label}>Report issue</Text>
            <View style={styles.textAreaContainer}>
                <TextInput
                    style={styles.textArea}
                    multiline={true}
                    scrollEnabled={false}
                    value={reportText}
                    onChangeText={setReportText}
                    textAlignVertical="top"
                    placeholderTextColor={theme.searchPlaceholder}
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
            >
                {submitting ? (
                    <CustomLoader size={20} color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                )}
            </TouchableOpacity>
            <View style={{ height: 40 }} />
        </ScrollView>

        {/* Dropdown rendered LAST so it stacks above ScrollView on both platforms */}
        {isDropdownVisible && filteredVenues.length > 0 && (
            <View style={[styles.dropdown, { top: 100, left: 16, right: 16 }]}>
                <FlatList
                    data={filteredVenues}
                    keyExtractor={(item) => item.id.toString()}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    style={{ maxHeight: 200 }}
                    renderItem={({ item: venue }) => (
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => handleSelectVenue(venue)}
                        >
                            <Text style={styles.dropdownItemText}>{venue.name}</Text>
                            <Text style={styles.dropdownItemSub}>{venue.area}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )}
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
        fontSize: 26,
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
    },
    content: {
        paddingHorizontal: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.searchBg,
        borderWidth: 1,
        borderColor: theme.searchBorder,
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
        color: theme.searchText,
    },
   dropdown: {
    position: 'absolute',
    // top/left/right now passed inline above since it's outside `content` padding
    backgroundColor: theme.dropdownBg,
    borderWidth: 1,
    borderColor: theme.dropdownBorder,
    borderRadius: 10,
    maxHeight: 200,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 4,
    elevation: 10,   // 👈 was missing — Android needs this for correct stacking, not just zIndex
    zIndex: 50,
},
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.dropdownItemBorder,
    },
    dropdownItemText: {
        fontSize: 16,
        fontFamily: 'Urbanist_500Medium',
        color: theme.dropdownItemText,
    },
    dropdownItemSub: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.dropdownItemSub,
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
        color: theme.checkboxText,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: theme.label,
        marginBottom: 8,
    },
    titleInputContainer: {
        borderWidth: 1,
        borderColor: theme.textAreaBorder,
        borderRadius: 12,
        backgroundColor: theme.textAreaBg,
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    titleInput: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textAreaText,
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: theme.textAreaBorder,
        borderRadius: 12,
        backgroundColor: theme.textAreaBg,
        marginBottom: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 180,
    },
    textArea: {
        fontSize: 16,
        fontFamily: 'Urbanist_400Regular',
        color: theme.textAreaText,
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
        backgroundColor: theme.submitButtonDisabled,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
    },
});