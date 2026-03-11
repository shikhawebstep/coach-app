import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileModal({ visible, onClose }) {
    const [view, setView] = useState('profile'); // 'profile' or 'contract'
    
    // Slide horizontally. We animate the whole container from -width to 0
    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        if (visible) {
            setView('profile'); // Reset to profile on open
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

    const handleBack = () => {
        if (view === 'contract') {
            setView('profile');
        } else {
            onClose();
        }
    };

    const renderProfile = () => (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.pageTitle}>Edit your profile</Text>
            
            <View style={styles.profileImageContainer}>
                <View style={styles.profileImageWrapper}>
                    <Image
                        source={require('../../assets/images/Ellipse.png')}
                        style={styles.profileLargeImage}
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
                        value="Ethan"
                        placeholder="First Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input}
                        value="Bond Vaughan"
                        placeholder="Last Name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.inputTextWithIcon}
                        value="ethan@sambasoccerschools.com"
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
                        value="+1 111 467 378 399"
                        placeholder="Phone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity 
                    style={styles.contractActionCard}
                    onPress={() => setView('contract')}
                >
                    <Text style={styles.contractActionText}>See your contract</Text>
                    <View style={styles.contractGraphicPlaceholder}>
                        <Text style={styles.contractGraphicTitle}>CONTRACT</Text>
                        <View style={styles.contractGraphicLine} />
                        <View style={styles.contractGraphicLine} />
                        <View style={styles.contractGraphicLine} />
                        <View style={styles.contractGraphicLine} />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
                           <View style={styles.contractGraphicBadge} />
                           <Text style={{fontSize: 8, color: '#666'}}>~</Text>
                        </View>
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

    const renderContract = () => (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.contractHeaderRow}>
                <Text style={styles.pageTitleHeader}>Sign your contract</Text>
                <View style={styles.completeBadge}>
                    <Text style={styles.completeBadgeText}>Complete</Text>
                </View>
            </View>

            <View style={styles.contractButtonRow}>
                <TouchableOpacity style={styles.contractTopButton}>
                    <Text style={styles.contractTopBtnText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contractTopButton}>
                    <Text style={styles.contractTopBtnText}>Next</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contractTopButton}>
                    <Text style={styles.contractTopBtnText}>Download</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contractContent}>
                <Text style={styles.contractMainTitle}>INDEPENDENT CONTRACTOR AGREEMENT</Text>
                
                <Text style={styles.contractParagraph}>
                    This independent contractor agreement is between <Text style={styles.boldText}>Ethan Bond Vaughan</Text>
                    {' '}And SAMBA SOCCER SCHOOLS GLOBAL LTD ("We", "Us", "Our", the "Company")
                </Text>

                <Text style={styles.contractSectionTitle}>Background</Text>
                <Text style={styles.contractParagraph}>
                    a. The Company is of the opinion that the Contractor has the necessary qualifications, experience and abilities to provide services to the Company.
                </Text>
                <Text style={styles.contractParagraph}>
                    b. The Contractor agrees to provide such services to the Company on the terms and conditions set out in the Agreement.
                </Text>

                <Text style={styles.contractSectionTitle}>General</Text>
                <Text style={styles.contractParagraph}>
                    IN CONSIDERATION OF the matters described above and of the mutual benefits and obligations set forth in this Agreement, the receipt and sufficiency of of which consideration is hereby acknowledged, the Company and the Contractor (individually the "Party" and collectively the "Parties" to this Agreement) agree as follows:
                </Text>

                <Text style={styles.contractSectionTitle}>General</Text>
                <Text style={styles.contractParagraph}>
                    a. The particulars of this Agreement are as set out in this Agreement and the Company policies, procedures and rules as may be introduced and/or varied from time to time.
                </Text>
                <Text style={styles.contractParagraph}>
                    b. The Company has a duty to safeguard all students, parents and guardians and their personal information. The Contractor agrees to adhere to the Company's policies and understands that failure to do so may lead to all work being withdrawn.
                </Text>
                <Text style={styles.contractParagraph}>
                    c. Any amendments or modifications of this Agreement or additional obligation assumed by either Party in connection with this agreement will
                </Text>
            </View>
        </ScrollView>
    );

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
                        {view === 'profile' ? renderProfile() : renderContract()}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0)', // Completely solid as it slides over everything
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
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerBg: {
        width: '100%',
        height: 100, // Matching the thin grey top header
        justifyContent: 'flex-end',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 15, // Lift the arrow a bit
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 20,
    },
    pageTitleHeader: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1A1A1A',
        flex: 1,
    },
    // Profile styles
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    profileImageWrapper: {
        width: 110,
        height: 110,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#02b45a', // Green border
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileLargeImage: {
        width: 110,
        height: 110,
        resizeMode: 'cover',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fdbb2d', // Yellow/Gold
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
        paddingHorizontal: 16,
        height: 56,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    inputTextWithIcon: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
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
        fontWeight: '500',
    },
    contractActionCard: {
        backgroundColor: '#2643a6', // Dark blue
        borderRadius: 12,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    contractActionText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        zIndex: 2,
    },
    contractGraphicPlaceholder: {
        position: 'absolute',
        right: 20,
        top: 0,
        width: 55,
        height: 90,
        backgroundColor: '#f3f1e9',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        padding: 5,
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        transform: [{ translateY: -5 }], // Stick out of the parent slightly
    },
    contractGraphicTitle: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 4,
    },
    contractGraphicLine: {
        height: 3,
        backgroundColor: '#ccc',
        borderRadius: 1.5,
        marginBottom: 4,
        width: '100%',
    },
    contractGraphicBadge: {
        width: 10,
        height: 6,
        backgroundColor: '#333',
        borderRadius: 2,
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
    cancelButton: {
        backgroundColor: '#ffe89b', // Light yellow
    },
    saveButton: {
        backgroundColor: '#fdbb2d', // Bold yellow/gold
    },
    actionButtonTextBlack: {
        color: '#1a1a1a',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Contract styles
    contractHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    completeBadge: {
        backgroundColor: '#02b45a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    completeBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    contractButtonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 30,
    },
    contractTopButton: {
        backgroundColor: '#3b5fdf', // Royal blue
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    contractTopBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    contractContent: {
        paddingBottom: 50,
    },
    contractMainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    contractSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 20,
        marginBottom: 12,
    },
    contractParagraph: {
        fontSize: 14,
        lineHeight: 24,
        color: '#555',
        marginBottom: 15,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
});
