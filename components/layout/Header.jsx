import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import NotificationDetails from '../notifications/NotificationDetails';
import NotificationsList from '../notifications/NotificationsList';
import ProfileModal from './ProfileModal';

export default function Header({ title, showBack = false, onMenuPress }) {
    const router = useRouter();
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
    const [notificationsView, setNotificationsView] = useState('list'); // 'list' or 'details'

    const handleNotificationPress = () => {
        setNotificationsView('list');
        setIsNotificationsVisible(true);
    };

    const handleNotificationSelect = (id) => {
        setNotificationsView('details');
    };

    return (
        <>
            <ImageBackground
                source={require('@/assets/images/Login.png')} // 👈 your image path
                style={styles.bgImage}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        {showBack ? (
                            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                                <Ionicons name="arrow-back" size={28} color="#fff" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
                                <Ionicons name="menu" size={32} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.centerContainer}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../../assets/images/coach-logo.png')}
                                style={styles.logoImage}
                            />

                        </View>
                    </View>

                    <View style={styles.rightContainer}>
                        <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
                            <Image
                                source={require('../../assets/images/Notification.png')}
                                style={{ width: 32, height: 32 }}
                            />                            <View style={styles.badge} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileButton} onPress={() => setIsProfileVisible(true)}>

                            <Image
                                source={require('@/assets/images/Ellipse.png')}
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

            <ProfileModal
                visible={isProfileVisible}
                onClose={() => setIsProfileVisible(false)}
            />

            <Modal
                visible={isNotificationsVisible}
                animationType="slide"
                onRequestClose={() => setIsNotificationsVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <ImageBackground
                        source={require('@/assets/images/Login.png')}
                        style={styles.bgImage}
                        resizeMode="cover"
                    >
                        <View style={[styles.container, { borderBottomWidth: 0 }]}>
                            <View style={styles.leftContainer}>
                                <TouchableOpacity onPress={() => setIsNotificationsVisible(false)} style={styles.iconButton}>
                                    <Ionicons name="menu" size={32} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.centerContainer}>
                                <View style={styles.logoContainer}>
                                    <Image
                                        source={require('../../assets/images/coach-logo.png')}
                                        style={styles.logoImage}
                                    />
                                </View>
                            </View>

                            <View style={styles.rightContainer}>
                                <TouchableOpacity style={styles.iconButton} onPress={() => setIsNotificationsVisible(false)}>
                                    <Image
                                        source={require('../../assets/images/Notification.png')}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <View style={styles.badge} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.profileButton} onPress={() => { setIsNotificationsVisible(false); setIsProfileVisible(true); }}>
                                    <Image
                                        source={require('@/assets/images/Ellipse.png')}
                                        style={styles.profileImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{ flex: 1 }}>
                        {notificationsView === 'list' ? (
                            <NotificationsList onNotificationSelect={handleNotificationSelect} />
                        ) : (
                            <NotificationDetails onBack={() => setNotificationsView('list')} />
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 30, // Status bar padding
        paddingBottom: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    logoImage: {
        width: 130,
        objectFit: "contain"
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoTextWhite: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    logoTextGold: {
        fontSize: 24,
        fontStyle: 'italic',
        fontWeight: 'bold',
        color: '#fdbb2d', // Gold/Yellow color
        marginLeft: 2,
        fontFamily: 'serif',
    },
    iconButton: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ff4444',
        borderWidth: 1.5,
        borderColor: '#4a4a4a',
    },
    profileButton: {
        marginLeft: 8,
    },
    profileImage: {
        width: 36,
        height: 36,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    modalBackButton: {
        padding: 4,
    },
});
