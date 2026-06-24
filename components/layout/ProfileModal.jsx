import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ImageBackground,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileModal({ visible, onClose }) {
    const { token, userId } = useAuth();
    const [view, setView] = useState('profile');
    const [profileData, setProfileData] = useState(null);

    // ── Edit profile form state ──────────────────────────────────────────────
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [profileSaving, setProfileSaving] = useState(false);

    // ── Refer a coach form state ─────────────────────────────────────────────
    // ── Refer a coach form state ─────────────────────────────────────────────
    const [referName, setReferName] = useState('');       // single field: "Shikha Thakur"
    const [referPhone, setReferPhone] = useState('');
    const [referNotes, setReferNotes] = useState('');
    const [referSaving, setReferSaving] = useState(false);

    // Splits "Shikha Thakur" -> { firstName: "Shikha", lastName: "Thakur" }
    // "Shikha" (no space) -> { firstName: "Shikha", lastName: "" }
    // "Shikha Kumari Thakur" -> { firstName: "Shikha", lastName: "Kumari Thakur" }
    const splitName = (fullName) => {
        const trimmed = fullName.trim().replace(/\s+/g, ' '); // collapse multiple spaces
        const parts = trimmed.split(' ');
        const firstName = parts[0] || '';
        const lastName = parts.slice(1).join(' ') || '';
        return { firstName, lastName };
    };
    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        if (visible) {
            setView('profile');
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    useEffect(() => {
        if (!token || !userId) return;
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        fetch(`https://api.grabbite.com/api/coachpro/account-profile/${userId}`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then(r => r.json())
            .then(result => {
                if (result.status && result.data) {
                    const d = result.data;
                    setProfileData(d);
                    // seed form fields
                    setFirstName(d.firstName || '');
                    setLastName(d.lastName || '');
                    setEmail(d.email || '');
                    setPhoneNumber(d.phoneNumber || '');
                    setCity(d.city || '');
                    setPostalCode(d.postalCode || '');
                }
            })
            .catch(err => console.error(err));
    }, [token, userId]);

    const handleBack = () => {
        if (view === 'contract') setView('profile');
        else if (view === 'referCoach') setView('profile');
        else if (view === 'latestResults') setView('profile');
        else if (view === 'averageResults') setView('latestResults');
        else onClose();
    };

    // ── API: Update Profile ──────────────────────────────────────────────────
    const handleSaveProfile = async () => {
        if (!userId) return;
        try {
            setProfileSaving(true);
            const formdata = new FormData();
            formdata.append('firstName', firstName);
            formdata.append('lastName', lastName);
            formdata.append('email', email);
            formdata.append('phoneNumber', phoneNumber);
            if (city) formdata.append('city', city);
            if (postalCode) formdata.append('postalCode', postalCode);

            const response = await fetch(
                `https://api.grabbite.com/api/coachPro/account-profile/update/profile/${userId}`,
                { method: 'PUT', body: formdata, redirect: 'follow' }
            );
            const result = await response.json();
            if (result.status) {
                setProfileData(prev => ({ ...prev, firstName, lastName, email, phoneNumber, city, postalCode }));
                Alert.alert('Success', 'Profile updated successfully.');
            } else {
                Alert.alert('Error', result.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setProfileSaving(false);
        }
    };

    // ── API: Refer a Coach ───────────────────────────────────────────────────
    const handleReferSubmit = async () => {
        const { firstName: referFirstName, lastName: referLastName } = splitName(referName);

        if (!referFirstName || !referPhone) {
            Alert.alert('Validation', 'Please fill in all required fields.');
            return;
        }
        try {
            setReferSaving(true);
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const response = await fetch('https://api.grabbite.com/api/coachpro/referal/create', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    firstName: referFirstName,
                    lastName: referLastName, // will be "" if user only typed one word
                    phone: referPhone,
                    email: "abc@gmail.com",
                    notes: referNotes,
                }),
                redirect: 'follow',
            });
            const result = await response.json();
            if (result.status) {
                Alert.alert('Success', 'Referral submitted successfully!');
                setReferName('');
                setReferPhone('');
                setReferNotes('');
                setView('latestResults');
            } else {
                Alert.alert('Error', result.message || 'Failed to submit referral.');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Something went wrong.');
        } finally {
            setReferSaving(false);
        }
    };

    // ─── Step 1: Edit Profile ────────────────────────────────────────────────
    const renderProfile = () => (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>Edit your profile</Text>

            <View style={styles.profileImageContainer}>
                <View style={styles.profileImageWrapper}>
                    <Image
                        source={
                            profileData?.profile
                                ? { uri: profileData.profile }
                                : require('../../assets/images/Ellipse.png')
                        }
                        style={[styles.profileImage, { borderRadius: 35 }]}
                    />
                </View>
                <TouchableOpacity style={styles.editIconBadge}>
                    <Image
                        source={require('../../assets/images/pencil.png')
                        }
                        style={[styles.editIconBadgeImage]}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputTextWithIcon}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Ionicons name="mail-outline" size={20} color="#333" style={styles.inputIconRight} />
                </View>

                <View style={styles.phoneInputContainer}>
                    <View style={styles.flagContainer}>
                        <Text style={styles.flagText}>🇺🇸</Text>
                        <Ionicons name="chevron-down" size={16} color="#333" />
                    </View>
                    <TextInput
                        style={styles.phoneInput}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Phone Number"
                        placeholderTextColor="#797A88"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                        placeholder="City"
                        placeholderTextColor="#797A88"
                    />
                </View> */}

                {/* <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={postalCode}
                        onChangeText={setPostalCode}
                        placeholder="Postal Code"
                        placeholderTextColor="#797A88"
                        keyboardType="number-pad"
                    />
                </View> */}

                {/* {profileData?.referralCode ? (
                    <View style={[styles.inputContainer, { backgroundColor: '#f0f4ff' }]}>
                        <Ionicons name="gift-outline" size={18} color="#3b5fdf" style={{ marginRight: 8 }} />
                        <Text style={[styles.input, { color: '#3b5fdf' }]}>
                            Referral Code: {profileData.referralCode}
                        </Text>
                    </View>
                ) : null} */}

                <TouchableOpacity
                    style={styles.contractActionCard}
                    onPress={() => setView('contract')}
                >
                    <Text style={styles.contractActionText}>See your contract</Text>
                    <View style={styles.contractGraphicPlaceholder}>
                        <Image style={{ height: '100%', width: 80 }} source={require('@/assets/images/contract.png')} />
                    </View>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => {
                            // reset fields to original
                            setFirstName(profileData?.firstName || '');
                            setLastName(profileData?.lastName || '');
                            setEmail(profileData?.email || '');
                            setPhoneNumber(profileData?.phoneNumber || '');
                            setCity(profileData?.city || '');
                            setPostalCode(profileData?.postalCode || '');
                        }}
                    >
                        <Text style={styles.actionButtonTextBlack}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton, profileSaving && { opacity: 0.6 }]}
                        onPress={handleSaveProfile}
                        disabled={profileSaving}
                    >
                        <Text style={styles.actionButtonTextBlack}>{profileSaving ? 'Saving...' : 'Save'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );

    // ─── Step 2: Sign Contract ───────────────────────────────────────────────
    const renderContract = () => {
        const contract = profileData?.contract;
        const isSigned = contract?.status === 'signed';
        const pdfUrl = contract?.signedPdfFile || contract?.pdfFile;
        const contractorName = profileData
            ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 'Coach'
            : 'Coach';

        return (
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contractHeaderRow}>
                    <Text style={styles.pageTitleHeader}>Sign your contract</Text>
                    <View style={[styles.completeBadge, { backgroundColor: isSigned ? '#1CAB4B' : '#f59e0b' }]}>
                        <Text style={styles.completeBadgeText}>
                            {isSigned ? 'Complete' : 'Pending'}
                        </Text>
                    </View>
                </View>

                <View style={styles.contractButtonRow}>
                    <TouchableOpacity style={styles.contractTopButton}>
                        <Text style={styles.contractTopBtnText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setView('referCoach')}
                        style={styles.contractTopButton}
                    >
                        <Text style={styles.contractTopBtnText}>Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.contractTopButton}
                        onPress={() => { if (pdfUrl) Linking.openURL(pdfUrl); }}
                    >
                        <Text style={styles.contractTopBtnText}>Download</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contractContent}>
                    <Text style={styles.contractMainTitle}>
                        {contract?.title || 'INDEPENDENT CONTRACTOR AGREEMENT'}
                    </Text>
                    {/* 
                {contract?.contractType ? (
                    <Text style={[styles.contractParagraph, { color: '#3b5fdf', fontFamily: 'Urbanist_700Bold' }]}>
                        Contract Type: {contract.contractType}
                    </Text>
                ) : null} */}

                    <Text style={styles.contractParagraph}>
                        This independent contractor agreement is between{' '}
                        <Text style={styles.boldText}>{contractorName}</Text>
                        {' '}And SAMBA SOCCER SCHOOLS GLOBAL LTD ("We", "Us", "Our", the "Company")
                    </Text>

                    {/* {contract?.description ? (
                    <>
                        <Text style={styles.contractSectionTitle}>Description</Text>
                        <Text style={styles.contractParagraph}>{contract.description}</Text>
                    </>
                ) : null} */}

                    <Text style={styles.contractSectionTitle}>Background</Text>
                    <Text style={styles.contractParagraph}>
                        a. The Company is of the opinion that the Contractor has the necessary qualifications, experience and abilities to provide services to the Company.
                    </Text>
                    <Text style={styles.contractParagraph}>
                        b. The Contractor agrees to provide such services to the Company on the terms and conditions set out in the Agreement.
                    </Text>

                    <Text style={styles.contractSectionTitle}>General</Text>
                    <Text style={styles.contractParagraph}>
                        IN CONSIDERATION OF the matters described above and of the mutual benefits and obligations set forth in this Agreement, the receipt and sufficiency of which consideration is hereby acknowledged, the Company and the Contractor (individually the "Party" and collectively the "Parties" to this Agreement) agree as follows:
                    </Text>

                    <Text style={styles.contractSectionTitle}>General</Text>
                    <Text style={styles.contractParagraph}>
                        a. The particulars of this Agreement are as set out in this Agreement and the Company policies, procedures and rules as may be introduced and/or varied from time to time.
                    </Text>
                    <Text style={styles.contractParagraph}>
                        b. The Company has a duty to safeguard all students, parents and guardians and their personal information. The Contractor agrees to adhere to the Company's policies and understands that failure to do so may lead to all work being withdrawn.
                    </Text>
                    <Text style={styles.contractParagraph}>
                        c. Any amendments or modifications of this Agreement or additional obligation assumed by either Party in connection with this agreement will only be binding if evidenced in writing and signed by both parties.
                    </Text>

                    {/* {isSigned && contract?.signedAt ? (
                    <Text style={[styles.contractParagraph, { color: '#02b45a', marginTop: 16 }]}>
                        ✓ Signed on {new Date(contract.signedAt).toLocaleDateString()}
                    </Text>
                ) : null} */}
                </View>
            </ScrollView>
        );
    };

    // ─── Step 3: Refer a Coach ───────────────────────────────────────────────
    const renderReferCoach = () => (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Refer a coach</Text>
            <Text style={[styles.referSubtitle, { textAlign: 'center', color: '#88909D' }]}>
                Fill out the form below and we'll take care of the rest. If your referee is hired, you'll earn £20 as a thank you and an additional £10 if they continue with us for over 12 weeks.
            </Text>

            <View style={styles.formContainer}>
                <View style={[styles.inputContainer, { borderWidth: 1, borderColor: '#9E9FAA' }]}>
                    <TextInput
                        style={[styles.input, { fontWeight: 'medium' }]}
                        placeholder="Full Name"
                        placeholderTextColor="#797A88"
                        value={referName}
                        onChangeText={setReferName}
                    />
                </View>

                <View style={[styles.inputContainer, { borderWidth: 1, borderColor: '#9E9FAA' }]}>
                    <TextInput
                        style={[styles.input, { fontWeight: 'medium' }]}
                        placeholder="Telephone Number"
                        placeholderTextColor="#797A88"
                        keyboardType="phone-pad"
                        value={referPhone}
                        onChangeText={setReferPhone}
                    />
                </View>

                <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start', paddingTop: 14, borderWidth: 1, borderColor: '#9E9FAA' }]}>
                    <TextInput
                        style={[styles.input, { fontWeight: 'medium', height: 90, textAlignVertical: 'top' }]}
                        placeholder="Notes (Optional)"
                        placeholderTextColor="#797A88"
                        multiline
                        value={referNotes}
                        onChangeText={setReferNotes}
                    />
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButtonBlue]}
                        onPress={handleBack}
                    >
                        <Text style={[styles.actionButtonTextBlack, { color: '#2F5FE5' }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButtonBlue, referSaving && { opacity: 0.6 }]}
                        onPress={handleReferSubmit}
                        disabled={referSaving}
                    >
                        <Text style={styles.actionButtonTextWhite}>{referSaving ? 'Submitting...' : 'Submit'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );

    // ─── Step 4 & 5: Results ─────────────────────────────────────────────────
    const renderResults = () => {
        const isLatest = view === 'latestResults';

        const latestData = {
            percentage: 75,
            label: 'Good Job!',
            image: require('../../assets/images/happy.png'),
            color: '#fdbb2d',
            strengths: ['Great tone and enthusiasm', 'Good adaptation', 'Inclusive all students'],
        };

        const averageData = {
            percentage: 42,
            label: 'Improvement needed',
            image: require('../../assets/images/sad.png'),
            color: '#3b5fdf',
            strengths: ['Needs more engagement', 'Work on adaptation', 'Focus on inclusivity'],
        };

        const data = isLatest ? latestData : averageData;

        const ratings = [
            { label: 'SET-UP', score: '4/5', color: '#3b5fdf' },
            { label: 'SET-UP', score: '4/5', color: '#fdbb2d' },
            { label: 'SET-UP', score: '4/5', color: '#e74c3c' },
        ];

        return (
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.resultHeader,{display:'flex',}]}>
                    <Image
                        source={
                            profileData?.profile
                                ? { uri: profileData.profile }
                                : require('../../assets/images/Ellipse.png')
                        }
                        style={[styles.profileImage, { borderRadius: 35 }]}
                    />
                    <Text style={[styles.pageTitle, { fontSize: 30 }]}>
                        Your results are in...
                    </Text>
                </View>

                <View style={styles.resultTabRow}>
                    <TouchableOpacity
                        style={[styles.resultTab, isLatest && styles.resultTabActive]}
                        onPress={() => setView('latestResults')}
                    >
                        <Text style={[styles.resultTabText, isLatest && styles.resultTabTextActive]}>Latest Results</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.resultTab, !isLatest && styles.resultTabActive]}
                        onPress={() => setView('averageResults')}
                    >
                        <Text style={[styles.resultTabText, !isLatest && styles.resultTabTextActive]}>Average Results</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.resultMetaRow}>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="calendar-outline" size={14} color="#000" />
                        <Text style={styles.resultMetaText}>18/01/23</Text>
                    </View>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="location-outline" size={14} color="#000" />
                        <Text style={styles.resultMetaText}>Kings Cross</Text>
                    </View>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="time-outline" size={14} color="#000" />
                        <Text style={styles.resultMetaText}>9:30</Text>
                    </View>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="person-outline" size={14} color="#000" />
                        <Text style={styles.resultMetaText}>Ellis Marsh</Text>
                    </View>
                </View>

                <ImageBackground
                    source={require('@/assets/images/ThemeDark.png')}
                    style={styles.scoreCard}
                    imageStyle={{ borderRadius: 16, opacity: 0.5 }}
                >
                    <View style={styles.donutWrapper}>
                        <View style={styles.donutTrack}>
                            <View style={[styles.donutSegment, {
                                borderTopColor: data.color,
                                borderRightColor: data.color,
                                borderBottomColor: data.percentage > 50 ? data.color : 'transparent',
                                borderLeftColor: 'transparent',
                                transform: [{ rotate: '-45deg' }]
                            }]} />
                        </View>
                        <View style={styles.donutHole}>
                            <Text style={styles.donutPercent}>{data.percentage}%</Text>
                        </View>
                    </View>
                    <View style={styles.scoreLabelWrapper}>
                        <Text style={styles.scoreLabelText}>{data.label}</Text>
                        <Image source={data.image} style={{ width: 80, height: 80, resizeMode: 'contain' }} />
                    </View>
                </ImageBackground>

                <View style={styles.ratingRow}>
                    {ratings.map((r, i) => (
                        <ImageBackground
                            key={i}
                            source={require('@/assets/images/ThemeDark.png')}
                            style={[styles.ratingPill, { backgroundColor: r.color }]}
                            imageStyle={{ borderRadius: 12, opacity: 0.4 }}
                        >
                            <Text style={styles.ratingScore}>{r.score}</Text>
                            <Text style={styles.ratingLabel}>{r.label}</Text>
                        </ImageBackground>
                    ))}
                </View>

                <View style={styles.insightTabRow}>
                    <TouchableOpacity style={styles.insightTabActive}>
                        <Text style={styles.insightTabTextActive}>Strengths</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.insightTab}>
                        <Text style={styles.insightTabText}>Improvements</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.insightTab}>
                        <Text style={styles.insightTabText}>Voice note</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.strengthsList}>
                    {data.strengths.map((s, i) => (
                        <View key={i} style={styles.strengthItem}>
                            <Text style={styles.strengthText}>{s}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        );
    };

    const renderContent = () => {
        switch (view) {
            case 'contract': return renderContract();
            case 'referCoach': return renderReferCoach();
            case 'latestResults':
            case 'averageResults': return renderResults();
            default: return renderProfile();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Animated.View
                    style={[
                        styles.screenContainer,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    <ImageBackground
                        source={require('@/assets/images/Login.png')}
                        style={styles.headerBg}
                        resizeMode="cover"
                    >
                        <View style={styles.headerTop}>
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    <View style={styles.bodyContainer}>
                        {renderContent()}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0)' },
    screenContainer: {
        width: width, height: '100%', backgroundColor: '#fff',
        position: 'absolute', left: 0, top: 0, bottom: 0,
        elevation: 10, shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5,
    },
    headerBg: { width: '100%', height: 100, justifyContent: 'flex-end' },
    headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 15 },
    backButton: { padding: 4 },
    bodyContainer: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { flex: 1, padding: 20 },
    pageTitle: { fontSize: 26, color: '#1A1A1A', marginBottom: 20, fontWeight: 'bold' },
    pageTitleHeader: { fontSize: 26, color: '#1A1A1A', flex: 1, fontWeight: 'bold', fontFamily: 'Urbanist_700Bold' },

    profileImageContainer: { alignSelf: 'center', marginBottom: 30, position: 'relative' },
    profileImageWrapper: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    editIconBadge: {
        position: 'absolute', bottom: 0, right: 0, width: 32, height: 32,
        borderRadius: 16, justifyContent: 'center',
        alignItems: 'center', borderWidth: 2, borderColor: '#fff',
    },
    editIconBadgeImage: {
        height: 30,
        width: 30,
    },

    formContainer: { gap: 16, paddingBottom: 50 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
        borderRadius: 12, borderColor: '#9E9FAA', paddingHorizontal: 16, height: 56,
    },
    input: { flex: 1, fontSize: 16, color: '#333', fontWeight: 'bold' },
    inputTextWithIcon: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#333', fontFamily: 'Urbanist_500Medium' },
    inputIconRight: { marginLeft: 10 },
    phoneInputContainer: {
        flexDirection: 'row', fontWeight: 'bold', alignItems: 'center', backgroundColor: '#f5f5f5',
        borderRadius: 12, height: 56, paddingHorizontal: 16,
    },
    flagContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10, borderRightWidth: 1, borderRightColor: '#ddd', paddingRight: 10, gap: 4 },
    flagText: { fontSize: 20 },
    phoneInput: { flex: 1, fontWeight: 'bold', fontSize: 16, color: '#333', fontFamily: 'Urbanist_500Medium' },
    contractActionCard: {
        backgroundColor: '#2643a6', borderRadius: 12, height: 80,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, marginTop: 10, marginBottom: 10, position: 'relative',
    },
    contractActionText: { color: '#fff', fontSize: 20, zIndex: 2, fontFamily: 'Urbanist_700Bold' },
    contractGraphicPlaceholder: {
        position: 'absolute', right: 70, top: -20, width: 40, height: 120,
        borderTopLeftRadius: 6, borderTopRightRadius: 6,
        padding: 5, justifyContent: 'center', shadowColor: '#000',
    },
    actionRow: { flexDirection: 'row', gap: 16, marginTop: 10 },
    actionButton: { flex: 1, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    cancelButtonBlue: { borderWidth: 2, borderColor: '#2F5FE5' },
    saveButtonBlue: { backgroundColor: '#2F5FE5' },
    cancelButton: { backgroundColor: '#ffe89b' },
    saveButton: { backgroundColor: '#fdbb2d' },
    actionButtonTextBlack: { color: '#1a1a1a', fontSize: 16, fontFamily: 'Urbanist_700Bold' },
    actionButtonTextWhite: { color: '#fff', fontWeight: 'bold' },

    contractHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    completeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    completeBadgeText: { color: '#fff', fontSize: 12, fontFamily: 'Urbanist_700Bold' },
    contractButtonRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
    contractTopButton: { backgroundColor: '#2F5FE5', paddingVertical: 8, paddingHorizontal: 25, borderRadius: 20 },
    contractTopBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Urbanist_500Medium' },
    contractContent: { paddingBottom: 50 },
    contractMainTitle: { fontSize: 16, color: '#1a1a1a', marginBottom: 20, textTransform: 'uppercase', fontFamily: 'Urbanist_700Bold' },
    contractSectionTitle: { fontSize: 18, color: '#1a1a1a', marginTop: 20, marginBottom: 12, fontFamily: 'Urbanist_700Bold' },
    contractParagraph: { fontSize: 14, lineHeight: 24, color: '#555', marginBottom: 15, fontFamily: 'Urbanist_400Regular' },
    boldText: { color: '#1a1a1a', fontFamily: 'Urbanist_700Bold' },

    referSubtitle: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 28, fontFamily: 'Urbanist_400Regular' },

    resultTabRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 10, padding: 4, marginBottom: 20 },
    resultTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    resultTabActive: { backgroundColor: '#3b5fdf' },
    resultTabText: { fontSize: 15, color: '#797A88', fontFamily: 'Urbanist_500Medium' },
    resultTabTextActive: { color: '#fff', fontFamily: 'Urbanist_700Bold' },
    resultMetaRow: { flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' ,justifyContent:'space-between',borderBottomColor:'#EEEEEE',borderBottomWidth:1,paddingBottom:20},
    resultMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    resultMetaText: { fontSize: 14, color: '#000', fontFamily: 'Urbanist_500Medium' },
    scoreCard: { backgroundColor: '#1F222A', borderRadius: 20, padding: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 20 },
    donutWrapper: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    donutTrack: { width: 76, height: 76, borderRadius: 38, borderWidth: 8, borderColor: '#444', position: 'absolute', justifyContent: 'center', alignItems: 'center' },
    donutSegment: { width: 76, height: 76, borderRadius: 38, borderWidth: 8, position: 'absolute' },
    donutHole: { width: 58, height: 58, borderRadius: 29, justifyContent: 'center', alignItems: 'center', position: 'absolute', zIndex: 10 },
    donutPercent: { fontSize: 14, fontFamily: 'Urbanist_700Bold', color: '#fff' },
    scoreLabelWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    scoreLabelText: { fontSize: 20, color: '#fff', fontFamily: 'Urbanist_700Bold', flex: 1 },
    ratingRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    ratingPill: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    ratingScore: { fontSize: 40, color: '#fff', fontFamily: 'LuckiestGuy_400Regular' },
    ratingLabel: { fontSize: 18, color: '#fff', fontFamily: 'LuckiestGuy_400Regular', marginTop: 2 },
    insightTabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 16 },
    insightTabActive: { paddingBottom: 10, marginRight: 24, borderBottomWidth: 2, borderBottomColor: '#3b5fdf' },
    insightTab: { paddingBottom: 10, marginRight: 24 },
    insightTabTextActive: { fontSize: 16, color: '#3b5fdf', fontFamily: 'Urbanist_700Bold' },
    insightTabText: { fontSize: 16, color: '#999', fontFamily: 'Urbanist_500Medium' },
    strengthsList: { gap: 10 },
    strengthItem: { backgroundColor: '#EEF2F5', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16 },
    strengthText: { fontSize: 16, color: '#333', fontFamily: 'Urbanist_500Medium' },
    profileImage: { width: 110, height: 110, resizeMode: 'cover' },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 15, },
});  