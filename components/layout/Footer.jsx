import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
    const router = useRouter();
    const pathname = usePathname();

    // Map each tab to image sources for active and inactive states
    const tabs = [
        {
            name: 'Home',
            route: '/',
            iconActive: require('../../assets/images/home.png'),
            iconInactive: require('../../assets/images/home.png'), // same image or different if you want
        },
        {
            name: 'Calendar',
            route: '/calendar',
            iconActive: require('../../assets/images/Calendar.png'),
            iconInactive: require('../../assets/images/Calendar.png'),
        },
        {
            name: 'Classes',
            route: '/classes',
            iconActive: require('../../assets/images/Document.png'),
            iconInactive: require('../../assets/images/Document.png'),
        },
        {
            name: 'Music',
            route: '/music',
            iconActive: require('../../assets/images/music.png'),
            iconInactive: require('../../assets/images/music.png'),
        },
        {
            name: 'My Results',
            route: '/my-results',
            iconActive: require('../../assets/images/Activity.png'),
            iconInactive: require('../../assets/images/Activity.png'),
        },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.route;

                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => router.push(tab.route)}
                    >
                        <Image
                            source={isActive ? tab.iconActive : tab.iconInactive}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                        <Text style={[styles.label, isActive && styles.activeLabel]}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
        color: '#666',
    },
    activeLabel: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
});
