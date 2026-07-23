import CustomLoader from '@/components/common/CustomLoader';
import { ToastProvider, useToast } from '@/components/common/Toast';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';

import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    ImageBackground,
    Linking,
    Modal,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { WebView } from 'react-native-webview';

let localToast = null;

function ToastRegister() {
    const toast = useToast();
    useEffect(() => {
        localToast = toast;
        return () => {
            localToast = null;
        };
    }, [toast]);
    return null;
}

const toast = {
    success: (msg, title) => localToast?.success(msg, title),
    error: (msg, title) => localToast?.error(msg, title),
    warning: (msg, title) => localToast?.warning(msg, title),
    info: (msg, title) => localToast?.info(msg, title),
};

const { width } = Dimensions.get('window');
const PAD_W = width - 80;
const PAD_H = 120;
const PDF_PREVIEW_HEIGHT = 380;

// ─── Signature Drawing Pad ─────────────────────────────────────────────────
function SignaturePad({ onHasSignature, disabled, viewShotRef, borderColor }) {
    const [paths, setPaths] = useState([]);
    const currentPath = useRef([]);
    const padRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });
    const disabledRef = useRef(disabled);
    const cbRef = useRef(onHasSignature);
    disabledRef.current = disabled;
    cbRef.current = onHasSignature;

    const measure = () => padRef.current?.measure((_fx, _fy, _w, _h, px, py) => {
        offsetRef.current = { x: px, y: py };
    });
    const pt = (pageX, pageY) => ({
        x: (pageX - offsetRef.current.x).toFixed(1),
        y: (pageY - offsetRef.current.y).toFixed(1),
    });
    const pan = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderGrant: ({ nativeEvent: { pageX, pageY } }) => {
            const { x, y } = pt(pageX, pageY);
            currentPath.current = [`M${x},${y}`];
        },
        onPanResponderMove: ({ nativeEvent: { pageX, pageY } }) => {
            const { x, y } = pt(pageX, pageY);
            currentPath.current.push(`L${x},${y}`);
            setPaths(prev => {
                const copy = [...prev];
                if (copy._temp && copy.length > 0) copy[copy.length - 1] = currentPath.current.join(' ');
                else copy.push(currentPath.current.join(' '));
                copy._temp = true;
                return copy;
            });
        },
        onPanResponderRelease: () => {
            const d = currentPath.current.join(' ');
            if (d) {
                setPaths(prev => { const done = [...prev]; done._temp = false; return done; });
                cbRef.current?.(true);
            }
            currentPath.current = [];
        },
    })).current;

    const clear = () => { setPaths([]); currentPath.current = []; onHasSignature?.(false); };

    return (
        <View style={{ marginTop: 4 }}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9, result: 'base64' }}>
                <View
                    ref={padRef}
                    onLayout={measure}
                    style={{ width: PAD_W, height: PAD_H, borderBottomWidth: 1.5, borderBottomColor: borderColor, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}
                    {...pan.panHandlers}
                >
                    {paths.length === 0 && <Text style={{ fontSize: 14, fontStyle: 'italic', color: '#aaa', position: 'absolute', fontFamily: 'Urbanist_400Regular' }}>Sign here…</Text>}
                    <Svg width={PAD_W} height={PAD_H} style={StyleSheet.absoluteFill}>
                        {paths.map((d, i) => <Path key={i} d={d} stroke="#1A2FA8" strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
                    </Svg>
                </View>
            </ViewShot>
            {paths.length > 0 && (
                <TouchableOpacity onPress={clear} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: '#FEE2E2', gap: 4 }}>
                    <Ionicons name="refresh-outline" size={13} color="#EF4444" />
                    <Text style={{ color: '#EF4444', fontSize: 12, fontFamily: 'Urbanist_600SemiBold' }}>Clear signature</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// ─── PDF Preview via WebView ───────────────────────────────────────────────
function PdfPreview({ pdfUrl, isDark }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    if (!pdfUrl) return (
        <View style={{ height: PDF_PREVIEW_HEIGHT / 1.5, borderWidth: 1, borderColor: isDark ? '#2A2A2A' : '#eee', borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Ionicons name="document-outline" size={28} color={isDark ? '#555' : '#bbb'} />
            <Text style={{ color: isDark ? '#777' : '#aaa', fontFamily: 'Urbanist_500Medium', fontSize: 13 }}>No contract PDF available yet.</Text>
        </View>
    );
    const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    return (
        <View style={{ borderWidth: 1, borderColor: isDark ? '#2A2A2A' : '#eee', borderRadius: 12, overflow: 'hidden', marginBottom: 4 }}>
            {error ? (
                <View style={{ height: PDF_PREVIEW_HEIGHT / 1.5, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 }}>
                    <Ionicons name="alert-circle-outline" size={26} color="#EF4444" />
                    <Text style={{ color: isDark ? '#9CA3AF' : '#888', fontFamily: 'Urbanist_500Medium', fontSize: 13, textAlign: 'center' }}>Couldn't preview the PDF. Try opening it directly.</Text>
                    <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(pdfUrl)} style={{ backgroundColor: '#2F5FE5', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 }}>
                        <Text style={{ color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 13 }}>Open PDF</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <WebView source={{ uri: viewerUrl }} style={{ height: PDF_PREVIEW_HEIGHT, backgroundColor: 'transparent' }} onLoadEnd={() => setLoading(false)} onError={() => { setLoading(false); setError(true); }} scalesPageToFit />
                    {loading && (
                        <View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.6)' }}>
                            <ActivityIndicator size="small" color="#2F5FE5" />
                            <Text style={{ color: isDark ? '#9CA3AF' : '#888', fontFamily: 'Urbanist_500Medium', marginTop: 8, fontSize: 13 }}>Loading contract preview…</Text>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

function ProfileModalContent({ visible, onClose }) {
    const { token, userId, setCoachProfile, fetchCoachProfile } = useAuth();
    const [view, setView] = useState('profile');
    const [profileData, setProfileData] = useState(null);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = getStyles(isDark);


    // ── Edit profile form state ──────────────────────────────────────────────
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [profileSaving, setProfileSaving] = useState(false);

    // ── Refer a coach form state ─────────────────────────────────────────────
    const [referName, setReferName] = useState('');       // single field: "Shikha Thakur"
    const [referPhone, setReferPhone] = useState('');
    const [referNotes, setReferNotes] = useState('');
    const [referSaving, setReferSaving] = useState(false);

    // ── Contract signing state ───────────────────────────────────────────────
    const [sigMethod, setSigMethod] = useState('type');  // 'type' | 'draw'
    const [contractFullName, setContractFullName] = useState('');
    const [hasSig, setHasSig] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [signing, setSigning] = useState(false);
    const [signError, setSignError] = useState(null);
    const [signSuccess, setSignSuccess] = useState(null);
    const [signedPdfUrl, setSignedPdfUrl] = useState(null);
    const viewShotRef = useRef(null);

    const [pickedImage, setPickedImage] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null); // actual file to upload
    const [photoUploading, setPhotoUploading] = useState(false);

    const handlePickPhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            toast.error('Photo library permission is required.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        setPickedImage(asset.uri);
        setProfileImageFile(asset); // store for upload on Save
    };
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
        const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.grabbite.com/').replace(/\/$/, '');
        fetch(`${baseUrl}/api/coachpro/account-profile/${userId}`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then(r => r.json())
            .then(result => {
                if (result.status && result.data) {
                    const d = result.data;
                    setProfileData(d);
                    setCoachProfile(d);
                    // seed form fields
                    setFirstName(d.firstName || '');
                    setLastName(d.lastName || '');
                    setEmail(d.email || '');
                    setPhoneNumber(d.phoneNumber || '');
                    setCity(d.city || '');
                    setPostalCode(d.postalCode || '');
                    // seed contract name
                    const name = `${d.firstName || ''} ${d.lastName || ''}`.trim();
                    setContractFullName(name);
                    if (d.contract?.signedPdfFile) setSignedPdfUrl(d.contract.signedPdfFile);
                }
            })
            .catch(err => console.error(err));
    }, [token, userId]);

    // ── API: Sign Contract ───────────────────────────────────────────────────
    const handleSignContract = async () => {
        const contract = profileData?.contract;
        if (!agreed) { setSignError('Please check the agreement box.'); return; }
        if (!contractFullName.trim()) { setSignError('Please type your full name.'); return; }
        if (sigMethod === 'draw' && !hasSig) { setSignError('Please draw your signature.'); return; }
        if (!contract?.id) { setSignError('No contract found.'); return; }

        setSigning(true); setSignError(null); setSignSuccess(null);
        try {
            let signatureBase64 = null;
            if (sigMethod === 'draw') {
                const raw = await viewShotRef.current?.capture?.();
                if (!raw) { setSignError('Unable to capture signature. Please try again.'); return; }
                signatureBase64 = `data:image/png;base64,${raw}`;
            }
            const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.grabbite.com/').replace(/\/$/, '');
            const res = await fetch(`${baseUrl}/api/coachpro/contract/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ contractTemplateId: contract.id, signedName: contractFullName.trim(), signatureImage: signatureBase64 }),
            });
            const result = await res.json();
            if (!res.ok || !result.status) { setSignError(result.message || 'Failed to sign contract.'); return; }
            const pdf = result.data?.signedPdfFile || result.data?.pdfFile || null;
            if (pdf) setSignedPdfUrl(pdf);
            setSignSuccess('Contract signed successfully!');
            toast.success('Contract signed successfully!');
            // update local profileData so badge flips to Signed
            setProfileData(prev => ({ ...prev, contract: { ...prev?.contract, status: 'signed', signedAt: new Date().toISOString() } }));
        } catch (err) {
            console.error(err);
            setSignError(err.message || 'Something went wrong.');
        } finally {
            setSigning(false);
        }
    };

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

            if (profileImageFile) {
                formdata.append('profile', {
                    uri: profileImageFile.uri,
                    name: profileImageFile.fileName || `profile_${Date.now()}.jpg`,
                    type: profileImageFile.mimeType || 'image/jpeg',
                });
            }

            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachPro/account-profile/update/profile/${userId}`,
                {
                    method: 'PUT', body: formdata, redirect: 'follow', headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();
            if (result.status) {
                setProfileData(prev => {
                    const updated = { ...prev, firstName, lastName, email, phoneNumber, city, postalCode, profile: result.data?.profile || prev?.profile };
                    setCoachProfile(updated);
                    return updated;
                });
                setProfileImageFile(null);
                toast.success('Profile updated successfully.');
            } else {
                toast.error(result.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong.');
        } finally {
            setProfileSaving(false);
        }
    };
    // ── API: Refer a Coach ───────────────────────────────────────────────────
    const handleReferSubmit = async () => {
        const { firstName: referFirstName, lastName: referLastName } = splitName(referName);

        if (!referFirstName || !referPhone) {
            toast.warning('Please fill in all required fields.', 'Validation');
            return;
        }
        try {
            setReferSaving(true);
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}api/coachpro/referal/create`, {
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
                toast.success('Referral submitted successfully!');
                setReferName('');
                setReferPhone('');
                setReferNotes('');
                setView('latestResults');
            } else {
                toast.error(result.message || 'Failed to submit referral.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong.');
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
                    {profileSaving ? (
                        <CustomLoader size={80} color={'#3B82F6'} />
                    ) : (
                        <Image
                            source={
                                pickedImage
                                    ? { uri: pickedImage }
                                    : profileData?.profile
                                        ? { uri: profileData.profile }
                                        : require('../../assets/images/Ellipse.png')
                            }
                            style={[styles.profileImage, { borderRadius: 35 }]}
                        />
                    )}
                </View>
                <TouchableOpacity style={styles.editIconBadge} onPress={handlePickPhoto}>
                    <Image source={require('../../assets/images/pencil.png')} style={[styles.editIconBadgeImage]} />
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputTextWithIcon}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor={isDark ? '#888' : '#999'}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Ionicons name="mail-outline" size={20} color={isDark ? '#ccc' : '#333'} style={styles.inputIconRight} />
                </View>

                <View style={styles.phoneInputContainer}>
                    <View style={styles.flagContainer}>
                        <Text style={styles.flagText}>🇺🇸</Text>
                        <Ionicons name="chevron-down" size={16} color={isDark ? '#ccc' : '#333'} />
                    </View>
                    <TextInput
                        style={styles.phoneInput}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Phone Number"
                        placeholderTextColor={isDark ? '#888' : '#797A88'}
                        keyboardType="phone-pad"
                    />
                </View>

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

    // ─── Step 2: Contract — PDF preview only ────────────────────────────────
    const renderContract = () => {
        const contract = profileData?.contract;
        const isSigned = contract?.status === 'signed' || !!contract?.signedAt;
        const activePdfUrl = signedPdfUrl || contract?.signedPdfFile || contract?.pdfFile;

        return (
            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.contractHeaderRow}>
                    <Text style={styles.pageTitleHeader}>Your contract</Text>
                    <View style={[styles.completeBadge, { backgroundColor: isSigned ? '#1CAB4B' : '#f59e0b' }]}>
                        <Text style={styles.completeBadgeText}>{isSigned ? 'Signed' : 'Pending'}</Text>
                    </View>
                </View>

                {/* Action buttons */}
                <View style={styles.contractButtonRow}>
                    <TouchableOpacity style={styles.contractTopButton} onPress={handleBack}>
                        <Text style={styles.contractTopBtnText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contractTopButton} onPress={() => setView('referCoach')}>
                        <Text style={styles.contractTopBtnText}>Next</Text>
                    </TouchableOpacity>
                    {activePdfUrl && (
                        <TouchableOpacity style={styles.contractTopButton} onPress={() => Linking.openURL(activePdfUrl)}>
                            <Text style={styles.contractTopBtnText}>Download</Text>
                        </TouchableOpacity>
                    )}


                </View>

                {/* PDF Preview */}
                <PdfPreview pdfUrl={activePdfUrl} isDark={isDark} />

                {/* Signed confirmation row */}
                {isSigned && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(28,171,75,0.1)', borderRadius: 12, padding: 14, marginTop: 12, borderWidth: 1, borderColor: 'rgba(28,171,75,0.3)' }}>
                        <Ionicons name="checkmark-circle" size={18} color="#1CAB4B" />
                        <Text style={{ color: '#1CAB4B', fontFamily: 'Urbanist_700Bold', fontSize: 14 }}>Contract signed</Text>
                    </View>
                )}
            </ScrollView>
        );
    };

    // ─── Step 3: Refer a Coach ───────────────────────────────────────────────
    const renderReferCoach = () => (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={[styles.pageTitle, { textAlign: 'center' }]}>Refer a coach</Text>
            <Text style={[styles.referSubtitle, { textAlign: 'center' }]}>
                Fill out the form below and we'll take care of the rest. If your referee is hired, you'll earn £20 as a thank you and an additional £10 if they continue with us for over 12 weeks.
            </Text>

            <View style={styles.formContainer}>
                <View style={[styles.inputContainer, styles.referInputBordered]}>
                    <TextInput
                        style={[styles.input, { fontWeight: 'medium' }]}
                        placeholder="Full Name"
                        placeholderTextColor={isDark ? '#888' : '#797A88'}
                        value={referName}
                        onChangeText={setReferName}
                    />
                </View>

                <View style={[styles.inputContainer, styles.referInputBordered]}>
                    <TextInput
                        style={[styles.input, { fontWeight: 'medium' }]}
                        placeholder="Telephone Number"
                        placeholderTextColor={isDark ? '#888' : '#797A88'}
                        keyboardType="phone-pad"
                        value={referPhone}
                        onChangeText={setReferPhone}
                    />
                </View>

                <View style={[styles.inputContainer, styles.referInputBordered, { height: 120, alignItems: 'flex-start', paddingTop: 14 }]}>
                    <TextInput
                        style={[styles.input, { fontWeight: 'medium', height: 90, textAlignVertical: 'top' }]}
                        placeholder="Notes (Optional)"
                        placeholderTextColor={isDark ? '#888' : '#797A88'}
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
                <View style={[styles.resultHeader, { display: 'flex', }]}>
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
                        <Ionicons name="calendar-outline" size={14} color={isDark ? '#ccc' : '#000'} />
                        <Text style={styles.resultMetaText}>18/01/23</Text>
                    </View>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="location-outline" size={14} color={isDark ? '#ccc' : '#000'} />
                        <Text style={styles.resultMetaText}>Kings Cross</Text>
                    </View>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="time-outline" size={14} color={isDark ? '#ccc' : '#000'} />
                        <Text style={styles.resultMetaText}>9:30</Text>
                    </View>
                    <View style={styles.resultMetaItem}>
                        <Ionicons name="person-outline" size={14} color={isDark ? '#ccc' : '#000'} />
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
    );
}

export default function ProfileModal({ visible, onClose }) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            {visible && (
                <ToastProvider>
                    <ToastRegister />
                    <ProfileModalContent visible={visible} onClose={onClose} />
                </ToastProvider>
            )}
        </Modal>
    );
}

const getStyles = (isDark) => StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0)' },
    screenContainer: {
        width: width, height: '100%', backgroundColor: isDark ? '#121212' : '#fff',
        position: 'absolute', left: 0, top: 0, bottom: 0,
        elevation: 10, shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5,
    },
    headerBg: { width: '100%', height: 100, justifyContent: 'flex-end' },
    headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 15 },
    backButton: { padding: 4 },
    bodyContainer: { flex: 1, backgroundColor: isDark ? '#121212' : '#fff' },
    scrollContent: { flex: 1, padding: 20 },
    pageTitle: { fontSize: 26, color: isDark ? '#F5F5F5' : '#1A1A1A', marginBottom: 20, fontWeight: 'bold' },
    pageTitleHeader: { fontSize: 26, color: isDark ? '#F5F5F5' : '#1A1A1A', flex: 1, fontWeight: 'bold', fontFamily: 'Urbanist_700Bold' },

    profileImageContainer: { alignSelf: 'center', marginBottom: 30, position: 'relative' },
    profileImageWrapper: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    editIconBadge: {
        position: 'absolute', bottom: 0, right: 0, width: 32, height: 32,
        borderRadius: 16, justifyContent: 'center',
        alignItems: 'center', borderWidth: 2, borderColor: isDark ? '#121212' : '#fff',
    },
    editIconBadgeImage: {
        height: 30,
        width: 30,
    },

    formContainer: { gap: 16, paddingBottom: 50 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? '#1E1E1E' : '#f5f5f5',
        borderRadius: 12, borderColor: '#9E9FAA', paddingHorizontal: 16, height: 56,
    },
    referInputBordered: {
        borderWidth: 1, borderColor: isDark ? '#3A3A3A' : '#9E9FAA',
    },
    input: { flex: 1, fontSize: 16, color: isDark ? '#F5F5F5' : '#333', fontWeight: 'bold' },
    inputTextWithIcon: { flex: 1, fontSize: 16, fontWeight: 'bold', color: isDark ? '#F5F5F5' : '#333', fontFamily: 'Urbanist_500Medium' },
    inputIconRight: { marginLeft: 10 },
    phoneInputContainer: {
        flexDirection: 'row', fontWeight: 'bold', alignItems: 'center', backgroundColor: isDark ? '#1E1E1E' : '#f5f5f5',
        borderRadius: 12, height: 56, paddingHorizontal: 16,
    },
    flagContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 10, borderRightWidth: 1, borderRightColor: isDark ? '#3A3A3A' : '#ddd', paddingRight: 10, gap: 4 },
    flagText: { fontSize: 20 },
    phoneInput: { flex: 1, fontWeight: 'bold', fontSize: 16, color: isDark ? '#F5F5F5' : '#333', fontFamily: 'Urbanist_500Medium' },
    contractActionCard: {
        backgroundColor: isDark ? '#1A2E6E' : '#2643a6', borderRadius: 12, height: 80,
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
    contractMainTitle: { fontSize: 16, color: isDark ? '#F5F5F5' : '#1a1a1a', marginBottom: 20, textTransform: 'uppercase', fontFamily: 'Urbanist_700Bold' },
    contractSectionTitle: { fontSize: 18, color: isDark ? '#F5F5F5' : '#1a1a1a', marginTop: 20, marginBottom: 12, fontFamily: 'Urbanist_700Bold' },
    contractParagraph: { fontSize: 14, lineHeight: 24, color: isDark ? '#B0B0B0' : '#555', marginBottom: 15, fontFamily: 'Urbanist_400Regular' },
    boldText: { color: isDark ? '#F5F5F5' : '#1a1a1a', fontFamily: 'Urbanist_700Bold' },

    referSubtitle: { fontSize: 14, color: isDark ? '#9CA3AF' : '#88909D', lineHeight: 22, marginBottom: 28, fontFamily: 'Urbanist_400Regular' },

    resultTabRow: { flexDirection: 'row', backgroundColor: isDark ? '#1E1E1E' : '#f0f0f0', borderRadius: 10, padding: 4, marginBottom: 20 },
    resultTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
    resultTabActive: { backgroundColor: '#3b5fdf' },
    resultTabText: { fontSize: 15, color: isDark ? '#9CA3AF' : '#797A88', fontFamily: 'Urbanist_500Medium' },
    resultTabTextActive: { color: '#fff', fontFamily: 'Urbanist_700Bold' },
    resultMetaRow: { flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'space-between', borderBottomColor: isDark ? '#2A2A2A' : '#EEEEEE', borderBottomWidth: 1, paddingBottom: 20 },
    resultMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    resultMetaText: { fontSize: 14, color: isDark ? '#F5F5F5' : '#000', fontFamily: 'Urbanist_500Medium' },
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
    insightTabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: isDark ? '#2A2A2A' : '#eee', marginBottom: 16 },
    insightTabActive: { paddingBottom: 10, marginRight: 24, borderBottomWidth: 2, borderBottomColor: '#3b5fdf' },
    insightTab: { paddingBottom: 10, marginRight: 24 },
    insightTabTextActive: { fontSize: 16, color: '#3b5fdf', fontFamily: 'Urbanist_700Bold' },
    insightTabText: { fontSize: 16, color: isDark ? '#777' : '#999', fontFamily: 'Urbanist_500Medium' },
    strengthsList: { gap: 10 },
    strengthItem: { backgroundColor: isDark ? '#1E1E1E' : '#EEF2F5', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16 },
    strengthText: { fontSize: 16, color: isDark ? '#F5F5F5' : '#333', fontFamily: 'Urbanist_500Medium' },
    profileImage: { width: 110, height: 110, resizeMode: 'cover' },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 15, },
});