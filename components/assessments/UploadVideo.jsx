import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import CustomLoader from '@/components/common/CustomLoader';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';

const COLORS = {
    light: {
        background: '#fff',
        headerTitle: '#1a1a1a',
        outerCircle: '#93C5FD',
        middleCircle: '#60A5FA',
        innerCircle: '#3B82F6',
        iconBox: '#fff',
        icon: '#3B82F6',
        cardBg: '#F3F4F6',
        text: '#1F2937',
        subText: '#4B5563',
    },
    dark: {
        background: '#121212',
        headerTitle: '#F5F5F5',
        outerCircle: '#1E3A5F',
        middleCircle: '#2C5282',
        innerCircle: '#3B82F6',
        iconBox: '#1E1E1E',
        icon: '#60A5FA',
        cardBg: '#1E1E1E',
        text: '#F3F4F6',
        subText: '#9CA3AF',
    },
};

export default function UploadVideo({ onBack, onNext }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [video, setVideo] = useState(null);
    const [picking, setPicking] = useState(false);

    const handlePickVideo = async () => {
        try {
            setPicking(true);
            const res = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
                copyToCacheDirectory: true,
            });

            if (!res.canceled && res.assets && res.assets.length > 0) {
                setVideo(res.assets[0]);
            }
        } catch (err) {
            console.log('Error picking video:', err);
        } finally {
            setPicking(false);
        }
    };

    const clearVideo = () => {
        setVideo(null);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.headerTitle} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload video</Text>
            </View>

            <View style={styles.centerContent}>
                {/* Ripple Effect Circles */}
                <View style={styles.outerCircle}>
                    <View style={styles.middleCircle}>
                        <TouchableOpacity style={styles.innerCircle} onPress={handlePickVideo} disabled={picking}>
                            {picking ? (
                                <CustomLoader size={50} color="#fff" />
                            ) : video ? (
                                <Ionicons name="checkmark" size={54} color="#fff" />
                            ) : (
                                <View style={styles.iconBox}>
                                    <Ionicons name="add" size={32} color={theme.icon} style={styles.plusIcon} />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {video && (
                    <View style={styles.videoInfoContainer}>
                        <Ionicons name="videocam" size={24} color={theme.icon} style={{ marginRight: 8 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.videoName} numberOfLines={1}>{video.name}</Text>
                            <Text style={styles.videoSize}>
                                {video.size ? `${(video.size / (1024 * 1024)).toFixed(2)} MB` : 'Size Unknown'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={clearVideo} style={styles.clearButton}>
                            <Ionicons name="close-circle" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity 
                    style={[styles.nextButton, !video && { opacity: 0.5 }]} 
                    onPress={onNext}
                    disabled={!video}
                >
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 26,
        color: theme.headerTitle,
        fontFamily: 'Urbanist_700Bold',
        flex: 1,
        textAlign: 'center',
        marginRight: 36, // Balance the back button
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    outerCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: theme.outerCircle,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    middleCircle: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: theme.middleCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.innerCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        backgroundColor: theme.iconBox,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        fontWeight: '900',
    },
    videoInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBg,
        padding: 16,
        borderRadius: 12,
        width: '100%',
        marginTop: 20,
    },
    videoName: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
    },
    videoSize: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.subText,
        marginTop: 4,
    },
    clearButton: {
        padding: 4,
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
        fontSize: 18,
        fontFamily: 'Urbanist_700Bold',
    },
});