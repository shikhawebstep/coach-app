import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

const COLORS = {
    light: {
        background: '#fff',
        headerTitle: '#1a1a1a',
        title: '#1a1a1a',
        timer: '#9CA3AF',
        outerCircle: '#93C5FD',
        middleCircle: '#60A5FA',
        innerCircle: '#3B82F6',
        icon: '#fff',
        cardBg: '#F3F4F6',
        text: '#1F2937',
        subText: '#4B5563',
    },
    dark: {
        background: '#121212',
        headerTitle: '#F5F5F5',
        title: '#F5F5F5',
        timer: '#9CA3AF',
        outerCircle: '#1E3A5F',
        middleCircle: '#2C5282',
        innerCircle: '#3B82F6',
        icon: '#fff',
        cardBg: '#1E1E1E',
        text: '#F3F4F6',
        subText: '#9CA3AF',
    },
};

export default function SummarisePerformance({ onBack, onComplete }) {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? COLORS.dark : COLORS.light;
    const styles = getStyles(theme);

    const [recording, setRecording] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState('idle'); // 'idle', 'recording', 'stopped'
    const [soundUri, setSoundUri] = useState(null);
    const [playbackSound, setPlaybackSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Audio Timer
    useEffect(() => {
        let interval = null;
        if (status === 'recording') {
            interval = setInterval(() => {
                setSeconds(sec => sec + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [status]);

    // Clean up sounds on unmount
    useEffect(() => {
        return () => {
            if (playbackSound) {
                playbackSound.unloadAsync();
            }
        };
    }, [playbackSound]);

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                alert('Permission to access microphone is required!');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            
            setRecording(recording);
            setSeconds(0);
            setStatus('recording');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setSoundUri(uri);
            setRecording(null);
            setStatus('stopped');
        } catch (err) {
            console.error('Failed to stop recording', err);
        }
    }

    async function playAudio() {
        if (!soundUri) return;
        try {
            if (playbackSound) {
                await playbackSound.unloadAsync();
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: soundUri },
                { shouldPlay: true }
            );

            setPlaybackSound(sound);
            setIsPlaying(true);

            sound.setOnPlaybackStatusUpdate((statusUpdate) => {
                if (statusUpdate.didJustFinish) {
                    setIsPlaying(false);
                }
            });
        } catch (err) {
            console.error('Failed to play audio', err);
        }
    }

    async function stopPlayback() {
        if (playbackSound) {
            await playbackSound.stopAsync();
            setIsPlaying(false);
        }
    }

    const resetRecording = () => {
        setSoundUri(null);
        setSeconds(0);
        setStatus('idle');
        if (playbackSound) {
            playbackSound.unloadAsync();
            setPlaybackSound(null);
        }
        setIsPlaying(false);
    };

    const fmt = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.headerTitle} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create report</Text>
            </View>

            <Text style={styles.title}>Summarise Performance</Text>

            <View style={styles.centerContent}>
                <Text style={styles.timer}>{fmt(seconds)}</Text>

                {/* Ripple Effect Circles */}
                <View style={[styles.outerCircle, status === 'recording' && styles.outerCircleRecording]}>
                    <View style={[styles.middleCircle, status === 'recording' && styles.middleCircleRecording]}>
                        <TouchableOpacity 
                            style={[styles.innerCircle, status === 'recording' && styles.innerCircleRecording]}
                            onPress={status === 'recording' ? stopRecording : startRecording}
                        >
                            <Ionicons name={status === 'recording' ? 'stop' : 'mic-outline'} size={54} color={theme.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {status === 'stopped' && soundUri && (
                    <View style={styles.audioPlayerContainer}>
                        <TouchableOpacity onPress={isPlaying ? stopPlayback : playAudio} style={styles.playButton}>
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.audioText}>Recorded Feedback</Text>
                            <Text style={styles.audioSubText}>Duration: {fmt(seconds)}</Text>
                        </View>
                        <TouchableOpacity onPress={resetRecording} style={styles.trashButton}>
                            <Ionicons name="trash" size={24} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity 
                    style={[styles.completeButton, status !== 'stopped' && { opacity: 0.5 }]} 
                    onPress={onComplete}
                    disabled={status !== 'stopped'}
                >
                    <Text style={styles.completeButtonText}>Complete</Text>
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
        fontFamily: 'Urbanist_700Bold',
        color: theme.headerTitle,
        flex: 1,
        textAlign: 'center',
        marginRight: 36, // Balance the back button
    },
    title: {
        fontSize: 22,
        fontFamily: 'Urbanist_700Bold',
        color: theme.title,
        textAlign: 'center',
        marginTop: 10,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    timer: {
        fontSize: 56,
        color: theme.timer,
        fontFamily: 'Urbanist_400Regular',
        marginBottom: 40,
    },
    outerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.outerCircle,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    outerCircleRecording: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    middleCircle: {
        width: 156,
        height: 156,
        borderRadius: 78,
        backgroundColor: theme.middleCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleCircleRecording: {
        backgroundColor: 'rgba(239, 68, 68, 0.4)',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.innerCircle,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircleRecording: {
        backgroundColor: '#EF4444',
    },
    audioPlayerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBg,
        padding: 16,
        borderRadius: 12,
        width: '100%',
        marginTop: 20,
        borderWidth: 1,
        borderColor: theme.cardBg === '#fff' ? '#E5E7EB' : '#2A2A2A',
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioText: {
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        color: theme.text,
    },
    audioSubText: {
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
        color: theme.subText,
        marginTop: 2,
    },
    trashButton: {
        padding: 8,
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    completeButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
    },
});