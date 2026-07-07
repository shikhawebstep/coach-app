import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MiniMapView({ region, studentName, address }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <Ionicons name="map" size={36} color={isDark ? '#60A5FA' : '#3B82F6'} />
            <Text style={[styles.title, isDark && styles.titleDark]}>Map Preview</Text>
            <Text style={[styles.address, isDark && styles.addressDark]} numberOfLines={2}>
                {address || 'No address provided'}
            </Text>
            <Text style={styles.helper}>Map interaction is optimized for the mobile app</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    containerDark: {
        backgroundColor: '#1F2937',
        borderColor: '#374151',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 8,
    },
    titleDark: {
        color: '#F3F4F6',
    },
    address: {
        fontSize: 13,
        color: '#4B5563',
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 20,
    },
    addressDark: {
        color: '#9CA3AF',
    },
    helper: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 12,
    }
});
