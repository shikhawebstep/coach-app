import Banner from '@/components/dashboard/banner';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
export default function HomeScreen() {
    const router = useRouter();

    return (
        <Banner />);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
});
