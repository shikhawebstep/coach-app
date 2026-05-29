import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const COUNTRIES = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
];

export default function FillProfile() {
    const router = useRouter();
    const { completeProfile } = useAuth();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [countryModalVisible, setCountryModalVisible] = useState(false);

    const handleContinue = () => {
        completeProfile();
        router.replace('/first-time-onboarding');
    };

    const handleSkip = () => {
        completeProfile();
        router.replace('/first-time-onboarding');
    };

    return (
        <ImageBackground
            source={require('@/assets/images/Login.png')}
            resizeMode="cover"
            style={styles.background}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Fill Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Don't worry, you can always change it later, or{'\n'}you can skip it for now.
                        </Text>
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarRing}>
                            <Image
                                source={require('@/assets/images/Ellipse.png')}
                                style={styles.avatar}
                                resizeMode="cover"
                            />
                            <View style={styles.editBadge}>
                                <Ionicons name="pencil" size={14} color="#000" />
                            </View>
                        </View>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>

                        {/* Full Name */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#8E8E93"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Username */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#8E8E93"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#8E8E93"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Ionicons name="mail-outline" size={20} color="#8E8E93" />
                        </View>

                        {/* Phone — single white container */}
                        <View style={styles.phoneWrapper}>
                            <TouchableOpacity
                                style={styles.countryPicker}
                                onPress={() => setCountryModalVisible(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                                <Ionicons name="chevron-down" size={14} color="#8E8E93" />
                            </TouchableOpacity>

                            <View style={styles.phoneDivider} />

                            <TextInput
                                style={styles.phoneInput}
                                placeholder="Phone Number"
                                placeholderTextColor="#8E8E93"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>

                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.skipButton]}
                            onPress={handleSkip}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.completeButton]}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.completeButtonText}>Complete</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Country Picker Modal */}
            <Modal
                visible={countryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCountryModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country Code</Text>
                            <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        selectedCountry.code === item.code && styles.modalItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedCountry(item);
                                        setCountryModalVisible(false);
                                    }}
                                >
                                    <View style={styles.countryRow}>
                                        <Text style={styles.flagText}>{item.flag}</Text>
                                        <Text style={styles.countryName}>
                                            {item.name} ({item.code})
                                        </Text>
                                    </View>
                                    {selectedCountry.code === item.code && (
                                        <Ionicons name="checkmark" size={20} color="#FFC600" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 140,
        paddingBottom: 40,
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        fontFamily: 'Urbanist_700Bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 20,
        fontFamily: 'Urbanist_400Regular',
    },

    // Avatar
    avatarSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    avatarRing: {
        width: 140,
        height: 140,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 140,
        height: 140,
        borderRadius: 45,
    },
    editBadge: {
        position: 'absolute',
        bottom: 6,
        right: 2,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FFC600',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#1e1e22',
    },

    // Form
    form: {
        gap: 25,
        marginBottom: 28,
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 52,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#000',
        fontSize: 15,
        fontFamily: 'Urbanist_500Medium',
    },

    // Phone row — single white box
    phoneWrapper: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingRight: 10,
    },
    flagText: {
        fontSize: 20,
    },
    phoneDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0',
        marginRight: 10,
    },
    phoneInput: {
        flex: 1,
        height: '100%',
        color: '#000',
        fontSize: 15,
        fontFamily: 'Urbanist_500Medium',
    },

    // Buttons
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skipButton: {
        backgroundColor: '#4A4A4D',
    },
    skipButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Urbanist_700Bold',
    },
    completeButton: {
        backgroundColor: '#FFC600',
    },
    completeButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Urbanist_700Bold',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1E1E22',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C32',
        paddingBottom: 12,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        fontFamily: 'Urbanist_700Bold',
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C32',
    },
    modalItemSelected: {
        borderBottomColor: '#FFC600',
    },
    countryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    countryName: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Urbanist_500Medium',
    },
});