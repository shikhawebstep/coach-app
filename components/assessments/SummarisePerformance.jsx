import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SummarisePerformance({ onBack, onComplete }) {
    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create report</Text>
            </View> */}

            <Text style={styles.title}>Summarise Performance</Text>

            <View style={styles.centerContent}>
                <Text style={styles.timer}>00:30</Text>

                {/* Ripple Effect Circles */}
                <View style={styles.outerCircle}>
                    <View style={styles.middleCircle}>
                        <TouchableOpacity style={styles.innerCircle}>
                            <Ionicons name="mic-outline" size={54} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
                    <Text style={styles.completeButtonText}>Complete</Text>
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
        fontSize: 24,
        marginVertical: 24,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
    },
    title: {
        fontSize: 24,
        marginVertical: 24,
        fontFamily: 'Urbanist_700Bold',
        color: '#1a1a1a',
        textAlign: 'center'
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 56,
        color: '#9CA3AF', // Gray
          fontFamily: 'Urbanist_400Regular',
        marginBottom: 60,
    },
    outerCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#93C5FD', // Light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleCircle: {
        width: 156,
        height: 156,
        borderRadius: 78,
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
