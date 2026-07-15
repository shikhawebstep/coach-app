import CustomLoader from '@/components/common/CustomLoader';
import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

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

// postcode is passed silently from the venue — not shown as a field
export default function AddTrialist({ onBack, postcode = '' }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);
    const { token } = useAuth();
    const toast = useToast();

    // Single "Student Full Name" field — split on first space for firstName/lastName
    const [fullName, setFullName] = useState('');
    const [parentFullName, setParentFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [childAge, setChildAge] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Validation — use toast.warning to match app pattern
        if (!firstName) {
            toast.warning('Please enter the student\'s full name.', 'Validation');
            return;
        }
        if (!parentFullName.trim()) {
            toast.warning('Please enter the parent full name.', 'Validation');
            return;
        }
        if (!email.trim()) {
            toast.warning('Please enter an email address.', 'Validation');
            return;
        }
        if (!phone.trim()) {
            toast.warning('Please enter a phone number.', 'Validation');
            return;
        }
        if (!childAge.trim() || isNaN(Number(childAge))) {
            toast.warning('Please enter a valid child age.', 'Validation');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/classes/weekly-classes/walk-by-trialist`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        parentFullName: parentFullName.trim(),
                        email: email.trim(),
                        phone: phone.trim(),
                        postcode: postcode.trim(),
                        childAge: Number(childAge),
                    }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success('Trialist added successfully!');
                onBack();
            } else {
                const msg = result?.message || result?.error || 'Something went wrong. Please try again.';
                toast.error(msg);
            }
        } catch (err) {
            console.error('AddTrialist API error:', err);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
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
                    <Ionicons name="arrow-back" size={24} color={theme.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add a walk by trialist</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Student Full Name (firstName + lastName split by space) */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Student Full Name"
                        placeholderTextColor={theme.placeholder}
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                {/* Parent Full Name */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Parent Full Name"
                        placeholderTextColor={theme.placeholder}
                        value={parentFullName}
                        onChangeText={setParentFullName}
                    />
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        placeholderTextColor={theme.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Phone */}
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

                {/* Child Age */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Child Age"
                        placeholderTextColor={theme.placeholder}
                        value={childAge}
                        onChangeText={setChildAge}
                        keyboardType="number-pad"
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onBack} disabled={loading}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton} onPress={handleSubmit} disabled={loading}>
                        {loading ? (
                            <CustomLoader size={20} color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>Add student</Text>
                        )}
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
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: theme.inputBorder,
        borderRadius: 12,
        backgroundColor: theme.inputBg,
        marginBottom: 16,
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: theme.inputText,
        fontFamily: 'Urbanist_400Regular',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginTop: 8,
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
        fontFamily: 'Urbanist_700Bold',
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
        fontFamily: 'Urbanist_700Bold',
    },
});
