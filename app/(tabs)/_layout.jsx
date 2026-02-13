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

    return (
        <>
            <Header onMenuPress={() => setIsMenuOpen(true)} />

            <SideMenu visible={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

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
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarLabelStyle: {
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#9E9E9E',
                        },
                        tabBarIcon: () => (
                            <Image
                                source={require('../../assets/images/home.png')}
                                style={{ width: 25, height: 25, marginBottom: 10, objectFit: "contain", }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="calendar"
                    options={{
                        title: 'Calendar',
                        tabBarLabelStyle: {
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#9E9E9E',
                        },
                        tabBarIcon: () => (
                            <Image
                                source={require('../../assets/images/Calendar.png')}
                                style={{ width: 25, height: 25, marginBottom: 10, objectFit: "contain", }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="classes"
                    options={{
                        title: 'Classes',
                        tabBarLabelStyle: {
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#9E9E9E',
                        },
                        tabBarIcon: () => (
                            <Image
                                source={require('../../assets/images/Document.png')}
                                style={{ width: 25, height: 25, marginBottom: 10, objectFit: "contain", }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="music"
                    options={{
                        title: 'Music',
                        tabBarLabelStyle: {
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#9E9E9E',
                        },
                        tabBarIcon: () => (
                            <Image
                                source={require('../../assets/images/music.png')}
                                style={{ width: 25, height: 25, marginBottom: 10, objectFit: "contain", }}
                            />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="result"
                    options={{
                        title: 'My Results',
                        tabBarLabelStyle: {
                            fontSize: 13,
                            fontWeight: '700',
                            color: '#9E9E9E',
                        },
                        tabBarIcon: () => (
                            <Image
                                source={require('../../assets/images/Activity.png')}
                                style={{ width: 25, height: 25, marginBottom: 10, objectFit: "contain", }}
                            />
                        ),
                    }}
                />
            </Tabs>

        </>
    );
}
