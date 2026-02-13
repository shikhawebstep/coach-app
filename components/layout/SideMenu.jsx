import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Menu data structure matching the image
const MENU_ITEMS = [
    { id: 'profile', title: 'Profile', icon: 'person-circle-outline' },
    { id: 'schedule', title: 'My Schedule', icon: 'calendar-outline' },
    {
        id: 'classes',
        title: 'Classes',
        icon: 'radio-button-on-outline',
        hasSubmenu: true,
        isOpen: false, // Initial state
        submenu: [],
    },
    { id: 'training', title: 'Training', icon: 'play-circle-outline' },
    { id: 'assessments', title: 'My Assessments', icon: 'stats-chart-outline' },
    {
        id: 'health',
        title: 'Venue Health Check',
        icon: 'add-circle-outline',
        hasSubmenu: true,
        isOpen: true, // Shown open in the image
        submenu: [
            { id: 'student_numbers', title: 'Student Numbers' },
            { id: 'customer_feedback', title: 'Customer Feedback' },
        ],
    },
    { id: 'report', title: 'Report an issue', icon: 'warning-outline' },
    {
        id: 'quality',
        title: 'Quality Control',
        icon: 'checkmark-circle-outline',
        hasSubmenu: true,
        isOpen: true, // Shown open in the image
        submenu: [
            { id: 'create_report', title: 'Create a report' },
            { id: 'my_reports', title: 'My reports' },
        ],
    },
];

export default function SideMenu({ visible, onClose }) {
    const router = useRouter();
    const [items, setItems] = useState(MENU_ITEMS);
    // Animation for sliding in
    const [slideAnim] = useState(new Animated.Value(-width * 0.8));

    // Handle slide animation when visible changes
    if (visible) {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    } else {
        Animated.timing(slideAnim, {
            toValue: -width * 0.8,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }

    const toggleSubmenu = (id) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return { ...item, isOpen: !item.isOpen };
            }
            return item;
        }));
    };

    const handleLogout = () => {
        onClose();
        router.replace('/login');
    };

    const handleNavigation = (route) => {
        onClose();
        // Add navigation logic here if routes differ from items
        console.log('Navigate to:', route);
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        styles.menuContainer,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    <ImageBackground
                        source={require('@/assets/images/Sidebar.png')}
                        style={styles.bgImage}
                    >
                        {/* Header with Close Button */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={30} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.menuTitle}>Main Menu</Text>

                        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
                            {items.map((item) => (
                                <View key={item.id}>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => item.hasSubmenu ? toggleSubmenu(item.id) : handleNavigation(item.id)}
                                    >
                                        <View style={styles.menuItemLeft}>
                                            <Ionicons name={item.icon} size={24} color="#fff" />
                                            <Text style={styles.menuItemText}>{item.title}</Text>
                                        </View>
                                        {item.hasSubmenu && (
                                            <Ionicons
                                                name="chevron-down"
                                                size={20}
                                                color="#fff"
                                                style={{ transform: [{ rotate: item.isOpen ? '180deg' : '0deg' }] }}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    {/* Submenu */}
                                    {item.hasSubmenu && item.isOpen && (
                                        <View style={styles.submenuContainer}>
                                            {item.submenu.map((subItem, index) => (
                                                <TouchableOpacity
                                                    key={subItem.id}
                                                    style={styles.submenuItem}
                                                    onPress={() => handleNavigation(subItem.id)}
                                                >
                                                    <View style={styles.timelineLine}>
                                                        {/* Start Dot */}
                                                        <View style={[styles.timelineDot, index === 0 && { marginTop: 0 }]} />
                                                        {/* Vertical Line */}
                                                        {item.submenu.length > 1 && index !== item.submenu.length - 1 && (
                                                            <View style={styles.verticalLine} />
                                                        )}
                                                    </View>
                                                    <Text style={styles.submenuText}>{subItem.title}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>

                        {/* Footer / Logout */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={24} color="#fff" />
                                <Text style={styles.menuItemText}>Log out</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        width: width * 0.85,
        height: '100%',
        backgroundColor: '#2b2b2b', // Fallback
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bgImage: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    closeButton: {
        alignSelf: 'flex-start',
    },
    menuTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fdbb2d', // Gold Color
        marginBottom: 30,
    },
    menuList: {
        flex: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
        paddingVertical: 16,
        gap: 13
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    submenuContainer: {
        paddingLeft: 22, // Align with icon center
    },
    submenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingLeft: 10,
    },
    timelineLine: {
        alignItems: 'center',
        marginRight: 15,
        width: 10,
    },
    timelineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fdbb2d',
    },
    verticalLine: {
        width: 1.5,
        height: 40, // Height to connect to next item
        backgroundColor: '#fdbb2d',
        position: 'absolute',
        top: 6,
    },
    submenuText: {
        color: '#fff',
        fontSize: 15,
    },
    footer: {
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
});
