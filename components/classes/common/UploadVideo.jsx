import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function UploadVideo({ onBack }) {
    return (
        <View style={styles.container}>
            {/* Keeping spacing for where header usually is, mimicking minimalist look */}
            <View style={styles.headerSpacer} />
            
            <Text style={styles.title}>Upload Video</Text>

            <View style={styles.centerContent}>
                {/* Ripple Effect Circles */}
                <View style={styles.outerCircle}>
                    <View style={styles.middleCircle}>
                        <TouchableOpacity style={styles.innerCircle}>
                            <View style={styles.iconBox}>
                                <Ionicons name="add" size={32} color="#3B82F6" strokeWidth={4} style={styles.plusIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerSpacer: {
        height: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        marginTop: 20,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outerCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#93C5FD', // Lightest blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleCircle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: '#60A5FA', // Mid blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#3B82F6', // Dark blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        fontWeight: '900',
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    nextButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
