import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Image } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Header from '../../components/layout/Header';
import SideMenu from '../../components/layout/SideMenu';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuInitialTab, setMenuInitialTab] = useState('Menu');

    const openMenu = (tab = 'Menu') => {
        setMenuInitialTab(tab);
        setIsMenuOpen(true);
    };

    return (
        <>
            <Header onMenuPress={() => openMenu('Menu')} />

            <SideMenu
                visible={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                initialTab={menuInitialTab}
            />

            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: {
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                        height: 70,
                        paddingTop: 8,
                        paddingBottom: 8,
                    },
                    tabBarItemStyle: {
                        paddingVertical: 6,
                    },
                    tabBarIconStyle: {
                        width: 25,
                        height: 25,
                        marginBottom: 2,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontFamily: 'Urbanist_700Bold',
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/images/home.png')}
                                style={{
                                    width: 25, height: 25, marginBottom: 10, objectFit: 'contain',
                                    tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#9E9E9E',
                                }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="calendar"
                    options={{
                        title: 'Calendar',
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/images/Calendar.png')}
                                style={{
                                    width: 25, height: 25, marginBottom: 10, objectFit: 'contain',
                                    tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#9E9E9E',
                                }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="classes"
                    options={{
                        title: 'Classes',
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/images/Document.png')}
                                style={{
                                    width: 25, height: 25, marginBottom: 10, objectFit: 'contain',
                                    tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#9E9E9E',
                                }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="music"
                    options={{
                        title: 'Music',
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/images/music.png')}
                                style={{
                                    width: 25, height: 25, marginBottom: 10, objectFit: 'contain',
                                    tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#9E9E9E',
                                }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="reportIssueList"
                    options={{ href: null }}
                />

                <Tabs.Screen
                    name="result"
                    options={{
                        title: 'My Results',
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={require('../../assets/images/Activity.png')}
                                style={{
                                    width: 25, height: 25, marginBottom: 10, objectFit: 'contain',
                                    tintColor: focused ? Colors[colorScheme ?? 'light'].tint : '#9E9E9E',
                                }}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}