import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import {
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
    // 'profile' | 'contract' | 'referCoach' | 'latestResults' | 'averageResults'

    console.log('profileData', profileData)

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

    console.log('token', token, userId)
    useEffect(() => {
        if (!token || !userId) return;


        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        fetch(`https://api.grabbite.com/api/coachpro/account-profile/${userId}`, {
            method: "GET",
            headers: myHeaders,
        })
            .then((r) => r.json())
            .then((result) => {
                if (result.status && result.data) {
                    setProfileData(result.data);
                }
            })
            .catch((error) => console.error(error));
    }, [token, userId]);

    const handleBack = () => {
        if (view === 'contract') setView('profile');
        else if (view === 'referCoach') setView('profile');
        else if (view === 'latestResults') setView('profile');
        else if (view === 'averageResults') setView('latestResults');
        else onClose();
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
                        onError={(e) => console.log("Image Error:", e.nativeEvent)}

                       style={[styles.profileImage, { borderRadius: 35 }]}
                    />
                </View>
                <TouchableOpacity style={styles.editIconBadge}>
                    <Ionicons name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={profileData?.firstName || ""}
                        placeholder="First Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={profileData?.lastName || ""}
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputTextWithIcon}
                        value={profileData?.email || ""}
                        placeholder="Email"
                        placeholderTextColor="#999"
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
                        value={profileData?.phoneNumber || ""}
                        placeholder="Phone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* City & Postal Code */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={profileData?.city || ""}
                        placeholder="City"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={profileData?.postalCode || ""}
                        placeholder="Postal Code"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                    />
                </View>

                {/* Referral Code (read-only) */}
                {profileData?.referralCode ? (
                    <View style={[styles.inputContainer, { backgroundColor: '#f0f4ff' }]}>
                        <Ionicons name="gift-outline" size={18} color="#3b5fdf" style={{ marginRight: 8 }} />
                        <Text style={[styles.input, { color: '#3b5fdf' }]}>
                            Referral Code: {profileData.referralCode}
                        </Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={styles.contractActionCard}
                    onPress={() => setView('contract')}
                >
                    <Text style={styles.contractActionText}>See your contract</Text>
                    <View style={styles.contractGraphicPlaceholder}>
                        <Image source={require('@/assets/images/contract.png')} />
                    </View>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
                        <Text style={styles.actionButtonTextBlack}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.saveButton]}>
                        <Text style={styles.actionButtonTextBlack}>Save</Text>
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

        return (
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.contractHeaderRow}>
                    <Text style={styles.pageTitleHeader}>Sign your contract</Text>
                    <View style={[styles.completeBadge, { backgroundColor: isSigned ? '#02b45a' : '#f59e0b' }]}>
                        <Text style={styles.completeBadgeText}>
                            {isSigned ? 'Signed' : 'Pending'}
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

                    {contract?.contractType ? (
                        <Text style={[styles.contractParagraph, { color: '#3b5fdf', fontFamily: 'Urbanist_700Bold' }]}>
                            Contract Type: {contract.contractType}
                        </Text>
                    ) : null}

                    <Text style={styles.contractParagraph}>
                        This independent contractor agreement is between{' '}
                        <Text style={styles.boldText}>
                            {profileData ? `${profileData.firstName} ${profileData.lastName}` : 'Coach'}
                        </Text>
                        {' '}And SAMBA SOCCER SCHOOLS GLOBAL LTD ("We", "Us", "Our", the "Company")
                    </Text>

                    {contract?.description ? (
                        <>
                            <Text style={styles.contractSectionTitle}>Description</Text>
                            <Text style={styles.contractParagraph}>{contract.description}</Text>
                        </>
                    ) : null}

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

                    {isSigned && contract?.signedAt ? (
                        <Text style={[styles.contractParagraph, { color: '#02b45a', marginTop: 16 }]}>
                            ✓ Signed on {new Date(contract.signedAt).toLocaleDateString()}
                        </Text>
                    ) : null}
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
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Telephone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start', paddingTop: 14 }]}>
                    <TextInput
                        style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                        placeholder="Notes (Optional)"
                        placeholderTextColor="#999"
                        multiline
                    />
                </View>

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButtonBlue]}
                        onPress={handleBack}
                    >
                        <Text style={styles.actionButtonTextBlack}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.saveButtonBlue]}
                        onPress={() => setView('latestResults')}
                    >
                        <Text style={styles.actionButtonTextWhite}>Submit</Text>
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
            strengths: [
                'Great tone and enthusiasm',
                'Good adaptation',
                'Inclusive all students',
            ],
        };

        const averageData = {
            percentage: 42,
            label: 'Improvement needed',
            image: require('../../assets/images/sad.png'),
            color: '#3b5fdf',
            strengths: [
                'Needs more engagement',
                'Work on adaptation',
                'Focus on inclusivity',
            ],
        };

        const data = isLatest ? latestData : averageData;

        const ratings = [
            { label: 'SET-UP', score: '4/5', color: '#3b5fdf' },
            { label: 'SET-UP', score: '4/5', color: '#fdbb2d' },
            { label: 'SET-UP', score: '4/5', color: '#e74c3c' },
        ];

        return (
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.resultHeader}>
                    <Image
                        source={
                            profileData?.profile
                                ? { uri: profileData.profile }
                                : require('../../assets/images/Ellipse.png')
                        }
                        style={[styles.profileImage, { borderRadius: 35 }]}
                    />
                    <Text style={[styles.pageTitle, { fontSize: 32 }]}>
                        Your results are in...
                    </Text>
                </View>

                {/* Tab toggle */}
                <View style={styles.resultTabRow}>
                    <TouchableOpacity
                        style={[styles.resultTab, isLatest && styles.resultTabActive]}
                        onPress={() => setView('latestResults')}
                    >
                        <Text style={[styles.resultTabText, isLatest && styles.resultTabTextActive]}>
                            Latest Results
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.resultTab, !isLatest && styles.resultTabActive]}
                        onPress={() => setView('averageResults')}
                    >
                        <Text style={[styles.resultTabText, !isLatest && styles.resultTabTextActive]}>
                            Average Results
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Meta info row */}
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

                {/* Score card */}
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
                        <Image
                            source={data.image}
                            style={{ width: 80, height: 80, resizeMode: 'contain' }}
                        />
                    </View>
                </ImageBackground>

                {/* Rating pills */}
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

                {/* Tabs: Strengths / Improvements / Voice note */}
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

                {/* Strength items */}
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)',
    },
    screenContainer: {
        width: width,
        height: '100%',
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerBg: {
        width: '100%',
        height: 100,
        justifyContent: 'flex-end',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15,
    },
    backButton: {
        padding: 4,
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flex: 1,
        padding: 24,
    },
    pageTitle: {
        fontSize: 26,
        color: '#1A1A1A',
        marginBottom: 20,
        fontFamily: 'Urbanist_700Bold',
    },
    pageTitleHeader: {
        fontSize: 26,
        color: '#1A1A1A',
        flex: 1,
        fontFamily: 'Urbanist_700Bold',
    },

    // ── Profile ──────────────────────────────────────────────────────────────
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    profileImageWrapper: {
        width: 110,
        height: 110,
        borderRadius: 55,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileLargeImage: {
        width: 120,
        height: 120,
        resizeMode: 'cover',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fdbb2d',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    formContainer: {
        gap: 16,
        paddingBottom: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#9E9FAA',
        paddingHorizontal: 16,
        height: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Urbanist_500Medium',
    },
    inputTextWithIcon: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Urbanist_500Medium',
    },
    inputIconRight: {
        marginLeft: 10,
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
    },
    flagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        paddingRight: 10,
        gap: 4,
    },
    flagText: {
        fontSize: 20,
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Urbanist_500Medium',
    },
    contractActionCard: {
        backgroundColor: '#2643a6',
        borderRadius: 12,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        position: 'relative',
    },
    contractActionText: {
        color: '#fff',
        fontSize: 18,
        zIndex: 2,
        fontFamily: 'Urbanist_700Bold',
    },
    contractGraphicPlaceholder: {
        position: 'absolute',
        right: 70,
        top: 0,
        width: 50,
        height: 90,
        backgroundColor: '#f3f1e9',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        padding: 5,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        transform: [{ translateY: -5 }],
    },
    actionRow: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonBlue: {
        borderWidth: 2,
        borderColor: '#2F5FE5'
    },
    saveButtonBlue: {
        backgroundColor: '#2F5FE5',
    },
    cancelButton: {
        backgroundColor: '#ffe89b',
    },
    saveButton: {
        backgroundColor: '#fdbb2d',
    },
    actionButtonTextBlack: {
        color: '#1a1a1a',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
    },
    actionButtonTextWhite: {
        color: '#fff',
    },

    // ── Contract ─────────────────────────────────────────────────────────────
    contractHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    completeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    completeBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Urbanist_700Bold',
    },
    contractButtonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    contractTopButton: {
        backgroundColor: '#3b5fdf',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    contractTopBtnText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Urbanist_500Medium',
    },
    contractContent: {
        paddingBottom: 50,
    },
    contractMainTitle: {
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 20,
        textTransform: 'uppercase',
        fontFamily: 'Urbanist_700Bold',
    },
    contractSectionTitle: {
        fontSize: 18,
        color: '#1a1a1a',
        marginTop: 20,
        marginBottom: 12,
        fontFamily: 'Urbanist_700Bold',
    },
    contractParagraph: {
        fontSize: 14,
        lineHeight: 24,
        color: '#555',
        marginBottom: 15,
        fontFamily: 'Urbanist_400Regular',
    },
    boldText: {
        color: '#1a1a1a',
        fontFamily: 'Urbanist_700Bold',
    },

    // ── Refer a Coach ────────────────────────────────────────────────────────
    referSubtitle: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 28,
        fontFamily: 'Urbanist_400Regular',
    },

    // ── Results ──────────────────────────────────────────────────────────────
    resultTabRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 4,
        marginBottom: 20,
    },
    resultTab: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    resultTabActive: {
        backgroundColor: '#3b5fdf',
    },
    resultTabText: {
        fontSize: 15,
        color: '#999',
        fontFamily: 'Urbanist_500Medium',
    },
    resultTabTextActive: {
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
    },
    resultMetaRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    resultMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resultMetaText: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Urbanist_500Medium',
    },
    scoreCard: {
        backgroundColor: '#1F222A',
        borderRadius: 20,
        padding: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 20,
    },
    donutWrapper: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    donutTrack: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 8,
        borderColor: '#444',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    donutSegment: {
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 8,
        position: 'absolute',
    },
    donutHole: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10,
    },
    donutPercent: {
        fontSize: 14,
        fontFamily: 'Urbanist_700Bold',
        color: '#fff',
    },
    scoreLabelWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scoreLabelText: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'Urbanist_700Bold',
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    ratingPill: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingScore: {
        fontSize: 40,
        color: '#fff',
        fontFamily: 'LuckiestGuy_400Regular',
    },
    ratingLabel: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'LuckiestGuy_400Regular',
        marginTop: 2,
    },
    insightTabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 16,
    },
    insightTabActive: {
        paddingBottom: 10,
        marginRight: 24,
        borderBottomWidth: 2,
        borderBottomColor: '#3b5fdf',
    },
    insightTab: {
        paddingBottom: 10,
        marginRight: 24,
    },
    insightTabTextActive: {
        fontSize: 16,
        color: '#3b5fdf',
        fontFamily: 'Urbanist_700Bold',
    },
    insightTabText: {
        fontSize: 16,
        color: '#999',
        fontFamily: 'Urbanist_500Medium',
    },
    strengthsList: {
        gap: 10,
    },
    strengthItem: {
        backgroundColor: '#EEF2F5',
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    strengthText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Urbanist_500Medium',
    },
    profileImage: {
        width: 70,
        height: 70,
        resizeMode: 'cover',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginVertical: 20,
        flexWrap: 'wrap',
    },
});