import { useToast } from '@/components/common/Toast';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
    const { token, userId, completeProfile } = useAuth();
    const toast = useToast();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [countryModalVisible, setCountryModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || !userId) return;
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/account-profile/${userId}`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then(r => r.json())
            .then(result => {
                if (result.status && result.data) {
                    const d = result.data;
                    setFirstName(d.firstName || '');
                    setLastName(d.lastName || '');
                    setEmail(d.email || '');
                    // strip country code prefix from phone if present
                    const rawPhone = d.phoneNumber || '';
                    const matched = COUNTRIES.find(c => rawPhone.startsWith(c.code));
                    if (matched) {
                        setSelectedCountry(matched);
                        setPhone(rawPhone.slice(matched.code.length));
                    } else {
                        setPhone(rawPhone);
                    }
                }
            })
            .catch(err => console.error(err));
    }, [token, userId]);

  const saveProfile = async () => {
    console.log('here');

    if (!userId || !token) return false;

    try {
        setLoading(true);

        const formdata = new FormData();

        if (firstName) formdata.append('firstName', firstName);
        if (lastName) formdata.append('lastName', lastName);
        if (email) formdata.append('email', email);
        if (phone) formdata.append('phoneNumber', `${selectedCountry.code}${phone}`);

        const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachPro/account-profile/update/profile/${userId}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formdata,
                redirect: 'follow',
            }
        );

        const result = await response.json();

        console.log('result', result);
        return result.status;
    } catch (err) {
        console.error('FillProfile save error:', err);
        return false;
    } finally {
        setLoading(false);
    }
};

    const handleContinue = async () => {
        if (!firstName || !lastName || !email) {
            toast.warning('Please fill in your first name, last name, and email.', 'Required');
            return;
        }
        const ok = await saveProfile();
        if (!ok) {
            toast.error('Failed to save profile. Please try again.', 'Error');
            return;
        }
        completeProfile();
        router.replace('/onboarding');
    };

    const handleSkip = () => {
        completeProfile();
        router.replace('/onboarding');
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

                        {/* First Name */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor="#8E8E93"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor="#8E8E93"
                                value={lastName}
                                onChangeText={setLastName}
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

                        {/* Phone */}
                        <View style={styles.phoneWrapper}>
                            <TouchableOpacity
                                style={styles.countryPicker}
                                onPress={() => setCountryModalVisible(true)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.flagText}>{selectedCountry.flag}</Text>
                                <Text style={styles.countryCode}>{selectedCountry.code}</Text>
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
                            disabled={loading}
                        >
                            <Text style={styles.skipButtonText}>Skip</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.completeButton, loading && { opacity: 0.7 }]}
                            onPress={handleContinue}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            <Text style={styles.completeButtonText}>
                                {loading ? 'Saving...' : 'Complete'}
                            </Text>
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
    background: { flex: 1, width: '100%', height: '100%' },
    container: { flex: 1, backgroundColor: 'transparent' },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 140,
        paddingBottom: 40,
    },

    header: { alignItems: 'center', marginBottom: 24 },
  title: {
    fontSize: 32, color: '#fff',
    marginBottom: 8, fontFamily: 'Urbanist_700Bold', textAlign: 'center',
},

    subtitle: {
        fontSize: 18, color: 'rgba(255,255,255,0.6)',
        textAlign: 'center', lineHeight: 20, fontFamily: 'Urbanist_400Regular',
    },

    avatarSection: { alignItems: 'center', marginBottom: 28 },
    avatarRing: { width: 140, height: 140, position: 'relative', justifyContent: 'center', alignItems: 'center' },
    avatar: { width: 140, height: 140, borderRadius: 45 },
    editBadge: {
        position: 'absolute', bottom: 6, right: 2, width: 26, height: 26,
        borderRadius: 13, backgroundColor: '#FFC600', justifyContent: 'center',
        alignItems: 'center', borderWidth: 2, borderColor: '#1e1e22',
    },

    form: { gap: 25, marginBottom: 28 },
    inputContainer: {
        backgroundColor: '#fff', borderRadius: 10, height: 52,
        paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    },
    input: { flex: 1, height: '100%', color: '#000', fontSize: 15, fontFamily: 'Urbanist_500Medium' },

    phoneWrapper: {
        backgroundColor: '#fff', borderRadius: 10, height: 52,
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
    },
    countryPicker: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 10 },
    flagText: { fontSize: 20 },
    countryCode: { fontSize: 14, color: '#333', fontFamily: 'Urbanist_500Medium' },
    phoneDivider: { width: 1, height: 24, backgroundColor: '#E0E0E0', marginRight: 10 },
    phoneInput: { flex: 1, height: '100%', color: '#000', fontSize: 15, fontFamily: 'Urbanist_500Medium' },

    buttonRow: { flexDirection: 'row', gap: 12 },
    button: { flex: 1, height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
    skipButton: { backgroundColor: '#4A4A4D' },
    skipButtonText: { color: '#fff', fontSize: 16, fontFamily: 'Urbanist_700Bold' },
    completeButton: { backgroundColor: '#FFC600' },
    completeButtonText: { color: '#000', fontSize: 16, fontFamily: 'Urbanist_700Bold' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1E1E22', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
    modalHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#2C2C32', paddingBottom: 12,
    },
modalTitle: { color: '#fff', fontSize: 17, fontFamily: 'Urbanist_700Bold' },
    modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#2C2C32' },
    modalItemSelected: { borderBottomColor: '#FFC600' },
    countryRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    countryName: { color: '#fff', fontSize: 15, fontFamily: 'Urbanist_500Medium' },
});